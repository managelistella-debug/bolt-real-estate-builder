'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// This page redirects to the new builder route structure
export default function LegacyBuilderPage({ params }: { params: { siteId: string } }) {
  const { siteId: _siteId } = params;
  const searchParams = useSearchParams();
  const pageId = searchParams?.get('pageId');
  const router = useRouter();

  useEffect(() => {
    if (pageId) {
      // Redirect to new builder route
      router.replace(`/pages/${pageId}/builder`);
    } else {
      // No pageId, redirect to dashboard in headless mode
      router.replace('/dashboard');
    }
  }, [pageId, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
