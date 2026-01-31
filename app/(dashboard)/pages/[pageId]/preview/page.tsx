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
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/pages/${pageId}/builder`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="font-semibold text-sm">{currentPage.name}</h1>
              <p className="text-xs text-muted-foreground">Preview Mode</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {currentPage.status === 'published' ? '🟢 Published' : '🟡 Draft'}
          </div>
        </div>
      </div>

      {/* Preview Content - Full Width, No Padding */}
      <div className="w-full bg-white">
        <LivePreview page={currentPage} website={website} />
      </div>
    </div>
  );
}
