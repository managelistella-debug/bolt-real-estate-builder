"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="overflow-x-clip">
      <Header />

      <section className="relative w-full min-h-[100svh] md:min-h-[700px] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 parallax-bg"
          style={{ backgroundImage: "url(/images/hero-bg.webp)" }}
        />
        <div className="absolute inset-0 bg-[#09312a]/85" />

        <div className="relative z-10 flex flex-col items-center text-center px-5 md:px-10 pt-[70px] md:pt-[99px]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.1,
            }}
            className="text-[#daaf3a] text-[14px] uppercase tracking-[0.2em] mb-4"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Page Not Found
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2,
            }}
            className="font-heading text-[64px] sm:text-[80px] md:text-[120px] lg:text-[150px] leading-[1] gold-gradient-text"
            style={{ fontWeight: 400 }}
          >
            404
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.4,
            }}
            className="mt-4 md:mt-6 text-white/70 text-[15px] md:text-[16px] max-w-[500px] leading-[26px]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            The property you&apos;re looking for doesn&apos;t seem to exist.
            It may have been moved or is no longer available.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.6,
            }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-8 md:mt-10"
          >
            <a
              href="/"
              className="gold-gradient-bg flex items-center justify-center h-[47px] w-[178px] text-[#09312a] font-semibold text-[14px] transition-all duration-300"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Back to Home
            </a>
            <a
              href="/contact"
              className="flex items-center justify-center h-[47px] w-[178px] border border-white text-white font-semibold text-[14px] hover:bg-white/10 transition-all duration-300"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Contact Aspen
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
