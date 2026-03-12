import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BlogPostTemplateConfig, BlogPostTemplateId } from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

interface BlogTemplatesState {
  templates: BlogPostTemplateConfig[];
  activeTemplateId: BlogPostTemplateId;
  getTemplateById: (id: BlogPostTemplateId) => BlogPostTemplateConfig | undefined;
  getTemplatesForCurrentUser: (userId?: string) => BlogPostTemplateConfig[];
  getActiveTemplate: () => BlogPostTemplateConfig | undefined;
  setActiveTemplate: (id: BlogPostTemplateId) => void;
  updateTemplate: (id: BlogPostTemplateId, updates: Partial<BlogPostTemplateConfig>) => void;
  createTemplate: (name: string, sourceTemplateId?: BlogPostTemplateId) => BlogPostTemplateConfig;
  publishTemplateGlobally: (id: BlogPostTemplateId) => void;
}

const DEFAULT_BLOG_TEMPLATES: BlogPostTemplateConfig[] = [
  {
    id: 'classic',
    name: 'Classic Article',
    description: 'Hero image and title with a sticky right-column contact form.',
    scope: 'global',
    layoutVariant: 'newsletter',
    heroLayoutMode: 'image_overlay',
    heroTextAlign: 'left',
    heroImageObjectPositionX: 'center',
    heroImageObjectPositionY: 'center',
    heroGradientEnabled: true,
    heroGradientStartColor: '#000000',
    heroGradientStartOpacity: 45,
    heroGradientEndColor: '#000000',
    heroGradientEndOpacity: 10,
    heroGradientAngle: 180,
    showCategory: true,
    showDateAuthor: true,
    showTagsInHero: true,
    showSidebarContact: true,
    showBottomBlogCards: true,
    bottomBlogCardsCount: 3,
    sidebarStickyOffset: 20,
    sidebarForm: {
      heading: 'Contact Agent',
      description: 'Have a question? Send us a message and we will respond shortly.',
      buttonText: 'Send Message',
      fields: [
        { id: 'name', type: 'text', label: 'Name', placeholder: 'Your name', required: true },
        { id: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
        { id: 'phone', type: 'phone', label: 'Phone', placeholder: '(555) 555-5555', required: false },
        { id: 'message', type: 'textarea', label: 'Message', placeholder: 'How can we help?', required: true },
      ],
    },
    dynamicBindings: {
      heroImageField: 'featuredImage',
      titleField: 'title',
      dateField: 'publishedAt',
      contentField: 'contentHtml',
    },
    showTags: true,
    heroImageFullWidth: false,
    relatedPostsHeading: 'Related Posts',
    relatedPostsLayout: 'grid',
    relatedPostsFilter: 'latest',
    relatedPostsFilterCategory: '',
    relatedPostsFilterTag: '',
    showRelatedPostDate: true,
    showRelatedPostExcerpt: true,
    relatedCardContentPadding: 12,
    style: {
      containerWidth: 'narrow',
      headerBackgroundColor: '#ffffff',
      headerBackgroundOpacity: 100,
      headerOverlayColor: '#000000',
      headerOverlayOpacity: 25,
      heroImageBorderRadius: 12,
      bodyBackgroundColor: '#ffffff',
      bodyBackgroundOpacity: 100,
      sidebarBackgroundColor: '#ffffff',
      sidebarBackgroundOpacity: 100,
      sidebarBorderColor: '#e5e7eb',
      sidebarBorderOpacity: 100,
      sidebarBorderWidth: 1,
      sidebarBorderRadius: 12,
      formFieldBackgroundColor: '#ffffff',
      formFieldBackgroundOpacity: 100,
      formFieldBorderColor: '#d1d5db',
      formFieldBorderOpacity: 100,
      formFieldBorderWidth: 1,
      formFieldBorderRadius: 8,
      formButtonBackgroundColor: '#2563eb',
      formButtonBackgroundOpacity: 100,
      formButtonBorderRadius: 8,
      formButtonHoverBackgroundColor: '#1d4ed8',
      formButtonHoverBackgroundOpacity: 100,
      formButtonHoverTextColor: '#ffffff',
      formButtonHoverTextOpacity: 100,
      borderColor: '#e5e7eb',
      borderColorOpacity: 100,
      borderWidth: 1,
      tagBackgroundColor: '#f3f4f6',
      tagBackgroundOpacity: 100,
      tagBorderColor: '#d1d5db',
      tagBorderOpacity: 100,
      tagBorderWidth: 1,
      tagBorderRadius: 999,
      relatedCardBackgroundColor: '#ffffff',
      relatedCardBackgroundOpacity: 100,
      relatedCardBorderColor: '#e5e7eb',
      relatedCardBorderOpacity: 100,
      relatedCardBorderWidth: 1,
      relatedCardBorderRadius: 12,
      relatedImageBorderRadius: 10,
      typography: {
        title: { fontFamily: 'Inter', fontSize: 42, fontWeight: '700', lineHeight: '1.2', textTransform: 'none', color: '#111827', colorOpacity: 100 },
        date: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', lineHeight: '1.5', textTransform: 'none', color: '#6b7280', colorOpacity: 100 },
        tags: { fontFamily: 'Inter', fontSize: 12, fontWeight: '600', lineHeight: '1.5', textTransform: 'none', color: '#374151', colorOpacity: 100 },
        body: { fontFamily: 'Inter', fontSize: 16, fontWeight: '400', lineHeight: '1.6', textTransform: 'none', color: '#111827', colorOpacity: 100 },
        formHeading: { fontFamily: 'Inter', fontSize: 22, fontWeight: '700', lineHeight: '1.3', textTransform: 'none', color: '#111827', colorOpacity: 100 },
        formLabel: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', lineHeight: '1.5', textTransform: 'none', color: '#374151', colorOpacity: 100 },
        formButton: { fontFamily: 'Inter', fontSize: 14, fontWeight: '600', lineHeight: '1.4', textTransform: 'none', color: '#ffffff', colorOpacity: 100 },
        relatedHeading: { fontFamily: 'Inter', fontSize: 24, fontWeight: '700', lineHeight: '1.3', textTransform: 'none', color: '#111827', colorOpacity: 100 },
      },
    },
  },
  {
    id: 'feature',
    name: 'Feature Header',
    description: 'Minimal article page with date, tags, hero image, and body content.',
    scope: 'global',
    layoutVariant: 'insights',
    heroLayoutMode: 'title_with_thumbnail',
    heroTextAlign: 'left',
    heroImageObjectPositionX: 'center',
    heroImageObjectPositionY: 'center',
    heroGradientEnabled: false,
    heroGradientStartColor: '#000000',
    heroGradientStartOpacity: 0,
    heroGradientEndColor: '#000000',
    heroGradientEndOpacity: 0,
    heroGradientAngle: 180,
    showCategory: true,
    showDateAuthor: true,
    showTagsInHero: true,
    showSidebarContact: false,
    showBottomBlogCards: false,
    bottomBlogCardsCount: 3,
    sidebarStickyOffset: 20,
    sidebarForm: {
      heading: 'Contact',
      description: '',
      buttonText: 'Submit',
      fields: [
        { id: 'name', type: 'text', label: 'Name', placeholder: 'Your name', required: true },
        { id: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
      ],
    },
    dynamicBindings: {
      heroImageField: 'featuredImage',
      titleField: 'title',
      dateField: 'publishedAt',
      contentField: 'contentHtml',
    },
    showTags: true,
    heroImageFullWidth: false,
    relatedPostsHeading: 'Latest Posts',
    relatedPostsLayout: 'grid',
    relatedPostsFilter: 'latest',
    relatedPostsFilterCategory: '',
    relatedPostsFilterTag: '',
    showRelatedPostDate: true,
    showRelatedPostExcerpt: true,
    relatedCardContentPadding: 12,
    style: {
      containerWidth: 'narrow',
      headerBackgroundColor: '#ffffff',
      headerBackgroundOpacity: 100,
      headerOverlayColor: '#000000',
      headerOverlayOpacity: 0,
      heroImageBorderRadius: 12,
      bodyBackgroundColor: '#ffffff',
      bodyBackgroundOpacity: 100,
      sidebarBackgroundColor: '#ffffff',
      sidebarBackgroundOpacity: 100,
      sidebarBorderColor: '#e5e7eb',
      sidebarBorderOpacity: 100,
      sidebarBorderWidth: 1,
      sidebarBorderRadius: 12,
      formFieldBackgroundColor: '#ffffff',
      formFieldBackgroundOpacity: 100,
      formFieldBorderColor: '#d1d5db',
      formFieldBorderOpacity: 100,
      formFieldBorderWidth: 1,
      formFieldBorderRadius: 8,
      formButtonBackgroundColor: '#2563eb',
      formButtonBackgroundOpacity: 100,
      formButtonBorderRadius: 8,
      formButtonHoverBackgroundColor: '#1d4ed8',
      formButtonHoverBackgroundOpacity: 100,
      formButtonHoverTextColor: '#ffffff',
      formButtonHoverTextOpacity: 100,
      borderColor: '#e5e7eb',
      borderColorOpacity: 100,
      borderWidth: 1,
      tagBackgroundColor: '#f3f4f6',
      tagBackgroundOpacity: 100,
      tagBorderColor: '#d1d5db',
      tagBorderOpacity: 100,
      tagBorderWidth: 1,
      tagBorderRadius: 999,
      relatedCardBackgroundColor: '#ffffff',
      relatedCardBackgroundOpacity: 100,
      relatedCardBorderColor: '#e5e7eb',
      relatedCardBorderOpacity: 100,
      relatedCardBorderWidth: 1,
      relatedCardBorderRadius: 12,
      relatedImageBorderRadius: 10,
      typography: {
        title: { fontFamily: 'Inter', fontSize: 44, fontWeight: '700', lineHeight: '1.2', textTransform: 'none', color: '#111827', colorOpacity: 100 },
        date: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', lineHeight: '1.5', textTransform: 'none', color: '#6b7280', colorOpacity: 100 },
        tags: { fontFamily: 'Inter', fontSize: 12, fontWeight: '600', lineHeight: '1.5', textTransform: 'none', color: '#374151', colorOpacity: 100 },
        body: { fontFamily: 'Inter', fontSize: 16, fontWeight: '400', lineHeight: '1.6', textTransform: 'none', color: '#111827', colorOpacity: 100 },
        formHeading: { fontFamily: 'Inter', fontSize: 22, fontWeight: '700', lineHeight: '1.3', textTransform: 'none', color: '#111827', colorOpacity: 100 },
        formLabel: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', lineHeight: '1.5', textTransform: 'none', color: '#374151', colorOpacity: 100 },
        formButton: { fontFamily: 'Inter', fontSize: 14, fontWeight: '600', lineHeight: '1.4', textTransform: 'none', color: '#ffffff', colorOpacity: 100 },
        relatedHeading: { fontFamily: 'Inter', fontSize: 24, fontWeight: '700', lineHeight: '1.3', textTransform: 'none', color: '#111827', colorOpacity: 100 },
      },
    },
  },
];

const DEFAULT_DYNAMIC_BINDINGS: BlogPostTemplateConfig['dynamicBindings'] = {
  heroImageField: 'featuredImage',
  titleField: 'title',
  dateField: 'publishedAt',
  contentField: 'contentHtml',
};

export const useBlogTemplatesStore = create<BlogTemplatesState>()(
  persist(
    (set, get) => ({
      templates: DEFAULT_BLOG_TEMPLATES,
      activeTemplateId: 'classic',

      getTemplateById: (id) => get().templates.find((template) => template.id === id),
      getTemplatesForCurrentUser: (userId) => {
        const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
        return get().templates.filter(
          (template) => template.scope === 'global' || (!effectiveUserId ? true : template.ownerUserId === effectiveUserId)
        );
      },
      getActiveTemplate: () => {
        const state = get();
        const visibleTemplates = state.getTemplatesForCurrentUser();
        return (
          visibleTemplates.find((template) => template.id === state.activeTemplateId) ||
          visibleTemplates[0] ||
          DEFAULT_BLOG_TEMPLATES[0]
        );
      },
      setActiveTemplate: (id) => set({ activeTemplateId: id }),

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? {
                  ...template,
                  ...updates,
                  dynamicBindings: {
                    ...DEFAULT_DYNAMIC_BINDINGS,
                    ...template.dynamicBindings,
                    ...(updates.dynamicBindings || {}),
                  },
                  style: { ...template.style, ...(updates.style || {}) },
                  sidebarForm: {
                    ...template.sidebarForm,
                    ...(updates.sidebarForm || {}),
                    fields: updates.sidebarForm?.fields || template.sidebarForm.fields,
                  },
                }
              : template
          ),
        }));
      },

      createTemplate: (name, sourceTemplateId) => {
        const source =
          get().templates.find((template) => template.id === sourceTemplateId) ||
          get().templates[0] ||
          DEFAULT_BLOG_TEMPLATES[0];
        const template: BlogPostTemplateConfig = {
          ...source,
          id: `template_${Date.now()}`,
          name: name.trim() || 'Untitled Template',
          description: 'Custom blog template',
          scope: 'tenant',
          ownerUserId: useTenantContextStore.getState().effectiveUserId,
          sourceTemplateId: source.id,
          dynamicBindings: {
            ...DEFAULT_DYNAMIC_BINDINGS,
            ...source.dynamicBindings,
          },
          sidebarForm: {
            ...source.sidebarForm,
            fields: source.sidebarForm.fields.map((field) => ({ ...field })),
          },
        };
        set((state) => ({ templates: [...state.templates, template] }));
        return template;
      },
      publishTemplateGlobally: (id) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? {
                  ...template,
                  scope: 'global',
                  ownerUserId: undefined,
                  publishedAt: new Date(),
                }
              : template
          ),
        }));
      },
    }),
    {
      name: 'blog-templates-storage',
      version: 8,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any) => {
        const state = persistedState as Partial<BlogTemplatesState> | undefined;
        const templates = state?.templates;
        if (!Array.isArray(templates) || templates.length === 0) {
          return { templates: DEFAULT_BLOG_TEMPLATES, activeTemplateId: 'classic' };
        }
        const legacyActiveTemplateId = (state as any)?.activeTemplateId;
        const migratedTemplates = templates.map((template: any) => {
          const legacyId = template?.id;
          const isLegacyBaseTemplate =
            legacyId === 'newsletter' ||
            legacyId === 'insights' ||
            legacyId === 'classic' ||
            legacyId === 'feature' ||
            legacyId === 'sidebar';
          const mappedId =
            legacyId === 'newsletter'
              ? 'classic'
              : legacyId === 'insights'
                ? 'feature'
                : legacyId === 'classic' || legacyId === 'feature'
                  ? legacyId
                  : legacyId === 'sidebar'
                    ? `template_legacy_sidebar_${Date.now()}`
                    : legacyId || `template_${Date.now()}`;
          const defaultSource = mappedId === 'feature' ? DEFAULT_BLOG_TEMPLATES[1] : DEFAULT_BLOG_TEMPLATES[0];

          return {
            ...defaultSource,
            ...(isLegacyBaseTemplate ? {} : template),
            ...(isLegacyBaseTemplate
              ? { name: defaultSource.name, description: defaultSource.description }
              : template),
            id: mappedId,
            scope: template?.scope || (isLegacyBaseTemplate ? 'global' : 'tenant'),
            ownerUserId: template?.ownerUserId,
            sourceTemplateId: template?.sourceTemplateId,
            publishedAt: template?.publishedAt ? new Date(template.publishedAt) : undefined,
            relatedPostsLayout: 'grid',
            showRelatedPostDate:
              typeof template?.showRelatedPostDate === 'boolean'
                ? template.showRelatedPostDate
                : defaultSource.showRelatedPostDate,
            showRelatedPostExcerpt:
              typeof template?.showRelatedPostExcerpt === 'boolean'
                ? template.showRelatedPostExcerpt
                : defaultSource.showRelatedPostExcerpt,
            relatedCardContentPadding:
              typeof template?.relatedCardContentPadding === 'number'
                ? template.relatedCardContentPadding
                : defaultSource.relatedCardContentPadding,
            dynamicBindings: {
              ...DEFAULT_DYNAMIC_BINDINGS,
              ...defaultSource.dynamicBindings,
              ...(template?.dynamicBindings || {}),
              dateField:
                template?.dynamicBindings?.dateField === 'createdAt' ||
                template?.dynamicBindings?.dateField === 'updatedAt' ||
                template?.dynamicBindings?.dateField === 'publishedAt'
                  ? template.dynamicBindings.dateField
                  : defaultSource.dynamicBindings.dateField,
            },
            sidebarForm: {
              ...defaultSource.sidebarForm,
              ...(template?.sidebarForm || {}),
              fields: Array.isArray(template?.sidebarForm?.fields)
                ? template.sidebarForm.fields
                : defaultSource.sidebarForm.fields,
            },
            style: {
              ...defaultSource.style,
              ...(template?.style || {}),
              typography: {
                ...defaultSource.style.typography,
                ...(template?.style?.typography || {}),
              },
            },
          } as BlogPostTemplateConfig;
        });

        const normalizedActiveTemplateId =
          legacyActiveTemplateId === 'newsletter'
            ? 'classic'
            : legacyActiveTemplateId === 'insights'
              ? 'feature'
              : typeof legacyActiveTemplateId === 'string'
                ? legacyActiveTemplateId
                : 'classic';

        return {
          templates: migratedTemplates,
          activeTemplateId: migratedTemplates.some((template) => template.id === normalizedActiveTemplateId)
            ? normalizedActiveTemplateId
            : migratedTemplates[0]?.id || 'classic',
        };
      },
    }
  )
);
