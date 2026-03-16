"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/aspen/ScrollReveal";
import { BlogPost, formatDate } from "@/lib/aspen/blog";

interface HomepageBlogPreviewProps {
  posts: BlogPost[];
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="relative w-full aspect-[16/10] overflow-clip">
        <Image
          src={post.featuredImage || "/images/featured-1.webp"}
          alt={post.featuredImageAlt || post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
      </div>
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
          className="font-heading text-[18px] md:text-[22px] leading-[1.25] text-white mt-2 group-hover:text-[#daaf3a] transition-colors duration-300"
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
  );
}

export default function HomepageBlogPreview({ posts }: HomepageBlogPreviewProps) {
  const safePosts = posts.length > 0 ? posts : [];

  if (safePosts.length === 0) return null;

  return (
    <section id="blog" className="bg-[#09312a]">
      <div className="max-w-[1440px] mx-auto py-10 md:py-[60px] px-5 md:px-10 lg:px-[60px]">
        <ScrollReveal>
          <div className="max-w-[900px] mx-auto text-center mb-10 md:mb-[60px]">
            <h2
              className="font-heading text-[36px] md:text-[50px] gold-gradient-text leading-[44px] md:leading-[60px]"
              style={{ fontWeight: 400 }}
            >
              From the Blog
            </h2>
            <p
              className="mt-4 text-white/70 text-[15px] md:text-[16px] leading-[26px]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Insights, market updates, and expert advice on buying and selling
              rural properties.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {safePosts.map((post, index) => (
            <ScrollReveal key={post.id} delay={index * 0.06}>
              <BlogCard post={post} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-10 md:mt-[60px] text-center">
            <Link
              href="/blog"
              className="inline-flex gold-gradient-bg h-[52px] px-8 items-center justify-center text-[#09312a] font-semibold text-[14px] tracking-wider transition-all duration-300 hover:opacity-90"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              View All Posts
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
