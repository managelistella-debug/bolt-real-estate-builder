'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { Plus, Pencil, Trash2, Images as ImagesIcon } from 'lucide-react';
import { CollectionDialog } from '@/components/collections/CollectionDialog';
import { ImageManager } from '@/components/collections/ImageManager';

export default function CollectionsPage() {
  const { user } = useAuthStore();
  const { deleteCollection, getCollectionsForCurrentUser } = useImageCollectionsStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [managingCollectionId, setManagingCollectionId] = useState<string | null>(null);

  const userCollections = getCollectionsForCurrentUser(user?.id);

  const handleDelete = (collectionId: string) => {
    if (confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      deleteCollection(collectionId);
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <div className="flex items-center justify-between px-6 py-3.5">
          <div>
            <h1 className="text-[15px] font-medium text-black">Image Collections</h1>
            <p className="text-[13px] text-[#888C99]">Manage your image libraries for gallery widgets</p>
          </div>
          <button type="button" onClick={() => setIsCreateDialogOpen(true)} className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]">
            <Plus className="h-3.5 w-3.5" /> Create Collection
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {userCollections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-[#EBEBEB] p-6">
              <ImagesIcon className="h-10 w-10 text-[#CCCCCC]" />
            </div>
            <p className="text-[15px] text-black">No collections yet</p>
            <p className="mt-1 max-w-md text-[13px] text-[#888C99]">Create your first image collection to organize photos for your gallery widgets.</p>
            <button type="button" onClick={() => setIsCreateDialogOpen(true)} className="mt-5 flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]">
              <Plus className="h-3.5 w-3.5" /> Create Your First Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userCollections.map((collection) => (
              <div key={collection.id} className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white transition-colors hover:border-[#DAFF07]/50">
                <div className="group relative aspect-video cursor-pointer bg-[#F5F5F3]" onClick={() => setManagingCollectionId(collection.id)}>
                  {collection.images.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center"><ImagesIcon className="h-10 w-10 text-[#CCCCCC]" /></div>
                  ) : (
                    <div className="grid h-full grid-cols-2 gap-1 p-1">
                      {collection.images.slice(0, 4).map((image, idx) => (
                        <div key={image.id} className="relative overflow-hidden rounded-lg bg-[#EBEBEB]">
                          <img src={image.url} alt={image.caption || `Image ${idx + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {collection.images.length < 4 && Array.from({ length: 4 - collection.images.length }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="rounded-lg bg-[#EBEBEB]" />
                      ))}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-[13px] font-medium text-white">Manage Images</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="truncate text-[13px] font-medium text-black">{collection.name}</h3>
                  <p className="mb-3 text-[11px] text-[#888C99]">{collection.images.length} {collection.images.length === 1 ? 'image' : 'images'}</p>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => setEditingCollectionId(collection.id)} className="flex h-[28px] flex-1 items-center justify-center gap-1 rounded-lg border border-[#EBEBEB] bg-white text-[12px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(collection.id)} className="flex h-[28px] w-[28px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-[#CCCCCC] hover:bg-[#F5F5F3] hover:text-red-500">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CollectionDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} collectionId={null} />
      <CollectionDialog open={!!editingCollectionId} onOpenChange={(open) => !open && setEditingCollectionId(null)} collectionId={editingCollectionId} />
      <ImageManager open={!!managingCollectionId} onOpenChange={(open) => !open && setManagingCollectionId(null)} collectionId={managingCollectionId} />
    </div>
  );
}
