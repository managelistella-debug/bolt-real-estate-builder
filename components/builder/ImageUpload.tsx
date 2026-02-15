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
  preserveOriginal?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Image',
  maxSizeMB = 4,
  preserveOriginal = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const readFileAsDataUrl = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const readSvgAsCompactDataUrl = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawSvg = (e.target?.result as string) || '';
        if (!rawSvg) {
          reject(new Error('Failed to read SVG file'));
          return;
        }

        // Lightweight minification to reduce localStorage pressure.
        const compact = rawSvg
          .replace(/>\s+</g, '><')
          .replace(/\s{2,}/g, ' ')
          .trim();

        resolve(`data:image/svg+xml;utf8,${encodeURIComponent(compact)}`);
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsText(file);
    });
  };

  const isSvgFile = (file: File) =>
    file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');

  const compressImage = async (file: File): Promise<string> => {
    // Keep original file data when requested (header logos, SVGs).
    if (preserveOriginal || isSvgFile(file)) {
      if (!file.type.startsWith('image/') && !isSvgFile(file)) {
        throw new Error('Invalid image file type');
      }

      // For non-SVG files, respect max size when preserving original.
      if (!isSvgFile(file) && file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Image is too large. Please upload a file smaller than ${maxSizeMB}MB.`);
      }

      if (isSvgFile(file)) {
        return readSvgAsCompactDataUrl(file);
      }

      return readFileAsDataUrl(file);
    }

    if (file.type === 'image/svg+xml') {
      return new Promise((resolve, reject) => {
        const svgReader = new FileReader();
        svgReader.onload = (e) => resolve((e.target?.result as string) || '');
        svgReader.onerror = () => reject(new Error('Failed to read SVG file'));
        svgReader.readAsDataURL(file);
      });
    }

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

          const preserveTransparency = file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/gif';
          const outputType = preserveTransparency ? 'image/png' : 'image/jpeg';
          let quality = 0.7;
          let compressedDataUrl = preserveTransparency
            ? canvas.toDataURL(outputType)
            : canvas.toDataURL(outputType, quality);

          // Keep reducing quality until under 800KB for lossy outputs.
          const maxSizeBytes = 800 * 1024;
          while (!preserveTransparency && compressedDataUrl.length > maxSizeBytes && quality > 0.2) {
            quality -= 0.05;
            compressedDataUrl = canvas.toDataURL(outputType, quality);
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
    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.svg')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (jpg, png, gif, webp, svg)',
        variant: 'destructive',
      });
      return;
    }

    // Guardrail for oversized uploads regardless of conversion mode.
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Please upload a file smaller than ${maxSizeMB}MB.`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const keepsOriginalData = preserveOriginal || file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');

    try {
      // Convert/compress image depending on mode.
      const compressedDataUrl = await compressImage(file);
      const originalSizeKB = Math.round(file.size / 1024);

      // Yield once so the UI can paint before we set large data URLs.
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      onChange(compressedDataUrl);
      
      toast({
        title: 'Image uploaded successfully',
        description: keepsOriginalData
          ? `Uploaded original file (${originalSizeKB} KB)`
          : 'Image optimized and uploaded successfully',
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred while uploading',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
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
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          
          <p className="text-sm font-medium mb-1">
            {isUploading ? (preserveOriginal ? 'Uploading...' : 'Compressing & uploading...') : 'Drop your image here, or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, GIF, WebP, SVG (optimized for web)
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

// Backward-compatible default export for legacy editors.
export default ImageUpload;
