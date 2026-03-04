import { NextRequest, NextResponse } from 'next/server';
import { ensureTenantDataset } from '@/lib/server/cmsData';
import { requirePublicApiKey } from '@/lib/server/publicApi';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string; id: string }> }
) {
  const { tenant, id } = await params;
  const unauthorized = await requirePublicApiKey(request, tenant, 'content:read');
  if (unauthorized) return unauthorized;

  const dataset = await ensureTenantDataset(tenant);
  const item = dataset.testimonials.find((entry) => entry.id === id);
  if (!item) {
    return NextResponse.json({ apiVersion: 'v1', error: 'Testimonial not found' }, { status: 404 });
  }

  return NextResponse.json({
    apiVersion: 'v1',
    tenant,
    item,
  });
}
