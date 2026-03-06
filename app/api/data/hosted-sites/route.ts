import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';

const sb = () => getServiceClient();

export async function GET() {
  const { data, error } = await sb()
    .from('hosted_sites')
    .select('*')
    .order('created_at');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const row = {
    id: body.id,
    name: body.name,
    description: body.description || '',
    preview_image: body.previewImage || body.preview_image || '',
    site_slug: body.siteSlug || body.site_slug,
    origin_url: body.originUrl || body.origin_url || '',
    pages: body.pages || [],
    cms_config: body.cmsConfig || body.cms_config || {},
    assigned_user_ids: body.assignedUserIds || body.assigned_user_ids || [],
  };

  const { data, error } = await sb()
    .from('hosted_sites')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const row: Record<string, unknown> = {};
  if (updates.name !== undefined) row.name = updates.name;
  if (updates.description !== undefined) row.description = updates.description;
  if (updates.previewImage !== undefined) row.preview_image = updates.previewImage;
  if (updates.originUrl !== undefined) row.origin_url = updates.originUrl;
  if (updates.pages !== undefined) row.pages = updates.pages;
  if (updates.cmsConfig !== undefined) row.cms_config = updates.cmsConfig;
  if (updates.assignedUserIds !== undefined) row.assigned_user_ids = updates.assignedUserIds;

  const { data, error } = await sb()
    .from('hosted_sites')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await sb().from('hosted_sites').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
