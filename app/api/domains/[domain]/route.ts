import { NextRequest, NextResponse } from 'next/server';
import { ensureTenantRecord, upsertTenantRecord } from '@/lib/server/tenantStore';
import { addAuditEvent } from '@/lib/server/auditBuffer';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;
  const tenantId = request.nextUrl.searchParams.get('tenantId');
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }

  await ensureTenantRecord(tenantId);
  const decodedDomain = decodeURIComponent(domain);

  const updated = await upsertTenantRecord(tenantId, (current) => ({
    ...current,
    domains: current.domains.filter((entry) => entry.domain !== decodedDomain),
  }));
  addAuditEvent({
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'integration_updated',
    actorUserId: tenantId,
    effectiveUserId: tenantId,
    entityId: decodedDomain,
    entityType: 'domain',
    createdAt: new Date(),
    metadata: { action: 'domain_removed' },
  });

  return NextResponse.json({ success: true, items: updated.domains });
}
