"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "../ScrollReveal";
import { Testimonial } from "@/lib/testimonials";

interface AboutTestimonialsProps {
  testimonials: Testimonial[];
}

export default function AboutTestimonials({ testimonials }: AboutTestimonialsProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const items = testimonials.length > 0 ? testimonials : [];

  const paginate = useCallback((newDir: number) => {
    if (items.length === 0) return;
    setDirection(newDir);
    setCurrent((prev) => {
      const next = prev + newDir;
      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;
      return next;
    });
  }, [items.length]);

  return (
    <section className="bg-[#09312a]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[100px]">
        <ScrollReveal>
          <div className="max-w-[900px] mx-auto text-center">
            <h2
              className="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]"
              style={{ fontWeight: 400 }}
            >
              What Clients Say
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-10 md:mt-14 lg:mt-[60px] max-w-[800px] mx-auto">
          <div className="relative h-[300px] sm:h-[260px] md:h-[240px] flex items-center overflow-hidden">
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
                className="w-full text-center"
              >
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-6 md:mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="url(#starGrad)"
                      />
                      <defs>
                        <linearGradient
                          id="starGrad"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#daaf3a" />
                          <stop offset="50%" stopColor="#ffebaf" />
                          <stop offset="100%" stopColor="#c9a84c" />
                        </linearGradient>
                      </defs>
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="text-white/80 text-[15px] md:text-[17px] leading-[24px] md:leading-[30px] italic"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  &ldquo;{items[current]?.quote || "No testimonials available yet."}&rdquo;
                </p>

                {/* Author */}
                <p
                  className="mt-6 md:mt-8 font-heading text-[16px] md:text-[18px] gold-gradient-text"
                  style={{ fontWeight: 400 }}
                >
                  {items[current]?.author || ""}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {items.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-8 md:mt-10">
            <button
              onClick={() => paginate(-1)}
              className="shrink-0 w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity duration-300"
              aria-label="Previous"
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
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? "gold-gradient-bg" : "bg-white/20"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="shrink-0 w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity duration-300"
              aria-label="Next"
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
