import { NextRequest, NextResponse } from 'next/server';
import { getTenantRecord, verifyTenantApiKey } from '@/lib/server/tenantStore';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const tenantId = body?.tenantId as string | undefined;
  const apiKey = body?.apiKey as string | undefined;

  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }

  const tenant = await getTenantRecord(tenantId);
  if (!tenant) {
    return NextResponse.json({
      success: false,
      error: 'Tenant not found. Provision the tenant first.',
      checks: { tenant: false, apiKey: false, listings: 0, blogs: 0, testimonials: 0, webhook: false },
    });
  }

  const keyToTest = apiKey || tenant.apiKeys[0]?.key;
  const keyValid = keyToTest ? await verifyTenantApiKey(tenantId, keyToTest, 'content:read') : false;

  const webhookConfigured = !!tenant.infra.revalidationWebhookUrl;

  return NextResponse.json({
    success: true,
    checks: {
      tenant: true,
      apiKey: keyValid,
      listings: tenant.listings.length,
      blogs: tenant.blogs.length,
      testimonials: tenant.testimonials.length,
      webhook: webhookConfigured,
      webhookUrl: tenant.infra.revalidationWebhookUrl ?? null,
      webhookStatus: tenant.infra.revalidationStatus,
    },
  });
}
