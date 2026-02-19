'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuditLogStore } from '@/lib/stores/auditLog';

export default function AdminAuditPage() {
  const { events } = useAuditLogStore();

  return (
    <div>
      <Header
        title="Admin Audit"
        description="Tenant support and impersonation activity log."
      />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground">No audit events yet.</p>
            )}
            {events.map((event) => (
              <div key={event.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{event.type}</p>
                <p className="text-xs text-muted-foreground">
                  actor {event.actorUserId} - effective {event.effectiveUserId || '-'}
                </p>
                {event.metadata?.reason && (
                  <p className="text-xs text-muted-foreground">reason: {event.metadata.reason}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
