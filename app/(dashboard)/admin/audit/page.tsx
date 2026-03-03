'use client';

import { Header } from '@/components/layout/header';
import { useAuditLogStore } from '@/lib/stores/auditLog';
import { FileText } from 'lucide-react';

export default function AdminAuditPage() {
  const { events } = useAuditLogStore();

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Admin Audit" description="Tenant support and impersonation activity log." />
      </div>
      <div className="p-6">
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="mb-4 text-[15px] font-normal text-black">Recent Events</h2>
          <div className="space-y-2">
            {events.length === 0 && (
              <div className="flex flex-col items-center py-10 text-center">
                <FileText className="mb-2 h-6 w-6 text-[#CCCCCC]" />
                <p className="text-[13px] text-[#888C99]">No audit events yet.</p>
              </div>
            )}
            {events.map((event) => (
              <div key={event.id} className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3">
                <p className="text-[13px] font-medium text-black">{event.type}</p>
                <p className="text-[11px] text-[#888C99]">
                  actor {event.actorUserId} – effective {event.effectiveUserId || '–'}
                </p>
                {event.metadata?.reason && (
                  <p className="text-[11px] text-[#888C99]">reason: {event.metadata.reason}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
