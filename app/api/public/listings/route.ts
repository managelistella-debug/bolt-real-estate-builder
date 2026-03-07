import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

async function resolveListingsTenantIds(tenantId: string): Promise<string[]> {
  const ids = [tenantId];
  const sb = getServiceClient();

  const { data: profiles } = await sb
    .from('profiles')
    .select('id')
    .eq('business_id', tenantId);

  if (profiles && profiles.length > 0) {
    profiles.forEach((p: { id: string }) => {
      if (!ids.includes(p.id)) ids.push(p.id);
    });
  }

  return ids;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const tenantId = sp.get('tenantId');
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId required' }, { status: 400, headers: corsHeaders });
  }

  const status = sp.get('status');
  const featured = sp.get('featured');
  const city = sp.get('city');
  const neighborhood = sp.get('neighborhood');
  const propertyType = sp.get('propertyType');
  const sort = sp.get('sort') || 'newest';
  const page = Math.max(1, parseInt(sp.get('page') || '1', 10));
  const perPageParam = sp.get('perPage');
  const perPage = perPageParam ? Math.max(1, parseInt(perPageParam, 10)) : null;

  const sb = getServiceClient();
  const tenantIds = await resolveListingsTenantIds(tenantId);

  let query = sb.from('listings').select('*', { count: 'exact' }).in('tenant_id', tenantIds);

  if (status) {
    const statuses = status.split(',').map((s) => s.trim()).filter(Boolean);
    if (statuses.length === 1) {
      query = query.eq('listing_status', statuses[0]);
    } else if (statuses.length > 1) {
      query = query.in('listing_status', statuses);
    }
  }

  if (city) {
    const cities = city.split(',').map((c) => c.trim()).filter(Boolean);
    if (cities.length === 1) {
      query = query.ilike('city', cities[0]);
    } else if (cities.length > 1) {
      query = query.in('city', cities);
    }
  }

  if (neighborhood) {
    const neighborhoods = neighborhood.split(',').map((n) => n.trim()).filter(Boolean);
    if (neighborhoods.length === 1) {
      query = query.ilike('neighborhood', neighborhoods[0]);
    } else if (neighborhoods.length > 1) {
      query = query.in('neighborhood', neighborhoods);
    }
  }

  if (propertyType) {
    const types = propertyType.split(',').map((t) => t.trim()).filter(Boolean);
    if (types.length === 1) {
      query = query.ilike('property_type', types[0]);
    } else if (types.length > 1) {
      query = query.in('property_type', types);
    }
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('list_price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('list_price', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'custom_order':
      query = query.order('custom_order', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  if (perPage) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let enriched = (data ?? []).map((row: any) => ({
    ...row,
    thumbnail: row.thumbnail || (Array.isArray(row.gallery) && row.gallery[0]?.url) || null,
    homepage_featured: row.homepage_featured ?? false,
  }));

  if (featured === 'true') {
    enriched = enriched.filter((r: { homepage_featured: boolean }) => r.homepage_featured);
  }

  const total = count ?? enriched.length;

  if (perPage) {
    return NextResponse.json(
      {
        data: enriched,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
      { headers: corsHeaders }
    );
  }

  return NextResponse.json(enriched, { headers: corsHeaders });
}
