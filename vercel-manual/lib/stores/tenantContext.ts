import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SessionActorContext, User } from '@/lib/types';

interface TenantContextState extends SessionActorContext {
  actorRole?: User['role'];
  setActor: (actor: Pick<User, 'id' | 'role'>) => void;
  startImpersonation: (targetUserId: string) => void;
  stopImpersonation: () => void;
  requireAdminRole: () => boolean;
}

const defaultState: SessionActorContext = {
  actorUserId: '',
  effectiveUserId: '',
  isImpersonating: false,
};

export const useTenantContextStore = create<TenantContextState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      actorRole: undefined,
      setActor: (actor) =>
        set((state) => ({
          actorUserId: actor.id,
          effectiveUserId: state.isImpersonating && state.effectiveUserId ? state.effectiveUserId : actor.id,
          actorRole: actor.role,
        })),
      startImpersonation: (targetUserId) =>
        set((state) => ({
          actorUserId: state.actorUserId || targetUserId,
          effectiveUserId: targetUserId,
          isImpersonating: true,
        })),
      stopImpersonation: () =>
        set((state) => ({
          effectiveUserId: state.actorUserId,
          isImpersonating: false,
        })),
      requireAdminRole: () => {
        const role = get().actorRole;
        return role === 'super_admin' || role === 'internal_admin';
      },
    }),
    {
      name: 'tenant-context-storage',
      version: 1,
      partialize: (state) => ({
        actorUserId: state.actorUserId,
        effectiveUserId: state.effectiveUserId,
        isImpersonating: state.isImpersonating,
        actorRole: state.actorRole,
      }),
    }
  )
);
