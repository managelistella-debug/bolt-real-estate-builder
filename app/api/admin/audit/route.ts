import { NextRequest, NextResponse } from 'next/server';
import { readSessionTenantContext } from '@/lib/server/tenantGuard';
import { AuditEvent } from '@/lib/stores/auditLog';
import { addAuditEvent, listAuditEvents } from '@/lib/server/auditBuffer';

export async function GET(request: NextRequest) {
  const sessionContext = readSessionTenantContext(request);
  if (!sessionContext || (sessionContext.actorRole !== 'super_admin' && sessionContext.actorRole !== 'internal_admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json({ items: listAuditEvents() });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AuditEvent;
  addAuditEvent(body);
  return NextResponse.json({ success: true });
}
