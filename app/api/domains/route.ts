import { NextRequest, NextResponse } from 'next/server';
import { ensureTenantRecord, upsertTenantRecord } from '@/lib/server/tenantStore';
import { addAuditEvent } from '@/lib/server/auditBuffer';

export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenantId');
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }
  const tenant = await ensureTenantRecord(tenantId);
  return NextResponse.json({
    success: true,
    items: tenant.domains,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const tenantId = body?.tenantId as string | undefined;
  const domain = body?.domain as string | undefined;
  if (!tenantId || !domain) {
    return NextResponse.json({ error: 'tenantId and domain are required' }, { status: 400 });
  }

  const updated = await upsertTenantRecord(tenantId, (current) => ({
    ...current,
    domains: [
      ...current.domains.filter((entry) => entry.domain !== domain),
      {
        domain,
        status: 'pending_dns' as const,
        isPrimary: current.domains.length === 0,
        updatedAt: new Date().toISOString(),
      },
    ],
  }));
  addAuditEvent({
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'integration_updated',
    actorUserId: tenantId,
    effectiveUserId: tenantId,
    entityId: domain,
    entityType: 'domain',
    createdAt: new Date(),
    metadata: { action: 'domain_attached' },
  });

  return NextResponse.json({
    success: true,
    items: updated.domains,
  });
}
