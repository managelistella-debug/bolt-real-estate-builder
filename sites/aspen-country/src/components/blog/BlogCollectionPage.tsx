"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Pagination from "@/components/listings/Pagination";
import { BlogPost, formatDate } from "@/lib/blog";

const ITEMS_PER_PAGE = 12;

interface BlogCollectionPageProps {
  posts: BlogPost[];
}

export default function BlogCollectionPage({ posts: allPosts }: BlogCollectionPageProps) {
  const totalPages = Math.ceil(allPosts.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = allPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const featuredPost = currentPage === 1 ? currentPosts[0] : null;
  const gridPosts = currentPage === 1 ? currentPosts.slice(1) : currentPosts;

  const handlePageChange = (page: number) => {
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="relative w-full pt-[100px] md:pt-[140px] pb-10 md:pb-[60px] overflow-hidden">
        <div
          className="absolute inset-0 parallax-bg"
          style={{ backgroundImage: "url(/images/blog-banner.webp)" }}
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
            Blog
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
            Insights, market updates, and expert advice on buying and selling
            rural properties in Sundre and the surrounding foothills.
          </motion.p>
        </div>
      </section>

      {/* Blog Grid */}
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
            >
              {/* Featured Post (page 1 only) */}
              {featuredPost && (
                <ScrollReveal>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="block group mb-10 md:mb-14"
                  >
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10">
                      {/* Featured Image */}
                      <div className="relative w-full lg:w-[60%] aspect-[16/9] overflow-clip">
                        <Image
                          src={featuredPost.featuredImage || "/images/featured-1.webp"}
                          alt={featuredPost.featuredImageAlt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-center">
                        {featuredPost.category && (
                          <span
                            className="gold-gradient-text text-[12px] md:text-[13px] uppercase tracking-[0.1em] mb-2 md:mb-3"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                          >
                            {featuredPost.category}
                          </span>
                        )}
                        <h2
                          className="font-heading text-[24px] sm:text-[28px] md:text-[34px] lg:text-[38px] leading-[1.2] text-white group-hover:text-[#daaf3a] transition-colors duration-300"
                          style={{ fontWeight: 400 }}
                        >
                          {featuredPost.title}
                        </h2>
                        <p
                          className="mt-3 md:mt-4 text-white/50 text-[13px] md:text-[14px]"
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          {formatDate(featuredPost.publishDate)} &middot;{" "}
                          {featuredPost.author}
                        </p>
                        {featuredPost.excerpt && (
                          <p
                            className="mt-3 md:mt-4 text-white/70 text-[14px] md:text-[15px] leading-[24px] md:leading-[26px] line-clamp-3"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                          >
                            {featuredPost.excerpt}
                          </p>
                        )}
                        <div className="mt-5 md:mt-6">
                          <span
                            className="inline-flex items-center justify-center gold-gradient-bg h-[42px] px-6 text-[#09312a] font-semibold text-[13px] md:text-[14px] transition-all duration-300"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                          >
                            Read Article
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              {/* 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {gridPosts.map((post, index) => (
                  <ScrollReveal key={post.id} delay={index * 0.06}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      {/* Image */}
                      <div className="relative w-full aspect-[16/10] overflow-clip">
                        <Image
                          src={post.featuredImage || "/images/featured-1.webp"}
                          alt={post.featuredImageAlt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
                      </div>

                      {/* Content */}
                      <div className="pt-4 md:pt-5 pb-5 md:pb-6 border-b border-white/10">
                        {post.category && (
                          <span
                            className="gold-gradient-text text-[11px] md:text-[12px] uppercase tracking-[0.1em]"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                          >
                            {post.category}
                          </span>
                        )}
                        <h3
                          className="font-heading text-[20px] md:text-[24px] leading-[1.25] text-white mt-2 group-hover:text-[#daaf3a] transition-colors duration-300"
                          style={{ fontWeight: 400 }}
                        >
                          {post.title}
                        </h3>
                        <p
                          className="mt-2 text-white/50 text-[12px] md:text-[13px]"
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          {formatDate(post.publishDate)}
                        </p>
                        {post.excerpt && (
                          <p
                            className="mt-3 text-white/60 text-[14px] md:text-[15px] leading-[22px] md:leading-[24px] line-clamp-2"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                          >
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-4">
                          <span
                            className="text-[#daaf3a] text-[13px] md:text-[14px] font-semibold group-hover:underline transition-all duration-300"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                          >
                            Read Now
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
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
