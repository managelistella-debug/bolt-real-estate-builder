'use client';

import { useState, useRef } from 'react';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { CollectionImage } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, GripVertical, MessageSquare } from 'lucide-react';

interface ImageManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string | null;
}

const MAX_IMAGES = 30;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

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

          // Resize if too large (max 1920px width)
          const maxWidth = 1920;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with quality 0.8
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          // Check if still too large
          const sizeInBytes = (compressedDataUrl.length * 3) / 4;
          if (sizeInBytes > MAX_FILE_SIZE) {
            // Further compress
            resolve(canvas.toDataURL('image/jpeg', 0.6));
          } else {
            resolve(compressedDataUrl);
          }
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
      toast({
        title: 'Maximum images reached',
        description: `You can only have ${MAX_IMAGES} images per collection.`,
        variant: 'destructive',
      });
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not an image file.`,
          variant: 'destructive',
        });
        continue;
      }

      try {
        const compressedUrl = await compressImage(file);
        const newImage: Omit<CollectionImage, 'order'> = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: compressedUrl,
          caption: undefined,
        };
        addImageToCollection(collectionId, newImage);
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        });
      }
    }

    toast({
      title: 'Success',
      description: `${filesToProcess.length} image(s) uploaded successfully`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveImage = (imageId: string) => {
    if (!collectionId) return;
    if (confirm('Are you sure you want to remove this image?')) {
      removeImageFromCollection(collectionId, imageId);
      toast({
        title: 'Success',
        description: 'Image removed successfully',
      });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOverImage = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || !collectionId) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // Update order property
    const reorderedImages = newImages.map((img, idx) => ({ ...img, order: idx }));
    updateImageOrder(collectionId, reorderedImages);
    setDraggedIndex(index);
  };

  const handleEditCaption = (imageId: string, currentCaption?: string) => {
    setEditingCaption(imageId);
    setCaptionText(currentCaption || '');
  };

  const handleSaveCaption = (imageId: string) => {
    if (!collectionId) return;
    updateImageCaption(collectionId, imageId, captionText);
    setEditingCaption(null);
    setCaptionText('');
    toast({
      title: 'Success',
      description: 'Caption updated successfully',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Images - {collection?.name}</DialogTitle>
          <DialogDescription>
            Upload and organize images in your collection. Maximum {MAX_IMAGES} images, up to 4MB each.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Drag and drop images here</p>
            <p className="text-xs text-muted-foreground mb-4">or</p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= MAX_IMAGES}
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <p className="text-xs text-muted-foreground mt-4">
              {images.length} / {MAX_IMAGES} images
            </p>
          </div>

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOverImage(e, index)}
                  className={`relative group border rounded-lg overflow-hidden cursor-move ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  {/* Order Number & Drag Handle */}
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                    <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                    <div className="bg-black/60 text-white p-1 rounded">
                      <GripVertical className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute top-2 right-2 z-10 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Image */}
                  <div className="aspect-square">
                    <img
                      src={image.url}
                      alt={image.caption || `Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Caption */}
                  <div className="p-2 bg-muted">
                    {editingCaption === image.id ? (
                      <div className="flex gap-1">
                        <Input
                          value={captionText}
                          onChange={(e) => setCaptionText(e.target.value)}
                          placeholder="Add caption..."
                          className="h-7 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveCaption(image.id);
                            } else if (e.key === 'Escape') {
                              setEditingCaption(null);
                            }
                          }}
                          autoFocus
                        />
                        <Button size="sm" onClick={() => handleSaveCaption(image.id)} className="h-7 px-2">
                          Save
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditCaption(image.id, image.caption)}
                        className="w-full text-left text-xs truncate hover:bg-accent rounded px-1 py-0.5 flex items-center gap-1"
                      >
                        <MessageSquare className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{image.caption || 'Add caption...'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No images yet. Upload some images to get started.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
