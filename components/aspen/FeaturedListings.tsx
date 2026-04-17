"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Listing, formatPrice } from "@/lib/aspen/listings";

interface FeaturedListingsProps {
  listings: Listing[];
}

/** Matches `gap-8` (32px) on the carousel track for md+ */
const CAROUSEL_GAP_PX = 32;

function statusLabel(status: Listing["listingStatus"]) {
  if (status === "sold") return "Sold";
  if (status === "pending") return "Pending";
  return "For Sale";
}

function ListingCard({
  listing,
  cardRef,
  fixedCardWidthPx,
}: {
  listing: Listing;
  cardRef?: React.Ref<HTMLAnchorElement>;
  /** Pixel width from viewport measurement — avoids cqw/0-width bugs that break next/image fill */
  fixedCardWidthPx?: number | null;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      ref={cardRef}
      href={`/listings/${listing.slug}`}
      className={`cursor-pointer shrink-0 ${fixedCardWidthPx == null ? "w-full" : ""}`}
      style={fixedCardWidthPx != null ? { width: fixedCardWidthPx } : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full h-[200px] md:h-[238px] overflow-clip">
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={listing.thumbnail || "/images/featured-1.webp"}
            alt={listing.address}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>

        <div className="absolute top-0 left-0 p-[8px] z-10">
          <div className="gold-gradient-bg px-[12px] md:px-[16px] py-[4px] md:py-[6px]">
            <span
              className="text-[#09312a] text-[14px] md:text-[16px] leading-[24px] font-normal"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {statusLabel(listing.listingStatus)}
            </span>
          </div>
        </div>
      </div>

      <div className="py-[12px] md:py-[16px] border-b border-[#daaf3a]">
        <p
          className="gold-gradient-text text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] font-heading"
          style={{ fontWeight: 400 }}
        >
          {formatPrice(listing.listPrice)}
        </p>
        <p
          className="text-white text-[14px] md:text-[16px] leading-[22px] md:leading-[24px]"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {listing.address}, {listing.city}
        </p>
      </div>
    </Link>
  );
}

export default function FeaturedListings({ listings }: FeaturedListingsProps) {
  const safeListings = listings.length > 0 ? listings : [];
  const len = safeListings.length;

  const trackListings = len > 0 ? [...safeListings, ...safeListings] : [];

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [step, setStep] = useState(0);
  const [cardWidthPx, setCardWidthPx] = useState<number | null>(null);

  const [scope, animate] = useAnimate<HTMLDivElement>();
  const firstCardRef = useRef<HTMLAnchorElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w <= 0) return;
      const cols = window.matchMedia("(min-width: 1024px)").matches ? 3 : 2;
      const totalGap = (cols - 1) * CAROUSEL_GAP_PX;
      setCardWidthPx((w - totalGap) / cols);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const mq = window.matchMedia("(min-width: 1024px)");
    mq.addEventListener("change", update);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      const card = firstCardRef.current;
      const track = scope.current;
      if (!card || !track) return;
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const next = card.offsetWidth + gap;
      setStep(next);
      track.style.transform = `translateX(${-index * next}px)`;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [index, len, scope, cardWidthPx]);

  const paginate = useCallback(
    async (direction: number) => {
      if (isAnimating || len <= 1 || step === 0) return;
      setIsAnimating(true);

      const transition = {
        type: "spring" as const,
        stiffness: 180,
        damping: 28,
      };

      try {
        if (direction > 0) {
          const target = index + 1;
          await animate(scope.current, { x: -target * step }, transition);
          if (target >= len) {
            await animate(scope.current, { x: 0 }, { duration: 0 });
            setIndex(0);
          } else {
            setIndex(target);
          }
        } else {
          const pre = index + len;
          await animate(scope.current, { x: -pre * step }, { duration: 0 });
          const target = pre - 1;
          await animate(scope.current, { x: -target * step }, transition);
          setIndex(target - len);
        }
      } finally {
        setIsAnimating(false);
      }
    },
    [animate, index, isAnimating, len, scope, step]
  );

  return (
    <section id="featured" className="bg-[#09312a]">
      <div className="max-w-[1440px] mx-auto py-10 md:py-[60px] px-5 md:px-10 lg:px-[60px] flex flex-col items-center gap-8 md:gap-[60px]">
        <div className="flex flex-col gap-6 w-full md:hidden">
          {safeListings.slice(0, 3).map((listing) => (
            <ListingCard key={`mobile-${listing.id}`} listing={listing} />
          ))}
          {safeListings.length === 0 && (
            <p className="text-white/60 text-sm">No featured listings yet.</p>
          )}
        </div>

        <div ref={viewportRef} className="w-full overflow-hidden hidden md:block">
          {trackListings.length > 0 ? (
            <motion.div
              ref={scope}
              className="flex flex-row items-stretch gap-6 md:gap-8"
              style={{ willChange: "transform" }}
            >
              {trackListings.map((listing, i) => (
                <ListingCard
                  key={`${listing.id}-${i}`}
                  listing={listing}
                  cardRef={i === 0 ? firstCardRef : undefined}
                  fixedCardWidthPx={cardWidthPx}
                />
              ))}
            </motion.div>
          ) : (
            <p className="text-white/60 text-sm">No featured listings yet.</p>
          )}
        </div>

        {len > 1 && (
          <div className="hidden md:flex items-center justify-center gap-[28px]">
            <button
              onClick={() => paginate(-1)}
              disabled={isAnimating}
              className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300 disabled:cursor-not-allowed"
              aria-label="Previous listings"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/arrow-left.svg" alt="Previous" width={24} height={24} />
            </button>
            <Link
              href="/listings/active"
              className="text-white text-[14px] font-normal border-b border-white/40 pb-[2px] hover:text-[#daaf3a] hover:border-[#daaf3a] transition-all duration-300"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              View All Listings
            </Link>
            <button
              onClick={() => paginate(1)}
              disabled={isAnimating}
              className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300 disabled:cursor-not-allowed"
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
        )}

        <Link
          href="/listings/active"
          className="md:hidden gold-gradient-bg flex items-center justify-center h-[52px] w-full text-[#09312a] font-semibold text-[14px] tracking-wider transition-all duration-300"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          View All Listings
        </Link>
      </div>
    </section>
  );
}
