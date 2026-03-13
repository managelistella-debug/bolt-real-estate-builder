"use client";

import Script from "next/script";
import ScrollReveal from "./ScrollReveal";

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{ backgroundImage: "url(/images/homepage-testimonial-bg.webp)" }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-16 md:py-24 lg:py-[150px]">
        {/* Title */}
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
          <div
            data-bolt-embed="testimonial-feed"
            data-tenant-id="business-1772752217587"
            data-embed-id="embed_1773200711353_fcx8sa"
            className="min-h-[320px]"
            aria-busy="true"
          />
          <Script
            src="https://bolt-real-estate-builder-dereks-projects-6a01aa79.vercel.app/embed/bolt-embed.js"
            strategy="afterInteractive"
          />
        </div>
      </div>
    </section>
  );
}
