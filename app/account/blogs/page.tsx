'use client';

import { Header } from '@/components/layout/header';
import BlogManager from '@/components/aspen/admin/BlogManager';

export default function AccountBlogsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Blogs"
          description="Manage your blog posts"
        />
      </div>
      <BlogManager />
    </div>
  );
}
