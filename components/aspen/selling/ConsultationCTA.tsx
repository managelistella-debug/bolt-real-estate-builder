"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/aspen/ScrollReveal";

export default function ConsultationCTA() {
  return (
    <section id="consultation" className="relative overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{ backgroundImage: "url(/images/selling-cta-bg.webp)" }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-16 md:py-20 lg:py-[120px]">
        <div className="max-w-[800px] mx-auto text-center">
          <ScrollReveal>
            <h2
              className="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]"
              style={{ fontWeight: 400 }}
            >
              Ready to Sell Your Property?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p
              className="mt-5 md:mt-8 text-white/80 text-[14px] md:text-[16px] lg:text-[18px] leading-[22px] md:leading-[28px] max-w-[600px] mx-auto"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Schedule a complimentary property consultation with Aspen to
              discuss your goals, review your property&apos;s market position, and
              outline a personalized selling strategy.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 md:mt-12">
              <motion.a
                href="/contact"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="gold-gradient-bg flex items-center justify-center h-[52px] w-[240px] text-[#09312a] font-semibold text-[14px] md:text-[15px] tracking-wide transition-all duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Request a Consultation
              </motion.a>
              <a
                href="tel:4037033909"
                className="flex items-center justify-center h-[52px] w-[240px] border border-white text-white font-semibold text-[14px] md:text-[15px] hover:bg-white/10 transition-all duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Call 403-703-3909
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
