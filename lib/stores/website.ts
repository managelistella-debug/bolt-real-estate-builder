import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Website, Page, Section } from '@/lib/types';
import { getDefaultHeaderConfig, normalizeHeaderConfig } from '@/lib/header-config';
import { getDefaultFooterConfig, normalizeFooterConfig } from '@/lib/footer-config';

interface WebsiteState {
  currentWebsite: Website | null;
  websites: Website[];
  getCurrentUserWebsite: () => Website | null;
  initializeUserWebsite: (userId: string) => void;
  setCurrentWebsite: (website: Website) => void;
  updateWebsite: (websiteId: string, updates: Partial<Website>) => void;
  addPage: (page: Page) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  setHomepage: (pageId: string) => void;
}

const normalizePageData = (page: Page): Page => ({
  ...page,
  headerSettings: page.headerSettings || { useCustomHeader: false },
});

const normalizeWebsiteData = (website: Website): Website => ({
  ...website,
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
    // Assuming one website per user, return the first website
    return state.websites.length > 0 ? state.websites[0] : null;
  },

  initializeUserWebsite: (userId: string) => {
    const state = get();
    if (state.websites.length === 0) {
      // Create a default home page
      const defaultHomePage: Page = {
        id: `page-${Date.now()}`,
        websiteId: `website-${userId}`,
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
        id: `website-${userId}`,
        name: 'My Website',
        userId: userId,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const normalizedWebsite = normalizeWebsiteData(defaultWebsite);
      set({ websites: [normalizedWebsite], currentWebsite: normalizedWebsite });
    }
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
}),
    {
      name: 'website-storage',
      version: 1,
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
    }
  )
);
