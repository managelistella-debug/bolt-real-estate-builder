import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get('role');
  const supabase = getServiceClient();

  let query = supabase.from('profiles').select('*');

  if (role === 'admin') {
    query = query.in('role', ['super_admin', 'internal_admin']);
  } else if (role === 'business_user') {
    query = query.eq('role', 'business_user');
  }

  const { data: profiles, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (role === 'business_user') {
    const enriched = await Promise.all(
      (profiles || []).map(async (p: Record<string, unknown>) => {
        const tenantId = p.business_id || p.id;

        const [listings, blogs, leads] = await Promise.all([
          supabase.from('listings').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId as string),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId as string),
          supabase.from('leads').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId as string),
        ]);

        const { data: tenant } = await supabase
          .from('tenants')
          .select('website_id')
          .eq('user_id', tenantId as string)
          .maybeSingle();

        return {
          ...p,
          stats: {
            listings: listings.count ?? 0,
            blogs: blogs.count ?? 0,
            leads: leads.count ?? 0,
          },
          connectionStatus: tenant?.website_id ? 'connected' : 'not_connected',
        };
      })
    );

    return NextResponse.json(enriched);
  }

  return NextResponse.json(profiles || []);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { userId, ...updates } = body;

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.role !== undefined) updateData.role = updates.role;
  if (updates.permissions !== undefined) updateData.permissions = updates.permissions;
  if (updates.last_login_at !== undefined) updateData.last_login_at = updates.last_login_at;

  const { error } = await supabase
    .from('profiles')
    .update(updateData as never)
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
