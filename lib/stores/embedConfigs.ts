import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  EmbedConfig,
  EmbedConfigType,
  BlogFeedWidget,
  ListingFeedConfig,
  ListingDetailEmbedConfig,
  TestimonialFeedConfig,
} from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

function toDbRow(c: EmbedConfig) {
  const dbType = c.type === 'listing_detail' ? 'listing_detail' : 'listing_feed';
  return {
    id: c.id,
    tenant_id: c.tenantId,
    name: c.name,
    type: dbType,
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

export const DEFAULT_TESTIMONIAL_FEED_CONFIG: TestimonialFeedConfig = {
  selectionMode: 'all',
  selectedTestimonialIds: [],
  sortBy: 'newest',

  showRating: true,
  showQuote: true,
  showDate: false,
  showAuthorName: true,
  showAuthorTitle: true,

  columns: 1,
  gap: 24,
  cardRadius: 12,
  cardPadding: 32,
  backgroundColor: 'transparent',
  cardBackgroundColor: '#ffffff',
  cardBorderColor: '#EBEBEB',

  starColor: '#D4AF37',
  starColorMode: 'solid',
  starGradientColors: ['#D4AF37', '#F5E6A3'],
  starSize: 20,

  quoteFont: '',
  quoteFontSize: 15,
  quoteColor: '#333333',
  quoteLineHeight: 1.6,

  authorNameFont: '',
  authorNameFontSize: 15,
  authorNameColor: '#000000',

  authorTitleFont: '',
  authorTitleFontSize: 13,
  authorTitleColor: '#888C99',

  dateFont: '',
  dateFontSize: 12,
  dateColor: '#888C99',
  dateFormat: 'MMM D, YYYY',

  showDots: true,
  activeDotColor: '#000000',
  inactiveDotColor: '#CCCCCC',
  dotSize: 8,

  showArrows: true,
  arrowColor: '#000000',
  arrowColorMode: 'solid',
  arrowGradientColors: ['#000000', '#555555'],
  arrowSize: 36,
  customLeftArrowSvg: '',
  customRightArrowSvg: '',

  autoplay: false,
  autoplayInterval: 5,

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

export const DEFAULT_BLOG_FEED_CONFIG: BlogFeedWidget = {
  type: 'blog-feed',
  layoutVariant: 'modern-grid',
  query: {
    mode: 'filters',
    manualBlogIds: [],
    filters: { statuses: ['published'], category: '', tags: [], search: '' },
  },
  sortBy: 'date_desc',
  columns: { desktop: 2, tablet: 2, mobile: 1 },
  perPage: { desktop: 9, tablet: 6, mobile: 3 },
  thumbnailHeight: { desktop: 300, tablet: 280, mobile: 220 },
  thumbnailHeightUnit: 'px',
  spacing: 20,
  pagination: {
    mode: 'paged',
    loadMoreLabel: 'Load More',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    infiniteBatchSize: 3,
    showPageIndicator: true,
  },
  showDate: true,
  showAuthor: true,
  showCategory: true,
  showExcerpt: true,
  showReadMore: true,
  showFeaturedReadMore: true,
  readMoreLabel: 'Read More',
  featuredReadMoreLabel: 'Read Article',
  equalHeightCards: true,
  cardClickable: true,
  featuredPost: { enabled: true, showOnTablet: true },
  style: {
    cardBackgroundColor: '#ffffff',
    cardBackgroundOpacity: 100,
    cardBorderColor: '#e5e7eb',
    cardBorderOpacity: 100,
    cardBorderWidth: 1,
    cardBorderRadius: 12,
    cardShadow: true,
    imageBorderRadius: 8,
    imageBorderColor: '#e5e7eb',
    imageBorderOpacity: 100,
    imageBorderWidth: 0,
    imageShadow: false,
    featuredCardBackgroundColor: '#0f172a',
    featuredCardBackgroundOpacity: 100,
    featuredCardBorderColor: '#0f172a',
    featuredCardBorderOpacity: 100,
    featuredCardBorderWidth: 0,
    featuredCardBorderRadius: 14,
    featuredCardShadow: true,
    typography: {
      category: { fontFamily: 'Inter', fontSize: 12, fontWeight: '600', color: '#f59e0b', colorOpacity: 100 },
      title: { fontFamily: 'Inter', fontSize: 22, fontWeight: '700', color: '#111827', colorOpacity: 100 },
      date: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', color: '#6b7280', colorOpacity: 100 },
      meta: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', color: '#6b7280', colorOpacity: 100 },
      excerpt: { fontFamily: 'Inter', fontSize: 15, fontWeight: '400', color: '#374151', colorOpacity: 100 },
      action: { fontFamily: 'Inter', fontSize: 13, fontWeight: '600', color: '#111827', colorOpacity: 100 },
      featuredAction: { fontFamily: 'Inter', fontSize: 14, fontWeight: '600', color: '#111827', colorOpacity: 100 },
    },
    gridButton: {
      textColor: '#111827',
      textColorOpacity: 100,
      backgroundColor: '#ffffff',
      backgroundColorOpacity: 100,
      borderColor: '#d1d5db',
      borderColorOpacity: 100,
      borderRadius: 8,
    },
    featuredButton: {
      textColor: '#111827',
      textColorOpacity: 100,
      backgroundColor: '#fbbf24',
      backgroundColorOpacity: 100,
      borderColor: '#fbbf24',
      borderColorOpacity: 100,
      borderRadius: 8,
    },
    paginationButton: {
      textColor: '#111827',
      textColorOpacity: 100,
      backgroundColor: '#ffffff',
      backgroundColorOpacity: 100,
      borderColor: '#d1d5db',
      borderColorOpacity: 100,
      borderRadius: 8,
    },
  },
  background: { type: 'color', color: 'transparent', opacity: 100, blur: 0 },
  layout: {
    height: { type: 'auto' },
    width: 'container',
    padding: { top: 60, right: 20, bottom: 60, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  },
};

interface EmbedConfigsState {
  configs: EmbedConfig[];
  loaded: boolean;

  createConfig: (
    tenantId: string,
    name: string,
    type: EmbedConfigType,
    config: ListingFeedConfig | ListingDetailEmbedConfig | TestimonialFeedConfig | BlogFeedWidget
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
