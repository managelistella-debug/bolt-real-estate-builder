"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import ListingCard from "@/components/listings/ListingCard";
import { Listing } from "@/lib/listings";

const ITEMS_PER_PAGE = 12;

interface EstatesListingsPageProps {
  listings: Listing[];
}

type FilterState = "all" | "active" | "sold";

export default function EstatesListingsPage({ listings }: EstatesListingsPageProps) {
  const [filter, setFilter] = useState<FilterState>("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredListings = listings.filter((listing) => {
    if (filter === "all") return true;
    return listing.listingStatus === filter;
  });
  const visibleListings = filteredListings.slice(0, visibleCount);
  const hasMore = visibleCount < filteredListings.length;

  const setFilterAndReset = (next: FilterState) => {
    setFilter(next);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative w-full pt-[100px] md:pt-[140px] pb-10 md:pb-[60px] overflow-hidden">
        <div
          className="absolute inset-0 parallax-bg"
          style={{ backgroundImage: "url(/images/estate-hero.webp)" }}
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
            Estates & Ranch Properties
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
            Explore exclusive estate and ranch properties in Sundre,
            Mountain View County, and the surrounding Alberta foothills.
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
              {filteredListings.length} {filteredListings.length === 1 ? "property" : "properties"} available
            </span>
          </motion.div>
        </div>
      </section>

      {/* Listings Grid - 2 columns like active listings */}
      <section className="bg-[#09312a]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]">
          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setFilterAndReset("all")}
              className={`rounded-md px-4 py-2 text-sm ${filter === "all" ? "gold-gradient-bg text-[#09312a]" : "border border-white/20 text-white/80"}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterAndReset("active")}
              className={`rounded-md px-4 py-2 text-sm ${filter === "active" ? "gold-gradient-bg text-[#09312a]" : "border border-white/20 text-white/80"}`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setFilterAndReset("sold")}
              className={`rounded-md px-4 py-2 text-sm ${filter === "sold" ? "gold-gradient-bg text-[#09312a]" : "border border-white/20 text-white/80"}`}
            >
              Sold
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10"
          >
            {visibleListings.map((listing, index) => (
              <ScrollReveal key={listing.id} delay={index * 0.04}>
                <ListingCard listing={listing} showPrice={true} detailMetric="lotArea" />
              </ScrollReveal>
            ))}
          </motion.div>

          <div className="mt-10 md:mt-[60px] flex justify-center">
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + ITEMS_PER_PAGE)}
                className="gold-gradient-bg h-[52px] px-8 text-[#09312a] font-semibold text-[14px] tracking-wider"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                View More
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
