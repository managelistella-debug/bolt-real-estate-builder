'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/lib/stores/auth';
import { BrandLoader } from '@/components/ui/BrandLoader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Wait for Zustand to rehydrate from localStorage
  useEffect(() => {
    const showLoaderTimer = setTimeout(() => setShowLoader(true), 220);
    const hydrateTimer = setTimeout(() => setIsHydrated(true), 350);
    return () => {
      clearTimeout(showLoaderTimer);
      clearTimeout(hydrateTimer);
    };
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    if (!showLoader) {
      return <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F3' }} />;
    }
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: '#F5F5F3' }}
      >
        <BrandLoader size={140} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
