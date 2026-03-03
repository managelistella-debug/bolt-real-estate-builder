import { NextRequest, NextResponse } from 'next/server';
import { assertTenantAccess, readSessionTenantContext } from '@/lib/server/tenantGuard';
import { upsertTenantRecord } from '@/lib/server/tenantStore';

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
      resend: {
        apiKey: body?.apiKey || current.integrations.resend.apiKey,
        defaultRecipient: body?.defaultRecipient || current.integrations.resend.defaultRecipient,
        enabled: true,
      },
      updatedAt: new Date(),
    },
  }));

  return NextResponse.json({
    success: true,
    resend: updated.integrations.resend,
  });
}
