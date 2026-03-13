import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdminUser() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    redirect("/login");
  }
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/login");
  }
  return data.user;
}
