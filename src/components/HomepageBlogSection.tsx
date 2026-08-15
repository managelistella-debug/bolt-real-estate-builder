"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { BlogPost, formatDate } from "@/lib/blog";
import { decodeHtmlEntities } from "@/lib/html-entities";

interface HomepageBlogSectionProps {
  posts: BlogPost[];
}

export default function HomepageBlogSection({ posts }: HomepageBlogSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-[#09312a]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-16 md:py-24 lg:py-[120px]">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-8 md:mb-10 flex-wrap gap-4">
            <h2
              className="font-heading text-[32px] md:text-[42px] gold-gradient-text leading-[1.2]"
              style={{ fontWeight: 400 }}
            >
              From the Blog
            </h2>
            <Link
              href="/blog"
              className="text-[#daaf3a] text-[14px] font-semibold hover:underline"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              View All Articles
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {posts.slice(0, 3).map((post, index) => (
            <ScrollReveal key={post.id} delay={index * 0.06}>
              <Link href={`/blog/${post.slug}`} className="block group">
                <div className="relative w-full aspect-[16/10] overflow-clip">
                  <Image
                    src={post.featuredImage || "/images/featured-1.webp"}
                    alt={post.featuredImageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
                </div>
                <div className="pt-4 md:pt-5">
                  {post.category && (
                    <span
                      className="gold-gradient-text text-[11px] md:text-[12px] uppercase tracking-[0.1em]"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {post.category}
                    </span>
                  )}
                  <h3
                    className="font-heading text-[19px] md:text-[22px] leading-[1.25] text-white mt-2 group-hover:text-[#daaf3a] transition-colors duration-300"
                    style={{ fontWeight: 400 }}
                  >
                    {post.title}
                  </h3>
                  <p className="mt-2 text-white/50 text-[12px] md:text-[13px]" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {formatDate(post.publishDate)}
                  </p>
                  {post.excerpt && (
                    <p
                      className="mt-3 text-white/60 text-[14px] leading-[22px] line-clamp-2"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {decodeHtmlEntities(post.excerpt)}
                    </p>
                  )}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
