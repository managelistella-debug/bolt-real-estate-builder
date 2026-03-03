import { NextRequest, NextResponse } from 'next/server';
import { ensureTenantDataset } from '@/lib/server/cmsData';
import { requirePublicApiKey } from '@/lib/server/publicApi';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;
  const unauthorized = requirePublicApiKey(request, tenant, 'content:read');
  if (unauthorized) return unauthorized;

  const dataset = ensureTenantDataset(tenant);
  return NextResponse.json({
    tenant,
    items: dataset.blogs,
  });
}
