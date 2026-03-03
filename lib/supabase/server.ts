import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDatabase = any;

let _admin: ReturnType<typeof createClient<AnyDatabase>> | null = null;

export function getServiceClient() {
  if (_admin) return _admin;
  _admin = createClient<AnyDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  return _admin;
}
