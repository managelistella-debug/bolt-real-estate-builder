import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TenantSiteSettings } from '@/lib/types';

interface TenantSettingsState {
  settings: Record<string, TenantSiteSettings>;
  getSettings: (userId: string) => TenantSiteSettings;
  setAiBuilderDisabled: (userId: string, disabled: boolean) => void;
  setAssignedHostedSiteSlug: (userId: string, slug: string | undefined) => void;
  assignSiteToUser: (userId: string, siteSlug: string) => void;
  unassignSiteFromUser: (userId: string) => void;
}

const DEFAULT_SETTINGS: TenantSiteSettings = {
  aiBuilderDisabled: false,
  assignedHostedSiteSlug: undefined,
};

export const useTenantSettingsStore = create<TenantSettingsState>()(
  persist(
    (set, get) => ({
      settings: {},

      getSettings: (userId) => get().settings[userId] || DEFAULT_SETTINGS,

      setAiBuilderDisabled: (userId, disabled) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [userId]: { ...(state.settings[userId] || DEFAULT_SETTINGS), aiBuilderDisabled: disabled },
          },
        }));
      },

      setAssignedHostedSiteSlug: (userId, slug) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [userId]: { ...(state.settings[userId] || DEFAULT_SETTINGS), assignedHostedSiteSlug: slug },
          },
        }));
      },

      assignSiteToUser: (userId, siteSlug) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [userId]: { aiBuilderDisabled: true, assignedHostedSiteSlug: siteSlug },
          },
        }));
      },

      unassignSiteFromUser: (userId) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [userId]: { aiBuilderDisabled: false, assignedHostedSiteSlug: undefined },
          },
        }));
      },
    }),
    {
      name: 'tenant-settings-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);
