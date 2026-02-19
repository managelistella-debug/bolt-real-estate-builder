import { NextRequest } from 'next/server';

export interface SessionTenantContext {
  actorUserId: string;
  effectiveUserId: string;
  actorRole: 'super_admin' | 'internal_admin' | 'business_user';
  isImpersonating: boolean;
}

export function readSessionTenantContext(request: NextRequest): SessionTenantContext | null {
  const actorUserId = request.headers.get('x-actor-user-id') || '';
  const effectiveUserId = request.headers.get('x-effective-user-id') || '';
  const actorRole = request.headers.get('x-actor-role') as SessionTenantContext['actorRole'] | null;
  const isImpersonating = request.headers.get('x-impersonating') === 'true';

  if (!actorUserId || !effectiveUserId || !actorRole) {
    return null;
  }
  return {
    actorUserId,
    effectiveUserId,
    actorRole,
    isImpersonating,
  };
}

export function assertTenantAccess(context: SessionTenantContext, tenantId: string) {
  if (context.actorRole === 'super_admin' || context.actorRole === 'internal_admin') {
    return true;
  }
  return context.effectiveUserId === tenantId;
}
