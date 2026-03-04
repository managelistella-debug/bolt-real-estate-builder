import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuditEventType =
  | 'impersonation_started'
  | 'impersonation_stopped'
  | 'admin_assigned_theme'
  | 'template_published_global'
  | 'integration_updated'
  | 'api_key_created'
  | 'admin_login'
  | 'password_reset'
  | 'user_updated'
  | 'permissions_updated';

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  actorUserId: string;
  effectiveUserId?: string;
  targetUserId?: string;
  entityId?: string;
  entityType?: string;
  createdAt: Date;
  metadata?: Record<string, string>;
}

interface AuditLogState {
  events: AuditEvent[];
  addEvent: (event: Omit<AuditEvent, 'id' | 'createdAt'>) => void;
}

export const useAuditLogStore = create<AuditLogState>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event) => {
        const created = {
          ...event,
          id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date(),
        };
        // Best-effort server persistence for cross-session support auditing.
        if (typeof window !== 'undefined') {
          fetch('/api/admin/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(created),
          }).catch(() => undefined);
        }
        set((state) => ({
          events: [created, ...state.events].slice(0, 500),
        }));
      },
    }),
    {
      name: 'audit-log-storage',
      version: 1,
    }
  )
);
