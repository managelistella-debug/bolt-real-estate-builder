"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const listings = [
  {
    id: 1,
    price: "$1,200,000",
    address: "33289 Lakeview Court, Sundre, AB",
    image: "/images/featured-1.webp",
    badge: "For Sale",
  },
  {
    id: 2,
    price: "$1,350,000",
    address: "22034 Lakeview Drive, Sundre, AB",
    image: "/images/featured-2.webp",
    badge: "For Sale",
  },
  {
    id: 3,
    price: "$1,200,000",
    address: "33291 Lakeview Court, Sundre, AB",
    image: "/images/featured-3.webp",
    badge: "For Sale",
  },
  {
    id: 4,
    price: "$985,000",
    address: "14422 Mountain View Road, Olds, AB",
    image: "/images/featured-1.webp",
    badge: "For Sale",
  },
  {
    id: 5,
    price: "$1,475,000",
    address: "78901 Range Road 54, Sundre, AB",
    image: "/images/featured-2.webp",
    badge: "Sold",
  },
  {
    id: 6,
    price: "$2,100,000",
    address: "55123 Foothills Drive, Sundre, AB",
    image: "/images/featured-3.webp",
    badge: "For Sale",
  },
];

function ListingCard({ listing }: { listing: (typeof listings)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cursor-pointer w-full md:w-[calc(50%-12px)] lg:w-[422px] shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative w-full h-[200px] md:h-[238px] overflow-clip">
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={listing.image}
            alt={listing.address}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 422px"
          />
        </motion.div>

        {/* Badge */}
        <div className="absolute top-0 left-0 p-[8px] z-10">
          <div className="gold-gradient-bg px-[12px] md:px-[16px] py-[4px] md:py-[6px]">
            <span
              className="text-[#09312a] text-[14px] md:text-[16px] leading-[24px] font-normal"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {listing.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="py-[12px] md:py-[16px] border-b border-[#daaf3a]">
        <p
          className="gold-gradient-text text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] font-heading"
          style={{ fontWeight: 400 }}
        >
          {listing.price}
        </p>
        <p
          className="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px]"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {listing.address}
        </p>
      </div>
    </div>
  );
}

export default function FeaturedListings() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Mobile: 1 card, Tablet: 2 cards, Desktop: 3 cards
  // We use 3 for the animation, responsive layout handles display
  const totalPages = Math.ceil(listings.length / 3);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setPage((prev) => {
        const next = prev + newDirection;
        if (next < 0) return totalPages - 1;
        if (next >= totalPages) return 0;
        return next;
      });
    },
    [totalPages]
  );

  const currentListings = listings.slice(page * 3, page * 3 + 3);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 800 : -800,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir < 0 ? 800 : -800,
      opacity: 0,
    }),
  };

  return (
    <section id="featured" className="bg-[#09312a]">
      <div className="max-w-[1440px] mx-auto py-10 md:py-[60px] px-5 md:px-10 lg:px-[60px] flex flex-col items-center gap-8 md:gap-[60px]">
        {/* Slider container */}
        <div className="w-full overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 180, damping: 28 },
                opacity: { duration: 0.3 },
              }}
              className="flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-4 lg:gap-0"
            >
              {currentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows + View All (desktop) */}
        <div className="hidden md:flex items-center justify-center gap-[28px]">
          <button
            onClick={() => paginate(-1)}
            className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300"
            aria-label="Previous listings"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/arrow-left.svg" alt="Previous" width={24} height={24} />
          </button>
          <a
            href="/listings/active"
            className="text-white text-[14px] font-normal border-b border-white/40 pb-[2px] hover:text-[#daaf3a] hover:border-[#daaf3a] transition-all duration-300"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            View All Listings
          </a>
          <button
            onClick={() => paginate(1)}
            className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300"
            aria-label="Next listings"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/arrow-left.svg"
              alt="Next"
              width={24}
              height={24}
              className="scale-x-[-1]"
            />
          </button>
        </div>

        {/* View All Listings button (mobile only) */}
        <a
          href="/listings/active"
          className="md:hidden gold-gradient-bg flex items-center justify-center h-[52px] w-full text-[#09312a] font-semibold text-[14px] tracking-wider transition-all duration-300"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          View All Listings
        </a>
      </div>
    </section>
  );
}
