import { NextRequest, NextResponse } from "next/server";
import {
  buildCmsAuthCookie,
  createCmsSessionToken,
  getCmsAuthIdentity,
  verifyCmsCredentials,
} from "@/lib/server/cmsAuth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "").trim();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const identity = await getCmsAuthIdentity();
  const valid = await verifyCmsCredentials(email, password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = createCmsSessionToken({
    sub: identity.userId,
    email: identity.email,
    role: identity.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  });

  const response = NextResponse.json({
    session: { expires_at: Date.now() + 1000 * 60 * 60 * 24 },
    user: { id: identity.userId, email: identity.email },
  });
  const cookie = buildCmsAuthCookie(token);
  response.cookies.set(cookie.name, cookie.value, cookie.options);

  return response;
}
