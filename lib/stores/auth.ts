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

// Mock users for prototype
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@superadmin.com',
    password: 'admin123',
    name: 'Super Admin',
    role: 'super_admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'support@company.com',
    password: 'support123',
    name: 'Support Staff',
    role: 'internal_admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    email: 'john@plumbing.com',
    password: 'john123',
    name: 'John Plumber',
    role: 'business_user',
    businessId: 'business-1',
    createdAt: new Date('2024-01-15'),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: MOCK_USERS.map(({ password: _password, ...user }) => user),
      user: null,
      actorUser: null,
      isImpersonating: false,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // TODO: Replace with API call to /api/auth/login
        // TODO: Add rate limiting
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const matchedMock = MOCK_USERS.find(
          u => u.email === email && u.password === password
        );
        const user = matchedMock || get().users.find((candidate) => candidate.email === email);
        
        if (user) {
          const userWithoutPassword = 'password' in user ? (({ password: _, ...rest }) => rest)(user) : user;
          set({
            user: userWithoutPassword,
            actorUser: userWithoutPassword,
            isAuthenticated: true,
            isImpersonating: false,
          });
          useTenantContextStore.getState().setActor({
            id: userWithoutPassword.id,
            role: userWithoutPassword.role,
          });
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({ user: null, actorUser: null, isAuthenticated: false, isImpersonating: false });
        useTenantContextStore.setState({
          actorUserId: '',
          effectiveUserId: '',
          isImpersonating: false,
          actorRole: undefined,
        });
      },
      
      register: async (email: string, password: string, name: string, role: User['role']) => {
        // TODO: Replace with API call to /api/auth/register
        // TODO: Add rate limiting
        // TODO: Validate input on server side
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if user already exists
        const exists = MOCK_USERS.some(u => u.email === email);
        if (exists) {
          return false;
        }
        
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          role,
          createdAt: new Date(),
          businessId: role === 'business_user' ? `business-${Date.now()}` : undefined,
        };
        
        set((state) => ({
          users: [...state.users, newUser],
          user: newUser,
          actorUser: newUser,
          isAuthenticated: true,
          isImpersonating: false,
        }));
        useTenantContextStore.getState().setActor({ id: newUser.id, role: newUser.role });
        return true;
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
      version: 2,
      partialize: (state) => ({
        users: state.users,
        user: state.user,
        actorUser: state.actorUser,
        isImpersonating: state.isImpersonating,
        isAuthenticated: state.isAuthenticated,
      }),
      migrate: (persistedState: any) => {
        const state = persistedState as Partial<AuthState> | undefined;
        const users = Array.isArray(state?.users) && state?.users.length
          ? state.users
          : MOCK_USERS.map(({ password: _password, ...user }) => user);
        return {
          users,
          user: state?.user || null,
          actorUser: state?.actorUser || state?.user || null,
          isImpersonating: !!state?.isImpersonating,
          isAuthenticated: !!state?.isAuthenticated,
        };
      },
    }
  )
);
