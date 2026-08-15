import { NextResponse, type NextRequest } from "next/server";
import { createSessionToken, setSessionCookie, sleep, timingSafeEqualStr } from "@/lib/admin/auth";

export async function POST(req: NextRequest) {
  // Deliberate delay on every attempt (pass or fail) to slow brute-forcing
  // the single shared password without needing external rate-limit storage.
  await sleep(600);

  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!expected || !secret) {
    return NextResponse.json({ error: "Admin auth is not configured." }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (!password || !timingSafeEqualStr(password, expected)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  setSessionCookie(res, token);
  return res;
}
