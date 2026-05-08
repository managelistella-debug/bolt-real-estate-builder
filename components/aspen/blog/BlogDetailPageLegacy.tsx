"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlogPost, formatDate } from "@/lib/aspen/blog";

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
        <div className="lg:sticky lg:top-[114px]">
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
    <div className="relative">
      {/* Locked-in-place background covering the full viewport. We use
          positive z-index (z-0) instead of negative so the fixed layers
          paint above the public layout's solid #09312a background,
          which would otherwise hide the image. */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url(/images/homepage-testimonial-bg.webp)" }}
      />
      <div
        aria-hidden
        className="fixed inset-0 z-0 bg-[#09312a]/75 pointer-events-none"
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
                  src="/images/about-image.webp"
                  alt="Aspen Muraski"
                  fill
                  sizes="68px"
                  className="object-cover object-[center_25%]"
                />
              </div>
              <p
                className="mt-3 text-white text-[14px] md:text-[15px] font-semibold tracking-wide"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Aspen Muraski
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

      {/* Body section (transparent so background shows through).
          Layout strategy: on lg+ the right-column sidebar is positioned
          absolutely inside a relative wrapper. This makes the wrapper's
          (and therefore the section's) height depend ONLY on the body
          column. That guarantees the page ends right after the
          "Back to Blog" link with no empty scrollable area below. */}
      <section className="relative z-10">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-[80px]">
          <div className="lg:relative">
            {/* Body column. On lg+ we reserve room on the right for the
                absolutely positioned sidebar via right padding. */}
            <div className="lg:pr-[calc(33.3333%+2rem)]">
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
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

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

            {/* Mobile sidebar - shown below the body on small screens. */}
            <aside className="mt-10 lg:hidden">
              <Sidebar recentPosts={recentPosts} />
            </aside>

            {/* Desktop sidebar - absolutely positioned so its height does
                NOT contribute to the wrapper's height. The wrapper (and
                therefore the section + page) ends at the body column's
                natural height. overflow-clip visually clips any sidebar
                content past the body height; unlike overflow-hidden,
                clip does not create a scroll container, so the inner
                Recent Posts can still be sticky against the viewport. */}
            <aside className="hidden lg:block lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-1/3 lg:overflow-clip">
              <Sidebar recentPosts={recentPosts} />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
