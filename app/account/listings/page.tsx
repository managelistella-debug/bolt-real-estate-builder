'use client';

import { Header } from '@/components/layout/header';
import WordPressCmsPanel from '@/components/aspen/admin/WordPressCmsPanel';

export default function AccountListingsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Listings"
          description="Manage your property listings in WordPress"
        />
      </div>
      <div className="p-4 sm:p-6">
        <WordPressCmsPanel kind="listings" />
      </div>
    </div>
  );
}
