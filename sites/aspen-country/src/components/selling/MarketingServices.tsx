"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "../ScrollReveal";

const services = [
  {
    label: "Captivating",
    title: "Property Photography",
    description:
      "Aspen's skilled photographers expertly capture the unique character and allure of your property. With a meticulous eye and years of experience, they create stunning visuals for print and online, showcasing your home's elegance to perfection.",
    image: "/images/photography.webp",
  },
  {
    label: "Cinematic",
    title: "Videography Services",
    description:
      "With refined videography expertise, Aspen presents your property through immersive video tours. These professionally crafted videos create a compelling visual journey, allowing buyers to experience the ambiance and flow of your home, sparking immediate interest.",
    image: "/images/videography.webp",
  },
  {
    label: "Exclusive",
    title: "Open House Experiences",
    description:
      "Aspen orchestrates exceptional open houses and private viewings, inviting discerning buyers to experience your property's charm through insightful presentations and neighborhood highlights, helping buyers envision life in their future home.",
    image: "/images/open-houses.webp",
  },
  {
    label: "Influential",
    title: "Digital Showcasing",
    description:
      "Aspen elevates your property's visibility through prime placements on leading real estate platforms nationwide. Exposure on prominent sites like Realtor.ca positions your home before an expansive, targeted audience of interested buyers.",
    image: "/images/digital-showcasing.webp",
  },
  {
    label: "Refined",
    title: "Print Marketing",
    description:
      "Aspen utilizes high-quality postcards, brochures, and direct mail to capture attention within the community. With carefully crafted designs and a strategic local reach, she ensures your property garners interest from serious buyers right from the initial market launch.",
    image: "/images/print-marketing.webp",
  },
  {
    label: "Expansive",
    title: "Social Media Reach",
    description:
      "Aspen broadens your listing's presence through a powerful combination of organic posts and paid social media ads. With tailored campaigns on Instagram and Facebook, she connects your property with engaged buyers actively seeking their next home.",
    image: "/images/social-media-reach.webp",
  },
  {
    label: "Optimized",
    title: "Email Campaigns",
    description:
      "Aspen leverages a vast network of agents, brokers, and eager buyers in a finely tuned email campaign. Through direct outreach, your listing reaches well-qualified local contacts, ensuring your property is seen by those most likely to act promptly.",
    image: "/images/email-campaigns.webp",
  },
  {
    label: "Comprehensive",
    title: "Floor Plan Visuals",
    description:
      "Aspen provides meticulously designed floor plans that allow potential buyers to understand the layout of your property. These detailed visuals offer a comprehensive view, simplifying decision-making and helping buyers envision themselves in the space.",
    image: "/images/floor-plans.webp",
  },
];

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-[44px] h-[44px] md:w-[52px] md:h-[52px] border border-[#daaf3a] flex items-center justify-center hover:bg-[rgba(218,175,58,0.1)] transition-colors duration-300"
      aria-label={direction === "left" ? "Previous" : "Next"}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className={direction === "right" ? "scale-x-[-1]" : ""}
      >
        <path
          d="M11.25 3.75L5.25 9L11.25 14.25"
          stroke="#daaf3a"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function MarketingServices() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((newDir: number) => {
    setDirection(newDir);
    setCurrent((prev) => {
      const next = prev + newDir;
      if (next < 0) return services.length - 1;
      if (next >= services.length) return 0;
      return next;
    });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  // Preload all images
  useEffect(() => {
    services.forEach((s) => {
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  const service = services[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  return (
    <section id="marketing-approach" className="bg-[#09312a]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
        {/* Section Heading */}
        <ScrollReveal>
          <h2
            className="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]"
            style={{ fontWeight: 400 }}
          >
            Aspen&apos;s Marketing Approach
          </h2>
          <p
            className="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] max-w-[700px]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            A comprehensive, multi-channel strategy designed to showcase your
            property to the right audience and maximize its value.
          </p>
        </ScrollReveal>

        {/* Slider */}
        <ScrollReveal delay={0.15}>
          <div className="mt-10 md:mt-14 lg:mt-[70px]">
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-0 border border-[rgba(218,175,58,0.2)]">
              {/* Image side */}
              <div className="relative w-full lg:w-[55%] aspect-[16/9] lg:aspect-auto lg:h-[520px] overflow-hidden bg-[#113d35]">
                {/* Preload all images hidden behind active */}
                {services.map((s) => (
                  <Image
                    key={s.image}
                    src={s.image}
                    alt=""
                    fill
                    className="object-cover opacity-0 pointer-events-none"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                    aria-hidden="true"
                  />
                ))}

                {/* Active image crossfade */}
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/15" />
                  </motion.div>
                </AnimatePresence>

                {/* Counter overlay */}
                <div className="absolute bottom-4 left-5 md:bottom-6 md:left-6 z-10">
                  <span
                    className="font-heading text-[14px] text-white/60 tracking-normal"
                    style={{ fontWeight: 400 }}
                  >
                    {String(current + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Content side */}
              <div className="flex-1 flex flex-col justify-between bg-[#113d35] p-6 md:p-8 lg:p-10 xl:p-[60px] min-h-[300px] lg:min-h-0">
                <div className="flex-1 flex flex-col justify-center">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={current}
                      custom={direction}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      {/* Label */}
                      <span
                        className="gold-gradient-text font-heading text-[14px] md:text-[16px] tracking-normal"
                        style={{ fontWeight: 400 }}
                      >
                        {service.label}
                      </span>

                      {/* Title */}
                      <h3
                        className="font-heading text-[28px] md:text-[34px] lg:text-[40px] text-white leading-[1.15] mt-2 md:mt-3"
                        style={{ fontWeight: 400 }}
                      >
                        {service.title}
                      </h3>

                      {/* Gold divider */}
                      <div className="w-[50px] h-[2px] gold-gradient-bg mt-5 md:mt-6 mb-5 md:mb-6" />

                      {/* Description */}
                      <p
                        className="text-white/75 text-[14px] md:text-[15px] lg:text-[16px] leading-[22px] md:leading-[26px]"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        {service.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 lg:mt-10">
                  {/* Dots */}
                  <div className="flex gap-[6px]">
                    {services.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`h-[3px] transition-all duration-400 ${
                          i === current
                            ? "w-[24px] gold-gradient-bg"
                            : "w-[12px] bg-white/20 hover:bg-white/40"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Arrows */}
                  <div className="flex gap-3">
                    <ArrowButton direction="left" onClick={() => paginate(-1)} />
                    <ArrowButton direction="right" onClick={() => paginate(1)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
