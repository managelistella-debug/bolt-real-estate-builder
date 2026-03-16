'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/lib/stores/auth';
import { useTenantContextStore } from '@/lib/stores/tenantContext';
import { BrandLoader } from '@/components/ui/BrandLoader';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [sessionCheckDone, setSessionCheckDone] = useState(false);

  useEffect(() => {
    const showLoaderTimer = setTimeout(() => setShowLoader(true), 220);
    const hydrateTimer = setTimeout(() => setIsHydrated(true), 350);
    return () => {
      clearTimeout(showLoaderTimer);
      clearTimeout(hydrateTimer);
    };
  }, []);

  // Hydrate auth store from server session cookie on refresh/direct load.
  useEffect(() => {
    if (!isHydrated || sessionCheckDone) return;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((me) => {
        if (!me) return;
        const u = {
          id: me.id,
          email: me.email,
          name: me.email?.split('@')[0] ?? 'User',
          role: (me.role as 'super_admin' | 'internal_admin' | 'business_user') ?? 'business_user',
          createdAt: new Date(),
          businessId: 'aspen',
          lastLoginAt: new Date(),
          permissions: undefined,
        };
        useAuthStore.setState({
          user: u,
          actorUser: u,
          isAuthenticated: true,
          isImpersonating: false,
        });
        useTenantContextStore.getState().setActor({ id: u.id, role: u.role });
      })
      .finally(() => setSessionCheckDone(true));
  }, [isHydrated, sessionCheckDone]);

  useEffect(() => {
    if (isHydrated && sessionCheckDone && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, sessionCheckDone, router]);

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
