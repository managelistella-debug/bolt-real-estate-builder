import { NextRequest, NextResponse } from 'next/server';
import { upsertTenantRecord } from '@/lib/server/tenantStore';
import { addAuditEvent } from '@/lib/server/auditBuffer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const body = await request.json().catch(() => ({}));
  const tenantId = body?.tenantId as string | undefined;
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }
  const { domain } = await params;
  const decodedDomain = decodeURIComponent(domain);

  const updated = await upsertTenantRecord(tenantId, (current) => ({
    ...current,
    domains: current.domains.map((entry) => ({
      ...entry,
      isPrimary: entry.domain === decodedDomain,
      updatedAt: new Date().toISOString(),
    })),
  }));
  addAuditEvent({
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'integration_updated',
    actorUserId: tenantId,
    effectiveUserId: tenantId,
    entityId: decodedDomain,
    entityType: 'domain',
    createdAt: new Date(),
    metadata: { action: 'domain_primary_set' },
  });

  return NextResponse.json({
    success: true,
    items: updated.domains,
  });
}
