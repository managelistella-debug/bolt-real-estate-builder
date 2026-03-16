import { NextRequest, NextResponse } from 'next/server';
import { CMS_AUTH_COOKIE } from '@/lib/server/cmsAuthShared';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
  'Access-Control-Max-Age': '86400',
};

function isPublicApi(pathname: string) {
  return pathname.startsWith('/api/public/');
}

const ACCOUNT_PREFIXES = ['/account'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isPublicApi(pathname)) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
    }
    const response = NextResponse.next();
    Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  }

  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const isAccountRoute = ACCOUNT_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const hasSession = Boolean(request.cookies.get(CMS_AUTH_COOKIE)?.value);

  if (isAccountRoute) {
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === '/login') {
    if (hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/account/dashboard';
      url.searchParams.delete('next');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const host = request.headers.get('host') || '';
  const response = NextResponse.next();
  response.headers.set('x-site-host', host);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
