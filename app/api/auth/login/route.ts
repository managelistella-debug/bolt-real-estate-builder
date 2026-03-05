import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authenticateLocalUser, isSupabaseConfigured } from '@/lib/server/localAuthStore';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '').trim();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    const user = await authenticateLocalUser({ email, password });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({
      session: {
        access_token: 'local-dev-session',
        refresh_token: 'local-dev-refresh',
        expires_at: Date.now() + 1000 * 60 * 60 * 24,
      },
      user: {
        id: user.id,
        email: user.email,
      },
    });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
}
