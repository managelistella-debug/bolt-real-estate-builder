'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Users, Plus, Building2, FileText, PlugZap, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { useWebsiteStore } from '@/lib/stores/website';
import { useLeadsStore } from '@/lib/stores/leads';
import { useListingsStore } from '@/lib/stores/listings';
import { useBlogsStore } from '@/lib/stores/blogs';
import { mockWebsites } from '@/lib/mock-data/websites';
import { mockLeads } from '@/lib/mock-data/leads';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  new: 'bg-[#DAFF07]/20 text-[#5A6600]',
  contacted: 'bg-[#FFF4D6] text-[#8A6200]',
  in_progress: 'bg-[#F0EDFF] text-[#5B3DC5]',
  closed: 'bg-[#E4F9EC] text-[#0D7A3E]',
  lost: 'bg-[#F5F5F3] text-[#888C99]',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { websites } = useWebsiteStore();
  const { leads } = useLeadsStore();
  const { getListingsForCurrentUser } = useListingsStore();
  const { getBlogsForCurrentUser } = useBlogsStore();

  useEffect(() => {
    if (websites.length === 0) useWebsiteStore.setState({ websites: mockWebsites });
    if (leads.length === 0) useLeadsStore.setState({ leads: mockLeads });
  }, [leads.length, websites.length]);

  const scopedWebsites = websites.filter((w) => (user?.id ? w.userId === user.id : true));
  const scopedWebsiteIds = new Set(scopedWebsites.map((w) => w.id));
  const scopedLeads = leads.filter((l) => scopedWebsiteIds.has(l.websiteId));
  const newLeads = scopedLeads.filter((l) => l.status === 'new').length;
  const listingCount = user ? getListingsForCurrentUser(user.id).length : getListingsForCurrentUser().length;
  const blogCount = user ? getBlogsForCurrentUser(user.id).length : getBlogsForCurrentUser().length;

  const metrics = [
    { title: 'Listings', value: listingCount, detail: 'published + draft', icon: Building2 },
    { title: 'Blog Posts', value: blogCount, detail: 'across all statuses', icon: FileText },
    { title: 'New Leads', value: newLeads, detail: `${scopedLeads.length} total`, icon: Users },
    { title: 'Active Sites', value: scopedWebsites.filter((w) => w.published).length, detail: `${scopedWebsites.length} configured`, icon: PlugZap },
  ];

  const quickLinks = [
    { label: 'Manage Listings', href: '/listings', icon: Building2 },
    { label: 'Manage Blogs', href: '/blogs', icon: FileText },
    { label: 'CRM', href: '/leads', icon: Users },
    { label: 'Integrations', href: '/integrations', icon: PlugZap },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
          description="Manage your website content, domains, and integrations from one place."
          action={
            <Link href="/listings">
              <Button className="h-[30px] rounded-lg bg-[#DAFF07] px-4 text-[13px] font-normal text-black hover:bg-[#C8ED00]">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Listing
              </Button>
            </Link>
          }
        />
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        {/* Metric tiles */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.title} className="rounded-xl border border-[#EBEBEB] bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#888C99]">{m.title}</p>
                <m.icon className="h-4 w-4 text-[#CCCCCC]" />
              </div>
              <p className="mt-2 text-[24px] font-medium leading-tight text-black">{m.value}</p>
              <p className="mt-0.5 text-[13px] text-[#888C99]">{m.detail}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="mb-3 text-[15px] font-normal text-black">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button
                  type="button"
                  className="flex h-[38px] w-full items-center gap-2.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]"
                >
                  <link.icon className="h-3.5 w-3.5 text-[#888C99]" />
                  <span className="truncate">{link.label}</span>
                  <ArrowUpRight className="ml-auto h-3 w-3 flex-shrink-0 text-[#CCCCCC]" />
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent leads */}
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-normal text-black">Recent Leads</h2>
            <Link href="/leads" className="flex items-center gap-1 text-[13px] text-[#888C99] hover:text-black">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {scopedLeads.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-[#888C99]">
              No leads yet. They will appear here when someone submits a form on your website.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#EBEBEB]">
                    <th className="pb-2.5 font-normal text-[#888C99]">Name</th>
                    <th className="hidden pb-2.5 font-normal text-[#888C99] sm:table-cell">Email</th>
                    <th className="pb-2.5 font-normal text-[#888C99]">Status</th>
                    <th className="hidden pb-2.5 font-normal text-[#888C99] md:table-cell">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {scopedLeads.slice(0, 6).map((lead) => (
                    <tr key={lead.id} className="border-b border-[#EBEBEB] last:border-0">
                      <td className="py-3 text-black">{lead.firstName} {lead.lastName}</td>
                      <td className="hidden py-3 text-[#888C99] sm:table-cell">{lead.email}</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[12px] font-normal ${statusColors[lead.status] || statusColors.lost}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="hidden py-3 text-[#888C99] md:table-cell">{lead.sourcePage || '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
