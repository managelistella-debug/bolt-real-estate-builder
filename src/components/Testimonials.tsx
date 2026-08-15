"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { Testimonial } from "@/lib/testimonials";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const items = testimonials.length > 0 ? testimonials : [];

  const paginate = useCallback((newDirection: number) => {
    if (items.length === 0) return;
    setDirection(newDirection);
    setCurrent((prev) => {
      const next = prev + newDirection;
      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;
      return next;
    });
  }, [items.length]);

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 parallax-bg"
        style={{ backgroundImage: "url(/images/homepage-testimonial-bg.webp)" }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-16 md:py-24 lg:py-[150px]">
        <ScrollReveal>
          <div className="max-w-[900px] mx-auto text-center">
            <h2
              className="font-heading text-[36px] md:text-[50px] gold-gradient-text leading-[44px] md:leading-[60px]"
              style={{ fontWeight: 400 }}
            >
              Testimonials
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-10 md:mt-14 lg:mt-[60px] max-w-[800px] mx-auto">
          <div className="relative h-[320px] sm:h-[280px] md:h-[260px] flex items-center overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction < 0 ? 300 : -300 }}
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 30 },
                  opacity: { duration: 0.25 },
                }}
                className="w-full flex flex-col items-center text-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/stars.svg" alt="5 stars" width={135} height={18} className="mb-6 md:mb-8" />

                <p
                  className="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] font-normal"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {items[current]?.quote || "No testimonials available yet."}
                </p>

                <p
                  className="mt-6 md:mt-8 text-white text-[14px] md:text-[16px] leading-[24px] font-normal"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {items[current]?.author || ""}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {items.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-8 md:mt-10">
            <button
              onClick={() => paginate(-1)}
              className="shrink-0 w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity duration-300"
              aria-label="Previous testimonial"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/arrow-left.svg" alt="Previous" width={24} height={24} />
            </button>

            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === current ? "gold-gradient-bg" : "bg-white/20"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="shrink-0 w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity duration-300"
              aria-label="Next testimonial"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/arrow-left.svg"
                alt="Next"
                width={24}
                height={24}
                className="scale-x-[-1]"
              />
            </button>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
