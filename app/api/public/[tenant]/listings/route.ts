import { NextRequest, NextResponse } from 'next/server';
import { Listing } from '@/lib/types';
import { ensureTenantDataset } from '@/lib/server/cmsData';
import { requirePublicApiKey } from '@/lib/server/publicApi';

type SortOption = 'price_asc' | 'price_desc' | 'date_added_desc' | 'custom_order';

function sortListings(items: Listing[], sort: SortOption): Listing[] {
  const sorted = [...items];
  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.listPrice - b.listPrice);
    case 'price_desc':
      return sorted.sort((a, b) => b.listPrice - a.listPrice);
    case 'custom_order':
      return sorted.sort((a, b) => a.customOrder - b.customOrder);
    case 'date_added_desc':
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;
  const unauthorized = await requirePublicApiKey(request, tenant, 'content:read');
  if (unauthorized) return unauthorized;

  const sp = request.nextUrl.searchParams;
  const dataset = await ensureTenantDataset(tenant);

  let results = dataset.listings;

  const ids = sp.get('ids');
  if (ids) {
    const idSet = new Set(ids.split(',').map((s) => s.trim()).filter(Boolean));
    results = results.filter((item) => idSet.has(item.id));
  }

  const status = sp.get('status');
  if (status) {
    results = results.filter((item) => item.listingStatus === status);
  }

  const city = sp.get('city');
  if (city) {
    const lc = city.toLowerCase();
    results = results.filter((item) => item.city.toLowerCase() === lc);
  }

  const propertyType = sp.get('propertyType');
  if (propertyType) {
    const lc = propertyType.toLowerCase();
    results = results.filter((item) => item.propertyType.toLowerCase() === lc);
  }

  const search = sp.get('search');
  if (search) {
    const term = search.toLowerCase();
    results = results.filter(
      (item) =>
        item.address.toLowerCase().includes(term) ||
        item.neighborhood.toLowerCase().includes(term) ||
        item.city.toLowerCase().includes(term) ||
        item.mlsNumber.toLowerCase().includes(term),
    );
  }

  const sort = (sp.get('sort') || 'date_added_desc') as SortOption;
  results = sortListings(results, sort);

  const page = Math.max(1, Number(sp.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, Number(sp.get('pageSize') || '25')));
  const start = (page - 1) * pageSize;
  const items = results.slice(start, start + pageSize);

  return NextResponse.json({
    apiVersion: 'v1',
    tenant,
    items,
    pagination: {
      page,
      pageSize,
      total: results.length,
    },
  });
}
