import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { isSupabaseConfigured, updateLocalPassword } from '@/lib/server/localAuthStore';

export async function POST(req: NextRequest) {
  const { userId, newPassword } = await req.json();

  if (!userId || !newPassword) {
    return NextResponse.json({ error: 'userId and newPassword are required' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    const changed = await updateLocalPassword(userId, newPassword);
    if (!changed) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  }

  const supabase = getServiceClient();

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
