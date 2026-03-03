import { NextRequest, NextResponse } from 'next/server';
import { requirePublicApiKey } from '@/lib/server/publicApi';
import { markRevalidationError, runTenantRevalidation } from '@/lib/server/revalidation';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;
  const unauthorized = await requirePublicApiKey(request, tenant, 'content:read');
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const allowedTypes = new Set(['listing', 'blog', 'testimonial', 'globals', 'media']);
  const contentType = allowedTypes.has(body?.type) ? body.type : 'listing';
  const slug = body?.slug as string | undefined;

  try {
    const targets = await runTenantRevalidation({
      tenantId: tenant,
      type: contentType,
      slug,
    });
    return NextResponse.json({
      apiVersion: 'v1',
      success: true,
      tenant,
      queued: true,
      revalidated: targets,
    });
  } catch (error) {
    await markRevalidationError(tenant);
    return NextResponse.json(
      {
        apiVersion: 'v1',
        success: false,
        tenant,
        error: 'Revalidation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
