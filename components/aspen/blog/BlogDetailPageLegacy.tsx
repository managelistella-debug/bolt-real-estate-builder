"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlogPost, formatDate } from "@/lib/aspen/blog";

interface BlogDetailPageProps {
  post: BlogPost;
}

export default function BlogDetailPageLegacy({ post }: BlogDetailPageProps) {
  return (
    <>
      <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
        <Image src={post.featuredImage} alt={post.featuredImageAlt} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#09312a] to-transparent" />
      </section>

      <section className="bg-[#09312a]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]">
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-2 mb-6 md:mb-8" style={{ fontFamily: "'Lato', sans-serif" }}>
            <Link href="/blog" className="text-white/50 text-[13px] md:text-[14px] hover:text-white transition-colors duration-300">
              Blog
            </Link>
          </motion.nav>

          <div className="max-w-[800px]">
            {post.category && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
                className="gold-gradient-text text-[12px] md:text-[13px] uppercase tracking-[0.1em]"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {post.category}
              </motion.span>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
              className="font-heading text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] leading-[1.15] text-white mt-3 md:mt-4"
              style={{ fontWeight: 400 }}
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3 mt-4 md:mt-5"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              <span className="text-white/50 text-[13px] md:text-[14px]">{formatDate(post.publishDate)}</span>
              <span className="w-[1px] h-[12px] bg-white/30" />
              <span className="text-white/50 text-[13px] md:text-[14px]">{post.author}</span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap gap-2 mt-4 md:mt-5">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 border border-white/15 text-white/50 text-[11px] md:text-[12px]" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {tag}
                </span>
              ))}
            </motion.div>

            <div className="w-[50px] h-[2px] gold-gradient-bg mt-6 md:mt-8 mb-8 md:mb-10" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
              className="blog-content text-white/80 text-[15px] md:text-[16px] leading-[26px] md:leading-[28px]"
              style={{ fontFamily: "'Lato', sans-serif" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-10 md:mt-14 pt-8 border-t border-white/10">
              <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-[14px] md:text-[15px] transition-colors duration-300" style={{ fontFamily: "'Lato', sans-serif" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/arrow-left.svg" alt="" width={16} height={16} />
                Back to Blog
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
