'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';

export default function NavigationPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Navigation Builder Retired" description="Navigation is now managed directly in each coded frontend website." />
      </div>
      <div className="p-6">
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="mb-2 text-[15px] font-normal text-black">Headless mode active</h2>
          <p className="mb-4 text-[13px] text-[#888C99]">
            Use your frontend framework (Next.js, React, etc.) to define navigation and route structure.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Link href="/dashboard" className="inline-flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">Dashboard</Link>
            <Link href="/settings" className="inline-flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">Domain Settings</Link>
            <Link href="/integrations" className="inline-flex h-[30px] items-center rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]">Integrations</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
