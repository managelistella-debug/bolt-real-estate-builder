import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Template, TemplateAssetKind, TemplateCatalogAsset, Section, SectionType } from '@/lib/types';
import { mockTemplates } from '@/lib/mock-data/templates';
import { useAuditLogStore } from './auditLog';
import { createDefaultWidget } from '@/lib/default-widgets';
import { getDefaultHeaderConfig } from '@/lib/header-config';
import { getDefaultFooterConfig } from '@/lib/footer-config';

type CatalogAssetInput = {
  name: string;
  description: string;
  kind: TemplateAssetKind;
  payload: unknown;
  createdByUserId: string;
  ownerUserId?: string;
  sourceTemplateId?: string;
};

interface TemplateCatalogState {
  assets: TemplateCatalogAsset[];
  createAsset: (input: CatalogAssetInput) => TemplateCatalogAsset;
  createSiteTemplate: (input: {
    name: string;
    description: string;
    industries: string[];
    previewImage: string;
    createdByUserId: string;
    sectionTypes: SectionType[];
    baseAssetId?: string;
  }) => TemplateCatalogAsset;
  createAiSiteTemplate: (input: {
    name: string;
    description: string;
    previewHtml: string;
    previewCss: string;
    createdByUserId: string;
  }) => TemplateCatalogAsset;
  publishAssetGlobal: (assetId: string, actorUserId: string) => void;
  assignAssetToUser: (assetId: string, targetUserId: string, actorUserId: string) => TemplateCatalogAsset | null;
  getAssetsForUser: (userId: string) => TemplateCatalogAsset[];
  getGlobalAssets: (kind?: TemplateAssetKind) => TemplateCatalogAsset[];
  getAssetById: (assetId: string) => TemplateCatalogAsset | undefined;
}

const seededAssets: TemplateCatalogAsset[] = mockTemplates.map((template) => ({
  id: `catalog_seed_${template.id}`,
  name: template.name,
  description: template.description,
  kind: 'full_site',
  scope: 'global',
  createdByUserId: 'system',
  sourceTemplateId: template.id,
  payload: template,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  publishedAt: new Date('2024-01-01'),
}));

const DEFAULT_SITE_TEMPLATE_PREVIEW =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop';

