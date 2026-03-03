'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';

export default function PagesListPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Page Builder Retired" description="Visual page editing has been removed for headless CMS mode." />
      </div>
      <div className="p-6">
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="mb-2 text-[15px] font-normal text-black">Use API-driven content instead</h2>
          <p className="mb-4 text-[13px] text-[#888C99]">
            Build pages directly in your codebase and consume content from this CMS via API.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Link href="/blogs" className="inline-flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">Blogs</Link>
            <Link href="/listings" className="inline-flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">Listings</Link>
            <Link href="/collections" className="inline-flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">Media</Link>
            <Link href="/integrations" className="inline-flex h-[30px] items-center rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]">Open Integrations</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
