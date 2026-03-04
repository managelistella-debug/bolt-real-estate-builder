import { NextRequest, NextResponse } from 'next/server';
import { ensureTenantRecord, upsertTenantRecord, getTenantRecord } from '@/lib/server/tenantStore';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const tenantId = body?.tenantId as string | undefined;
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }

  await ensureTenantRecord(tenantId);

  const websiteUrl = body?.websiteUrl as string | undefined;
  const webhookUrl = body?.webhookUrl as string | undefined;
  const siteName = body?.siteName as string | undefined;

  await upsertTenantRecord(tenantId, (current) => ({
    ...current,
    infra: {
      ...current.infra,
      revalidationWebhookUrl: webhookUrl ?? current.infra.revalidationWebhookUrl,
      updatedAt: new Date().toISOString(),
    },
    globals: {
      ...current.globals,
      updatedAt: new Date().toISOString(),
    },
  }));

  const tenant = await getTenantRecord(tenantId);
  const apiKey = tenant?.apiKeys[0]?.key ?? `demo_public_key_${tenantId}`;

  return NextResponse.json({
    success: true,
    connection: {
      tenantId,
      apiKey,
      siteName: siteName ?? null,
      websiteUrl: websiteUrl ?? null,
      webhookUrl: tenant?.infra.revalidationWebhookUrl ?? null,
      webhookStatus: tenant?.infra.revalidationStatus ?? 'idle',
      listingsCount: tenant?.listings.length ?? 0,
      blogsCount: tenant?.blogs.length ?? 0,
      testimonialsCount: tenant?.testimonials.length ?? 0,
    },
  });
}

export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId');
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId required' }, { status: 400 });
  }

  const tenant = await getTenantRecord(tenantId);
  if (!tenant) {
    return NextResponse.json({ provisioned: false });
  }

  const apiKey = tenant.apiKeys[0]?.key ?? `demo_public_key_${tenantId}`;

  return NextResponse.json({
    provisioned: true,
    connection: {
      tenantId,
      apiKey,
      webhookUrl: tenant.infra.revalidationWebhookUrl ?? null,
      webhookStatus: tenant.infra.revalidationStatus ?? 'idle',
      listingsCount: tenant.listings.length,
      blogsCount: tenant.blogs.length,
      testimonialsCount: tenant.testimonials.length,
    },
  });
}
