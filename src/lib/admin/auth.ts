import type { NextRequest, NextResponse } from "next/server";

/**
 * Single-shared-password admin session, ported from the reference
 * architecture's HMAC-signed cookie pattern. Uses Web Crypto (not Node's
 * `crypto` module) so the exact same code runs in both API route handlers
 * (Node runtime) and `middleware.ts` (Edge runtime).
 */

export const SESSION_COOKIE_NAME = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

interface SessionPayload {
  exp: number;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(str.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return base64UrlEncode(new Uint8Array(signature));
}

/** Constant-time string comparison — used for both HMAC verification and password checks. */
export function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload: SessionPayload = { exp: Date.now() + MAX_AGE_SECONDS * 1000 };
  const payloadStr = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await hmacSign(payloadStr, secret);
  return `${payloadStr}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const [payloadStr, signature] = token.split(".");
  if (!payloadStr || !signature) return false;

  const expectedSignature = await hmacSign(payloadStr, secret);
  if (!timingSafeEqualStr(signature, expectedSignature)) return false;

  try {
    const payload: SessionPayload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payloadStr))
    );
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function getSessionFromRequest(req: NextRequest): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token, secret);
}

export function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.VERCEL === "1" || process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
