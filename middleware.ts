import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
  'Access-Control-Max-Age': '86400',
};

function isPublicApi(pathname: string) {
  return pathname.startsWith('/api/public/');
}

const INTERNAL_PATH_PREFIXES = ['/api', '/_next', '/dashboard', '/admin', '/login'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isPublicApi(pathname)) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
    }
    const response = NextResponse.next();
    Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  }

  if (INTERNAL_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const host = request.headers.get('host') || '';
  const response = NextResponse.next();
  response.headers.set('x-site-host', host);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|templates/).*)'],
};
