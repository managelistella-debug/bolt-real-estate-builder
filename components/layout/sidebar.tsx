'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Images,
  FolderKanban,
  Building2,
  FileText,
  Settings,
  Plus,
  LogOut,
  Shield,
  PlugZap,
  MessageSquareQuote,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Listings', href: '/listings', icon: Building2 },
  { name: 'Blogs', href: '/blogs', icon: FileText },
  { name: 'Testimonials', href: '/testimonials', icon: MessageSquareQuote },
  { name: 'Media Library', href: '/collections', icon: Images },
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
    if (item.adminOnly && user?.role !== 'super_admin') {
      return false;
    }
    return true;
  });

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-primary">HeadlessCMS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          if (item.name === 'Blogs') {
            const isArticlesActive = pathname === '/blogs';
            const isTemplatesActive = pathname?.startsWith('/blogs/templates');
            return (
              <div key={item.name} className="space-y-1">
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Link href="/blogs" className="flex min-w-0 flex-1 items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    aria-label="Toggle blog submenu"
                    onClick={() => setBlogsMenuOpen((prev) => !prev)}
                    className="rounded p-1 hover:bg-black/10"
                  >
                    <Plus className={cn('h-4 w-4 transition-transform', blogsMenuOpen && 'rotate-45')} />
                  </button>
                </div>
                {blogsMenuOpen && (
                  <div className="ml-8 space-y-1">
                    <Link
                      href="/blogs"
                      className={cn(
                        'block rounded-md px-3 py-1.5 text-sm transition-colors',
                        isArticlesActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      Articles
                    </Link>
                    <Link
                      href="/blogs/templates"
                      className={cn(
                        'block rounded-md px-3 py-1.5 text-sm transition-colors',
                        isTemplatesActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
        {canManageTenants() && (
          <div className="pt-2">
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Admin
            </p>
            <div className="space-y-1">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
