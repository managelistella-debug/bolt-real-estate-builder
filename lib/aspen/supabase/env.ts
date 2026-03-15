const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return { supabaseUrl, supabaseAnonKey };
}

export function getSupabaseServiceEnv() {
  const base = getSupabaseEnv();
  if (!base || !supabaseServiceRoleKey) {
    return null;
  }
  return { ...base, supabaseServiceRoleKey };
}
