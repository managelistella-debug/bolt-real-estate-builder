import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ImageCollection, CollectionImage } from '@/lib/types';

interface ImageCollectionsState {
  collections: ImageCollection[];
  addCollection: (collection: Omit<ImageCollection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCollection: (id: string, updates: Partial<Omit<ImageCollection, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteCollection: (id: string) => void;
  addImageToCollection: (collectionId: string, image: Omit<CollectionImage, 'order'>) => void;
  removeImageFromCollection: (collectionId: string, imageId: string) => void;
  updateImageOrder: (collectionId: string, images: CollectionImage[]) => void;
  updateImageCaption: (collectionId: string, imageId: string, caption: string) => void;
  getCollectionById: (id: string) => ImageCollection | undefined;
}

export const useImageCollectionsStore = create<ImageCollectionsState>()(
  persist(
    (set, get) => ({
      collections: [],

      addCollection: (collection) => {
        const newCollection: ImageCollection = {
          ...collection,
          id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          collections: [...state.collections, newCollection],
        }));
      },

      updateCollection: (id, updates) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === id
              ? { ...collection, ...updates, updatedAt: new Date() }
              : collection
          ),
        }));
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((collection) => collection.id !== id),
        }));
      },

      addImageToCollection: (collectionId, image) => {
        set((state) => ({
          collections: state.collections.map((collection) => {
            if (collection.id === collectionId) {
              const maxOrder = collection.images.length > 0
                ? Math.max(...collection.images.map((img) => img.order))
                : -1;
              const newImage: CollectionImage = {
                ...image,
                order: maxOrder + 1,
              };
              return {
                ...collection,
                images: [...collection.images, newImage],
                updatedAt: new Date(),
              };
            }
            return collection;
          }),
        }));
      },

      removeImageFromCollection: (collectionId, imageId) => {
        set((state) => ({
          collections: state.collections.map((collection) => {
            if (collection.id === collectionId) {
              return {
                ...collection,
                images: collection.images.filter((img) => img.id !== imageId),
                updatedAt: new Date(),
              };
            }
            return collection;
          }),
        }));
      },

      updateImageOrder: (collectionId, images) => {
        set((state) => ({
          collections: state.collections.map((collection) => {
            if (collection.id === collectionId) {
              return {
                ...collection,
                images: images,
                updatedAt: new Date(),
              };
            }
            return collection;
          }),
        }));
      },

      updateImageCaption: (collectionId, imageId, caption) => {
        set((state) => ({
          collections: state.collections.map((collection) => {
            if (collection.id === collectionId) {
              return {
                ...collection,
                images: collection.images.map((img) =>
                  img.id === imageId ? { ...img, caption } : img
                ),
                updatedAt: new Date(),
              };
            }
            return collection;
          }),
        }));
      },

      getCollectionById: (id) => {
        return get().collections.find((collection) => collection.id === id);
      },
    }),
    {
      name: 'image-collections-storage',
    }
  )
);
