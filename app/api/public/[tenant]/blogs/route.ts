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
  const statusFilter = request.nextUrl.searchParams.get('status');
  const categoryFilter = request.nextUrl.searchParams.get('category');
  const page = Number(request.nextUrl.searchParams.get('page') || '1');
  const pageSize = Number(request.nextUrl.searchParams.get('pageSize') || '25');
  const filtered = dataset.blogs.filter((post) => {
    if (statusFilter && post.status !== statusFilter) return false;
    if (categoryFilter && (post.category || '').toLowerCase() !== categoryFilter.toLowerCase()) return false;
    return true;
  });
  const start = Math.max(0, (page - 1) * pageSize);
  const items = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    apiVersion: 'v1',
    tenant,
    items,
    pagination: {
      page,
      pageSize,
      total: filtered.length,
    },
  });
}
