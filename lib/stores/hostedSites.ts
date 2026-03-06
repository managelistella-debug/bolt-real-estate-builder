import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { HostedSite } from '@/lib/types';
import { getDefaultHostedSites } from '@/lib/hosted-sites/seed';

interface HostedSitesState {
  sites: HostedSite[];
  _seeded: boolean;
  ensureSeeded: () => void;
  getSiteBySlug: (slug: string) => HostedSite | undefined;
  getSiteById: (id: string) => HostedSite | undefined;
  addSite: (site: HostedSite) => void;
  updateSite: (id: string, updates: Partial<HostedSite>) => void;
  removeSite: (id: string) => void;
  assignUser: (siteId: string, userId: string) => void;
  unassignUser: (siteId: string, userId: string) => void;
  getSitesForUser: (userId: string) => HostedSite[];
}

export const useHostedSitesStore = create<HostedSitesState>()(
  persist(
    (set, get) => ({
      sites: [],
      _seeded: false,

      ensureSeeded: () => {
        if (get()._seeded) return;
        const defaults = getDefaultHostedSites();
        const existing = get().sites;
        const newSites = defaults.filter((d) => !existing.some((e) => e.id === d.id));
        if (newSites.length > 0) {
          set((state) => ({ sites: [...state.sites, ...newSites], _seeded: true }));
        } else {
          set({ _seeded: true });
        }
      },

      getSiteBySlug: (slug) => get().sites.find((s) => s.siteSlug === slug),
      getSiteById: (id) => get().sites.find((s) => s.id === id),

      addSite: (site) => {
        set((state) => ({ sites: [...state.sites.filter((s) => s.id !== site.id), site] }));
      },

      updateSite: (id, updates) => {
        set((state) => ({
          sites: state.sites.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s)),
        }));
      },

      removeSite: (id) => {
        set((state) => ({ sites: state.sites.filter((s) => s.id !== id) }));
      },

      assignUser: (siteId, userId) => {
        set((state) => ({
          sites: state.sites.map((s) =>
            s.id === siteId && !s.assignedUserIds.includes(userId)
              ? { ...s, assignedUserIds: [...s.assignedUserIds, userId], updatedAt: new Date() }
              : s,
          ),
        }));
      },

      unassignUser: (siteId, userId) => {
        set((state) => ({
          sites: state.sites.map((s) =>
            s.id === siteId
              ? { ...s, assignedUserIds: s.assignedUserIds.filter((id) => id !== userId), updatedAt: new Date() }
              : s,
          ),
        }));
      },

      getSitesForUser: (userId) => get().sites.filter((s) => s.assignedUserIds.includes(userId)),
    }),
    {
      name: 'hosted-sites-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ sites: state.sites, _seeded: state._seeded }),
    },
  ),
);
