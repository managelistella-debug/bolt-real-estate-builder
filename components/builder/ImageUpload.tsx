'use client';

import { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export function ImageUpload({ value, onChange, label = 'Image', maxSizeMB = 4 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Calculate new dimensions while maintaining aspect ratio
          // Much more aggressive sizing for localStorage limits
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200; // Reduced significantly for localStorage

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Start with quality 0.7 for aggressive compression (localStorage limits)
          let quality = 0.7;
          let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

          // Keep reducing quality until under 800KB (very conservative for localStorage)
          const maxSizeBytes = 800 * 1024;
          while (compressedDataUrl.length > maxSizeBytes && quality > 0.2) {
            quality -= 0.05;
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // Check if still too large
          if (compressedDataUrl.length > maxSizeBytes) {
            reject(new Error('Image is too large even after compression. Please use a much smaller image or a simpler photo with less detail.'));
            return;
          }

          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (jpg, png, gif, webp)',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Compress the image
      const compressedDataUrl = await compressImage(file);
      
      // Calculate compressed size
      const compressedSizeKB = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
      const originalSizeKB = Math.round(file.size / 1024);
      
      console.log('Image compressed successfully:', {
        originalSize: originalSizeKB,
        compressedSize: compressedSizeKB,
        dataUrlLength: compressedDataUrl.length
      });
      
      onChange(compressedDataUrl);
      setIsUploading(false);
      
      toast({
        title: 'Image uploaded successfully',
        description: `Compressed from ${originalSizeKB} KB to ${compressedSizeKB} KB`,
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      setIsUploading(false);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred while uploading',
        variant: 'destructive',
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          
          <p className="text-sm font-medium mb-1">
            {isUploading ? 'Compressing & uploading...' : 'Drop your image here, or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, GIF, WebP (will be compressed for web)
          </p>
        </div>
      ) : (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
            {value.startsWith('data:') || value.startsWith('http') ? (
              <img
                src={value}
                alt="Uploaded image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
