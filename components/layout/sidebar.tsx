'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Globe, 
  Users, 
  Images,
  FolderKanban,
  MenuSquare,
  PanelsTopLeft,
  Building2,
  LayoutTemplate,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pages', href: '/pages', icon: Globe },
  { name: 'Header & Footer', href: '/header-footer', icon: PanelsTopLeft },
  { name: 'Navigation', href: '/navigation', icon: MenuSquare },
  { name: 'Collections', href: '/collections', icon: Images },
  { name: 'Listings', href: '/listings', icon: Building2 },
  { name: 'Listings Templates', href: '/listings/templates', icon: LayoutTemplate },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Templates', href: '/templates', icon: FolderKanban, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

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
        <h1 className="text-xl font-bold text-primary">BuilderCRM</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
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
