'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/lib/stores/auth';
import { useWebsiteStore } from '@/lib/stores/website';
import { useTenantContextStore } from '@/lib/stores/tenantContext';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';
import { featureFlags } from '@/lib/featureFlags';
import { useDataLoader } from '@/lib/hooks/useDataLoader';
import { BrandLoader } from '@/components/ui/BrandLoader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, actorUser, isImpersonating } = useAuthStore();
  const { initializeUserWebsite } = useWebsiteStore();
  const { setActor, startImpersonation } = useTenantContextStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useDataLoader();

  // Check if we're in builder or preview mode (hide sidebar)
  const isBuilderMode = featureFlags.enableVisualBuilder && pathname?.includes('/builder');
  const isPreviewMode = featureFlags.enableVisualBuilder && pathname?.includes('/preview');
  const isHeaderEditorMode = false;
  const isBlogTemplateEditorMode = featureFlags.enableTemplateEditor && pathname?.includes('/blogs/templates/editor');

  // Wait for Zustand to rehydrate from localStorage
  useEffect(() => {
    // Avoid flashing a loader on fast transitions.
    const showLoaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 220);

    // Small delay to ensure localStorage has loaded
    const hydrateTimer = setTimeout(() => {
      setIsHydrated(true);
    }, 350);
    return () => {
      clearTimeout(showLoaderTimer);
      clearTimeout(hydrateTimer);
    };
  }, []);

  useEffect(() => {
    // Only check auth after hydration to avoid false redirects
    if (isHydrated) {
    if (!isAuthenticated) {
      router.push('/login');
      } else if (user) {
        const actor = actorUser || user;
        setActor({ id: actor.id, role: actor.role });
        if (isImpersonating) {
          startImpersonation(user.id);
        }
        // Initialize user's website if not already done
        initializeUserWebsite(user.id);
      }
    }
  }, [isHydrated, isAuthenticated, user, actorUser, isImpersonating, router, initializeUserWebsite, setActor, startImpersonation]);

  // Show loading while hydrating to prevent flash and false redirects
  if (!isHydrated) {
    if (!showLoader) {
      return <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F3' }} />;
    }

    return (
      <div
        className="fixed inset-0 z-50"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5F5F3',
        }}
      >
        <BrandLoader size={140} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Full-screen layout for editor-focused routes
  if (isBuilderMode || isPreviewMode || isHeaderEditorMode || isBlogTemplateEditorMode) {
    return (
      <>
        <ImpersonationBanner />
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
        <ImpersonationBanner />
        {children}
      </main>
      <Toaster />
    </div>
  );
}
