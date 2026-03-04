import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { ensureTenant } from '@/lib/server/ensureTenant';

const sb = () => getServiceClient();

export async function GET(req: NextRequest) {
  const tenantId = req.nextUrl.searchParams.get('tenantId');
  if (!tenantId) return NextResponse.json({ error: 'tenantId required' }, { status: 400 });

  const { data, error } = await sb()
    .from('integration_configs')
    .select('*')
    .eq('tenant_id', tenantId)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? null);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.tenant_id) await ensureTenant(body.tenant_id);
  const { data, error } = await sb()
    .from('integration_configs')
    .upsert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
