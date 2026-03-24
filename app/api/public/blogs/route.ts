import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { fetchWpPostsRaw } from '@/lib/wordpress/client';
import { getWordPressBaseUrl } from '@/lib/wordpress/env';
import { mapWpPostToBlogPost } from '@/lib/wordpress/mappers';
import { blogPostToPublicApiRow } from '@/lib/wordpress/publicRows';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

async function resolveTenantIds(tenantId: string): Promise<string[]> {
  const ids = [tenantId];
  const sb = getServiceClient();

  const { data: profiles } = await sb
    .from('profiles')
    .select('id')
    .eq('business_id', tenantId);

  if (profiles && profiles.length > 0) {
    profiles.forEach((p: { id: string }) => {
      if (!ids.includes(p.id)) ids.push(p.id);
    });
  }

  return ids;
}

export async function GET(req: NextRequest) {
  const tenantId = req.nextUrl.searchParams.get('tenantId');
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId required' }, { status: 400, headers: corsHeaders });
  }

  if (getWordPressBaseUrl()) {
    try {
      const raw = await fetchWpPostsRaw();
      const rows = raw.map((p) => blogPostToPublicApiRow(mapWpPostToBlogPost(p)));
      return NextResponse.json(rows, { headers: corsHeaders });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'WordPress blogs unavailable';
      return NextResponse.json({ error: msg }, { status: 502, headers: corsHeaders });
    }
  }

  const sb = getServiceClient();
  const tenantIds = await resolveTenantIds(tenantId);

  const { data, error } = await sb
    .from('blog_posts')
    .select('*')
    .in('tenant_id', tenantIds)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }

  return NextResponse.json(data ?? [], { headers: corsHeaders });
}
