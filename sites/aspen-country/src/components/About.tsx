"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function About() {
  const [imageHovered, setImageHovered] = useState(false);

  return (
    <section
      id="about"
      className="bg-[#113d35] border-t border-b border-[#daaf3a]"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-stretch">
        {/* Image - flush left on desktop, full width on mobile */}
        <ScrollReveal direction="left" className="w-full lg:w-[696px] shrink-0">
          <div
            className="relative w-full h-[300px] sm:h-[400px] lg:h-[652px] overflow-hidden"
            onMouseEnter={() => setImageHovered(true)}
            onMouseLeave={() => setImageHovered(false)}
          >
            <motion.div
              animate={{ scale: imageHovered ? 1.04 : 1 }}
              transition={{
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute inset-0"
            >
              <Image
                src="/images/about-image.webp"
                alt="Aspen Muraski"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 696px"
              />
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Content - right side */}
        <div className="flex-1 flex flex-col justify-center px-5 md:px-10 lg:pl-[96px] lg:pr-[60px] py-10 md:py-16 lg:py-0">
          <ScrollReveal direction="right">
            <div className="lg:w-[588px]">
              <h2
                className="font-heading text-[32px] sm:text-[42px] md:text-[50px] gold-gradient-text leading-[1.2] md:leading-[60px]"
                style={{ fontWeight: 400 }}
              >
                Meet Aspen Muraski
              </h2>

              <div className="mt-5 md:mt-[25.565px]">
                <p
                  className="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] font-normal"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Based in Sundre and serving the greater Mountain View County
                  area, Aspen pairs deep local knowledge with a strategic
                  approach to real estate. She knows that successful outcomes
                  come from thoughtful pricing and smart marketing that puts a
                  property in front of the right audience.
                </p>
                <p
                  className="mt-4 text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] font-normal"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  With a focus on acreages, farms, and residential homes, Aspen
                  understands the nuances of rural real estate and manages each
                  transaction with professionalism, care, and attention to
                  detail. Her goal is simple: to make sure every property is
                  handled with precision and sold with confidence.
                </p>
              </div>

              <a
                href="/about"
                className="inline-flex items-center justify-center mt-6 md:mt-[38px] gold-gradient-bg h-[47px] w-[178px] text-[#09312a] font-semibold text-[14px] transition-all duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Learn More
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
