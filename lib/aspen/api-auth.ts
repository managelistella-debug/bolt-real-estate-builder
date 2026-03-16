import { NextResponse } from "next/server";
import {
  getSupabaseServiceClient,
} from "@/lib/aspen/supabase/server";
import { getCmsSessionUserFromCookies } from "@/lib/server/cmsAuth";

export async function requireRouteUser() {
  const db = getSupabaseServiceClient();
  if (!db) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Supabase service role is not configured." },
        { status: 500 }
      ),
      supabase: null,
      db: null,
    };
  }

  const user = await getCmsSessionUserFromCookies();
  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      supabase: null,
      db,
    };
  }

  return {
    ok: true as const,
    response: null,
    supabase: null,
    db,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}
