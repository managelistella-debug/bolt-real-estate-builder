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
import { PanelLeftOpen } from 'lucide-react';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useDataLoader();

  // Keep fullscreen only for blog template editor and onboarding.
  const isBlogTemplateEditorMode = featureFlags.enableTemplateEditor && pathname?.includes('/blogs/templates/editor');
  const isOnboardingRoute = pathname === '/ai-builder/onboarding';
  const isAiBuilderRoute = !isOnboardingRoute && (pathname === '/ai-builder' || pathname?.startsWith('/ai-builder/'));

  useEffect(() => {
    // AI builder defaults to collapsed sidebar for focus.
    setIsSidebarOpen(!isAiBuilderRoute);
  }, [isAiBuilderRoute, pathname]);

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

  // Full-screen layout for editor-focused routes and onboarding
  if (isBlogTemplateEditorMode || isOnboardingRoute) {
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
      {isSidebarOpen && (
        <Sidebar
          onCollapse={isAiBuilderRoute ? () => setIsSidebarOpen(false) : undefined}
          showCollapseButton={isAiBuilderRoute}
        />
      )}
      <main className="flex-1 overflow-auto">
        <ImpersonationBanner />
        {isAiBuilderRoute && !isSidebarOpen && (
          <div className="fixed left-4 top-4 z-40">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] shadow-sm hover:bg-[#F5F5F3] hover:text-black"
            >
              <PanelLeftOpen className="h-3.5 w-3.5" />
              Open menu
            </button>
          </div>
        )}
        {children}
      </main>
      <Toaster />
    </div>
  );
}
