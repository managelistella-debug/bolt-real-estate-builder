import { NextRequest, NextResponse } from 'next/server';
import { assertTenantAccess, readSessionTenantContext } from '@/lib/server/tenantGuard';
import { createLeadAndSubmission, ensureTenantDataset } from '@/lib/server/cmsData';

export async function GET(request: NextRequest) {
  const sessionContext = readSessionTenantContext(request);
  if (!sessionContext) {
    return NextResponse.json({ error: 'Missing authenticated tenant context' }, { status: 401 });
  }

  const tenantId = request.nextUrl.searchParams.get('tenantId') || sessionContext.effectiveUserId;
  if (!assertTenantAccess(sessionContext, tenantId)) {
    return NextResponse.json({ error: 'Forbidden tenant access' }, { status: 403 });
  }

  const dataset = ensureTenantDataset(tenantId);
  return NextResponse.json({ items: dataset.submissions });
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
  if (!body?.email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const result = createLeadAndSubmission(tenantId, {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    message: body.message,
    sourcePage: body.sourcePage,
    formKey: body.formKey || 'contact-form',
    payload: body.payload || {},
  });

  return NextResponse.json({ success: true, ...result });
}
