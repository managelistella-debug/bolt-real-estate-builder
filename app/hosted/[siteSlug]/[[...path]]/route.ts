import { NextRequest, NextResponse } from 'next/server';
import { getPage, ASPEN_COUNTRY_PAGES } from '@/lib/hosted-sites/aspen-country';

const SITE_REGISTRY: Record<string, {
  getPage: (path: string, basePath: string, tenantId?: string) => string;
  pages: string[];
}> = {
  'aspen-country': {
    getPage,
    pages: ASPEN_COUNTRY_PAGES,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteSlug: string; path?: string[] }> },
) {
  const { siteSlug, path } = await params;
  const site = SITE_REGISTRY[siteSlug];

  if (!site) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const pagePath = '/' + (path?.join('/') || '');
  const basePath = `/hosted/${siteSlug}`;

  const tenantId = request.nextUrl.searchParams.get('tenantId') || undefined;

  const html = site.getPage(pagePath, basePath, tenantId);

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  });
}
