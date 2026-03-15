import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret');
  if (secret !== 'run-migration-006') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      db: { schema: 'public' },
    }
  );

  const results: Record<string, string> = {};

  // 1. Add date column via a workaround: insert then alter won't work via REST
  // We need to use the SQL editor approach. Let's try creating an RPC function first.

  // Actually, the only reliable way is via the Supabase Management API.
  // Let's use a different approach: use the pg_net extension or create a migration function.
  
  // Try: use the supabase-js admin client to call the Management API
  const projectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    .replace('https://', '')
    .replace('.supabase.co', '');

  const queries = [
    'ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS date date;',
    'ALTER TABLE public.embed_configs DROP CONSTRAINT IF EXISTS embed_configs_type_check;',
    "ALTER TABLE public.embed_configs ADD CONSTRAINT embed_configs_type_check CHECK (type IN ('listing_feed', 'listing_detail', 'testimonial_feed', 'blog_feed'));",
  ];

  // Use the Supabase Management API v1 SQL endpoint
  for (let i = 0; i < queries.length; i++) {
    try {
      const resp = await fetch(
        `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN || ''}`,
          },
          body: JSON.stringify({ query: queries[i] }),
        }
      );
      const body = await resp.text();
      results[`query_${i}`] = `${resp.status}: ${body.substring(0, 200)}`;
    } catch (e: any) {
      results[`query_${i}`] = `error: ${e.message}`;
    }
  }

  return NextResponse.json(results);
}
