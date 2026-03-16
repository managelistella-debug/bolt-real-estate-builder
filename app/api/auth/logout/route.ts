import { NextResponse } from "next/server";
import { buildClearCmsAuthCookie } from "@/lib/server/cmsAuth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  const cookie = buildClearCmsAuthCookie();
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
