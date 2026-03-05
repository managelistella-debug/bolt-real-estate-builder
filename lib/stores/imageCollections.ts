import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ImageCollection, CollectionImage } from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

interface ImageCollectionsState {
  collections: ImageCollection[];
  loaded: boolean;
  loading: boolean;
  fetchCollections: (tenantId: string) => Promise<void>;
  addCollection: (collection: Omit<ImageCollection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCollection: (id: string, updates: Partial<Omit<ImageCollection, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteCollection: (id: string) => void;
  addImageToCollection: (collectionId: string, image: Omit<CollectionImage, 'order'>) => void;
  removeImageFromCollection: (collectionId: string, imageId: string) => void;
  updateImageOrder: (collectionId: string, images: CollectionImage[]) => void;
  updateImageCaption: (collectionId: string, imageId: string, caption: string) => void;
  getCollectionById: (id: string) => ImageCollection | undefined;
  getCollectionsForCurrentUser: (userId?: string) => ImageCollection[];
}

export const useImageCollectionsStore = create<ImageCollectionsState>()(
  persist(
    (set, get) => ({
      collections: [],
      loaded: false,
      loading: false,

      fetchCollections: async () => {
        set({ loaded: true });
      },

      addCollection: (collection) => {
        const newCollection: ImageCollection = {
          ...collection,
          id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ collections: [...state.collections, newCollection] }));
      },

      updateCollection: (id, updates) => {
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== id) return c;
            return { ...c, ...updates, updatedAt: new Date() };
          }),
        }));
      },

      deleteCollection: (id) => {
        set((state) => ({ collections: state.collections.filter((c) => c.id !== id) }));
      },

      addImageToCollection: (collectionId, image) => {
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            const maxOrder = c.images.length > 0 ? Math.max(...c.images.map((img) => img.order)) : -1;
            return { ...c, images: [...c.images, { ...image, order: maxOrder + 1 }], updatedAt: new Date() };
          }),
        }));
      },

      removeImageFromCollection: (collectionId, imageId) => {
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            return { ...c, images: c.images.filter((img) => img.id !== imageId), updatedAt: new Date() };
          }),
        }));
      },

      updateImageOrder: (collectionId, images) => {
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            return { ...c, images, updatedAt: new Date() };
          }),
        }));
      },

      updateImageCaption: (collectionId, imageId, caption) => {
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            return {
              ...c,
              images: c.images.map((img) => (img.id === imageId ? { ...img, caption } : img)),
              updatedAt: new Date(),
            };
          }),
        }));
      },

      getCollectionById: (id) => get().collections.find((c) => c.id === id),

      getCollectionsForCurrentUser: (userId) => {
        const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
        if (!effectiveUserId) return [];
        return get().collections.filter((c) => c.userId === effectiveUserId);
      },
    }),
    {
      name: 'collections-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ collections: state.collections }),
    }
  )
);
