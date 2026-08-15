"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { BlogPost, formatDate } from "@/lib/blog";
import { imageUrl } from "@/lib/sanity/image";
import type { PortableTextImageBlock } from "@/lib/sanity/types";

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = imageUrl(value as PortableTextImageBlock, 1100);
      if (!src) return null;
      return (
        <span className="block relative w-full aspect-[16/9] my-6">
          <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 1100px) 100vw, 1100px" />
        </span>
      );
    },
  },
};

interface BlogDetailPageProps {
  post: BlogPost;
  recentPosts?: BlogPost[];
}

function Sidebar({ recentPosts }: { recentPosts: BlogPost[] }) {
  return (
    <>
      {/* Get in Touch - transparent box with gold outline */}
      <div className="bg-transparent border border-[#daaf3a] p-5 md:p-6 mb-8 md:mb-10">
        <h3
          className="font-heading text-[22px] md:text-[24px] gold-gradient-text leading-[1.2]"
          style={{ fontWeight: 400 }}
        >
          Get in Touch
        </h3>
        <div className="h-[1px] gold-gradient-bg mt-3 mb-4" />

        <form
          className="flex flex-col gap-[8px]"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-[rgba(17,61,53,0.4)] border border-[#daaf3a]/70 px-3 py-2.5 text-white text-[14px] leading-[20px] placeholder:text-white/40"
            style={{ fontFamily: "'Lato', sans-serif" }}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-[rgba(17,61,53,0.4)] border border-[#daaf3a]/70 px-3 py-2.5 text-white text-[14px] leading-[20px] placeholder:text-white/40"
            style={{ fontFamily: "'Lato', sans-serif" }}
          />
          <textarea
            placeholder="Message"
            className="w-full bg-[rgba(17,61,53,0.4)] border border-[#daaf3a]/70 px-3 py-2.5 text-white text-[14px] leading-[20px] resize-none h-[80px] placeholder:text-white/40"
            style={{ fontFamily: "'Lato', sans-serif" }}
          />

          <button
            type="submit"
            className="gold-gradient-bg flex items-center justify-center h-[40px] w-full text-[#09312a] font-semibold text-[13px] tracking-wider transition-all duration-300 mt-1"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Submit
          </button>
        </form>
      </div>

      {/* Recent posts - sticks 15px below the header once it
          reaches the top of the viewport */}
      {recentPosts.length > 0 && (
        <div className="lg:sticky lg:top-[114px] scroll-m-0">
          <h3
            className="font-heading text-[22px] md:text-[24px] gold-gradient-text leading-[1.2]"
            style={{ fontWeight: 400 }}
          >
            Recent Posts
          </h3>
          <div className="h-[1px] gold-gradient-bg mt-3 mb-5" />
          <div className="flex flex-col gap-5">
            {recentPosts.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.slug}`}
                className="group flex gap-3 items-start"
              >
                {item.featuredImage && (
                  <div className="relative w-[88px] h-[68px] shrink-0 overflow-hidden">
                    <Image
                      src={item.featuredImage}
                      alt={item.featuredImageAlt || item.title}
                      fill
                      sizes="88px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {item.category && (
                    <span
                      className="gold-gradient-text text-[10px] md:text-[11px] uppercase tracking-[0.1em]"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {item.category}
                    </span>
                  )}
                  <h4
                    className="font-heading text-[14px] md:text-[15px] text-white leading-[1.3] mt-1 group-hover:text-[#daaf3a] transition-colors duration-300 line-clamp-2"
                    style={{ fontWeight: 400 }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="mt-1 text-white/55 text-[11px] md:text-[12px]"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {formatDate(item.publishDate)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function BlogDetailPageLegacy({
  post,
  recentPosts = [],
}: BlogDetailPageProps) {
  return (
    <div>
      {/* Fixed background layers — z-[1] keeps them above the layout's
          solid bg-[#09312a] but below the z-10 sections and footer. */}
      <div
        aria-hidden
        className="fixed inset-0 z-[1] bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url(/images/homepage-testimonial-bg.webp)" }}
      />
      <div
        aria-hidden
        className="fixed inset-0 z-[1] bg-[#09312a]/70 pointer-events-none"
      />

      {/* Hero */}
      <section className="relative z-10">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-[60px] pt-[110px] md:pt-[150px] pb-10 md:pb-[40px]">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 mb-6 md:mb-8"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            <Link
              href="/blog"
              className="text-white/60 text-[13px] md:text-[14px] hover:text-white transition-colors duration-300"
            >
              ← Blog
            </Link>
          </motion.nav>

          <div className="text-center max-w-[820px] mx-auto">
            {post.category && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.15,
                }}
                className="gold-gradient-text inline-block text-[12px] md:text-[13px] uppercase tracking-[0.12em]"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {post.category}
              </motion.span>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
              }}
              className="font-heading text-[30px] sm:text-[38px] md:text-[48px] lg:text-[56px] leading-[1.15] text-white mt-3 md:mt-4"
              style={{ fontWeight: 400 }}
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-col items-center mt-6 md:mt-8"
            >
              <div className="relative w-[60px] h-[60px] md:w-[68px] md:h-[68px] rounded-full overflow-hidden ring-2 ring-[#daaf3a]/70">
                <Image
                  src={post.authorImage || "/images/about-image.webp"}
                  alt={post.author}
                  fill
                  sizes="68px"
                  className="object-cover object-[center_25%]"
                />
              </div>
              <p
                className="mt-3 text-white text-[14px] md:text-[15px] font-semibold tracking-wide"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {post.author}
              </p>
              <p
                className="mt-1 text-white/60 text-[12px] md:text-[13px]"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {formatDate(post.publishDate)}
              </p>
            </motion.div>
          </div>

          {/* Featured image */}
          {post.featuredImage && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.4,
              }}
              className="relative w-full aspect-[16/9] mt-10 md:mt-14 overflow-hidden"
            >
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="object-cover"
                priority
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Body section — CSS Grid keeps both columns in normal flow so
          neither column can overflow its container and inflate the
          page's scroll height. items-start means each column is sized
          to its own content, not stretched to match the other. */}
      <section className="relative z-10">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-[80px]">
          <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-8">
            {/* Article column */}
            <div>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 border border-white/20 text-white/70 text-[11px] md:text-[12px] uppercase tracking-[0.08em]"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="blog-content-aspen text-white/85 text-[15px] md:text-[16px] leading-[26px] md:leading-[28px]"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                <PortableText value={post.content} components={portableTextComponents} />
              </div>

              <div className="mt-12 md:mt-14 pt-8 border-t border-white/15">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-[#daaf3a] text-[14px] md:text-[15px] font-semibold transition-colors duration-300"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  ← Back to Blog
                </Link>
              </div>
            </div>

            {/* Sidebar — stacks below article on mobile, right column on
                desktop. In-flow so it cannot inflate page scroll height. */}
            <aside className="mt-10 lg:mt-0">
              <Sidebar recentPosts={recentPosts} />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
