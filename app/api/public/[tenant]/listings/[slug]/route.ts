import { NextRequest, NextResponse } from 'next/server';
import { ensureTenantDataset } from '@/lib/server/cmsData';
import { requirePublicApiKey } from '@/lib/server/publicApi';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string; slug: string }> }
) {
  const { tenant, slug } = await params;
  const unauthorized = await requirePublicApiKey(request, tenant, 'content:read');
  if (unauthorized) return unauthorized;

  const dataset = await ensureTenantDataset(tenant);
  const item = dataset.listings.find((listing) => listing.slug === slug);
  if (!item) {
    return NextResponse.json({ apiVersion: 'v1', error: 'Listing not found' }, { status: 404 });
  }

  return NextResponse.json({
    apiVersion: 'v1',
    tenant,
    item,
  });
}
