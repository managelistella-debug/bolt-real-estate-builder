import { NextRequest, NextResponse } from 'next/server';
import { assertTenantAccess, readSessionTenantContext } from '@/lib/server/tenantGuard';
import { ensureTenantDataset } from '@/lib/server/cmsData';

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

  const dataset = ensureTenantDataset(tenantId);
  dataset.integrations.resend = {
    apiKey: body?.apiKey || dataset.integrations.resend.apiKey,
    defaultRecipient: body?.defaultRecipient || dataset.integrations.resend.defaultRecipient,
    enabled: true,
  };
  dataset.integrations.updatedAt = new Date();

  return NextResponse.json({
    success: true,
    resend: dataset.integrations.resend,
  });
}
