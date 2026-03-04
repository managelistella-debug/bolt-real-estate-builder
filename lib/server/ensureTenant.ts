import { getServiceClient } from '@/lib/supabase/server';

export async function ensureTenant(tenantId: string) {
  const sb = getServiceClient();
  const { data } = await sb.from('tenants').select('id').eq('id', tenantId).maybeSingle();
  if (!data) {
    await sb.from('tenants').insert({
      id: tenantId,
      user_id: tenantId,
      website_id: `site-${tenantId}`,
    } as never);
  }
}