function createTemplateSections(sectionTypes: SectionType[]): Section[] {
  return sectionTypes.map((type, index) => ({
    id: `section_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    order: index,
    widget: createDefaultWidget(type),
  }));
}

function createTemplatePayload(input: {
  name: string;
  description: string;
  industries: string[];
  previewImage: string;
  sectionTypes: SectionType[];
  baseTemplate?: Template | null;
}): Template {
  const nowId = `template_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const baseTemplate = input.baseTemplate || null;
  const sections = createTemplateSections(input.sectionTypes.length ? input.sectionTypes : ['hero', 'services', 'contact-form']);
  const normalizedName = input.name.trim() || 'Untitled Site Template';
  return {
    id: nowId,
    name: normalizedName,
    description: input.description.trim() || `Template generated for ${normalizedName}`,
    industry: input.industries.length ? input.industries : ['general'],
    previewImage: input.previewImage || baseTemplate?.previewImage || DEFAULT_SITE_TEMPLATE_PREVIEW,
    defaultGlobalStyles: cloneDeep(baseTemplate?.defaultGlobalStyles || mockTemplates[0].defaultGlobalStyles),
    defaultHeader: cloneDeep(baseTemplate?.defaultHeader || getDefaultHeaderConfig()),
    defaultFooter: cloneDeep(baseTemplate?.defaultFooter || getDefaultFooterConfig()),
    defaultPages: [
      {
        name: 'Home',
        slug: '/',
        isHomepage: true,
        sections,
        seo: {
          metaTitle: normalizedName,
          metaDescription: input.description.trim() || `Homepage for ${normalizedName}`,
        },
        status: 'draft',
      },
    ],
  };
}

function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export const useTemplateCatalogStore = create<TemplateCatalogState>()(
  persist(
    (set, get) => ({
      assets: seededAssets,
      createAsset: (input) => {
        const now = new Date();
        const asset: TemplateCatalogAsset = {
          id: `catalog_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: input.name,
          description: input.description,
          kind: input.kind,
          scope: input.ownerUserId ? 'tenant' : 'global',
          ownerUserId: input.ownerUserId,
          createdByUserId: input.createdByUserId,
          sourceTemplateId: input.sourceTemplateId,
          payload: cloneDeep(input.payload),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ assets: [asset, ...state.assets] }));
        return asset;
      },
      createSiteTemplate: (input) => {
        const baseAsset = input.baseAssetId
          ? get().assets.find((asset) => asset.id === input.baseAssetId && asset.kind === 'full_site')
          : undefined;
        const baseTemplate = baseAsset ? (baseAsset.payload as Template) : null;
        const payload = createTemplatePayload({
          name: input.name,
          description: input.description,
          industries: input.industries,
          previewImage: input.previewImage,
          sectionTypes: input.sectionTypes,
          baseTemplate,
        });
        const created = get().createAsset({
          name: payload.name,
          description: payload.description,
          kind: 'full_site',
          payload,
          createdByUserId: input.createdByUserId,
        });
        return created;
      },
      createAiSiteTemplate: (input) => {
        const now = new Date();
        const asset: TemplateCatalogAsset = {
          id: `catalog_ai_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: input.name,
          description: input.description,
          kind: 'full_site',
          scope: 'global',
          createdByUserId: input.createdByUserId,
          payload: { type: 'ai-site', previewHtml: input.previewHtml, previewCss: input.previewCss },
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ assets: [asset, ...state.assets] }));
        return asset;
      },
      publishAssetGlobal: (assetId, actorUserId) => {
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === assetId
              ? {
                  ...asset,
                  scope: 'global',
                  ownerUserId: undefined,
                  publishedAt: new Date(),
                  updatedAt: new Date(),
                }
              : asset
          ),
        }));
        useAuditLogStore.getState().addEvent({
          type: 'template_published_global',
          actorUserId,
          entityId: assetId,
          entityType: 'template_asset',
        });
      },
      assignAssetToUser: (assetId, targetUserId, actorUserId) => {
        const source = get().assets.find((asset) => asset.id === assetId);
        if (!source) return null;
        const now = new Date();
        const assignedAsset: TemplateCatalogAsset = {
          ...cloneDeep(source),
          id: `catalog_assigned_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          scope: 'assigned_private',
          ownerUserId: targetUserId,
          assignedByUserId: actorUserId,
          assignedAt: now,
          sourceTemplateId: source.sourceTemplateId || source.id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ assets: [assignedAsset, ...state.assets] }));
        useAuditLogStore.getState().addEvent({
          type: 'admin_assigned_theme',
          actorUserId,
          targetUserId,
          entityId: assignedAsset.id,
          entityType: 'template_asset',
        });
        return assignedAsset;
      },
      getAssetsForUser: (userId) =>
        get().assets.filter(
          (asset) => asset.scope === 'global' || (asset.scope !== 'global' && asset.ownerUserId === userId)
        ),
      getGlobalAssets: (kind) =>
        get().assets.filter((asset) => asset.scope === 'global' && (!kind || asset.kind === kind)),
      getAssetById: (assetId) => get().assets.find((asset) => asset.id === assetId),
    }),
    {
      name: 'template-catalog-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const state = persisted as Partial<TemplateCatalogState> | undefined;
        if (!state?.assets?.length) {
          return current;
        }
        const existingSeedIds = new Set(state.assets.map((asset) => asset.id));
        const missingSeeds = seededAssets.filter((seed) => !existingSeedIds.has(seed.id));
        return {
          ...current,
          ...state,
          assets: [...state.assets, ...missingSeeds],
        };
      },
    }
  )
);

export function getTemplateFromAsset(asset: TemplateCatalogAsset): Template | null {
  if (asset.kind !== 'full_site') return null;
  return asset.payload as Template;
}
