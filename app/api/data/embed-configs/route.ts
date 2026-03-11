import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { ensureTenant } from '@/lib/server/ensureTenant';

const sb = () => getServiceClient();

export async function GET(req: NextRequest) {
  const tenantId = req.nextUrl.searchParams.get('tenantId');
  if (!tenantId) return NextResponse.json({ error: 'tenantId required' }, { status: 400 });

  const { data, error } = await sb()
    .from('embed_configs')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.tenant_id) await ensureTenant(body.tenant_id);
  // Maximum compatibility: old DB constraints only allow listing_feed/listing_detail.
  // Keep full config payload unchanged and use legacy-safe row type for persistence.
  const dbBody = {
    ...body,
    type: body?.type === 'listing_detail' ? 'listing_detail' : 'listing_feed',
  };

  const { data, error } = await sb().from('embed_configs').upsert(dbBody).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await sb().from('embed_configs').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
