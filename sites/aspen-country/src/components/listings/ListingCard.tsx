"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Listing, formatPrice } from "@/lib/listings";

interface ListingCardProps {
  listing: Listing;
  showPrice?: boolean;
}

export default function ListingCard({
  listing,
  showPrice = true,
}: ListingCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-clip">
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={listing.thumbnail}
            alt={listing.address}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>

        {/* Badge */}
        <div className="absolute top-0 left-0 p-[8px] z-10">
          <div className="gold-gradient-bg px-[12px] md:px-[16px] py-[4px] md:py-[6px]">
            <span
              className="text-[#09312a] text-[13px] md:text-[14px] leading-[20px] font-normal"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {listing.listingStatus === "active" ? "For Sale" : "Sold"}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="py-[12px] md:py-[16px] border-b border-[#daaf3a]">
        {showPrice && (
          <p
            className="gold-gradient-text text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] font-heading"
            style={{ fontWeight: 400 }}
          >
            {formatPrice(listing.listPrice)}
          </p>
        )}
        <p
          className="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px]"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {listing.address}
        </p>
        {/* Bed / Bath / Sq Ft */}
        <div
          className="flex items-center gap-3 mt-1 text-white/60 text-[13px] md:text-[14px] leading-[20px]"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          <span>{listing.bedrooms} Bed</span>
          <span className="w-[1px] h-[12px] bg-white/30" />
          <span>{listing.bathrooms} Bath</span>
          <span className="w-[1px] h-[12px] bg-white/30" />
          <span>{listing.livingArea.toLocaleString()} Sq Ft</span>
        </div>
      </div>
    </Link>
  );
}
