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
  const requestedStatus = request.nextUrl.searchParams.get('status');
  // Public feeds default to published-only unless explicitly requested.
  const statusFilter = requestedStatus || 'published';
  const categoryFilter = request.nextUrl.searchParams.get('category');
  const tagFilter = request.nextUrl.searchParams.get('tag');
  const sort = request.nextUrl.searchParams.get('sort') || 'published_desc';
  const page = Number(request.nextUrl.searchParams.get('page') || '1');
  const pageSize = Math.min(100, Number(request.nextUrl.searchParams.get('pageSize') || '25'));
  const filtered = dataset.blogs.filter((post) => {
    if (statusFilter && post.status !== statusFilter) return false;
    if (categoryFilter && (post.category || '').toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (tagFilter && !post.tags.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase())) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'published_asc') {
      return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
    }
    if (sort === 'title_asc') return a.title.localeCompare(b.title);
    if (sort === 'title_desc') return b.title.localeCompare(a.title);
    return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
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
