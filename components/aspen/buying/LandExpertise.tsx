"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/aspen/ScrollReveal";

const expertiseAreas = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M20 4L4 14V36H36V14L20 4Z"
          stroke="url(#grad1)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 20H28M12 26H28M12 32H28"
          stroke="url(#grad1)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 14L20 6L32 14"
          stroke="url(#grad1)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#daaf3a" />
            <stop offset="50%" stopColor="#ffebaf" />
            <stop offset="100%" stopColor="#9d7500" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Due Diligence",
    description:
      "Thorough investigation of every property before you commit. Aspen reviews land titles, surveys, environmental reports, and legal encumbrances to ensure you have a complete picture. No detail is too small when it comes to protecting your investment.",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="2"
          stroke="url(#grad2)"
          strokeWidth="1.5"
        />
        <path
          d="M4 14H36M14 4V36M24 4V36M4 24H36"
          stroke="url(#grad2)"
          strokeWidth="1.5"
        />
        <circle cx="9" cy="9" r="2" fill="url(#grad2)" opacity="0.5" />
        <circle cx="29" cy="29" r="2" fill="url(#grad2)" opacity="0.5" />
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#daaf3a" />
            <stop offset="50%" stopColor="#ffebaf" />
            <stop offset="100%" stopColor="#9d7500" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Zoning & Land Use",
    description:
      "Understanding zoning regulations is critical, especially for rural and agricultural properties. Aspen navigates municipal bylaws, land use designations, and development permits to ensure your intended use aligns with local regulations and future plans.",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M4 36L12 20L20 28L28 12L36 4"
          stroke="url(#grad3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 36H36"
          stroke="url(#grad3)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="20" r="3" stroke="url(#grad3)" strokeWidth="1.5" />
        <circle cx="28" cy="12" r="3" stroke="url(#grad3)" strokeWidth="1.5" />
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#daaf3a" />
            <stop offset="50%" stopColor="#ffebaf" />
            <stop offset="100%" stopColor="#9d7500" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Acreage Considerations",
    description:
      "Buying acreage is different from purchasing a residential home. Aspen evaluates soil quality, topography, access roads, fencing, and property boundaries. She understands the unique considerations that come with rural properties and helps you make confident decisions.",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M20 4C20 4 8 12 8 22C8 28.627 13.373 34 20 34C26.627 34 32 28.627 32 22C32 12 20 4 20 4Z"
          stroke="url(#grad4)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M20 14C20 14 14 18 14 23C14 26.314 16.686 29 20 29C23.314 29 26 26.314 26 23C26 18 20 14 20 14Z"
          stroke="url(#grad4)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.6"
        />
        <defs>
          <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#daaf3a" />
            <stop offset="50%" stopColor="#ffebaf" />
            <stop offset="100%" stopColor="#9d7500" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Water Rights & Utilities",
    description:
      "Water access can make or break a rural property purchase. Aspen investigates water rights, well permits, septic systems, and utility availability — including power, gas, and internet connectivity — so you know exactly what you're getting before closing.",
  },
];

function ExpertiseCard({
  item,
  index,
}: {
  item: (typeof expertiseAreas)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollReveal delay={index * 0.12}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          borderColor: hovered ? "#daaf3a" : "rgba(218, 175, 58, 0.2)",
        }}
        transition={{ duration: 0.4 }}
        className="relative border border-[rgba(218,175,58,0.2)] bg-[#09312a] p-6 md:p-8 lg:p-10 h-full flex flex-col"
      >
        {/* Icon */}
        <div className="mb-5 md:mb-6">{item.icon}</div>

        {/* Title */}
        <h3
          className="font-heading text-[22px] md:text-[26px] lg:text-[28px] text-white leading-[1.2]"
          style={{ fontWeight: 400 }}
        >
          {item.title}
        </h3>

        {/* Gold accent line */}
        <motion.div
          animate={{ width: hovered ? "60px" : "40px" }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-[2px] gold-gradient-bg mt-4 mb-4 md:mb-5"
        />

        {/* Description */}
        <p
          className="text-white/70 text-[14px] md:text-[15px] leading-[22px] md:leading-[24px] flex-1"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {item.description}
        </p>
      </motion.div>
    </ScrollReveal>
  );
}

export default function LandExpertise() {
  return (
    <section className="bg-[#113d35] border-t border-b border-[#daaf3a]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
        {/* Section Heading */}
        <ScrollReveal>
          <div className="text-center max-w-[800px] mx-auto">
            <h2
              className="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]"
              style={{ fontWeight: 400 }}
            >
              Land & Estate Expertise
            </h2>
            <p
              className="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Purchasing rural property requires specialized knowledge that goes
              beyond a standard real estate transaction. Aspen&apos;s deep understanding
              of land and estate properties ensures every angle is covered.
            </p>
          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="mt-10 md:mt-14 lg:mt-[70px] grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
          {expertiseAreas.map((item, i) => (
            <ExpertiseCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
