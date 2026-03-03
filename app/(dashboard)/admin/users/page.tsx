'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/lib/stores/auth';
import { Search } from 'lucide-react';

const darkInput = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

export default function AdminUsersPage() {
  const router = useRouter();
  const { getAllUsers, startImpersonation, user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [reason, setReason] = useState('Customer support request');

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return getAllUsers().filter((entry) => {
      if (!term) return true;
      return entry.name.toLowerCase().includes(term) || entry.email.toLowerCase().includes(term) || entry.role.toLowerCase().includes(term);
    });
  }, [getAllUsers, search]);

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Admin Users" description="Browse all tenants and enter support mode as that user." />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex gap-3">
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Support reason for impersonation audit trail" className={darkInput} />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users by name, email, role" className={`${darkInput} pl-8`} />
          </div>
        </div>

        <div className="divide-y divide-[#EBEBEB] rounded-xl border border-[#EBEBEB] bg-white">
          {rows.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[13px] font-medium text-black">{entry.name}</p>
                <p className="text-[13px] text-[#888C99]">{entry.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[11px] text-[#888C99]">{entry.role}</span>
                  {entry.id === user?.id && <span className="rounded-full bg-[#DAFF07] px-2 py-0.5 text-[11px] text-black">Current</span>}
                </div>
              </div>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => { if (startImpersonation(entry.id, reason)) router.push('/dashboard'); }} className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
                  View Dashboard
                </button>
                <button type="button" onClick={() => { if (startImpersonation(entry.id, reason)) router.push('/dashboard'); }} className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]">
                  Log in as user
                </button>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="p-8 text-center text-[13px] text-[#888C99]">No users matched your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}
