"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/aspen/ScrollReveal";
import Lightbox from "@/components/aspen/listings/Lightbox";
import { Estate, formatPrice } from "@/lib/aspen/estates";

interface EstateDetailProps {
  estate: Estate;
}

export default function EstateDetail({ estate }: EstateDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [heroHovered, setHeroHovered] = useState(false);
  const [galleryPage, setGalleryPage] = useState(0);
  const [galleryDirection, setGalleryDirection] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const imagesPerPage = 3;
  const totalGalleryPages = Math.ceil(estate.gallery.length / imagesPerPage);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileDirection, setMobileDirection] = useState(0);

  const navigateGallery = useCallback(
    (dir: number) => {
      setGalleryDirection(dir);
      setGalleryPage((prev) => {
        const next = prev + dir;
        if (next < 0) return totalGalleryPages - 1;
        if (next >= totalGalleryPages) return 0;
        return next;
      });
    },
    [totalGalleryPages]
  );

  const navigateMobileGallery = useCallback(
    (dir: number) => {
      setMobileDirection(dir);
      setMobileIndex((prev) => {
        const next = prev + dir;
        if (next < 0) return estate.gallery.length - 1;
        if (next >= estate.gallery.length) return 0;
        return next;
      });
    },
    [estate.gallery.length]
  );

  const currentGalleryImages = estate.gallery.slice(
    galleryPage * imagesPerPage,
    galleryPage * imagesPerPage + imagesPerPage
  );

  const detailItems = [
    { label: "Bedrooms", value: estate.bedrooms },
    { label: "Bathrooms", value: estate.bathrooms },
    { label: "Living Area (Sq Ft)", value: estate.livingArea.toLocaleString() },
    { label: "Lot Area", value: `${estate.lotArea.toLocaleString()} ${estate.lotAreaUnit}` },
    { label: "Property Type", value: estate.propertyType },
    { label: "Year Built", value: estate.yearBuilt },
    { label: "Taxes (Annual)", value: formatPrice(estate.taxes) },
    { label: "Neighborhood", value: estate.neighborhood },
    { label: "City", value: estate.city },
    ...(estate.representation ? [{ label: "Representation", value: estate.representation }] : []),
    { label: "Listing Brokerage", value: estate.listingBrokerage },
    { label: "MLS #", value: estate.mlsNumber },
  ];

  const gallerySlideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 600 : -600, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 600 : -600, opacity: 0 }),
  };

  return (
    <>
      <section className="relative w-full h-[50vh] md:h-[65vh] lg:h-[75vh] overflow-hidden">
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => openLightbox(0)}
          onMouseEnter={() => setHeroHovered(true)}
          onMouseLeave={() => setHeroHovered(false)}
        >
          <motion.div
            animate={{ scale: heroHovered ? 1.03 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Image src={estate.thumbnail} alt={estate.address} fill className="object-cover" sizes="100vw" priority />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#09312a] to-transparent" />
        </div>

        <div className="absolute top-[90px] md:top-[120px] left-5 md:left-10 lg:left-[60px] z-10">
          <div className="gold-gradient-bg px-[16px] py-[6px]">
            <span className="text-[#09312a] text-[14px] md:text-[16px] leading-[24px] font-normal" style={{ fontFamily: "'Lato', sans-serif" }}>
              {estate.listingStatus === "active" ? "For Sale" : "Sold"}
            </span>
          </div>
        </div>

        <div className="absolute top-[90px] md:top-[120px] right-5 md:right-10 lg:right-[60px] z-10">
          <Link href="/estates" className="flex items-center gap-2 text-white/70 hover:text-white text-[14px] transition-colors duration-300" style={{ fontFamily: "'Lato', sans-serif" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/arrow-left.svg" alt="" width={16} height={16} />
            Back to Estates
          </Link>
        </div>

        <div
          className="absolute bottom-6 right-5 md:right-10 lg:right-[60px] z-10 flex items-center gap-2 text-white/60 text-[13px] cursor-pointer hover:text-white transition-colors duration-300"
          style={{ fontFamily: "'Lato', sans-serif" }}
          onClick={() => openLightbox(0)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
            <rect x="9" y="1" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
            <rect x="1" y="9" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
            <rect x="9" y="9" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          View Gallery ({estate.gallery.length} photos)
        </div>
      </section>

      <section className="bg-[#09312a]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]">
          <ScrollReveal>
            <div className="mb-8 md:mb-[48px]">
              <h1 className="font-heading text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] leading-[1.15] text-white" style={{ fontWeight: 400 }}>
                {estate.address}
              </h1>
              <p className="gold-gradient-text text-[24px] md:text-[30px] lg:text-[36px] leading-[1.3] font-heading mt-2 md:mt-3" style={{ fontWeight: 400 }}>
                {formatPrice(estate.listPrice)}
              </p>
            </div>
          </ScrollReveal>

          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">
            <div className="flex-1 min-w-0">
              <ScrollReveal delay={0.1}>
                <h2 className="font-heading text-[22px] md:text-[26px] leading-[1.3] gold-gradient-text mb-4 md:mb-6" style={{ fontWeight: 400 }}>
                  About This Property
                </h2>
                <div className="text-white/80 text-[15px] md:text-[16px] leading-[26px] md:leading-[28px] space-y-4" style={{ fontFamily: "'Lato', sans-serif" }} dangerouslySetInnerHTML={{ __html: estate.description }} />
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="mt-10 md:mt-[48px]">
                  <h2 className="font-heading text-[22px] md:text-[26px] leading-[1.3] gold-gradient-text mb-4 md:mb-6" style={{ fontWeight: 400 }}>
                    Property Details
                  </h2>
                  <div className="border-t border-white/10">
                    {detailItems.map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-3 md:py-4 border-b border-white/10">
                        <span className="text-white/50 text-[14px] md:text-[15px]" style={{ fontFamily: "'Lato', sans-serif" }}>{item.label}</span>
                        <span className="text-white text-[14px] md:text-[15px] font-normal text-right" style={{ fontFamily: "'Lato', sans-serif" }}>{String(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 lg:sticky lg:top-[115px]">
              <div className="border border-[#daaf3a] bg-[#113d35] p-6 md:p-8">
                <h3 className="font-heading text-[20px] md:text-[24px] leading-[1.3] text-white mb-2" style={{ fontWeight: 400 }}>
                  Interested in This Property?
                </h3>
                <p className="text-white/60 text-[14px] md:text-[15px] leading-[22px] mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Contact Aspen for more details.
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                  <input type="text" placeholder="Your Name" className="w-full bg-transparent border-b border-white/20 text-white text-[14px] md:text-[15px] py-3 focus:border-[#daaf3a] transition-colors duration-300" style={{ fontFamily: "'Lato', sans-serif" }} />
                  <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-white/20 text-white text-[14px] md:text-[15px] py-3 focus:border-[#daaf3a] transition-colors duration-300" style={{ fontFamily: "'Lato', sans-serif" }} />
                  <input type="tel" placeholder="Phone Number" className="w-full bg-transparent border-b border-white/20 text-white text-[14px] md:text-[15px] py-3 focus:border-[#daaf3a] transition-colors duration-300" style={{ fontFamily: "'Lato', sans-serif" }} />
                  <button type="submit" className="gold-gradient-bg flex items-center justify-center h-[47px] w-full text-[#09312a] font-semibold text-[14px] mt-2 transition-all duration-300" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Request Details
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <p className="text-white/40 text-[13px] mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Or call directly
                  </p>
                  <a href="tel:4037033909" className="gold-gradient-text font-heading text-[18px] md:text-[20px] hover:opacity-80 transition-opacity duration-300" style={{ fontWeight: 400 }}>
                    403-703-3909
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#09312a]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] pb-10 md:pb-[60px]">
          <ScrollReveal>
            <h2 className="font-heading text-[22px] md:text-[26px] leading-[1.3] gold-gradient-text mb-6 md:mb-8" style={{ fontWeight: 400 }}>
              Photo Gallery
            </h2>
          </ScrollReveal>

          <div className="md:hidden">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={mobileDirection}>
                <motion.div key={mobileIndex} custom={mobileDirection} variants={gallerySlideVariants} initial="enter" animate="center" exit="exit" transition={{ x: { type: "spring", stiffness: 200, damping: 30 }, opacity: { duration: 0.25 } }}>
                  <button onClick={() => openLightbox(mobileIndex)} className="relative w-full aspect-[4/3] overflow-clip">
                    <Image src={estate.gallery[mobileIndex]} alt={`${estate.address} - Photo ${mobileIndex + 1}`} fill className="object-cover" sizes="100vw" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-center gap-[28px] mt-6">
              <button onClick={() => navigateMobileGallery(-1)} className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300" aria-label="Previous photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/arrow-left.svg" alt="Previous" width={24} height={24} />
              </button>
              <button onClick={() => navigateMobileGallery(1)} className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300" aria-label="Next photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/arrow-left.svg" alt="Next" width={24} height={24} className="scale-x-[-1]" />
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={galleryDirection}>
                <motion.div key={galleryPage} custom={galleryDirection} variants={gallerySlideVariants} initial="enter" animate="center" exit="exit" transition={{ x: { type: "spring", stiffness: 200, damping: 30 }, opacity: { duration: 0.25 } }} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentGalleryImages.map((image, index) => {
                    const absoluteIndex = galleryPage * imagesPerPage + index;
                    return (
                      <button key={absoluteIndex} onClick={() => openLightbox(absoluteIndex)} className="relative w-full aspect-[4/3] overflow-clip group">
                        <Image src={image} alt={`${estate.address} - Photo ${absoluteIndex + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" sizes="(max-width: 1024px) 50vw, 33vw" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
            {totalGalleryPages > 1 && (
              <div className="flex items-center justify-center gap-[28px] mt-8">
                <button onClick={() => navigateGallery(-1)} className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300" aria-label="Previous photos">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/arrow-left.svg" alt="Previous" width={24} height={24} />
                </button>
                <button onClick={() => navigateGallery(1)} className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-300" aria-label="Next photos">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/arrow-left.svg" alt="Next" width={24} height={24} className="scale-x-[-1]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Lightbox images={estate.gallery} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>
  );
}
