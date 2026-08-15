"use client";

import { motion } from "framer-motion";

export default function BuyingHero() {
  return (
    <section className="relative w-full min-h-[85svh] md:min-h-0 md:h-[600px] overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{ backgroundImage: "url(/images/buying-hero.webp)" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 md:px-10 lg:px-[60px] text-center pt-[80px] pb-[40px] md:pt-[99px] md:pb-0">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.3,
          }}
          className="font-heading text-[36px] sm:text-[48px] md:text-[64px] lg:text-[74px] leading-[1.13] lg:leading-[84px] text-white max-w-[900px] text-center"
          style={{ fontWeight: 400 }}
        >
          Buying with Aspen
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.6,
          }}
          className="mt-6 md:mt-[39px] text-white text-[14px] md:text-[16px] max-w-[696px] leading-[24px] font-normal text-center"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          Whether you&apos;re looking for a sprawling acreage, a working ranch, or the perfect
          residential property, Aspen brings expert guidance to every step of your
          buying journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.9,
          }}
        >
          <a
            href="#buying-process"
            className="gold-gradient-bg flex items-center justify-center h-[47px] w-[178px] text-[#09312a] font-semibold text-[14px] transition-all duration-300 mt-6 md:mt-[39px]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Get Started
          </a>
        </motion.div>
      </div>
    </section>
  );
}
