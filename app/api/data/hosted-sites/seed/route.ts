import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { ASPEN_COUNTRY_SITE } from '@/lib/hosted-sites/seed';

const sb = () => getServiceClient();

export async function POST() {
  const site = ASPEN_COUNTRY_SITE;

  const row = {
    id: site.id,
    name: site.name,
    description: site.description,
    preview_image: site.previewImage,
    site_slug: site.siteSlug,
    pages: site.pages,
    cms_config: site.cmsConfig,
    assigned_user_ids: site.assignedUserIds,
  };

  const { data, error } = await sb()
    .from('hosted_sites')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, site: data });
}
