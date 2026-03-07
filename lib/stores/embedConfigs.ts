import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  EmbedConfig,
  EmbedConfigType,
  ListingFeedConfig,
  ListingDetailEmbedConfig,
} from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

function toDbRow(c: EmbedConfig) {
  return {
    id: c.id,
    tenant_id: c.tenantId,
    name: c.name,
    type: c.type,
    config: c.config,
  };
}

function syncConfigToDb(config: EmbedConfig) {
  fetch('/api/data/embed-configs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toDbRow(config)),
  }).catch(() => {});
}

function deleteConfigFromDb(id: string) {
  fetch(`/api/data/embed-configs?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }).catch(() => {});
}

const toDate = (value: Date | string | number | undefined) =>
  new Date(value ?? Date.now());

export const DEFAULT_LISTING_FEED_CONFIG: ListingFeedConfig = {
  columns: 3,
  itemsPerPage: 9,
  paginationType: 'pagination',
  filters: {
    statuses: [],
    cities: [],
    neighborhoods: [],
    propertyTypes: [],
  },
  sortBy: 'newest',
  detailPageUrlPattern: '/listings/{slug}',
};

export const DEFAULT_LISTING_DETAIL_CONFIG: ListingDetailEmbedConfig = {
  showGallery: true,
  showMortgageCalculator: true,
  showPropertyDetails: true,
  showContactForm: true,
  agentName: '',
  agentEmail: '',
  agentPhone: '',
  ctaLabel: 'Schedule a Tour',
};

interface EmbedConfigsState {
  configs: EmbedConfig[];
  loaded: boolean;

  createConfig: (
    tenantId: string,
    name: string,
    type: EmbedConfigType,
    config: ListingFeedConfig | ListingDetailEmbedConfig
  ) => EmbedConfig;
  updateConfig: (id: string, updates: Partial<Pick<EmbedConfig, 'name' | 'config'>>) => void;
  deleteConfig: (id: string) => void;
  getConfigsForTenant: (tenantId?: string) => EmbedConfig[];
  getConfigById: (id: string) => EmbedConfig | undefined;
  syncAllToDb: (tenantId: string) => void;
}

export const useEmbedConfigsStore = create<EmbedConfigsState>()(
  persist(
    (set, get) => ({
      configs: [],
      loaded: false,

      createConfig: (tenantId, name, type, config) => {
        const now = new Date();
        const embedConfig: EmbedConfig = {
          id: `embed_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          tenantId,
          name,
          type,
          config,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ configs: [...state.configs, embedConfig] }));
        syncConfigToDb(embedConfig);
        return embedConfig;
      },

      updateConfig: (id, updates) => {
        set((state) => ({
          configs: state.configs.map((c) => {
            if (c.id !== id) return c;
            const updated: EmbedConfig = {
              ...c,
              ...(updates.name !== undefined ? { name: updates.name } : {}),
              ...(updates.config !== undefined ? { config: updates.config } : {}),
              updatedAt: new Date(),
            };
            syncConfigToDb(updated);
            return updated;
          }),
        }));
      },

      deleteConfig: (id) => {
        set((state) => ({ configs: state.configs.filter((c) => c.id !== id) }));
        deleteConfigFromDb(id);
      },

      getConfigsForTenant: (tenantId) => {
        const effectiveId =
          tenantId || useTenantContextStore.getState().effectiveUserId;
        if (!effectiveId) return [];
        return get()
          .configs.filter((c) => c.tenantId === effectiveId)
          .map((c) => ({
            ...c,
            createdAt: toDate(c.createdAt),
            updatedAt: toDate(c.updatedAt),
          }));
      },

      getConfigById: (id) => {
        const c = get().configs.find((cfg) => cfg.id === id);
        if (!c) return undefined;
        return { ...c, createdAt: toDate(c.createdAt), updatedAt: toDate(c.updatedAt) };
      },

      syncAllToDb: (tenantId) => {
        const configs = get().configs.filter((c) => c.tenantId === tenantId);
        configs.forEach((c) => syncConfigToDb(c));
      },
    }),
    {
      name: 'embed-configs-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ configs: state.configs }),
    }
  )
);
