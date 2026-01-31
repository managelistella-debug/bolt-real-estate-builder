'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/lib/stores/auth';
import { useWebsiteStore } from '@/lib/stores/website';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { initializeUserWebsite } = useWebsiteStore();

  // Check if we're in builder mode (hide sidebar)
  const isBuilderMode = pathname?.includes('/builder');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user) {
      // Initialize user's website if not already done
      initializeUserWebsite(user.id);
    }
  }, [isAuthenticated, user, router, initializeUserWebsite]);

  if (!isAuthenticated) {
    return null;
  }

  // Full-screen layout for builder mode
  if (isBuilderMode) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  // Normal dashboard layout with sidebar
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
