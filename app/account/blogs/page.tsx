'use client';

import { Header } from '@/components/layout/header';
import WordPressCmsPanel from '@/components/aspen/admin/WordPressCmsPanel';

export default function AccountBlogsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Blogs"
          description="Manage blog posts in WordPress"
        />
      </div>
      <div className="p-4 sm:p-6">
        <WordPressCmsPanel kind="blogs" />
      </div>
    </div>
  );
}
