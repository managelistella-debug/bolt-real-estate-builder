import { NextRequest, NextResponse } from 'next/server';
import { ensureTenantRecord, upsertTenantRecord } from '@/lib/server/tenantStore';
import { verifyProjectDomain } from '@/lib/server/vercelDomains';
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

  const tenant = await ensureTenantRecord(tenantId);
  let status: 'connected' | 'error' = 'connected';
  let verificationError: string | undefined;
  try {
    if (tenant.infra.vercelProjectId && process.env.VERCEL_API_TOKEN) {
      await verifyProjectDomain(tenant.infra.vercelProjectId, decodedDomain, tenant.infra.vercelTeamId);
    }
  } catch (error) {
    status = 'error';
    verificationError = error instanceof Error ? error.message : 'Verification failed';
  }

  const updated = await upsertTenantRecord(tenantId, (current) => ({
    ...current,
    domains: current.domains.map((entry) =>
      entry.domain === decodedDomain
        ? {
            ...entry,
            status,
            verificationError,
            updatedAt: new Date().toISOString(),
          }
        : entry
    ),
  }));
  addAuditEvent({
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'integration_updated',
    actorUserId: tenantId,
    effectiveUserId: tenantId,
    entityId: decodedDomain,
    entityType: 'domain',
    createdAt: new Date(),
    metadata: { action: 'domain_verified', status },
  });

  return NextResponse.json({
    success: status === 'connected',
    items: updated.domains,
  });
}
