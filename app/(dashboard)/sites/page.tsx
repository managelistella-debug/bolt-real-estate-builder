'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page redirects to the new pages route since we now have one website per user
export default function SitesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pages');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
