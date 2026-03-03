import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { email, password, name, role } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
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
