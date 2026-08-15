"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const services = [
  { title: "Listings", image: "/images/listings-card.webp", href: "/listings/active" },
  { title: "Selling", image: "/images/selling-card.webp", href: "/selling" },
  { title: "Buying", image: "/images/buying-card.webp", href: "/buying" },
];

function ServiceCard({
  title,
  image,
  href,
  delay,
}: {
  title: string;
  image: string;
  href: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollReveal delay={delay}>
      <a
        href={href}
        className="relative block w-full lg:w-[422px] h-[350px] md:h-[479px] overflow-clip cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 422px"
          />
        </motion.div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15)), linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 43.111%)`,
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 0.35 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-black pointer-events-none"
        />

        <div className="absolute top-0 left-0 px-[20px] py-[16px]">
          <motion.div
            animate={{ y: hovered ? 8 : 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col"
          >
            <h3
              className="font-heading text-[36px] md:text-[50px] text-white leading-[44px] md:leading-[60px] text-center"
              style={{ fontWeight: 400 }}
            >
              {title}
            </h3>
            <motion.div
              animate={{ width: hovered ? "100%" : "0%" }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: hovered ? 0.1 : 0,
              }}
              className="h-[2px] mt-2 gold-gradient-bg"
            />
          </motion.div>
        </div>
      </a>
    </ScrollReveal>
  );
}


export default function ServiceCards() {
  return (
    <section id="services" className="bg-[#09312a]">
      {/* Desktop: 3-card row */}
      <div className="hidden md:flex max-w-[1440px] mx-auto p-5 md:p-10 lg:p-[60px] items-center justify-between gap-4 lg:gap-0">
        {services.map((service, i) => (
          <ServiceCard key={service.title} {...service} delay={i * 0.15} />
        ))}
      </div>

      {/* Mobile: Stacked cards + View All */}
      <div className="md:hidden px-5 py-10 flex flex-col gap-4">
        {services.map((service) => (
          <a
            key={service.title}
            href={service.href}
            className="relative block w-full h-[250px] overflow-clip"
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15)), linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 43.111%)`,
              }}
            />
            <div className="absolute top-0 left-0 px-[20px] py-[16px]">
              <h3
                className="font-heading text-[36px] text-white leading-[44px]"
                style={{ fontWeight: 400 }}
              >
                {service.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
