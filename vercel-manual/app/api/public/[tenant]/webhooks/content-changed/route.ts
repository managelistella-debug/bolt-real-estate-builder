import { NextRequest, NextResponse } from 'next/server';
import { requirePublicApiKey } from '@/lib/server/publicApi';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;
  const unauthorized = requirePublicApiKey(request, tenant, 'content:read');
  if (unauthorized) return unauthorized;

  // Placeholder for ISR/rebuild hook dispatching.
  return NextResponse.json({
    success: true,
    tenant,
    queued: true,
    message: 'Content change webhook accepted.',
  });
}
