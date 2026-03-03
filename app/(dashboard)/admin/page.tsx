'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/lib/stores/auth';
import { useTemplateCatalogStore } from '@/lib/stores/templateCatalog';
import { useAuditLogStore } from '@/lib/stores/auditLog';
import { Users, Layout, Shield, FileText } from 'lucide-react';

export default function AdminHomePage() {
  const { getAllUsers, isImpersonating } = useAuthStore();
  const { assets } = useTemplateCatalogStore();
  const { events } = useAuditLogStore();

  const cards = [
    { label: 'Users', value: getAllUsers().length, sub: 'Total users', href: '/admin/users', icon: Users },
    { label: 'Template Assets', value: assets.length, sub: 'Global + assigned assets', href: '/admin/templates', icon: Layout },
    { label: 'Impersonation', value: isImpersonating ? 'Active' : 'Idle', sub: 'Support mode status', href: null, icon: Shield },
    { label: 'Audit Events', value: events.length, sub: 'Recent support actions', href: '/admin/audit', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Admin" description="Manage tenants, impersonation, and template distribution." />
      </div>
      <div className="grid gap-4 p-6 md:grid-cols-4">
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
    </div>
  );
}
