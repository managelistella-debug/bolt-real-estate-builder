import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  ListingCollectionTemplate,
  ListingCollectionTemplatePreset,
  ListingsSortOption,
  ListingStatus,
} from '@/lib/types';

interface ListingsTemplatesState {
  templates: ListingCollectionTemplate[];
  initializeTemplatesForUser: (userId: string) => void;
  getTemplatesForUser: (userId?: string) => ListingCollectionTemplate[];
  getTemplateById: (templateId: string) => ListingCollectionTemplate | undefined;
  getActiveTemplateForUser: (userId?: string) => ListingCollectionTemplate | undefined;
  createTemplateFromPreset: (userId: string, preset: ListingCollectionTemplatePreset) => ListingCollectionTemplate;
  updateTemplate: (templateId: string, updates: Partial<Omit<ListingCollectionTemplate, 'id' | 'userId' | 'createdAt'>>) => void;
  setActiveTemplate: (templateId: string, userId: string) => void;
}

const createTemplateId = () => `listing_template_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const createBaseTemplate = (
  userId: string,
  preset: ListingCollectionTemplatePreset,
  name: string,
  pageSlug: string,
  statuses: ListingStatus[],
  sortBy: ListingsSortOption
): ListingCollectionTemplate => {
  const now = new Date();
  return {
    id: createTemplateId(),
    userId,
    name,
    pageSlug,
    preset,
    isActive: false,
    statuses,
    sortBy,
    columns: {
      desktop: 3,
      tablet: 2,
      mobile: 1,
    },
    showFields: {
      address: true,
      city: true,
      price: true,
      status: true,
      representation: true,
    },
    typography: {
      address: {
        fontFamily: 'Inter',
        fontSize: 26,
        fontWeight: '700',
        color: '#111111',
      },
      city: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '500',
        color: '#555555',
      },
      price: {
        fontFamily: 'Inter',
        fontSize: 28,
        fontWeight: '700',
        color: '#111111',
      },
    },
    statusBadgeStyles: {
      for_sale: { enabled: true, backgroundColor: '#111111', textColor: '#ffffff', borderRadius: 9999 },
      pending: { enabled: true, backgroundColor: '#444444', textColor: '#ffffff', borderRadius: 9999 },
      sold: { enabled: true, backgroundColor: '#000000', textColor: '#ffffff', borderRadius: 9999 },
    },
    representationBadgeStyles: {
      buyer_representation: { enabled: true, backgroundColor: '#f1f1f1', textColor: '#111111', borderRadius: 9999 },
      seller_representation: { enabled: true, backgroundColor: '#e8e8e8', textColor: '#111111', borderRadius: 9999 },
    },
    backgroundColor: '#ffffff',
    hero: {
      enabled: false,
      heading: '',
      subheading: '',
      imageUrl: '',
    },
    pagination: {
      mode: 'paged',
      itemsPerPage: 9,
      infiniteBatch: 6,
    },
    createdAt: now,
    updatedAt: now,
  };
};

const buildPresetTemplate = (
  userId: string,
  preset: ListingCollectionTemplatePreset
): ListingCollectionTemplate => {
  if (preset === 'hero-featured') {
    const template = createBaseTemplate(
      userId,
      preset,
      'Active Listings Hero',
      'active-listings',
      ['for_sale', 'pending'],
      'date_added_desc'
    );
    return {
      ...template,
      columns: { desktop: 2, tablet: 2, mobile: 1 },
      hero: {
        enabled: true,
        heading: 'Active Listings',
        subheading: 'Explore current opportunities',
        imageUrl: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80',
      },
    };
  }

  if (preset === 'compact') {
    const template = createBaseTemplate(
      userId,
      preset,
      'Sold Listings Compact',
      'sold-properties',
      ['sold'],
      'price_desc'
    );
    return {
      ...template,
      columns: { desktop: 1, tablet: 1, mobile: 1 },
      showFields: {
        ...template.showFields,
        representation: true,
      },
      typography: {
        ...template.typography,
        address: { ...template.typography.address, fontSize: 22 },
        price: { ...template.typography.price, fontSize: 24 },
      },
    };
  }

  return createBaseTemplate(
    userId,
    preset,
    'Sold Listings Editorial',
    'sold-listings',
    ['sold'],
    'date_added_desc'
  );
};

export const useListingsTemplatesStore = create<ListingsTemplatesState>()(
  persist(
    (set, get) => ({
      templates: [],

      initializeTemplatesForUser: (userId) => {
        const existing = get().templates.filter((template) => template.userId === userId);
        if (existing.length > 0) return;

        const defaultTemplates = [
          buildPresetTemplate(userId, 'editorial'),
          buildPresetTemplate(userId, 'hero-featured'),
          buildPresetTemplate(userId, 'compact'),
        ].map((template, index) => ({
          ...template,
          isActive: index === 0,
        }));

        set((state) => ({
          templates: [...state.templates, ...defaultTemplates],
        }));
      },

      getTemplatesForUser: (userId) => {
        if (!userId) return get().templates;
        return get().templates.filter((template) => template.userId === userId);
      },

      getTemplateById: (templateId) => get().templates.find((template) => template.id === templateId),

      getActiveTemplateForUser: (userId) => {
        const templates = userId
          ? get().templates.filter((template) => template.userId === userId)
          : get().templates;
        return templates.find((template) => template.isActive) ?? templates[0];
      },

      createTemplateFromPreset: (userId, preset) => {
        const template = buildPresetTemplate(userId, preset);
        set((state) => ({
          templates: [...state.templates, template],
        }));
        return template;
      },

      updateTemplate: (templateId, updates) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === templateId
              ? { ...template, ...updates, updatedAt: new Date() }
              : template
          ),
        }));
      },

      setActiveTemplate: (templateId, userId) => {
        set((state) => ({
          templates: state.templates.map((template) => {
            if (template.userId !== userId) return template;
            return {
              ...template,
              isActive: template.id === templateId,
              updatedAt: new Date(),
            };
          }),
        }));
      },
    }),
    {
      name: 'listings-templates-storage',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (error) {
            console.error('Failed to persist listings templates:', error);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);
