'use client';

import { useEffect } from 'react';
import { useWebsiteStore } from '@/lib/stores/website';
import { useAuthStore } from '@/lib/stores/auth';
import { useBuilderStore } from '@/lib/stores/builder';
import { LivePreview } from '@/components/builder/LivePreview';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PreviewPage({ params }: { params: { pageId: string } }) {
  const { pageId } = params;
  const { user, isAuthenticated } = useAuthStore();
  const { getCurrentUserWebsite, initializeUserWebsite } = useWebsiteStore();
  const { setDeviceView } = useBuilderStore();

  useEffect(() => {
    if (user) {
      initializeUserWebsite(user.id);
      // Set device view to desktop for preview
      setDeviceView('desktop');
    }
  }, [user, initializeUserWebsite, setDeviceView]);

  useEffect(() => {
    const rehydrateStore = () => {
      (useWebsiteStore as any).persist?.rehydrate?.();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        rehydrateStore();
      }
    };

    rehydrateStore();
    window.addEventListener('focus', rehydrateStore);
    window.addEventListener('storage', rehydrateStore);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('focus', rehydrateStore);
      window.removeEventListener('storage', rehydrateStore);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  // Show loading while authentication is being checked
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  const website = getCurrentUserWebsite();
  const currentPage = website?.pages.find(p => p.id === pageId);

  if (!website || !currentPage) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Page not found</h2>
          <p className="text-muted-foreground mb-4">The page you're looking for doesn't exist.</p>
          <Link href="/pages">
            <Button>Back to Pages</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating Preview Controls */}
      <div className="fixed bottom-4 left-4 z-[100]">
        <div className="rounded-md border bg-white/95 backdrop-blur px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <Link href={`/pages/${pageId}/builder`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <span className="text-xs font-medium text-muted-foreground">
              {currentPage.name} Preview
            </span>
          </div>
        </div>
      </div>

      {/* Full-screen Website Preview */}
      <LivePreview
        page={currentPage}
        website={website}
        fullscreen
        allowSectionSelection={false}
      />
    </div>
  );
}
