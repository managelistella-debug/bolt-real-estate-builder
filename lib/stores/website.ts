import { create } from 'zustand';
import { Website, Page, Section } from '@/lib/types';

interface WebsiteState {
  currentWebsite: Website | null;
  websites: Website[];
  setCurrentWebsite: (website: Website) => void;
  updateWebsite: (websiteId: string, updates: Partial<Website>) => void;
  addPage: (websiteId: string, page: Page) => void;
  updatePage: (websiteId: string, pageId: string, updates: Partial<Page>) => void;
  deletePage: (websiteId: string, pageId: string) => void;
  duplicatePage: (websiteId: string, pageId: string) => void;
  setHomepage: (websiteId: string, pageId: string) => void;
}

export const useWebsiteStore = create<WebsiteState>((set) => ({
  currentWebsite: null,
  websites: [],
  
  setCurrentWebsite: (website) => {
    set({ currentWebsite: website });
  },
  
  updateWebsite: (websiteId, updates) => {
    set((state) => ({
      websites: state.websites.map(w =>
        w.id === websiteId ? { ...w, ...updates, updatedAt: new Date() } : w
      ),
      currentWebsite: state.currentWebsite?.id === websiteId
        ? { ...state.currentWebsite, ...updates, updatedAt: new Date() }
        : state.currentWebsite,
    }));
  },
  
  addPage: (websiteId, page) => {
    set((state) => {
      const website = state.websites.find(w => w.id === websiteId);
      if (!website) return state;
      
      const updatedWebsite = {
        ...website,
        pages: [...website.pages, page],
        updatedAt: new Date(),
      };
      
      return {
        websites: state.websites.map(w => w.id === websiteId ? updatedWebsite : w),
        currentWebsite: state.currentWebsite?.id === websiteId ? updatedWebsite : state.currentWebsite,
      };
    });
  },
  
  updatePage: (websiteId, pageId, updates) => {
    set((state) => {
      const website = state.websites.find(w => w.id === websiteId);
      if (!website) return state;
      
      const updatedWebsite = {
        ...website,
        pages: website.pages.map(p =>
          p.id === pageId ? { ...p, ...updates, updatedAt: new Date() } : p
        ),
        updatedAt: new Date(),
      };
      
      return {
        websites: state.websites.map(w => w.id === websiteId ? updatedWebsite : w),
        currentWebsite: state.currentWebsite?.id === websiteId ? updatedWebsite : state.currentWebsite,
      };
    });
  },
  
  deletePage: (websiteId, pageId) => {
    set((state) => {
      const website = state.websites.find(w => w.id === websiteId);
      if (!website) return state;
      
      const updatedWebsite = {
        ...website,
        pages: website.pages.filter(p => p.id !== pageId),
        updatedAt: new Date(),
      };
      
      return {
        websites: state.websites.map(w => w.id === websiteId ? updatedWebsite : w),
        currentWebsite: state.currentWebsite?.id === websiteId ? updatedWebsite : state.currentWebsite,
      };
    });
  },
  
  duplicatePage: (websiteId, pageId) => {
    set((state) => {
      const website = state.websites.find(w => w.id === websiteId);
      if (!website) return state;
      
      const pageToDuplicate = website.pages.find(p => p.id === pageId);
      if (!pageToDuplicate) return state;
      
      const duplicatedPage: Page = {
        ...pageToDuplicate,
        id: `page-${Date.now()}`,
        name: `${pageToDuplicate.name} (Copy)`,
        slug: `${pageToDuplicate.slug}-copy`,
        isHomepage: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedWebsite = {
        ...website,
        pages: [...website.pages, duplicatedPage],
        updatedAt: new Date(),
      };
      
      return {
        websites: state.websites.map(w => w.id === websiteId ? updatedWebsite : w),
        currentWebsite: state.currentWebsite?.id === websiteId ? updatedWebsite : state.currentWebsite,
      };
    });
  },
  
  setHomepage: (websiteId, pageId) => {
    set((state) => {
      const website = state.websites.find(w => w.id === websiteId);
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
        websites: state.websites.map(w => w.id === websiteId ? updatedWebsite : w),
        currentWebsite: state.currentWebsite?.id === websiteId ? updatedWebsite : state.currentWebsite,
      };
    });
  },
}));
