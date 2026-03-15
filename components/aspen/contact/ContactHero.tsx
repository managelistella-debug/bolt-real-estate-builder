"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative w-full h-[50svh] md:h-[400px] overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{ backgroundImage: "url(/images/contact-banner.webp)" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 md:px-10 lg:px-[60px] text-center pt-[70px] md:pt-[99px]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.3,
          }}
          className="font-heading text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.13] text-white max-w-[800px] text-center"
          style={{ fontWeight: 400 }}
        >
          Get in Touch
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.5,
          }}
          className="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] max-w-[500px] leading-[24px] font-normal text-center"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          Have a question or ready to start your real estate journey? Aspen
          would love to hear from you.
        </motion.p>
      </div>
    </section>
  );
}
