import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/admin/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPath = pathname === "/admin/login";
  const isAdminPath = pathname.startsWith("/admin") && !isLoginPath;

  const authenticated = await getSessionFromRequest(request);

  if (isAdminPath && !authenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginPath && authenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
