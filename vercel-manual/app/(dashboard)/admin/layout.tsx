'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, canManageTenants } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!canManageTenants()) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, canManageTenants, router]);

  if (!canManageTenants()) {
    return null;
  }

  return <>{children}</>;
}
