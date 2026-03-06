"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import ListingCard from "./ListingCard";
import Pagination from "./Pagination";
import { getSoldListings } from "@/lib/listings";

const ITEMS_PER_PAGE = 12;

export default function SoldListingsPage() {
  const allListings = getSoldListings();
  const totalPages = Math.ceil(allListings.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentListings = allListings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative w-full pt-[100px] md:pt-[140px] pb-10 md:pb-[60px] overflow-hidden">
        <div
          className="absolute inset-0 parallax-bg"
          style={{ backgroundImage: "url(/images/sold-banner.webp)" }}
        />
        <div className="absolute inset-0 bg-[#09312a]/85" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px]">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2,
            }}
            className="font-heading text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.13] text-white"
            style={{ fontWeight: 400 }}
          >
            Sold Properties
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.4,
            }}
            className="mt-4 md:mt-6 text-white/70 text-[15px] md:text-[16px] max-w-[600px] leading-[26px]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            A selection of properties successfully sold by Aspen Muraski
            in Sundre, Mountain View County, and the surrounding foothills.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-3 md:mt-4"
          >
            <span
              className="text-white/40 text-[14px]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {allListings.length} {allListings.length === 1 ? "property" : "properties"} sold
            </span>
          </motion.div>
        </div>
      </section>

      {/* Listings Grid - 3 columns */}
      <section className="bg-[#09312a]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              initial={{ opacity: 0, y: direction > 0 ? 30 : -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction < 0 ? 30 : -30 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {currentListings.map((listing, index) => (
                <ScrollReveal key={listing.id} delay={index * 0.08}>
                  <ListingCard listing={listing} showPrice={false} />
                </ScrollReveal>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <div className="mt-10 md:mt-[60px]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>
    </>
  );
}
