import { NextRequest, NextResponse } from 'next/server';
import { ensureTenantDataset } from '@/lib/server/cmsData';
import { requirePublicApiKey } from '@/lib/server/publicApi';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;
  const unauthorized = await requirePublicApiKey(request, tenant, 'content:read');
  if (unauthorized) return unauthorized;

  const dataset = await ensureTenantDataset(tenant);
  const sourceFilter = request.nextUrl.searchParams.get('source');
  const minRating = Number(request.nextUrl.searchParams.get('minRating') || '0');
  const sort = request.nextUrl.searchParams.get('sort') || 'sort_order_asc';
  const page = Number(request.nextUrl.searchParams.get('page') || '1');
  const pageSize = Math.min(100, Number(request.nextUrl.searchParams.get('pageSize') || '25'));

  const filtered = dataset.testimonials.filter((item) => {
    if (sourceFilter && (item.source || 'manual') !== sourceFilter) return false;
    if (minRating > 0 && (item.rating || 0) < minRating) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'created_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return a.sortOrder - b.sortOrder;
  });

  const start = Math.max(0, (page - 1) * pageSize);
  const items = sorted.slice(start, start + pageSize);

  return NextResponse.json({
    apiVersion: 'v1',
    tenant,
    items,
    pagination: {
      page,
      pageSize,
      total: sorted.length,
    },
  });
}
