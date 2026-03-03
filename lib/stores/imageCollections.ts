import { create } from 'zustand';
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

function rowToCollection(r: any): ImageCollection {
  return {
    id: r.id,
    userId: r.user_id,
    name: r.name,
    images: r.images ?? [],
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

function collectionToRow(c: ImageCollection) {
  const tenantId = (c as any).tenantId || c.userId;
  return {
    id: c.id,
    tenant_id: tenantId,
    user_id: c.userId,
    name: c.name,
    images: c.images,
    created_at: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    updated_at: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
  };
}

function persistToApi(row: ReturnType<typeof collectionToRow>) {
  fetch('/api/data/collections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  }).catch(() => undefined);
}

function deleteFromApi(id: string) {
  fetch(`/api/data/collections?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => undefined);
}

export const useImageCollectionsStore = create<ImageCollectionsState>()(
  (set, get) => ({
    collections: [],
    loaded: false,
    loading: false,

    fetchCollections: async (tenantId) => {
      if (get().loading) return;
      set({ loading: true });
      try {
        const res = await fetch(`/api/data/collections?tenantId=${encodeURIComponent(tenantId)}`);
        if (!res.ok) throw new Error('fetch failed');
        const rows = await res.json();
        set({ collections: rows.map(rowToCollection), loaded: true });
      } catch {
        set({ loaded: true });
      } finally {
        set({ loading: false });
      }
    },

    addCollection: (collection) => {
      const newCollection: ImageCollection = {
        ...collection,
        id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set((state) => ({ collections: [...state.collections, newCollection] }));
      persistToApi(collectionToRow(newCollection));
    },

    updateCollection: (id, updates) => {
      let updated: ImageCollection | undefined;
      set((state) => ({
        collections: state.collections.map((c) => {
          if (c.id !== id) return c;
          updated = { ...c, ...updates, updatedAt: new Date() };
          return updated;
        }),
      }));
      if (updated) persistToApi(collectionToRow(updated));
    },

    deleteCollection: (id) => {
      set((state) => ({ collections: state.collections.filter((c) => c.id !== id) }));
      deleteFromApi(id);
    },

    addImageToCollection: (collectionId, image) => {
      let updated: ImageCollection | undefined;
      set((state) => ({
        collections: state.collections.map((c) => {
          if (c.id !== collectionId) return c;
          const maxOrder = c.images.length > 0 ? Math.max(...c.images.map((img) => img.order)) : -1;
          updated = { ...c, images: [...c.images, { ...image, order: maxOrder + 1 }], updatedAt: new Date() };
          return updated;
        }),
      }));
      if (updated) persistToApi(collectionToRow(updated));
    },

    removeImageFromCollection: (collectionId, imageId) => {
      let updated: ImageCollection | undefined;
      set((state) => ({
        collections: state.collections.map((c) => {
          if (c.id !== collectionId) return c;
          updated = { ...c, images: c.images.filter((img) => img.id !== imageId), updatedAt: new Date() };
          return updated;
        }),
      }));
      if (updated) persistToApi(collectionToRow(updated));
    },

    updateImageOrder: (collectionId, images) => {
      let updated: ImageCollection | undefined;
      set((state) => ({
        collections: state.collections.map((c) => {
          if (c.id !== collectionId) return c;
          updated = { ...c, images, updatedAt: new Date() };
          return updated;
        }),
      }));
      if (updated) persistToApi(collectionToRow(updated));
    },

    updateImageCaption: (collectionId, imageId, caption) => {
      let updated: ImageCollection | undefined;
      set((state) => ({
        collections: state.collections.map((c) => {
          if (c.id !== collectionId) return c;
          updated = {
            ...c,
            images: c.images.map((img) => (img.id === imageId ? { ...img, caption } : img)),
            updatedAt: new Date(),
          };
          return updated;
        }),
      }));
      if (updated) persistToApi(collectionToRow(updated));
    },

    getCollectionById: (id) => get().collections.find((c) => c.id === id),

    getCollectionsForCurrentUser: (userId) => {
      const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
      if (!effectiveUserId) return [];
      return get().collections.filter((c) => c.userId === effectiveUserId);
    },
  })
);
