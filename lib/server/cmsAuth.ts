import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { CMS_AUTH_COOKIE } from "@/lib/server/cmsAuthShared";

const DAY_SECONDS = 60 * 60 * 24;
const CREDENTIALS_PATH = path.join(process.cwd(), "data", "cms-auth.json");

type StoredCredentials = {
  email: string;
  passwordHash: string;
  updatedAt: string;
};

type CmsSessionPayload = {
  sub: string;
  email: string;
  role: "business_user";
  exp: number;
};

export function getCmsLoginConfig() {
  const email = (process.env.CMS_LOGIN_EMAIL || "admin@listella.co").trim().toLowerCase();
  const password = process.env.CMS_LOGIN_PASSWORD || "Listella2026!";
  const role: "business_user" = "business_user";
  const userId = "cms_owner";
  return { email, password, role, userId };
}

function hashPassword(password: string) {
  return createHmac("sha256", getSessionSecret()).update(password).digest("hex");
}

async function readStoredCredentials(): Promise<StoredCredentials | null> {
  try {
    const raw = await fs.readFile(CREDENTIALS_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoredCredentials;
    if (!parsed?.email || !parsed?.passwordHash) return null;
    return {
      email: String(parsed.email).trim().toLowerCase(),
      passwordHash: String(parsed.passwordHash),
      updatedAt: String(parsed.updatedAt || new Date().toISOString()),
    };
  } catch {
    return null;
  }
}

async function writeStoredCredentials(email: string, password: string) {
  const payload: StoredCredentials = {
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword(password),
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(CREDENTIALS_PATH), { recursive: true });
  await fs.writeFile(CREDENTIALS_PATH, JSON.stringify(payload, null, 2), "utf8");
}

export async function getCmsAuthIdentity() {
  const cfg = getCmsLoginConfig();
  const stored = await readStoredCredentials();
  return {
    userId: cfg.userId,
    role: cfg.role,
    email: stored?.email || cfg.email,
  };
}

export async function verifyCmsCredentials(email: string, password: string) {
  const cfg = getCmsLoginConfig();
  const normalizedEmail = email.trim().toLowerCase();
  const stored = await readStoredCredentials();
  const expectedEmail = stored?.email || cfg.email;
  const expectedHash = stored?.passwordHash || hashPassword(cfg.password);
  const actualHash = hashPassword(password);
  return normalizedEmail === expectedEmail && actualHash === expectedHash;
}

export async function changeCmsPassword(currentPassword: string, nextPassword: string) {
  const cfg = getCmsLoginConfig();
  const stored = await readStoredCredentials();
  const currentHash = hashPassword(currentPassword);
  const expectedHash = stored?.passwordHash || hashPassword(cfg.password);
  if (currentHash !== expectedHash) {
    return { ok: false as const, error: "Current password is incorrect." };
  }
  const email = stored?.email || cfg.email;
  await writeStoredCredentials(email, nextPassword);
  return { ok: true as const };
}

function getSessionSecret() {
  return process.env.CMS_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-session-secret";
}

function b64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function sign(unsignedToken: string) {
  return createHmac("sha256", getSessionSecret()).update(unsignedToken).digest("base64url");
}

export function createCmsSessionToken(payload: CmsSessionPayload) {
  const encoded = b64url(JSON.stringify(payload));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyCmsSessionToken(token: string | undefined | null): CmsSessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(signature);
  if (expectedBuf.length !== signatureBuf.length) return null;
  if (!timingSafeEqual(expectedBuf, signatureBuf)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as CmsSessionPayload;
    if (!payload?.sub || !payload?.email || !payload?.exp) return null;
    if (Date.now() / 1000 >= payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function buildCmsAuthCookie(token: string) {
  return {
    name: CMS_AUTH_COOKIE,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DAY_SECONDS,
    },
  };
}

export function buildClearCmsAuthCookie() {
  return {
    name: CMS_AUTH_COOKIE,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    },
  };
}

export async function getCmsSessionUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_AUTH_COOKIE)?.value;
  const payload = verifyCmsSessionToken(token);
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}
