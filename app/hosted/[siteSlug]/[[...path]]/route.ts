import { NextRequest, NextResponse } from 'next/server';

const ORIGIN_REGISTRY: Record<string, string> = {
  'aspen-country': 'https://aspenmuraski-main.vercel.app',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteSlug: string; path?: string[] }> },
) {
  const { siteSlug, path } = await params;

  const origin = ORIGIN_REGISTRY[siteSlug];
  if (!origin) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const pagePath = '/' + (path?.join('/') || '');
  const query = request.nextUrl.search || '';
  const target = `${origin}${pagePath}${query}`;

  // Exact-fidelity mode: no rewriting and no injection.
  return NextResponse.redirect(target, 307);
}
