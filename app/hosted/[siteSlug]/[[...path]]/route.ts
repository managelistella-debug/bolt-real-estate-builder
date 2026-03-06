import { NextRequest, NextResponse } from 'next/server';
import { getCmsBridgeScript } from '@/lib/hosted-sites/cms-bridge';

const ORIGIN_REGISTRY: Record<string, string> = {
  'aspen-country': 'https://website-zeta-three-86.vercel.app',
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
  const tenantId = request.nextUrl.searchParams.get('tenantId') || undefined;

  const upstreamUrl = `${origin}${pagePath}`;
  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamUrl, {
      headers: { Accept: 'text/html' },
      next: { revalidate: 300 },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach origin site' }, { status: 502 });
  }

  if (!upstreamRes.ok) {
    return new NextResponse('Upstream returned ' + upstreamRes.status, { status: upstreamRes.status });
  }

  let html = await upstreamRes.text();

  html = html.replace(/(src|href|srcset|content)="\/(?!\/)/g, `$1="${origin}/`);
  html = html.replace(/url\(\//g, `url(${origin}/`);

  if (tenantId) {
    html = html.replace(/<html/i, `<html data-tenant-id="${tenantId}"`);
  }

  const cmsBridge = `<script>${getCmsBridgeScript()}</script>`;
  html = html.replace(/<\/body>/i, `${cmsBridge}</body>`);

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  });
}
