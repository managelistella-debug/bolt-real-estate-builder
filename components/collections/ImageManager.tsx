'use client';

import { useState, useRef } from 'react';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { CollectionImage } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, GripVertical, MessageSquare, Star } from 'lucide-react';

interface ImageManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string | null;
}

const MAX_IMAGES = 30;
const MAX_FILE_SIZE = 4 * 1024 * 1024;

export function ImageManager({ open, onOpenChange, collectionId }: ImageManagerProps) {
  const { getCollectionById, addImageToCollection, removeImageFromCollection, updateImageOrder, updateImageCaption } =
    useImageCollectionsStore();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const collection = collectionId ? getCollectionById(collectionId) : null;
  const images = collection?.images || [];

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;
          if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const sizeInBytes = (compressedDataUrl.length * 3) / 4;
          resolve(sizeInBytes > MAX_FILE_SIZE ? canvas.toDataURL('image/jpeg', 0.6) : compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !collectionId) return;
    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      toast({ title: 'Maximum images reached', description: `You can only have ${MAX_IMAGES} images per collection.`, variant: 'destructive' });
      return;
    }
    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', description: `${file.name} is not an image file.`, variant: 'destructive' });
        continue;
      }
      try {
        const compressedUrl = await compressImage(file);
        addImageToCollection(collectionId, { id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, url: compressedUrl, caption: undefined });
      } catch {
        toast({ title: 'Upload failed', description: `Failed to upload ${file.name}`, variant: 'destructive' });
      }
    }
    toast({ title: 'Success', description: `${filesToProcess.length} image(s) uploaded successfully` });
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); };

  const handleRemoveImage = (imageId: string) => {
    if (!collectionId) return;
    if (confirm('Are you sure you want to remove this image?')) {
      removeImageFromCollection(collectionId, imageId);
      toast({ title: 'Success', description: 'Image removed successfully' });
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragEnd = () => setDraggedIndex(null);
  const handleDragOverImage = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || !collectionId) return;
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    updateImageOrder(collectionId, newImages.map((img, idx) => ({ ...img, order: idx })));
    setDraggedIndex(index);
  };

  const handleEditCaption = (imageId: string, currentCaption?: string) => { setEditingCaption(imageId); setCaptionText(currentCaption || ''); };
  const handleSaveCaption = (imageId: string) => {
    if (!collectionId) return;
    updateImageCaption(collectionId, imageId, captionText);
    setEditingCaption(null);
    setCaptionText('');
    toast({ title: 'Success', description: 'Caption updated successfully' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Images – {collection?.name}</DialogTitle>
          <DialogDescription>
            Upload and organize images in your collection. Maximum {MAX_IMAGES} images, up to 4MB each.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Drop zone */}
          <div
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${isDragging ? 'border-[#DAFF07] bg-[#DAFF07]/5' : 'border-white/20 bg-white/5'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <Upload className="h-5 w-5 text-white/50" />
            </div>
            <p className="text-[13px] font-medium text-white">Drag and drop images here</p>
            <p className="my-1.5 text-[11px] text-white/30">or</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= MAX_IMAGES}
              className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] disabled:opacity-40"
            >
              Browse Files
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileSelect(e.target.files)} />
            <p className="mt-3 text-[11px] text-white/30">{images.length} / {MAX_IMAGES} images</p>
          </div>

          {/* Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOverImage(e, index)}
                  className={`group relative cursor-move overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-opacity ${draggedIndex === index ? 'opacity-40' : ''}`}
                >
                  <div className="absolute left-2 top-2 z-10 flex items-center gap-1">
                    {index === 0 && (
                      <div className="flex h-6 items-center gap-1 rounded-md bg-[#DAFF07] px-1.5 text-[10px] font-medium text-black">
                        <Star className="h-3 w-3 fill-current" /> Cover
                      </div>
                    )}
                    {index > 0 && (
                      <div className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">#{index + 1}</div>
                    )}
                    <div className="rounded-md bg-black/60 p-0.5 text-white"><GripVertical className="h-3.5 w-3.5" /></div>
                  </div>

                  <button type="button" onClick={() => handleRemoveImage(image.id)} className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500">
                    <X className="h-3 w-3" />
                  </button>

                  <div className="aspect-square">
                    <img src={image.url} alt={image.caption || `Image ${index + 1}`} className="h-full w-full object-cover" />
                  </div>

                  <div className="border-t border-white/10 bg-white/5 p-1.5">
                    {editingCaption === image.id ? (
                      <div className="flex gap-1">
                        <input
                          value={captionText}
                          onChange={(e) => setCaptionText(e.target.value)}
                          placeholder="Add caption..."
                          className="h-6 flex-1 rounded border border-white/10 bg-white/5 px-2 text-[11px] text-white placeholder:text-white/30 focus:border-[#DAFF07] focus:outline-none"
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveCaption(image.id); else if (e.key === 'Escape') setEditingCaption(null); }}
                          autoFocus
                        />
                        <button type="button" onClick={() => handleSaveCaption(image.id)} className="h-6 rounded bg-[#DAFF07] px-2 text-[10px] text-black hover:bg-[#C8ED00]">Save</button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEditCaption(image.id, image.caption)}
                        className="flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-[11px] text-white/50 hover:bg-white/5 hover:text-white/70"
                      >
                        <MessageSquare className="h-2.5 w-2.5 flex-shrink-0" />
                        <span className="truncate">{image.caption || 'Add caption...'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div className="py-6 text-center text-[13px] text-white/30">
              No images yet. Upload some images to get started.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
