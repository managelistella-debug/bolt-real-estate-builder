import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';
import { useTenantContextStore } from './tenantContext';
import { useAuditLogStore } from './auditLog';

interface AuthState {
  users: User[];
  user: User | null;
  actorUser: User | null;
  isImpersonating: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: User['role']) => Promise<boolean>;
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  startImpersonation: (targetUserId: string, reason?: string) => boolean;
  stopImpersonation: () => void;
  canManageTenants: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      user: null,
      actorUser: null,
      isImpersonating: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const normalizedEmail = email.trim().toLowerCase();
          const normalizedPassword = password.trim();
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
          });
          if (!loginRes.ok) return false;
          const loginData = await loginRes.json();
          const userId = loginData.user?.id;
          if (!userId) return false;

          const profileRes = await fetch(`/api/auth/profile?userId=${encodeURIComponent(userId)}`);
          const profile = profileRes.ok ? await profileRes.json() : null;

          const user: User = {
            id: userId,
            email: loginData.user.email || normalizedEmail,
            name: profile?.name || normalizedEmail.split('@')[0],
            role: profile?.role || 'business_user',
            createdAt: new Date(profile?.created_at || Date.now()),
            businessId: profile?.business_id ?? undefined,
            lastLoginAt: new Date(),
            permissions: profile?.permissions ?? undefined,
          };

          set({
            user,
            actorUser: user,
            isAuthenticated: true,
            isImpersonating: false,
            users: mergeUser(get().users, user),
          });

          useTenantContextStore.getState().setActor({ id: user.id, role: user.role });

          fetch('/api/data/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, last_login_at: new Date().toISOString() }),
          }).catch(() => undefined);

          if (user.role === 'super_admin' || user.role === 'internal_admin') {
            useAuditLogStore.getState().addEvent({
              type: 'admin_login',
              actorUserId: user.id,
            });
          }

          return true;
        } catch {
          return false;
        }
      },

      logout: () => {
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
        set({ user: null, actorUser: null, isAuthenticated: false, isImpersonating: false });
        useTenantContextStore.setState({
          actorUserId: '',
          effectiveUserId: '',
          isImpersonating: false,
          actorRole: undefined,
        });
      },

      register: async (email: string, password: string, name: string, role: User['role']) => {
        try {
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, role }),
          });

          if (!res.ok) return false;
          const { userId } = await res.json();

          const user: User = {
            id: userId,
            email,
            name,
            role,
            createdAt: new Date(),
            businessId: role === 'business_user' ? `business-${Date.now()}` : undefined,
          };

          set({
            user,
            actorUser: user,
            isAuthenticated: true,
            isImpersonating: false,
            users: mergeUser(get().users, user),
          });

          useTenantContextStore.getState().setActor({ id: user.id, role: user.role });
          return true;
        } catch {
          return false;
        }
      },

      getAllUsers: () => get().users,
      getUserById: (id) => get().users.find((entry) => entry.id === id),

      startImpersonation: (targetUserId, reason) => {
        const state = get();
        const actor = state.actorUser || state.user;
        if (!actor) return false;
        if (actor.role !== 'super_admin' && actor.role !== 'internal_admin') return false;
        const targetUser = state.users.find((entry) => entry.id === targetUserId);
        if (!targetUser) return false;
        set({
          actorUser: actor,
          user: targetUser,
          isImpersonating: true,
          isAuthenticated: true,
        });
        useTenantContextStore.getState().setActor({ id: actor.id, role: actor.role });
        useTenantContextStore.getState().startImpersonation(targetUser.id);
        useAuditLogStore.getState().addEvent({
          type: 'impersonation_started',
          actorUserId: actor.id,
          effectiveUserId: targetUser.id,
          targetUserId: targetUser.id,
          metadata: reason ? { reason } : undefined,
        });
        return true;
      },

      stopImpersonation: () => {
        const state = get();
        if (!state.isImpersonating || !state.actorUser) return;
        const actor = state.actorUser;
        const previousEffective = state.user?.id;
        set({
          user: actor,
          actorUser: actor,
          isImpersonating: false,
          isAuthenticated: true,
        });
        useTenantContextStore.getState().setActor({ id: actor.id, role: actor.role });
        useTenantContextStore.getState().stopImpersonation();
        useAuditLogStore.getState().addEvent({
          type: 'impersonation_stopped',
          actorUserId: actor.id,
          effectiveUserId: previousEffective,
          targetUserId: previousEffective,
        });
      },

      canManageTenants: () => {
        const role = (get().actorUser || get().user)?.role;
        return role === 'super_admin' || role === 'internal_admin';
      },
    }),
    {
      name: 'auth-storage',
      version: 3,
      partialize: (state) => ({
        users: state.users,
        user: state.user,
        actorUser: state.actorUser,
        isImpersonating: state.isImpersonating,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

function mergeUser(users: User[], user: User): User[] {
  const exists = users.find((u) => u.id === user.id);
  if (exists) return users.map((u) => (u.id === user.id ? user : u));
  return [...users, user];
}
