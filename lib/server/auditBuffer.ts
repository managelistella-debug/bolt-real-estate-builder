import { AuditEvent } from '@/lib/stores/auditLog';

const auditLogBuffer: AuditEvent[] = [];

export function listAuditEvents(): AuditEvent[] {
  return auditLogBuffer;
}

export function addAuditEvent(event: AuditEvent) {
  auditLogBuffer.unshift(event);
  if (auditLogBuffer.length > 2000) {
    auditLogBuffer.length = 2000;
  }
}
