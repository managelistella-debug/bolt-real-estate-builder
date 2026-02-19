import { NextRequest, NextResponse } from 'next/server';
import { readSessionTenantContext } from '@/lib/server/tenantGuard';
import { AuditEvent } from '@/lib/stores/auditLog';

const auditLogBuffer: AuditEvent[] = [];

export async function GET(request: NextRequest) {
  const sessionContext = readSessionTenantContext(request);
  if (!sessionContext || (sessionContext.actorRole !== 'super_admin' && sessionContext.actorRole !== 'internal_admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json({ items: auditLogBuffer });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AuditEvent;
  auditLogBuffer.unshift(body);
  if (auditLogBuffer.length > 2000) {
    auditLogBuffer.length = 2000;
  }
  return NextResponse.json({ success: true });
}
