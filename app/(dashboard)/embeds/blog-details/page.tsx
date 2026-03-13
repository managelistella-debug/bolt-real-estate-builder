'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function BlogDetailsEditorPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/embeds"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EBEBEB] text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-[15px] font-medium text-black">Blog Details Editor</h1>
            <p className="text-[13px] text-[#888C99]">Manage blog post detail-page presentation separately from feed cards.</p>
          </div>
        </div>
      </div>

      <div className="border-b border-[#EBEBEB] bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <Link
            href="/embeds"
            className="rounded-lg border border-[#EBEBEB] bg-white px-3 py-1.5 text-[13px] text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black"
          >
            Blog Feed Editor
          </Link>
          <span className="rounded-lg bg-black px-3 py-1.5 text-[13px] text-white">
            Blog Detail Appearance
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-6">
          <h2 className="text-[15px] font-medium text-black">Open Blog Template Controls</h2>
          <p className="mt-2 text-[13px] text-[#888C99]">
            Feed card visibility controls have been separated from details-page controls.
            Use the Blog Template editor to configure category/date/author, hero, related cards, and detail-page styling.
          </p>
          <Link
            href="/blogs/templates/editor"
            className="mt-4 inline-flex h-[34px] items-center gap-2 rounded-lg bg-[#DAFF07] px-4 text-[13px] text-black transition-colors hover:bg-[#C8ED00]"
          >
            Open Blog Template Editor
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
