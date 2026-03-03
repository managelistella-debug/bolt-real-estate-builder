'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban,
  Building2,
  FileText,
  Settings,
  Plus,
  LogOut,
  Shield,
  PlugZap,
  MessageSquareQuote,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Listings', href: '/listings', icon: Building2 },
  { name: 'Blogs', href: '/blogs', icon: FileText },
  { name: 'Testimonials', href: '/testimonials', icon: MessageSquareQuote },
  { name: 'CRM', href: '/leads', icon: Users },
  { name: 'Integrations', href: '/integrations', icon: PlugZap },
  { name: 'Domains & Settings', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'Admin Home', href: '/admin', icon: Shield },
  { name: 'Admin Users', href: '/admin/users', icon: Users },
  { name: 'Admin Templates', href: '/admin/templates', icon: FolderKanban },
  { name: 'Admin Audit', href: '/admin/audit', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, canManageTenants } = useAuthStore();
  const [blogsMenuOpen, setBlogsMenuOpen] = useState(pathname?.startsWith('/blogs'));

  const filteredNavigation = navigation.filter(item => {
    if ((item as Record<string, unknown>).adminOnly && user?.role !== 'super_admin') {
      return false;
    }
    return true;
  });

  return (
    <div
      className="flex h-full w-64 flex-col border-r border-[#EBEBEB] bg-white"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-[#EBEBEB] px-5">
        <h1 className="text-[15px] font-medium text-black tracking-tight">HeadlessCMS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-3">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          if (item.name === 'Blogs') {
            const isArticlesActive = pathname === '/blogs';
            const isTemplatesActive = pathname?.startsWith('/blogs/templates');
            return (
              <div key={item.name} className="space-y-0.5">
                <div
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors',
                    isActive
                      ? 'bg-[#DAFF07] text-black'
                      : 'text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                  )}
                >
                  <Link href="/blogs" className="flex min-w-0 flex-1 items-center gap-2.5">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    aria-label="Toggle blog submenu"
                    onClick={() => setBlogsMenuOpen((prev) => !prev)}
                    className="rounded p-0.5 hover:bg-black/5"
                  >
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', blogsMenuOpen && 'rotate-180')} />
                  </button>
                </div>
                {blogsMenuOpen && (
                  <div className="ml-7 space-y-0.5 border-l border-[#EBEBEB] pl-3">
                    <Link
                      href="/blogs"
                      className={cn(
                        'block rounded-lg px-3 py-1.5 text-[13px] transition-colors',
                        isArticlesActive
                          ? 'bg-[#DAFF07]/30 text-black'
                          : 'text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                      )}
                    >
                      Articles
                    </Link>
                    <Link
                      href="/blogs/templates"
                      className={cn(
                        'block rounded-lg px-3 py-1.5 text-[13px] transition-colors',
                        isTemplatesActive
                          ? 'bg-[#DAFF07]/30 text-black'
                          : 'text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                      )}
                    >
                      Templates
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors',
                isActive
                  ? 'bg-[#DAFF07] text-black'
                  : 'text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}

        {canManageTenants() && (
          <div className="pt-3">
            <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-widest text-[#CCCCCC]">
              Admin
            </p>
            <div className="space-y-0.5">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors',
                      isActive
                        ? 'bg-[#DAFF07] text-black'
                        : 'text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-[#EBEBEB] p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F3]">
            <span className="text-[13px] font-medium text-black">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-black">{user?.name}</p>
            <p className="truncate text-[11px] text-[#888C99]">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex h-[30px] w-full items-center justify-center gap-2 rounded-lg border border-[#EBEBEB] bg-white text-[13px] text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
