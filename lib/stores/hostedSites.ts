import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { HostedSite } from '@/lib/types';
import { getDefaultHostedSites } from '@/lib/hosted-sites/seed';

interface HostedSitesState {
  sites: HostedSite[];
  _seeded: boolean;
  _syncedToDb: boolean;
  ensureSeeded: () => void;
  syncFromDb: () => Promise<void>;
  getSiteBySlug: (slug: string) => HostedSite | undefined;
  getSiteById: (id: string) => HostedSite | undefined;
  addSite: (site: HostedSite) => void;
  updateSite: (id: string, updates: Partial<HostedSite>) => void;
  removeSite: (id: string) => void;
  assignUser: (siteId: string, userId: string) => void;
  unassignUser: (siteId: string, userId: string) => void;
  getSitesForUser: (userId: string) => HostedSite[];
}

function toDbRow(site: HostedSite) {
  return {
    id: site.id,
    name: site.name,
    description: site.description,
    previewImage: site.previewImage,
    siteSlug: site.siteSlug,
    pages: site.pages,
    cmsConfig: site.cmsConfig,
    assignedUserIds: site.assignedUserIds,
  };
}

function fromDbRow(row: Record<string, unknown>): HostedSite {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) || '',
    previewImage: (row.preview_image as string) || '',
    siteSlug: (row.site_slug as string) || '',
    pages: (row.pages as HostedSite['pages']) || [],
    cmsConfig: (row.cms_config as HostedSite['cmsConfig']) || {},
    assignedUserIds: (row.assigned_user_ids as string[]) || [],
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

async function persistSiteToDb(site: HostedSite) {
  try {
    await fetch('/api/data/hosted-sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toDbRow(site)),
    });
  } catch {
    // DB sync is best-effort; localStorage remains the fallback
  }
}

async function patchSiteInDb(id: string, updates: Partial<HostedSite>) {
  try {
    const payload: Record<string, unknown> = { id };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.previewImage !== undefined) payload.previewImage = updates.previewImage;
    if (updates.pages !== undefined) payload.pages = updates.pages;
    if (updates.cmsConfig !== undefined) payload.cmsConfig = updates.cmsConfig;
    if (updates.assignedUserIds !== undefined) payload.assignedUserIds = updates.assignedUserIds;

    await fetch('/api/data/hosted-sites', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort
  }
}

async function deleteSiteFromDb(id: string) {
  try {
    await fetch(`/api/data/hosted-sites?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch {
    // best-effort
  }
}

export const useHostedSitesStore = create<HostedSitesState>()(
  persist(
    (set, get) => ({
      sites: [],
      _seeded: false,
      _syncedToDb: false,

      ensureSeeded: () => {
        if (get()._seeded) return;
        const defaults = getDefaultHostedSites();
        const existing = get().sites;
        const newSites = defaults.filter((d) => !existing.some((e) => e.id === d.id));
        if (newSites.length > 0) {
          set((state) => ({ sites: [...state.sites, ...newSites], _seeded: true }));
          newSites.forEach((s) => persistSiteToDb(s));
        } else {
          set({ _seeded: true });
        }
      },

      syncFromDb: async () => {
        try {
          const res = await fetch('/api/data/hosted-sites');
          if (!res.ok) return;
          const rows = await res.json();
          if (Array.isArray(rows) && rows.length > 0) {
            const dbSites = rows.map(fromDbRow);
            set({ sites: dbSites, _seeded: true, _syncedToDb: true });
          } else {
            const localSites = get().sites;
            if (localSites.length > 0) {
              await Promise.all(localSites.map(persistSiteToDb));
            }
            set({ _syncedToDb: true });
          }
        } catch {
          // offline / Supabase not configured — keep localStorage data
        }
      },

      getSiteBySlug: (slug) => get().sites.find((s) => s.siteSlug === slug),
      getSiteById: (id) => get().sites.find((s) => s.id === id),

      addSite: (site) => {
        set((state) => ({ sites: [...state.sites.filter((s) => s.id !== site.id), site] }));
        persistSiteToDb(site);
      },

      updateSite: (id, updates) => {
        set((state) => ({
          sites: state.sites.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s)),
        }));
        patchSiteInDb(id, updates);
      },

      removeSite: (id) => {
        set((state) => ({ sites: state.sites.filter((s) => s.id !== id) }));
        deleteSiteFromDb(id);
      },

      assignUser: (siteId, userId) => {
        const site = get().sites.find((s) => s.id === siteId);
        if (!site || site.assignedUserIds.includes(userId)) return;
        const updated = [...site.assignedUserIds, userId];
        set((state) => ({
          sites: state.sites.map((s) =>
            s.id === siteId ? { ...s, assignedUserIds: updated, updatedAt: new Date() } : s,
          ),
        }));
        patchSiteInDb(siteId, { assignedUserIds: updated });
      },

      unassignUser: (siteId, userId) => {
        const site = get().sites.find((s) => s.id === siteId);
        if (!site) return;
        const updated = site.assignedUserIds.filter((id) => id !== userId);
        set((state) => ({
          sites: state.sites.map((s) =>
            s.id === siteId ? { ...s, assignedUserIds: updated, updatedAt: new Date() } : s,
          ),
        }));
        patchSiteInDb(siteId, { assignedUserIds: updated });
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
