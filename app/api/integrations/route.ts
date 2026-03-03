import { NextRequest, NextResponse } from 'next/server';
import { assertTenantAccess, readSessionTenantContext } from '@/lib/server/tenantGuard';
import { ensureTenantDataset } from '@/lib/server/cmsData';
import { upsertTenantRecord } from '@/lib/server/tenantStore';

export async function GET(request: NextRequest) {
  const sessionContext = readSessionTenantContext(request);
  if (!sessionContext) {
    return NextResponse.json({ error: 'Missing authenticated tenant context' }, { status: 401 });
  }
  const tenantId = request.nextUrl.searchParams.get('tenantId') || sessionContext.effectiveUserId;
  if (!assertTenantAccess(sessionContext, tenantId)) {
    return NextResponse.json({ error: 'Forbidden tenant access' }, { status: 403 });
  }
  const dataset = await ensureTenantDataset(tenantId);
  return NextResponse.json(dataset.integrations);
}

export async function POST(request: NextRequest) {
  const sessionContext = readSessionTenantContext(request);
  if (!sessionContext) {
    return NextResponse.json({ error: 'Missing authenticated tenant context' }, { status: 401 });
  }
  const body = await request.json();
  const tenantId = String(body?.tenantId || sessionContext.effectiveUserId);
  if (!assertTenantAccess(sessionContext, tenantId)) {
    return NextResponse.json({ error: 'Forbidden tenant access' }, { status: 403 });
  }
  const updated = await upsertTenantRecord(tenantId, (current) => ({
    ...current,
    integrations: {
      ...current.integrations,
      ...body,
      google: { ...current.integrations.google, ...(body?.google || {}) },
      resend: { ...current.integrations.resend, ...(body?.resend || {}) },
      updatedAt: new Date(),
    },
  }));
  return NextResponse.json({ success: true, integrations: updated.integrations });
}
