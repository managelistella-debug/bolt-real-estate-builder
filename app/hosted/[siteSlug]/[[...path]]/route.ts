import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ siteSlug: string; path?: string[] }> },
) {
  const { siteSlug } = await params;

  const STATIC_SITES = ['aspen-country'];

  if (STATIC_SITES.includes(siteSlug)) {
    // Static sites are served directly from public/hosted/[siteSlug]/ by the CDN.
    // If we reach this handler, the requested file doesn't exist.
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  return NextResponse.json({ error: 'Site not found' }, { status: 404 });
}
