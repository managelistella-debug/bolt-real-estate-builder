import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SiteProfile, DEFAULT_SITE_PROFILE } from '@/lib/types/siteProfile';

interface SiteProfileState {
  profiles: Record<string, SiteProfile>;
  getProfileForUser: (userId: string) => SiteProfile | null;
  saveProfile: (userId: string, profile: SiteProfile) => void;
  updateProfile: (userId: string, updates: Partial<SiteProfile>) => void;
  hasCompletedOnboarding: (userId: string) => boolean;
}

export const useSiteProfileStore = create<SiteProfileState>()(
  persist(
    (set, get) => ({
      profiles: {},

      getProfileForUser: (userId) => {
        return get().profiles[userId] || null;
      },

      saveProfile: (userId, profile) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [userId]: { ...profile, completedAt: profile.completedAt || new Date().toISOString() },
          },
        }));
      },

      updateProfile: (userId, updates) => {
        const existing = get().profiles[userId];
        if (!existing) return;
        set((state) => ({
          profiles: {
            ...state.profiles,
            [userId]: { ...existing, ...updates },
          },
        }));
      },

      hasCompletedOnboarding: (userId) => {
        const profile = get().profiles[userId];
        return !!profile?.completedAt;
      },
    }),
    {
      name: 'site-profile-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { DEFAULT_SITE_PROFILE };
