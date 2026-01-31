'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Images as ImagesIcon } from 'lucide-react';
import { CollectionDialog } from '@/components/collections/CollectionDialog';
import { ImageManager } from '@/components/collections/ImageManager';

export default function CollectionsPage() {
  const { user } = useAuthStore();
  const { collections, deleteCollection } = useImageCollectionsStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [managingCollectionId, setManagingCollectionId] = useState<string | null>(null);

  const userCollections = collections.filter((c) => c.userId === user?.id);

  const handleDelete = (collectionId: string) => {
    if (confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      deleteCollection(collectionId);
    }
  };

  const handleEdit = (collectionId: string) => {
    setEditingCollectionId(collectionId);
  };

  const handleManageImages = (collectionId: string) => {
    setManagingCollectionId(collectionId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold">Image Collections</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your image libraries for gallery widgets
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="flex-1 overflow-auto p-8">
        {userCollections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-6 bg-muted/50 rounded-full mb-4">
              <ImagesIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Create your first image collection to organize photos for your gallery widgets.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCollections.map((collection) => (
              <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Thumbnail Grid */}
                <div
                  className="aspect-video bg-muted relative cursor-pointer group"
                  onClick={() => handleManageImages(collection.id)}
                >
                  {collection.images.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImagesIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1 h-full p-1">
                      {collection.images.slice(0, 4).map((image, idx) => (
                        <div key={image.id} className="relative overflow-hidden bg-muted rounded">
                          <img
                            src={image.url}
                            alt={image.caption || `Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {collection.images.length < 4 &&
                        Array.from({ length: 4 - collection.images.length }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="bg-muted/30 rounded" />
                        ))}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium">Manage Images</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{collection.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {collection.images.length} {collection.images.length === 1 ? 'image' : 'images'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(collection.id)}
                    >
                      <Pencil className="h-3 w-3 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(collection.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CollectionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        collectionId={null}
      />
      <CollectionDialog
        open={!!editingCollectionId}
        onOpenChange={(open) => !open && setEditingCollectionId(null)}
        collectionId={editingCollectionId}
      />
      <ImageManager
        open={!!managingCollectionId}
        onOpenChange={(open) => !open && setManagingCollectionId(null)}
        collectionId={managingCollectionId}
      />
    </div>
  );
}
