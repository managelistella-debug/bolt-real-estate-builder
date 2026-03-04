'use client';

import { useEffect, useRef } from 'react';
import { X, Clock, Shield, ShieldCheck, KeyRound, UserCog, Settings } from 'lucide-react';
import { useAuditLogStore, type AuditEventType } from '@/lib/stores/auditLog';

interface ActivityDrawerProps {
  userId: string;
  onClose: () => void;
}

const eventConfig: Record<AuditEventType, { label: string; icon: typeof Clock; color: string }> = {
  admin_login: { label: 'Logged in', icon: Clock, color: 'text-blue-500' },
  impersonation_started: { label: 'Started impersonation', icon: Shield, color: 'text-orange-500' },
  impersonation_stopped: { label: 'Stopped impersonation', icon: Shield, color: 'text-green-500' },
  password_reset: { label: 'Reset password', icon: KeyRound, color: 'text-red-500' },
  user_updated: { label: 'Updated user', icon: UserCog, color: 'text-purple-500' },
  permissions_updated: { label: 'Changed permissions', icon: ShieldCheck, color: 'text-yellow-600' },
  admin_assigned_theme: { label: 'Assigned theme', icon: Settings, color: 'text-indigo-500' },
  template_published_global: { label: 'Published template', icon: Settings, color: 'text-teal-500' },
  integration_updated: { label: 'Updated integration', icon: Settings, color: 'text-cyan-500' },
  api_key_created: { label: 'Created API key', icon: KeyRound, color: 'text-emerald-500' },
};

export function ActivityDrawer({ userId, onClose }: ActivityDrawerProps) {
  const { events } = useAuditLogStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  const userEvents = events.filter(
    (e) => e.actorUserId === userId || e.targetUserId === userId
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#EBEBEB] bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#EBEBEB] px-5 py-4">
          <div>
            <h3 className="text-[15px] font-medium text-black">Activity Log</h3>
            <p className="text-[13px] text-[#888C99]">{userEvents.length} events</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EBEBEB] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {userEvents.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-[#888C99]">
              No activity recorded for this user.
            </div>
          ) : (
            <div className="space-y-1">
              {userEvents.map((event) => {
                const config = eventConfig[event.type] || {
                  label: event.type,
                  icon: Clock,
                  color: 'text-[#888C99]',
                };
                const EventIcon = config.icon;
                const isActor = event.actorUserId === userId;

                return (
                  <div
                    key={event.id}
                    className="rounded-lg border border-[#EBEBEB] p-3 hover:bg-[#F5F5F3]"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 ${config.color}`}>
                        <EventIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-black">
                          {config.label}
                        </p>
                        <p className="text-[11px] text-[#888C99]">
                          {isActor ? 'Performed by this user' : 'Targeted this user'}
                        </p>
                        {event.targetUserId && event.targetUserId !== userId && (
                          <p className="mt-0.5 text-[11px] text-[#888C99]">
                            Target: <span className="font-mono">{event.targetUserId.slice(0, 8)}...</span>
                          </p>
                        )}
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {Object.entries(event.metadata).map(([k, v]) => (
                              <span
                                key={k}
                                className="rounded bg-[#F5F5F3] px-1.5 py-0.5 text-[10px] font-mono text-[#888C99]"
                              >
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mt-1 text-[11px] text-[#CCCCCC]">
                          {new Date(event.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
