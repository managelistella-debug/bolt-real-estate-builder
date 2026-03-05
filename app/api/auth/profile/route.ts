import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { getLocalProfile, isSupabaseConfigured } from '@/lib/server/localAuthStore';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  if (!isSupabaseConfigured()) {
    try {
      const localProfile = await getLocalProfile(userId);
      return NextResponse.json(localProfile);
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
  }

  const { data, error } = await getServiceClient()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
