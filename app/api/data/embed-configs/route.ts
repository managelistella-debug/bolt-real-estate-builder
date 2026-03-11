import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { ensureTenant } from '@/lib/server/ensureTenant';

const sb = () => getServiceClient();

async function ensureEmbedTypeConstraintAllowsBlogFeed() {
  const projectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    .replace('https://', '')
    .replace('.supabase.co', '');
  const token = process.env.SUPABASE_ACCESS_TOKEN || '';
  if (!projectRef || !token) {
    throw new Error('SUPABASE_ACCESS_TOKEN is required to update embed config constraint');
  }
  const query = `
    ALTER TABLE public.embed_configs DROP CONSTRAINT IF EXISTS embed_configs_type_check;
    ALTER TABLE public.embed_configs
    ADD CONSTRAINT embed_configs_type_check
    CHECK (type IN ('listing_feed', 'listing_detail', 'testimonial_feed', 'blog_feed'));
  `;
  const resp = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(body || `Constraint update failed (${resp.status})`);
  }
}

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

  let { data, error } = await sb().from('embed_configs').upsert(body).select().single();

  if (error && typeof body?.type === 'string' && body.type === 'blog_feed' && error.message.includes('embed_configs_type_check')) {
    await ensureEmbedTypeConstraintAllowsBlogFeed();
    const retry = await sb().from('embed_configs').upsert(body).select().single();
    data = retry.data;
    error = retry.error;
  }

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
