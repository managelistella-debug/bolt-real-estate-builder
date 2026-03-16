'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  FileText,
  MessageSquareQuote,
  LogOut,
  PanelLeftClose,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';

const navigation = [
  { name: 'Dashboard', href: '/account/dashboard', icon: LayoutDashboard },
  { name: 'Listings', href: '/account/listings', icon: Building2 },
  { name: 'Blogs', href: '/account/blogs', icon: FileText },
  { name: 'Testimonials', href: '/account/testimonials', icon: MessageSquareQuote },
];

interface SidebarProps {
  onCollapse?: () => void;
  showCollapseButton?: boolean;
}

export function Sidebar({ onCollapse, showCollapseButton = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div
      className="flex h-full w-64 flex-col border-r border-[#EBEBEB] bg-white"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-[#EBEBEB] px-5">
        <h1 className="text-[15px] font-medium text-black tracking-tight">Aspen CMS</h1>
        {showCollapseButton && (
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Collapse sidebar"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#EBEBEB] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-3">
        {navigation.map((item) => {
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
