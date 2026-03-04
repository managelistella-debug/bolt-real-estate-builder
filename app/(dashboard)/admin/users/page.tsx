'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/lib/stores/auth';
import { Check, Copy, Search } from 'lucide-react';

const darkInput = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#888C99] hover:text-black"
      title="Copy"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { getAllUsers, startImpersonation, user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [reason, setReason] = useState('Customer support request');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return getAllUsers().filter((entry) => {
      if (!term) return true;
      return entry.name.toLowerCase().includes(term) || entry.email.toLowerCase().includes(term) || entry.role.toLowerCase().includes(term) || entry.id.toLowerCase().includes(term);
    });
  }, [getAllUsers, search]);

  const apiBaseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Admin Users" description="Browse all tenants, view connection details, and enter support mode." />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex gap-3">
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Support reason for impersonation audit trail" className={darkInput} />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users by name, email, role, or tenant ID" className={`${darkInput} pl-8`} />
          </div>
        </div>

        <div className="divide-y divide-[#EBEBEB] rounded-xl border border-[#EBEBEB] bg-white">
          {rows.map((entry) => {
            const tenantId = entry.id;
            const isExpanded = expandedId === entry.id;
            const defaultApiKey = `demo_public_key_${tenantId}`;

            return (
              <div key={entry.id} className="p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-black">{entry.name}</p>
                    <p className="text-[13px] text-[#888C99]">{entry.email}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[11px] text-[#888C99]">{entry.role}</span>
                      {entry.id === user?.id && <span className="rounded-full bg-[#DAFF07] px-2 py-0.5 text-[11px] text-black">Current</span>}
                      <span className="flex items-center gap-1 rounded-full border border-[#EBEBEB] px-2 py-0.5 text-[11px] font-mono text-[#888C99]">
                        ID: {tenantId.length > 20 ? `${tenantId.slice(0, 8)}...${tenantId.slice(-4)}` : tenantId}
                        <CopyButton value={tenantId} />
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                    >
                      {isExpanded ? 'Hide' : 'Connection Info'}
                    </button>
                    <button type="button" onClick={() => { if (startImpersonation(entry.id, reason)) router.push('/dashboard'); }} className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
                      View Dashboard
                    </button>
                    <button type="button" onClick={() => { if (startImpersonation(entry.id, reason)) router.push('/dashboard'); }} className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]">
                      Log in as user
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-3 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-4">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#888C99]">Website Connection Details</h3>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Tenant ID</p>
                        <div className="flex items-center gap-2 rounded-md border border-[#EBEBEB] bg-white px-3 py-1.5">
                          <code className="flex-1 truncate text-[12px] text-black">{tenantId}</code>
                          <CopyButton value={tenantId} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Default API Key</p>
                        <div className="flex items-center gap-2 rounded-md border border-[#EBEBEB] bg-white px-3 py-1.5">
                          <code className="flex-1 truncate text-[12px] text-black">{defaultApiKey}</code>
                          <CopyButton value={defaultApiKey} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">API Base URL</p>
                      <div className="flex items-center gap-2 rounded-md border border-[#EBEBEB] bg-white px-3 py-1.5">
                        <code className="flex-1 truncate text-[12px] text-black">{apiBaseUrl}</code>
                        <CopyButton value={apiBaseUrl} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Listings API Endpoint</p>
                      <div className="flex items-center gap-2 rounded-md border border-[#EBEBEB] bg-white px-3 py-1.5">
                        <code className="flex-1 truncate text-[12px] text-black">{apiBaseUrl}/api/public/{tenantId}/listings</code>
                        <CopyButton value={`${apiBaseUrl}/api/public/${tenantId}/listings`} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Environment Variables for External Site</p>
                      <div className="relative rounded-md border border-[#EBEBEB] bg-white p-3">
                        <pre className="overflow-x-auto text-[12px] leading-5 text-black">{`CMS_BASE_URL=${apiBaseUrl}
CMS_READ_TOKEN=${defaultApiKey}
TENANT_ID=${tenantId}`}</pre>
                        <div className="absolute right-2 top-2">
                          <CopyButton value={`CMS_BASE_URL=${apiBaseUrl}\nCMS_READ_TOKEN=${defaultApiKey}\nTENANT_ID=${tenantId}`} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Quick Fetch Example</p>
                      <div className="relative rounded-md border border-[#EBEBEB] bg-white p-3">
                        <pre className="overflow-x-auto text-[12px] leading-5 text-black">{`const res = await fetch(
  '${apiBaseUrl}/api/public/${tenantId}/listings',
  { headers: { 'x-api-key': '${defaultApiKey}' } }
);
const { data: listings } = await res.json();`}</pre>
                        <div className="absolute right-2 top-2">
                          <CopyButton value={`const res = await fetch(\n  '${apiBaseUrl}/api/public/${tenantId}/listings',\n  { headers: { 'x-api-key': '${defaultApiKey}' } }\n);\nconst { data: listings } = await res.json();`} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {rows.length === 0 && (
            <div className="p-8 text-center text-[13px] text-[#888C99]">No users matched your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}
