'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/lib/stores/auth';
import { useTemplateCatalogStore } from '@/lib/stores/templateCatalog';
import { useAuditLogStore, type AuditEvent } from '@/lib/stores/auditLog';
import { Users, Layout, Shield, FileText, Clock, ShieldCheck } from 'lucide-react';

const eventLabels: Record<string, string> = {
  admin_login: 'Logged in',
  impersonation_started: 'Started impersonation',
  impersonation_stopped: 'Stopped impersonation',
  password_reset: 'Reset password',
  user_updated: 'Updated user',
  permissions_updated: 'Changed permissions',
  admin_assigned_theme: 'Assigned theme',
  template_published_global: 'Published template',
  integration_updated: 'Updated integration',
  api_key_created: 'Created API key',
};

export default function AdminHomePage() {
  const { isImpersonating } = useAuthStore();
  const { assets } = useTemplateCatalogStore();
  const { events } = useAuditLogStore();

  const [staffCount, setStaffCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);

  const fetchCounts = useCallback(async () => {
    try {
      const [adminRes, clientRes] = await Promise.all([
        fetch('/api/data/users?role=admin'),
        fetch('/api/data/users?role=business_user'),
      ]);
      if (adminRes.ok) {
        const data = await adminRes.json();
        setStaffCount(data.length);
      }
      if (clientRes.ok) {
        const data = await clientRes.json();
        setClientCount(data.length);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  const recentEvents = events.slice(0, 5) as AuditEvent[];

  const cards = [
    { label: 'Admin Staff', value: staffCount, sub: 'Admins & support', href: '/admin/users', icon: ShieldCheck },
    { label: 'Client Users', value: clientCount, sub: 'Business accounts', href: '/admin/clients', icon: Users },
    { label: 'Template Assets', value: assets.length, sub: 'Global + assigned', href: '/admin/templates', icon: Layout },
    { label: 'Impersonation', value: isImpersonating ? 'Active' : 'Idle', sub: 'Support mode', href: null, icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Admin" description="Manage staff, clients, impersonation, and template distribution." />
      </div>

      <div className="space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-[#EBEBEB] bg-white p-5">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F5F3]">
                <c.icon className="h-4 w-4 text-[#888C99]" />
              </div>
              <p className="text-[13px] text-[#888C99]">{c.label}</p>
              <p className="mt-1 text-[24px] font-medium text-black">{c.value}</p>
              <p className="mb-4 text-[13px] text-[#888C99]">{c.sub}</p>
              {c.href && (
                <Link href={c.href} className="inline-flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
                  Open
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#888C99]" />
              <h3 className="text-[15px] font-medium text-black">Recent Activity</h3>
            </div>
            <Link href="/admin/audit" className="text-[13px] text-[#888C99] hover:text-black">
              View all
            </Link>
          </div>
          {recentEvents.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-[#888C99]">No recent activity.</p>
          ) : (
            <div className="space-y-2">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 rounded-lg border border-[#EBEBEB] p-3">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-[#CCCCCC]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-black">
                      {eventLabels[event.type] || event.type}
                    </p>
                    {event.targetUserId && (
                      <p className="text-[11px] text-[#888C99]">
                        Target: <span className="font-mono">{event.targetUserId.slice(0, 8)}...</span>
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-[11px] text-[#CCCCCC]">
                    {new Date(event.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
