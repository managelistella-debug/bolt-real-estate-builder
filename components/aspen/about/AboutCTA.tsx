"use client";

import ScrollReveal from "@/components/aspen/ScrollReveal";

export default function AboutCTA() {
  return (
    <section className="relative overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{ backgroundImage: "url(/images/about-cta-bg.webp)" }}
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-16 md:py-20 lg:py-[120px]">
        <div className="max-w-[700px] mx-auto text-center">
          <ScrollReveal>
            <h2
              className="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]"
              style={{ fontWeight: 400 }}
            >
              Connect with Aspen
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p
              className="mt-5 md:mt-8 text-white/80 text-[14px] md:text-[16px] lg:text-[18px] leading-[22px] md:leading-[28px] max-w-[560px] mx-auto"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Ready to start your real estate journey? Whether buying, selling,
              or simply exploring your options, Aspen is here to help.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 md:mt-12">
              <a
                href="/contact"
                className="gold-gradient-bg flex items-center justify-center h-[52px] w-[220px] text-[#09312a] font-semibold text-[14px] md:text-[15px] tracking-wide transition-all duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Get in Touch
              </a>
              <a
                href="tel:4037033909"
                className="flex items-center justify-center h-[52px] w-[220px] border border-white text-white font-semibold text-[14px] md:text-[15px] hover:bg-white/10 transition-all duration-300"
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
