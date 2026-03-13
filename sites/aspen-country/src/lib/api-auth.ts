import { NextResponse } from "next/server";
import { getSupabaseServerClient, getSupabaseServiceClient } from "@/lib/supabase/server";

export async function requireRouteUser() {
  const supabase = await getSupabaseServerClient();
  const db = getSupabaseServiceClient();
  if (!supabase) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 500 }
      ),
      supabase: null,
      db: null,
    };
  }
  if (!db) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Supabase service role is not configured." },
        { status: 500 }
      ),
      supabase,
      db: null,
    };
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      supabase,
      db,
    };
  }

  return { ok: true as const, response: null, supabase, db, user: data.user };
}
