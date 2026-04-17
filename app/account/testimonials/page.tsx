'use client';

import { Header } from '@/components/layout/header';

export default function AccountTestimonialsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Testimonials"
          description="Client testimonials shown on the site"
        />
      </div>
      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-black">Testimonials are built into the website</h2>
          <p className="text-[13px] leading-relaxed text-[#888C99]">
            Home and About pull from a fixed set of reviews in the codebase. They are not synced from WordPress.
            To change copy or add reviews, update the site source (or ask your developer).
          </p>
        </div>
      </div>
    </div>
  );
}
