import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/aspen/supabase/database.types";
import { getSupabaseEnv } from "@/lib/aspen/supabase/env";

let publicClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabasePublicClient() {
  if (publicClient) return publicClient;
  const env = getSupabaseEnv();
  if (!env) return null;
  publicClient = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return publicClient;
}
