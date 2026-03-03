'use client';

import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CollectionImage } from '@/lib/types';

interface LightboxProps {
  images: CollectionImage[];
  initialIndex: number;
  onClose: () => void;
  showCaptions: boolean;
}

export function Lightbox({ images, initialIndex, onClose, showCaptions }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentImage = images[currentIndex];

  useEffect(() => {
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, images.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      {/* Image Container */}
      <div className="max-w-[90vw] max-h-[90vh] flex flex-col items-center justify-center">
        <img
          src={currentImage.url}
          alt={currentImage.caption || `Image ${currentIndex + 1}`}
          className="max-w-full max-h-[80vh] object-contain transition-opacity duration-300"
          style={{ objectFit: 'contain' }}
        />

        {/* Caption */}
        {showCaptions && currentImage.caption && (
          <div className="mt-4 px-6 py-3 rounded-lg bg-white/10 text-white text-center max-w-2xl backdrop-blur-sm">
            <p className="text-sm">{currentImage.caption}</p>
          </div>
        )}
      </div>

      {/* Touch Gestures Hint for Mobile */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs md:hidden">
        Swipe left or right to navigate
      </div>
    </div>
  );
}
