import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';

const sb = () => getServiceClient();

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (userId) {
    const { data, error } = await sb()
      .from('tenant_site_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || { user_id: userId, ai_builder_disabled: false, assigned_hosted_site_slug: null });
  }

  const { data, error } = await sb()
    .from('tenant_site_settings')
    .select('*');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const row = {
    user_id: body.userId || body.user_id,
    ai_builder_disabled: body.aiBuilderDisabled ?? body.ai_builder_disabled ?? false,
    assigned_hosted_site_slug: body.assignedHostedSiteSlug ?? body.assigned_hosted_site_slug ?? null,
  };

  const { data, error } = await sb()
    .from('tenant_site_settings')
    .upsert(row, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const { error } = await sb().from('tenant_site_settings').delete().eq('user_id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
