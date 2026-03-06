import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TenantSiteSettings } from '@/lib/types';

interface TenantSettingsState {
  settings: Record<string, TenantSiteSettings>;
  _syncedToDb: boolean;
  getSettings: (userId: string) => TenantSiteSettings;
  setAiBuilderDisabled: (userId: string, disabled: boolean) => void;
  setAssignedHostedSiteSlug: (userId: string, slug: string | undefined) => void;
  assignSiteToUser: (userId: string, siteSlug: string) => void;
  unassignSiteFromUser: (userId: string) => void;
  syncFromDb: () => Promise<void>;
}

const DEFAULT_SETTINGS: TenantSiteSettings = {
  aiBuilderDisabled: false,
  assignedHostedSiteSlug: undefined,
};

async function persistSettingsToDb(userId: string, s: TenantSiteSettings) {
  try {
    await fetch('/api/data/tenant-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        aiBuilderDisabled: s.aiBuilderDisabled,
        assignedHostedSiteSlug: s.assignedHostedSiteSlug || null,
      }),
    });
  } catch {
    // best-effort
  }
}

export const useTenantSettingsStore = create<TenantSettingsState>()(
  persist(
    (set, get) => ({
      settings: {},
      _syncedToDb: false,

      getSettings: (userId) => get().settings[userId] || DEFAULT_SETTINGS,

      setAiBuilderDisabled: (userId, disabled) => {
        const updated = { ...(get().settings[userId] || DEFAULT_SETTINGS), aiBuilderDisabled: disabled };
        set((state) => ({
          settings: { ...state.settings, [userId]: updated },
        }));
        persistSettingsToDb(userId, updated);
      },

      setAssignedHostedSiteSlug: (userId, slug) => {
        const updated = { ...(get().settings[userId] || DEFAULT_SETTINGS), assignedHostedSiteSlug: slug };
        set((state) => ({
          settings: { ...state.settings, [userId]: updated },
        }));
        persistSettingsToDb(userId, updated);
      },

      assignSiteToUser: (userId, siteSlug) => {
        const updated: TenantSiteSettings = { aiBuilderDisabled: true, assignedHostedSiteSlug: siteSlug };
        set((state) => ({
          settings: { ...state.settings, [userId]: updated },
        }));
        persistSettingsToDb(userId, updated);
      },

      unassignSiteFromUser: (userId) => {
        const updated: TenantSiteSettings = { aiBuilderDisabled: false, assignedHostedSiteSlug: undefined };
        set((state) => ({
          settings: { ...state.settings, [userId]: updated },
        }));
        persistSettingsToDb(userId, updated);
      },

      syncFromDb: async () => {
        try {
          const res = await fetch('/api/data/tenant-settings');
          if (!res.ok) return;
          const rows = await res.json();
          if (Array.isArray(rows) && rows.length > 0) {
            const mapped: Record<string, TenantSiteSettings> = {};
            for (const row of rows) {
              mapped[row.user_id] = {
                aiBuilderDisabled: row.ai_builder_disabled ?? false,
                assignedHostedSiteSlug: row.assigned_hosted_site_slug || undefined,
              };
            }
            set({ settings: mapped, _syncedToDb: true });
          } else {
            const local = get().settings;
            const entries = Object.entries(local);
            if (entries.length > 0) {
              await Promise.all(entries.map(([uid, s]) => persistSettingsToDb(uid, s)));
            }
            set({ _syncedToDb: true });
          }
        } catch {
          // offline — keep localStorage data
        }
      },
    }),
    {
      name: 'tenant-settings-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);
