import { NextResponse } from "next/server";
import { getSupabaseServiceEnv } from "@/lib/aspen/supabase/env";
import { getSupabaseServiceClient } from "@/lib/aspen/supabase/server";
import { getCmsSessionUserFromCookies } from "@/lib/server/cmsAuth";
import { getTenantId } from "@/lib/aspen/tenant";

export async function GET() {
  const checks: Record<string, unknown> = {};

  const env = getSupabaseServiceEnv();
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  checks.supabaseUrl = rawUrl;
  checks.supabaseUrlLooksCorrect = rawUrl.includes(".supabase.co") || rawUrl.includes(".supabase.in");
  checks.supabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  checks.supabaseServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  checks.envValid = !!env;

  const tenantId = getTenantId();
  checks.tenantId = tenantId || "(empty)";

  let user: { id: string; email: string; role: string } | null = null;
  try {
    user = await getCmsSessionUserFromCookies();
  } catch (e) {
    checks.authError = String(e);
  }
  checks.authenticated = !!user;
  checks.userId = user?.id || null;

  const db = getSupabaseServiceClient();
  checks.dbClientCreated = !!db;

  if (db && tenantId) {
    try {
      const { data, error } = await db
        .from("listings")
        .select("id")
        .eq("tenant_id", tenantId)
        .limit(1);
      checks.listingsQuery = error ? `ERROR: ${error.message}` : `OK (${data?.length ?? 0} rows)`;
    } catch (e) {
      checks.listingsQuery = `EXCEPTION: ${String(e)}`;
    }

    try {
      const { data, error } = await db
        .from("blog_posts")
        .select("id")
        .eq("tenant_id", tenantId)
        .limit(1);
      checks.blogsQuery = error ? `ERROR: ${error.message}` : `OK (${data?.length ?? 0} rows)`;
    } catch (e) {
      checks.blogsQuery = `EXCEPTION: ${String(e)}`;
    }

    try {
      const { data, error } = await db
        .from("testimonials")
        .select("id")
        .eq("tenant_id", tenantId)
        .limit(1);
      checks.testimonialsQuery = error ? `ERROR: ${error.message}` : `OK (${data?.length ?? 0} rows)`;
    } catch (e) {
      checks.testimonialsQuery = `EXCEPTION: ${String(e)}`;
    }
  }

  return NextResponse.json(checks);
}
