import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const tenantId = req.nextUrl.searchParams.get('tenantId');
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId required' }, { status: 400, headers: corsHeaders });
  }

  const status = req.nextUrl.searchParams.get('status');
  const featured = req.nextUrl.searchParams.get('featured');

  const sb = getServiceClient();
  let query = sb.from('listings').select('*').eq('tenant_id', tenantId);

  if (status) {
    query = query.eq('listing_status', status);
  }
  if (featured === 'true') {
    query = query.eq('homepage_featured', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }

  return NextResponse.json(data ?? [], { headers: corsHeaders });
}
