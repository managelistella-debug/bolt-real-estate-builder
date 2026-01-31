import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';
import { useWebsiteStore } from './website';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: User['role']) => Promise<boolean>;
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
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // TODO: Replace with API call to /api/auth/login
        // TODO: Add rate limiting
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = MOCK_USERS.find(
          u => u.email === email && u.password === password
        );
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
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
        
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
