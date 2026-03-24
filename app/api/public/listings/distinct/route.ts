import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { fetchWpListingsRaw } from '@/lib/wordpress/client';
import { getWordPressBaseUrl } from '@/lib/wordpress/env';
import { listingStatusToApiEnum, mapWpListingToListing } from '@/lib/wordpress/mappers';

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
  const { data: profiles } = await sb.from('profiles').select('id').eq('business_id', tenantId);
  if (profiles && profiles.length > 0) {
    profiles.forEach((p: { id: string }) => {
      if (!ids.includes(p.id)) ids.push(p.id);
    });
  }
  return ids;
}

export async function GET(req: NextRequest) {
  const tenantId = req.nextUrl.searchParams.get('tenantId');
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId required' }, { status: 400, headers: corsHeaders });
  }

  if (getWordPressBaseUrl()) {
    try {
      const raw = await fetchWpListingsRaw();
      const listings = raw.map(mapWpListingToListing);
      const cities = new Set<string>();
      const neighborhoods = new Set<string>();
      const propertyTypes = new Set<string>();
      const statuses = new Set<string>();
      listings.forEach((row) => {
        if (row.city) cities.add(row.city);
        if (row.neighborhood) neighborhoods.add(row.neighborhood);
        if (row.propertyType) propertyTypes.add(row.propertyType);
        statuses.add(listingStatusToApiEnum(row.listingStatus));
      });
      return NextResponse.json(
        {
          cities: Array.from(cities).sort(),
          neighborhoods: Array.from(neighborhoods).sort(),
          propertyTypes: Array.from(propertyTypes).sort(),
          statuses: Array.from(statuses).sort(),
        },
        { headers: corsHeaders }
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'WordPress listings unavailable';
      return NextResponse.json({ error: msg }, { status: 502, headers: corsHeaders });
    }
  }

  const sb = getServiceClient();
  const tenantIds = await resolveListingsTenantIds(tenantId);

  const { data, error } = await sb
    .from('listings')
    .select('city, neighborhood, property_type, listing_status')
    .in('tenant_id', tenantIds);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }

  const cities = new Set<string>();
  const neighborhoods = new Set<string>();
  const propertyTypes = new Set<string>();
  const statuses = new Set<string>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data ?? []).forEach((row: any) => {
    if (row.city) cities.add(row.city);
    if (row.neighborhood) neighborhoods.add(row.neighborhood);
    if (row.property_type) propertyTypes.add(row.property_type);
    if (row.listing_status) statuses.add(row.listing_status);
  });

  return NextResponse.json(
    {
      cities: Array.from(cities).sort(),
      neighborhoods: Array.from(neighborhoods).sort(),
      propertyTypes: Array.from(propertyTypes).sort(),
      statuses: Array.from(statuses).sort(),
    },
    { headers: corsHeaders }
  );
}
