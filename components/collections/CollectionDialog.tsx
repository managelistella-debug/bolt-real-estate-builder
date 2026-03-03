'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const darkInput = 'h-[34px] w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-white/30 focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

interface CollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string | null;
}

export function CollectionDialog({ open, onOpenChange, collectionId }: CollectionDialogProps) {
  const { user } = useAuthStore();
  const { addCollection, updateCollection, getCollectionById } = useImageCollectionsStore();
  const { toast } = useToast();
  const [name, setName] = useState('');

  const collection = collectionId ? getCollectionById(collectionId) : null;
  const isEditing = !!collectionId;

  useEffect(() => {
    if (open && collection) setName(collection.name);
    else if (open) setName('');
  }, [open, collection]);

  const handleSave = () => {
    if (!name.trim()) { toast({ title: 'Error', description: 'Collection name is required', variant: 'destructive' }); return; }
    if (!user?.id) { toast({ title: 'Error', description: 'You must be logged in to create a collection', variant: 'destructive' }); return; }

    if (isEditing && collectionId) {
      updateCollection(collectionId, { name: name.trim() });
      toast({ title: 'Success', description: 'Collection updated successfully' });
    } else {
      addCollection({ userId: user.id, name: name.trim(), images: [] });
      toast({ title: 'Success', description: 'Collection created successfully' });
    }
    onOpenChange(false);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Collection' : 'Create New Collection'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the name of your image collection.' : 'Give your image collection a name. You can add images after creating it.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <label className="text-[13px] text-white/50">Collection Name</label>
            <input
              placeholder="e.g., Product Photos, Portfolio, Gallery"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              className={darkInput}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="gap-1.5">
          <button type="button" onClick={() => { onOpenChange(false); setName(''); }} className="h-[30px] rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/50 hover:bg-white/10 hover:text-white">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="h-[30px] rounded-lg bg-[#DAFF07] px-4 text-[13px] text-black hover:bg-[#C8ED00]">
            {isEditing ? 'Update' : 'Create'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
