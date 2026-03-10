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

async function syncConfigToDb(config: EmbedConfig): Promise<void> {
  const res = await fetch('/api/data/embed-configs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toDbRow(config)),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Save failed (${res.status})`);
  }
}

async function deleteConfigFromDb(id: string): Promise<void> {
  const res = await fetch(`/api/data/embed-configs?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Delete failed (${res.status})`);
  }
}

const toDate = (value: Date | string | number | undefined) =>
  new Date(value ?? Date.now());

export const DEFAULT_LISTING_FEED_CONFIG: ListingFeedConfig = {
  columns: 3,
  maxListings: 'unlimited',
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

  cardLayout: 'classic',
  statusBadgePosition: 'left',
  showRepresentation: false,
  imageHeight: { value: 75, unit: 'vh' },
  gap: 16,
  cardRadius: 12,
  imageRadius: 0,
  detailsBoxRadius: 0,
  detailsBoxBg: '#ffffff',
  detailsBoxBorder: '#EBEBEB',
  dropShadow: false,
  showListingCount: true,
  statusBadge: { bg: '#DAFF07', color: '#000', borderColor: '', fontFamily: '', fontSize: 11, radius: 999 },
  typography: {
    address: { fontFamily: '', fontSize: 15, color: '#000000' },
    city: { fontFamily: '', fontSize: 13, color: '#555555' },
    price: { fontFamily: '', fontSize: 17, color: '#000000' },
    specs: { fontFamily: '', fontSize: 12, color: '#888C99' },
  },
  carousel: {
    totalListings: 10,
    visibleCount: 3,
    arrowPosition: 'beside',
    arrowSize: 36,
    arrowColor: '#000000',
    customLeftArrowSvg: '',
    customRightArrowSvg: '',
    autoplay: false,
    autoplayInterval: 5,
  },
  paginationButton: {
    bg: '#ffffff',
    color: '#888C99',
    borderColor: '#EBEBEB',
    borderWidth: 1,
    radius: 8,
    fontFamily: '',
    fontSize: 13,
    paddingX: 12,
    paddingY: 8,
    hoverBg: '#F5F5F3',
    hoverColor: '#000000',
  },
  loadMoreButton: {
    bg: '#ffffff',
    color: '#000000',
    borderColor: '#EBEBEB',
    borderWidth: 1,
    radius: 8,
    fontFamily: '',
    fontSize: 13,
    paddingX: 24,
    paddingY: 10,
    hoverBg: '#F5F5F3',
    hoverColor: '#000000',
  },
  responsive: { tablet: {}, mobile: {} },
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
  updateConfig: (id: string, updates: Partial<Pick<EmbedConfig, 'name' | 'config'>>) => Promise<void>;
  deleteConfig: (id: string) => Promise<void>;
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

      updateConfig: async (id, updates) => {
        let toSync: EmbedConfig | undefined;
        set((state) => ({
          configs: state.configs.map((c) => {
            if (c.id !== id) return c;
            const updated: EmbedConfig = {
              ...c,
              ...(updates.name !== undefined ? { name: updates.name } : {}),
              ...(updates.config !== undefined ? { config: updates.config } : {}),
              updatedAt: new Date(),
            };
            toSync = updated;
            return updated;
          }),
        }));
        if (toSync) await syncConfigToDb(toSync);
      },

      deleteConfig: async (id) => {
        set((state) => ({ configs: state.configs.filter((c) => c.id !== id) }));
        await deleteConfigFromDb(id);
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
