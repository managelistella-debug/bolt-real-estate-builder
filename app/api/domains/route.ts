import { NextRequest, NextResponse } from 'next/server';
import { attachDomainToProject } from '@/lib/server/vercelDomains';
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
    projectId: tenant.infra.vercelProjectId,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const tenantId = body?.tenantId as string | undefined;
  const domain = body?.domain as string | undefined;
  if (!tenantId || !domain) {
    return NextResponse.json({ error: 'tenantId and domain are required' }, { status: 400 });
  }

  const tenant = await ensureTenantRecord(tenantId);
  const projectId = body?.projectId || tenant.infra.vercelProjectId;
  const teamId = body?.teamId || tenant.infra.vercelTeamId;

  let providerStatus: 'connected' | 'pending_dns' = 'pending_dns';
  try {
    if (projectId && process.env.VERCEL_API_TOKEN) {
      await attachDomainToProject(projectId, domain, teamId);
      providerStatus = 'connected';
    }
  } catch {
    providerStatus = 'pending_dns';
  }

  const updated = await upsertTenantRecord(tenantId, (current) => ({
    ...current,
    infra: {
      ...current.infra,
      vercelProjectId: projectId,
      vercelTeamId: teamId,
      updatedAt: new Date().toISOString(),
    },
    domains: [
      ...current.domains.filter((entry) => entry.domain !== domain),
      {
        domain,
        projectId,
        status: providerStatus,
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
