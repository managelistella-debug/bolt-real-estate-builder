'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Legacy route: redirect to dashboard in headless mode.
export default function SitesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
