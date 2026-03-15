"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutHero() {
  const [imageHovered, setImageHovered] = useState(false);

  return (
    <section className="bg-[#09312a]">
      {/* Spacer for fixed header */}
      <div className="h-[70px] md:h-[99px]" />

      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-stretch">
        {/* Left: Portrait */}
        <div className="w-full lg:w-[50%] shrink-0">
          <div
            className="relative w-full h-[400px] sm:h-[500px] lg:h-[700px] overflow-hidden"
            onMouseEnter={() => setImageHovered(true)}
            onMouseLeave={() => setImageHovered(false)}
          >
            <motion.div
              animate={{ scale: imageHovered ? 1.03 : 1 }}
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
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </div>
        </div>

        {/* Right: Intro */}
        <div className="flex-1 flex flex-col justify-center px-5 md:px-10 lg:pl-[80px] lg:pr-[60px] py-10 md:py-16 lg:py-[80px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3,
            }}
          >
            <span
              className="text-white font-heading text-[14px] md:text-[16px]"
              style={{ fontWeight: 400 }}
            >
              Meet Your Realtor
            </span>

            <h1
              className="font-heading text-[36px] sm:text-[44px] md:text-[56px] lg:text-[64px] gold-gradient-text leading-[1.1] mt-3 md:mt-4"
              style={{ fontWeight: 400 }}
            >
              Aspen Muraski
            </h1>

            <div className="w-[60px] h-[2px] gold-gradient-bg mt-6 md:mt-8 mb-6 md:mb-8" />

            <p
              className="text-white/80 text-[15px] md:text-[17px] leading-[24px] md:leading-[28px] max-w-[520px]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Based in Mountain View County, Aspen pairs deep local knowledge
              with a strategic approach to real estate. She knows that successful
              outcomes come from thoughtful pricing and smart marketing that puts
              a property in front of the right audience.
            </p>

            <p
              className="mt-5 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] max-w-[520px]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              With a focus on acreages, farms, and residential homes, Aspen
              understands the nuances of rural real estate and manages each
              transaction with professionalism, care, and attention to detail.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
