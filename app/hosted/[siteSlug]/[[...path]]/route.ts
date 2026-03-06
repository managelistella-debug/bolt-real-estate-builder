import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import nodePath from 'path';

const LOCAL_SITE_DIRS: Record<string, string> = {
  'aspen-country': nodePath.join(process.cwd(), 'public', 'hosted-sites', 'aspen-country'),
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ siteSlug: string; path?: string[] }> },
) {
  const { siteSlug, path: segments } = await params;

  const siteDir = LOCAL_SITE_DIRS[siteSlug];
  if (!siteDir) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const requestedPath = (segments || []).join('/');
  const normalized = requestedPath.replace(/^\/+/, '');

  const possibleFiles = [
    normalized,
    normalized ? `${normalized}.html` : 'index.html',
    normalized ? nodePath.join(normalized, 'index.html') : 'index.html',
  ];

  for (const rel of possibleFiles) {
    const fullPath = nodePath.join(siteDir, rel);
    if (!fullPath.startsWith(siteDir)) continue;

    try {
      const stat = await fs.stat(fullPath);
      if (!stat.isFile()) continue;
      const data = await fs.readFile(fullPath);
      const ext = nodePath.extname(fullPath).toLowerCase();
      const contentType =
        ext === '.html' ? 'text/html; charset=utf-8'
        : ext === '.css' ? 'text/css; charset=utf-8'
        : ext === '.js' ? 'application/javascript; charset=utf-8'
        : ext === '.json' ? 'application/json; charset=utf-8'
        : ext === '.svg' ? 'image/svg+xml'
        : ext === '.png' ? 'image/png'
        : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
        : ext === '.webp' ? 'image/webp'
        : ext === '.woff' ? 'font/woff'
        : ext === '.woff2' ? 'font/woff2'
        : ext === '.ico' ? 'image/x-icon'
        : ext === '.ttf' ? 'font/ttf'
        : ext === '.map' ? 'application/json'
        : 'application/octet-stream';

      return new NextResponse(data, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': ext === '.html'
            ? 'public, max-age=60, s-maxage=300'
            : 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ error: 'Page not found' }, { status: 404 });
}
