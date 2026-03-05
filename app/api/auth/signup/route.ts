import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { createLocalUser, isSupabaseConfigured } from '@/lib/server/localAuthStore';

export async function POST(req: NextRequest) {
  const { email, password, name, role } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    const created = await createLocalUser({
      email,
      password,
      name: name || '',
      role: role || 'business_user',
    });

    if (!created.user) {
      return NextResponse.json({ error: created.error || 'Registration failed' }, { status: 400 });
    }

    return NextResponse.json({ userId: created.user.id, email: created.user.email });
  }

  const supabase = getServiceClient();

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
    name: name || '',
    role: role || 'business_user',
    business_id: role === 'business_user' ? `business-${Date.now()}` : null,
  } as any);

  return NextResponse.json({ userId, email });
}
