import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function requireRouteUser() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 500 }
      ),
      supabase: null,
    };
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      supabase,
    };
  }

  return { ok: true as const, response: null, supabase, user: data.user };
}
