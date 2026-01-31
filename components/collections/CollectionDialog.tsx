'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface CollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string | null;
}

export function CollectionDialog({ open, onOpenChange, collectionId }: CollectionDialogProps) {
  const { user } = useAuthStore();
  const { collections, addCollection, updateCollection, getCollectionById } = useImageCollectionsStore();
  const { toast } = useToast();
  const [name, setName] = useState('');

  const collection = collectionId ? getCollectionById(collectionId) : null;
  const isEditing = !!collectionId;

  useEffect(() => {
    if (open && collection) {
      setName(collection.name);
    } else if (open) {
      setName('');
    }
  }, [open, collection]);

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Collection name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a collection',
        variant: 'destructive',
      });
      return;
    }

    if (isEditing && collectionId) {
      updateCollection(collectionId, { name: name.trim() });
      toast({
        title: 'Success',
        description: 'Collection updated successfully',
      });
    } else {
      addCollection({
        userId: user.id,
        name: name.trim(),
        images: [],
      });
      toast({
        title: 'Success',
        description: 'Collection created successfully',
      });
    }

    onOpenChange(false);
    setName('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Collection' : 'Create New Collection'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the name of your image collection.'
              : 'Give your image collection a name. You can add images after creating it.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="collection-name">Collection Name</Label>
            <Input
              id="collection-name"
              placeholder="e.g., Product Photos, Portfolio, Gallery"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{isEditing ? 'Update' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
