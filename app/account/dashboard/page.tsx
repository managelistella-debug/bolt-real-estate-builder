'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/lib/stores/auth';
import { Building2, FileText, MessageSquareQuote, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AccountDashboardPage() {
  const { user } = useAuthStore();
  const [counts, setCounts] = useState({ listings: 0, blogs: 0, testimonials: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [listingsRes, blogsRes, testimonialsRes] = await Promise.all([
          fetch('/api/admin/listings', { credentials: 'include' }),
          fetch('/api/admin/blogs', { credentials: 'include' }),
          fetch('/api/admin/testimonials', { credentials: 'include' }),
        ]);
        const listings = listingsRes.ok ? await listingsRes.json() : [];
        const blogs = blogsRes.ok ? await blogsRes.json() : [];
        const testimonials = testimonialsRes.ok ? await testimonialsRes.json() : [];
        setCounts({
          listings: Array.isArray(listings) ? listings.length : 0,
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        });
      } catch {
        // Ignore
      }
    };
    load();
  }, []);

  const metrics = [
    { title: 'Listings', value: counts.listings, icon: Building2, href: '/account/listings' },
    { title: 'Blog Posts', value: counts.blogs, icon: FileText, href: '/account/blogs' },
    { title: 'Testimonials', value: counts.testimonials, icon: MessageSquareQuote, href: '/account/testimonials' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title={`Welcome back, ${user?.name?.split(' ')[0] || 'Admin'}!`}
          description="Manage your Aspen Muraski Real Estate content."
        />
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {metrics.map((m) => (
            <Link key={m.title} href={m.href}>
              <div className="rounded-xl border border-[#EBEBEB] bg-white p-4 transition-colors hover:bg-[#FAFAFA]">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#888C99]">{m.title}</p>
                  <m.icon className="h-4 w-4 text-[#CCCCCC]" />
                </div>
                <p className="mt-2 text-[24px] font-medium leading-tight text-black">{m.value}</p>
                <p className="mt-1 flex items-center gap-1 text-[13px] text-[#888C99]">
                  Manage <ArrowUpRight className="h-3 w-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="mb-3 text-[15px] font-normal text-black">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <Link href="/account/listings">
              <button
                type="button"
                className="flex h-[38px] w-full items-center gap-2.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]"
              >
                <Building2 className="h-3.5 w-3.5 text-[#888C99]" />
                Manage Listings
                <ArrowUpRight className="ml-auto h-3 w-3 flex-shrink-0 text-[#CCCCCC]" />
              </button>
            </Link>
            <Link href="/account/blogs">
              <button
                type="button"
                className="flex h-[38px] w-full items-center gap-2.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]"
              >
                <FileText className="h-3.5 w-3.5 text-[#888C99]" />
                Manage Blogs
                <ArrowUpRight className="ml-auto h-3 w-3 flex-shrink-0 text-[#CCCCCC]" />
              </button>
            </Link>
            <Link href="/account/testimonials">
              <button
                type="button"
                className="flex h-[38px] w-full items-center gap-2.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]"
              >
                <MessageSquareQuote className="h-3.5 w-3.5 text-[#888C99]" />
                Manage Testimonials
                <ArrowUpRight className="ml-auto h-3 w-3 flex-shrink-0 text-[#CCCCCC]" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
