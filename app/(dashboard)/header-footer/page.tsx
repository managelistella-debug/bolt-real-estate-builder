'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';

export default function HeaderFooterPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Header/Footer Builder Retired" description="Layout builder tooling is disabled in headless CMS mode." />
      </div>
      <div className="p-6">
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="mb-2 text-[15px] font-normal text-black">Manage coded site structure in your frontend repo</h2>
          <p className="mb-4 text-[13px] text-[#888C99]">
            Use this app for content, CRM, integrations, and domains. Headers, navigation, and footers now live in your codebase.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Link href="/integrations" className="inline-flex h-[30px] items-center rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]">Open Integrations</Link>
            <Link href="/settings" className="inline-flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">Domain Settings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
