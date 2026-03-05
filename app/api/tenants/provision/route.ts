import { NextRequest, NextResponse } from 'next/server';
import { ensureTenantRecord, upsertTenantRecord } from '@/lib/server/tenantStore';

const idempotencyBuffer = new Map<string, { tenantId: string; createdAt: string }>();

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const tenantId = body?.tenantId as string | undefined;
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }

  const idempotencyKey = request.headers.get('x-idempotency-key');
  if (idempotencyKey && idempotencyBuffer.has(idempotencyKey)) {
    return NextResponse.json({
      success: true,
      idempotent: true,
      tenantId,
      workflow: idempotencyBuffer.get(idempotencyKey),
    });
  }

  const tenant = await ensureTenantRecord(tenantId);
  const revalidationWebhookUrl = body?.revalidationWebhookUrl as string | undefined;

  await upsertTenantRecord(tenantId, (current) => ({
    ...current,
    infra: {
      ...current.infra,
      revalidationWebhookUrl: revalidationWebhookUrl || current.infra.revalidationWebhookUrl,
      updatedAt: new Date().toISOString(),
    },
  }));

  const workflow = {
    tenantId,
    createdAt: new Date().toISOString(),
    steps: [
      'tenant_created',
      'environment_variables_expected',
      'webhook_registration_pending',
      'domain_connection_pending',
    ],
  };
  if (idempotencyKey) idempotencyBuffer.set(idempotencyKey, { tenantId, createdAt: workflow.createdAt });

  return NextResponse.json({
    success: true,
    tenant: {
      tenantId: tenant.tenantId,
      websiteId: tenant.websiteId,
    },
    workflow,
  });
}
