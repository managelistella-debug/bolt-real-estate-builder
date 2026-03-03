import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Website, Page, WebsiteDomainSettings, Template } from '@/lib/types';
import { getDefaultHeaderConfig, normalizeHeaderConfig } from '@/lib/header-config';
import { getDefaultFooterConfig, normalizeFooterConfig } from '@/lib/footer-config';
import { buildPlatformUrl, generateDefaultSubdomainSlug } from '@/lib/domain/config';
import { buildVercelDnsRecords, normalizeDomainInput } from '@/lib/domain/dns';
import { DomainVerificationResult, MockDomainVerificationProvider } from '@/lib/domain/verification';
import { useTenantContextStore } from './tenantContext';

interface WebsiteState {
  currentWebsite: Website | null;
  websites: Website[];
  getCurrentUserWebsite: () => Website | null;
  initializeUserWebsite: (userId: string) => void;
  addWebsite: (website: Website) => void;
  applyTemplateToUserWebsite: (template: Template, userId: string) => Website;
  setCurrentWebsite: (website: Website) => void;
  updateWebsite: (websiteId: string, updates: Partial<Website>) => void;
  addPage: (page: Page) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  setHomepage: (pageId: string) => void;
  setCustomDomain: (websiteId: string, customDomain: string) => void;
  startDomainVerification: (websiteId: string) => void;
  completeDomainVerification: (websiteId: string, result: DomainVerificationResult) => void;
  verifyCustomDomain: (websiteId: string) => Promise<boolean>;
  disconnectCustomDomain: (websiteId: string) => void;
}

const normalizePageData = (page: Page): Page => ({
  ...page,
  headerSettings: page.headerSettings || { useCustomHeader: false },
});

const domainVerificationProvider = new MockDomainVerificationProvider();

