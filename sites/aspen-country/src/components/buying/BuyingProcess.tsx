"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "../ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Initial Consultation",
    description:
      "We start with a one-on-one conversation to understand your vision — whether it's a family home, a working ranch, or an investment property. Aspen takes the time to learn what matters most to you so every search is focused and efficient.",
    image: "/images/buying-step-1.webp",
  },
  {
    number: "02",
    title: "Property Search & Discovery",
    description:
      "Using deep local knowledge and access to both listed and off-market properties, Aspen curates options that match your criteria. From acreages to residential homes, she ensures you see the right properties — not just every property.",
    image: "/images/buying-step-2.webp",
  },
  {
    number: "03",
    title: "Due Diligence & Evaluation",
    description:
      "Every property is carefully evaluated. Aspen helps you navigate zoning, land titles, water rights, soil conditions, and utility access so there are no surprises. Her expertise in rural properties means nothing gets overlooked.",
    image: "/images/buying-step-3.webp",
  },
  {
    number: "04",
    title: "Negotiation & Offer",
    description:
      "With a strategic approach to pricing and negotiation, Aspen works to secure the best terms on your behalf. She handles the paperwork, coordinates with legal and financial professionals, and keeps you informed every step of the way.",
    image: "/images/buying-step-4.webp",
  },
  {
    number: "05",
    title: "Closing & Beyond",
    description:
      "From the accepted offer through to closing day, Aspen manages every detail to ensure a smooth transaction. And her commitment doesn't end at closing — she remains a trusted resource long after you receive the keys.",
    image: "/images/buying-step-5.webp",
  },
];

function StepCard({
  step,
  index,
  isActive,
  onHover,
}: {
  step: (typeof steps)[0];
  index: number;
  isActive: boolean;
  onHover: (index: number) => void;
}) {
  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.div
        onMouseEnter={() => onHover(index)}
        className={`relative cursor-default border-l-[2px] transition-colors duration-500 pl-6 md:pl-8 py-4 md:py-6 ${
          isActive ? "border-[#daaf3a]" : "border-white/20"
        }`}
      >
        {/* Step number */}
        <span
          className={`font-heading text-[14px] md:text-[16px] tracking-normal uppercase transition-all duration-500 ${
            isActive ? "gold-gradient-text" : "text-white/40"
          }`}
          style={{ fontWeight: 400 }}
        >
          Step {step.number}
        </span>

        {/* Title */}
        <h3
          className={`font-heading text-[22px] md:text-[28px] lg:text-[32px] leading-[1.2] mt-2 transition-colors duration-500 ${
            isActive ? "text-white" : "text-white/60"
          }`}
          style={{ fontWeight: 400 }}
        >
          {step.title}
        </h3>

        {/* Description - animated expand */}
        <motion.div
          initial={false}
          animate={{
            height: isActive ? "auto" : 0,
            opacity: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          <p
            className="text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] mt-3 md:mt-4 max-w-[600px]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {step.description}
          </p>
        </motion.div>
      </motion.div>
    </ScrollReveal>
  );
}

export default function BuyingProcess() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="buying-process"
      className="bg-[#09312a]"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
        {/* Section Heading */}
        <ScrollReveal>
          <h2
            className="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]"
            style={{ fontWeight: 400 }}
          >
            Your Buying Journey
          </h2>
          <p
            className="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] max-w-[700px]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Aspen guides you through every stage of the buying process with
            expertise, transparency, and personal attention to detail.
          </p>
        </ScrollReveal>

        {/* Steps + Sticky Image */}
        <div className="mt-10 md:mt-16 lg:mt-[80px] flex gap-8 xl:gap-[60px]">
          {/* Left: Steps */}
          <div className="flex-1 flex flex-col gap-2 md:gap-4">
            {steps.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                index={i}
                isActive={activeStep === i}
                onHover={setActiveStep}
              />
            ))}
          </div>

          {/* Right: Sticky Image — hidden below xl */}
          <div className="hidden xl:block w-[480px] shrink-0">
            <div className="sticky top-[130px]">
              <div className="relative w-full h-[560px] overflow-hidden border border-[rgba(218,175,58,0.2)]">
                {/* All images stacked, opacity-controlled for smooth crossfade */}
                {steps.map((step, i) => (
                  <motion.div
                    key={step.number}
                    animate={{ opacity: activeStep === i ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="480px"
                      priority
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
