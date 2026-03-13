"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    quote:
      "\" We recently worked with Aspen to purchase a recreational RV lot, and the experience was absolutely fantastic. Aspen was knowledgeable, responsive, and incredibly helpful throughout the entire process. Her knowledge of the RV resort made a big difference-she helped us navigate all the little details that come with buying an RV lot. Aspen was always available to answer questions and made sure everything was handled efficiently and professionally. Thanks to Aspen, we now have the perfect spot to relax and enjoy the outdoors. We couldn't be happier and highly recommend her to anyone looking for a reliable and experienced realtor in the Sundre area! \"",
    author: "Patti Lang",
  },
  {
    quote:
      "\" Aspen made the entire process of selling our family ranch seamless and stress-free. Her understanding of the rural Alberta market is unmatched, and she positioned our property perfectly to attract the right buyers. Within weeks, we had multiple offers above asking price. Her professionalism, communication, and genuine care for her clients sets her apart from anyone else in the industry. We are so grateful for her guidance. \"",
    author: "Brayden & Kayla M.",
  },
  {
    quote:
      "\" Working with Aspen was a game-changer for us. As first-time acreage buyers, we had a lot of questions and concerns. Aspen guided us through every step with patience and expertise. She found us the perfect property that we didn't even know existed. Her local connections and deep knowledge of the area made all the difference. We couldn't recommend her more highly to anyone looking in the Sundre area. \"",
    author: "Mark & Jennifer H.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => {
      const next = prev + newDirection;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  }, []);

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
                  {testimonials[current].quote}
                </p>

                <p
                  className="mt-6 md:mt-8 text-white text-[14px] md:text-[16px] leading-[24px] font-normal"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {testimonials[current].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

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
              {testimonials.map((_, i) => (
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
        </div>
      </div>
    </section>
  );
}
