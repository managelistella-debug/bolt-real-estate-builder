"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  const navigate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((prev) => {
        const next = prev + newDirection;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, navigate]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-2 text-[14px]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Close
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 3L13 13M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Counter */}
          <div
            className="absolute top-4 left-4 md:top-6 md:left-6 z-10 text-white/50 text-[14px]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {currentIndex + 1} / {images.length}
          </div>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-[90vw] max-h-[85vh] mx-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 30 },
                  opacity: { duration: 0.25 },
                }}
                className="relative w-full h-full"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`Gallery image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center border border-white/30 hover:border-white/60 bg-black/30 hover:bg-black/50 transition-all duration-300"
            aria-label="Previous image"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/arrow-left.svg"
              alt="Previous"
              width={20}
              height={20}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center border border-white/30 hover:border-white/60 bg-black/30 hover:bg-black/50 transition-all duration-300"
            aria-label="Next image"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/arrow-left.svg"
              alt="Next"
              width={20}
              height={20}
              className="scale-x-[-1]"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
