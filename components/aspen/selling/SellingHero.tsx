"use client";

import { motion } from "framer-motion";

export default function SellingHero() {
  return (
    <section className="relative w-full min-h-[85svh] md:min-h-0 md:h-[600px] overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{ backgroundImage: "url(/images/selling-hero.webp)" }}
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
          Selling with Aspen
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
          From strategic pricing to refined marketing, Aspen delivers a
          tailored approach that positions your property in front of the right
          buyers — ensuring a confident, seamless sale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.9,
          }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-[39px] mt-6 md:mt-[39px]"
        >
          <a
            href="#marketing-approach"
            className="gold-gradient-bg flex items-center justify-center h-[47px] w-[178px] text-[#09312a] font-semibold text-[14px] transition-all duration-300"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Our Approach
          </a>
          <a
            href="#consultation"
            className="flex items-center justify-center h-[47px] w-[178px] border border-white text-white font-semibold text-[14px] hover:bg-white/10 transition-all duration-300"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Request Consult
          </a>
        </motion.div>
      </div>
    </section>
  );
}
