import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { createLocalUser, isSupabaseConfigured } from '@/lib/server/localAuthStore';

const SEED_SECRET = process.env.ADMIN_SEED_SECRET || 'listella-seed-2026';

export async function POST(req: NextRequest) {
  const { email, password, name, secret } = await req.json();

  if (secret !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    const created = await createLocalUser({
      email,
      password,
      name: name || 'Super Admin',
      role: 'super_admin',
    });

    if (!created.user) {
      return NextResponse.json({ error: created.error || 'Failed to create admin' }, { status: 400 });
    }

    return NextResponse.json({ userId: created.user.id, email: created.user.email, role: 'super_admin' });
  }

  const supabase = getServiceClient();

  const { data: existingUsers } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('email', email)
    .limit(1);

  if (existingUsers && existingUsers.length > 0) {
    const profile = existingUsers[0];
    if (profile.role !== 'super_admin') {
      await supabase
        .from('profiles')
        .update({ role: 'super_admin' })
        .eq('id', profile.id);
    }
    return NextResponse.json({ message: 'User updated to super_admin', userId: profile.id, role: 'super_admin' });
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user.id;

  await supabase.from('profiles').insert({
    id: userId,
    email,
    name: name || 'Super Admin',
    role: 'super_admin',
  } as Record<string, unknown>);

  return NextResponse.json({ userId, email, role: 'super_admin' });
}
