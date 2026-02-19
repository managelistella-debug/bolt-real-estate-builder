'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth';

export function ImpersonationBanner() {
  const { isImpersonating, actorUser, user, stopImpersonation } = useAuthStore();

  if (!isImpersonating || !actorUser || !user) {
    return null;
  }

  return (
    <div className="border-b bg-amber-50 px-4 py-2 text-sm text-amber-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p>
          You are impersonating <span className="font-semibold">{user.name}</span> ({user.email}) as{' '}
          <span className="font-semibold">{actorUser.name}</span>.
        </p>
        <Button size="sm" variant="outline" onClick={stopImpersonation}>
          Exit impersonation
        </Button>
      </div>
    </div>
  );
}
