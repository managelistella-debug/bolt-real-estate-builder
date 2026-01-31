'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page redirects to the new pages route structure
export default function LegacySitePagesPage({ params }: { params: { siteId: string } }) {
  const { siteId } = params;
  const router = useRouter();

  useEffect(() => {
    // Redirect to new pages route
    router.replace('/pages');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