function createVerificationToken(): string {
  return `verify_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

function getDefaultDomainSettings(params: { userId: string; websiteId: string; platformSubdomain?: string }): WebsiteDomainSettings {
  const platformSubdomain = generateDefaultSubdomainSlug(
    params.platformSubdomain || params.userId || params.websiteId
  );
  return {
    platformSubdomain,
    platformUrl: buildPlatformUrl(platformSubdomain),
    status: 'not_started',
    expectedDnsRecords: [],
  };
}

function normalizeDomainSettings(website: Website): WebsiteDomainSettings {
  if (!website.domains) {
    const defaults = getDefaultDomainSettings({ userId: website.userId, websiteId: website.id });
    if (!website.domain) return defaults;

    const normalizedDomain = normalizeDomainInput(website.domain);
    const verificationToken = createVerificationToken();

    return {
      ...defaults,
      customDomain: normalizedDomain,
      status: 'connected',
      expectedDnsRecords: buildVercelDnsRecords(normalizedDomain, verificationToken),
      verificationToken,
      lastVerifiedAt: new Date(),
    };
  }

  const normalizedSubdomain = generateDefaultSubdomainSlug(website.domains.platformSubdomain || website.userId || website.id);
  const customDomain = website.domains.customDomain ? normalizeDomainInput(website.domains.customDomain) : undefined;

  return {
    ...website.domains,
    platformSubdomain: normalizedSubdomain,
    platformUrl: buildPlatformUrl(normalizedSubdomain),
    customDomain,
    expectedDnsRecords: website.domains.expectedDnsRecords || [],
    lastVerifiedAt: website.domains.lastVerifiedAt ? new Date(website.domains.lastVerifiedAt) : undefined,
  };
}

const normalizeWebsiteData = (website: Website): Website => ({
  ...website,
  domains: normalizeDomainSettings(website),
  header: normalizeHeaderConfig(website.header),
  footer: normalizeFooterConfig(website.footer),
  pages: website.pages.map(normalizePageData),
});

export const useWebsiteStore = create<WebsiteState>()(
  persist(
    (set, get) => ({
  currentWebsite: null,
  websites: [],
  
  getCurrentUserWebsite: () => {
    const state = get();
    const effectiveUserId = useTenantContextStore.getState().effectiveUserId;
    if (!effectiveUserId) return null;
    const scopedWebsite = state.websites.find((website) => website.userId === effectiveUserId);
    return scopedWebsite ? normalizeWebsiteData(scopedWebsite) : null;
  },

  initializeUserWebsite: (userId: string) => {
    const state = get();
    const effectiveUserId = useTenantContextStore.getState().effectiveUserId || userId;
    if (state.websites.length > 0) {
      const normalizedWebsites = state.websites.map((website) => normalizeWebsiteData(website));
      const existingForUser = normalizedWebsites.find((website) => website.userId === effectiveUserId);
      set({
        websites: normalizedWebsites,
        currentWebsite: existingForUser || normalizedWebsites[0] || null,
      });
      if (existingForUser) return;
    }

    if (state.websites.filter((website) => website.userId === effectiveUserId).length === 0) {
      // Create a default home page
      const defaultHomePage: Page = {
        id: `page-${Date.now()}`,
        websiteId: `website-${effectiveUserId}`,
        name: 'Home',
        slug: '/',
        isHomepage: true,
        sections: [],
        headerSettings: {
          useCustomHeader: false,
        },
        seo: {
          metaTitle: 'Home',
          metaDescription: 'Welcome to my website',
        },
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create a default website for the user
      const defaultWebsite: Website = {
        id: `website-${effectiveUserId}`,
        name: 'My Website',
        userId: effectiveUserId,
        templateId: 'default',
        published: false,
        globalStyles: {
          colors: {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#ec4899',
          },
          fontPair: {
            id: 'inter-default',
            name: 'Inter',
            heading: 'Inter',
            body: 'Inter',
          },
          button: {
            variant: 'solid',
            rounded: 'md',
          },
          headings: {
            h1: { fontSize: '3rem', fontWeight: '700', lineHeight: '1.2' },
            h2: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.3' },
            h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
          },
          body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' },
        },
        header: getDefaultHeaderConfig(),
        footer: getDefaultFooterConfig(),
        pages: [defaultHomePage],
        domains: getDefaultDomainSettings({ userId: effectiveUserId, websiteId: `website-${effectiveUserId}` }),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const normalizedWebsite = normalizeWebsiteData(defaultWebsite);
      set({ websites: [...state.websites, normalizedWebsite], currentWebsite: normalizedWebsite });
    }
  },

  addWebsite: (website) => {
    const normalizedWebsite = normalizeWebsiteData(website);
    set((state) => ({
      websites: [...state.websites, normalizedWebsite],
      currentWebsite: normalizedWebsite,
    }));
  },

  applyTemplateToUserWebsite: (template, userId) => {
    const state = get();
    const targetWebsite = state.websites.find((website) => website.userId === userId);
    const now = new Date();
    const nextPages = template.defaultPages.map((page, index) => ({
      ...page,
      id: `page_${Date.now()}_${index}`,
      websiteId: targetWebsite?.id || `website-${userId}`,
      createdAt: now,
      updatedAt: now,
    }));

    const nextWebsite: Website = normalizeWebsiteData({
      id: targetWebsite?.id || `website-${userId}`,
      name: targetWebsite?.name || `${template.name} Website`,
      userId,
      templateId: template.id,
      published: false,
      globalStyles: template.defaultGlobalStyles,
      header: template.defaultHeader,
      footer: template.defaultFooter,
      pages: nextPages,
      domains: targetWebsite?.domains || getDefaultDomainSettings({ userId, websiteId: targetWebsite?.id || `website-${userId}` }),
      createdAt: targetWebsite?.createdAt || now,
      updatedAt: now,
    });

    set((prev) => ({
      websites: targetWebsite
        ? prev.websites.map((website) => (website.id === targetWebsite.id ? nextWebsite : website))
        : [...prev.websites, nextWebsite],
      currentWebsite: nextWebsite,
    }));

    return nextWebsite;
  },
  
  setCurrentWebsite: (website) => {
    set({ currentWebsite: normalizeWebsiteData(website) });
  },
  
  updateWebsite: (websiteId, updates) => {
    const normalizedUpdates: Partial<Website> = { ...updates };
    if (updates.header) {
      normalizedUpdates.header = normalizeHeaderConfig(updates.header);
    }
    if (updates.footer) {
      normalizedUpdates.footer = normalizeFooterConfig(updates.footer);
    }
    set((state) => ({
      websites: state.websites.map(w =>
        w.id === websiteId ? normalizeWebsiteData({ ...w, ...normalizedUpdates, updatedAt: new Date() }) : w
      ),
      currentWebsite: state.currentWebsite?.id === websiteId
        ? normalizeWebsiteData({ ...state.currentWebsite, ...normalizedUpdates, updatedAt: new Date() })
        : state.currentWebsite,
    }));
  },
  
  addPage: (page) => {
    set((state) => {
      const website = get().getCurrentUserWebsite();
      if (!website) return state;
      
      const updatedWebsite = {
        ...website,
        pages: [...website.pages, normalizePageData(page)],
        updatedAt: new Date(),
      };
      
      return {
        websites: state.websites.map(w => w.id === website.id ? updatedWebsite : w),
        currentWebsite: state.currentWebsite?.id === website.id ? updatedWebsite : state.currentWebsite,
      };
    });
  },
  
  updatePage: (pageId, updates) => {
    set((state) => {
      const website = get().getCurrentUserWebsite();
      if (!website) return state;
      
      const updatedWebsite = {
        ...website,
        pages: website.pages.map(p =>
          p.id === pageId ? normalizePageData({ ...p, ...updates, updatedAt: new Date() }) : p
        ),
        updatedAt: new Date(),
      };
      
      return {
        websites: state.websites.map(w => w.id === website.id ? updatedWebsite : w),
        currentWebsite: state.currentWebsite?.id === website.id ? updatedWebsite : state.currentWebsite,
      };
    });
  },
  
  deletePage: (pageId) => {
    set((state) => {
      const website = get().getCurrentUserWebsite();
      if (!website) return state;
      
      const updatedWebsite = {
        ...website,
        pages: website.pages.filter(p => p.id !== pageId),
        updatedAt: new Date(),
      };
      
      return {
        websites: state.websites.map(w => w.id === website.id ? updatedWebsite : w),
        currentWebsite: state.currentWebsite?.id === website.id ? updatedWebsite : state.currentWebsite,
      };
    });
  },
  
  duplicatePage: (pageId) => {
    set((state) => {
      const website = get().getCurrentUserWebsite();
      if (!website) return state;
      
      const pageToDuplicate = website.pages.find(p => p.id === pageId);
      if (!pageToDuplicate) return state;
      
      const duplicatedPage: Page = {
        ...pageToDuplicate,
        id: `page-${Date.now()}`,
        name: `${pageToDuplicate.name} (Copy)`,
        slug: `${pageToDuplicate.slug}-copy`,
        isHomepage: false,
        headerSettings: pageToDuplicate.headerSettings || { useCustomHeader: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedWebsite = {
        ...website,
        pages: [...website.pages, duplicatedPage],
        updatedAt: new Date(),
      };
      
      return {
        websites: state.websites.map(w => w.id === website.id ? updatedWebsite : w),
        currentWebsite: state.currentWebsite?.id === website.id ? updatedWebsite : state.currentWebsite,
      };
    });
  },
  
  setHomepage: (pageId) => {
    set((state) => {
      const website = get().getCurrentUserWebsite();
      if (!website) return state;
      
      const updatedWebsite = {
        ...website,
        pages: website.pages.map(p => ({
          ...p,
          isHomepage: p.id === pageId,
        })),
        updatedAt: new Date(),
      };
      
      return {
        websites: state.websites.map(w => w.id === website.id ? updatedWebsite : w),
        currentWebsite: state.currentWebsite?.id === website.id ? updatedWebsite : state.currentWebsite,
      };
    });
  },

  setCustomDomain: (websiteId, customDomain) => {
    const normalizedDomain = normalizeDomainInput(customDomain);
    const verificationToken = createVerificationToken();
    const expectedDnsRecords = buildVercelDnsRecords(normalizedDomain, verificationToken);

    set((state) => ({
      websites: state.websites.map((website) =>
        website.id === websiteId
          ? normalizeWebsiteData({
              ...website,
              domain: normalizedDomain,
              domains: {
                ...(website.domains || getDefaultDomainSettings({ userId: website.userId, websiteId: website.id })),
                customDomain: normalizedDomain,
                status: 'pending_dns',
                verificationToken,
                verificationError: undefined,
                expectedDnsRecords,
              },
              updatedAt: new Date(),
            })
          : website
      ),
      currentWebsite:
        state.currentWebsite?.id === websiteId
          ? normalizeWebsiteData({
              ...state.currentWebsite,
              domain: normalizedDomain,
              domains: {
                ...(state.currentWebsite.domains || getDefaultDomainSettings({
                  userId: state.currentWebsite.userId,
                  websiteId: state.currentWebsite.id,
                })),
                customDomain: normalizedDomain,
                status: 'pending_dns',
                verificationToken,
                verificationError: undefined,
                expectedDnsRecords,
              },
              updatedAt: new Date(),
            })
          : state.currentWebsite,
    }));
  },

  startDomainVerification: (websiteId) => {
    set((state) => ({
      websites: state.websites.map((website) =>
        website.id === websiteId
          ? normalizeWebsiteData({
              ...website,
              domains: {
                ...(website.domains || getDefaultDomainSettings({ userId: website.userId, websiteId: website.id })),
                status: 'verifying',
                verificationError: undefined,
              },
              updatedAt: new Date(),
            })
          : website
      ),
      currentWebsite:
        state.currentWebsite?.id === websiteId
          ? normalizeWebsiteData({
              ...state.currentWebsite,
              domains: {
                ...(state.currentWebsite.domains || getDefaultDomainSettings({
                  userId: state.currentWebsite.userId,
                  websiteId: state.currentWebsite.id,
                })),
                status: 'verifying',
                verificationError: undefined,
              },
              updatedAt: new Date(),
            })
          : state.currentWebsite,
    }));
  },

  completeDomainVerification: (websiteId, result) => {
    set((state) => ({
      websites: state.websites.map((website) =>
        website.id === websiteId
          ? normalizeWebsiteData({
              ...website,
              domains: {
                ...(website.domains || getDefaultDomainSettings({ userId: website.userId, websiteId: website.id })),
                status: result.success ? 'connected' : 'error',
                lastVerifiedAt: result.verifiedAt,
                verificationError: result.success ? undefined : result.message,
              },
              updatedAt: new Date(),
            })
          : website
      ),
      currentWebsite:
        state.currentWebsite?.id === websiteId
          ? normalizeWebsiteData({
              ...state.currentWebsite,
              domains: {
                ...(state.currentWebsite.domains || getDefaultDomainSettings({
                  userId: state.currentWebsite.userId,
                  websiteId: state.currentWebsite.id,
                })),
                status: result.success ? 'connected' : 'error',
                lastVerifiedAt: result.verifiedAt,
                verificationError: result.success ? undefined : result.message,
              },
              updatedAt: new Date(),
            })
          : state.currentWebsite,
    }));
  },

  verifyCustomDomain: async (websiteId) => {
    const website = get().websites.find((entry) => entry.id === websiteId);
    const customDomain = website?.domains?.customDomain;

    if (!website || !customDomain) {
      return false;
    }

    get().startDomainVerification(websiteId);
    const result = await domainVerificationProvider.verifyDomain(customDomain, website.domains?.expectedDnsRecords || []);
    get().completeDomainVerification(websiteId, result);
    return result.success;
  },

  disconnectCustomDomain: (websiteId) => {
    set((state) => ({
      websites: state.websites.map((website) =>
        website.id === websiteId
          ? normalizeWebsiteData({
              ...website,
              domain: undefined,
              domains: {
                ...(website.domains || getDefaultDomainSettings({ userId: website.userId, websiteId: website.id })),
                customDomain: undefined,
                status: 'not_started',
                expectedDnsRecords: [],
                verificationToken: undefined,
                verificationError: undefined,
                lastVerifiedAt: undefined,
              },
              updatedAt: new Date(),
            })
          : website
      ),
      currentWebsite:
        state.currentWebsite?.id === websiteId
          ? normalizeWebsiteData({
              ...state.currentWebsite,
              domain: undefined,
              domains: {
                ...(state.currentWebsite.domains || getDefaultDomainSettings({
                  userId: state.currentWebsite.userId,
                  websiteId: state.currentWebsite.id,
                })),
                customDomain: undefined,
                status: 'not_started',
                expectedDnsRecords: [],
                verificationToken: undefined,
                verificationError: undefined,
                lastVerifiedAt: undefined,
              },
              updatedAt: new Date(),
            })
          : state.currentWebsite,
    }));
  },
}),
    {
      name: 'website-storage',
      version: 2,
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (error) {
            // Prevent quota exceptions from crashing the UI.
            console.error('Failed to persist website state:', error);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
      // Avoid persisting duplicated website payloads; currentWebsite is derivable.
      partialize: (state) => ({
        websites: state.websites,
      }),
      migrate: (persistedState: any) => {
        const state = persistedState as Partial<WebsiteState> | undefined;
        return {
          websites: Array.isArray(state?.websites) ? state!.websites : [],
        };
      },
    }
  )
);
