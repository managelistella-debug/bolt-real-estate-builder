import { NextRequest, NextResponse } from 'next/server';
import { getAllTestimonials } from '@/lib/aspen/testimonials';
import { testimonialToPublicApiRow } from '@/lib/wordpress/publicRows';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const tenantId = req.nextUrl.searchParams.get('tenantId');
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId required' }, { status: 400, headers: corsHeaders });
  }

  const all = await getAllTestimonials();
  const rows = all.map((t) => testimonialToPublicApiRow(t));
  return NextResponse.json(rows, { headers: corsHeaders });
}
