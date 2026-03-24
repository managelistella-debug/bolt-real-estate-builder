"use client";

import { ExternalLink } from "lucide-react";
import {
  getPublicWordPressBaseUrl,
  wordPressAdminBlogs,
  wordPressAdminListings,
  wordPressAdminNewListing,
  wordPressAdminNewPost,
  wordPressAdminNewTestimonial,
  wordPressAdminTestimonials,
} from "@/lib/wordpress/adminLinks";

type PanelKind = "listings" | "blogs" | "testimonials";

export default function WordPressCmsPanel({ kind }: { kind: PanelKind }) {
  const base = getPublicWordPressBaseUrl();

  const config = (() => {
    switch (kind) {
      case "listings":
        return {
          title: "Listings are managed in WordPress",
          body:
            "Create and edit property listings in the WordPress admin. Changes appear on the site after a short cache window (typically a few minutes).",
          primary: { label: "All listings", href: wordPressAdminListings() },
          secondary: { label: "Add new listing", href: wordPressAdminNewListing() },
        };
      case "blogs":
        return {
          title: "Blog posts are managed in WordPress",
          body:
            "Use WordPress Posts for articles. The Next.js site reads published posts from the REST API.",
          primary: { label: "All posts", href: wordPressAdminBlogs() },
          secondary: { label: "Add new post", href: wordPressAdminNewPost() },
        };
      case "testimonials":
        return {
          title: "Testimonials are managed in WordPress",
          body:
            "Edit the testimonial custom post type in WordPress. The post date is used for display; author and star rating use ACF fields.",
          primary: { label: "All testimonials", href: wordPressAdminTestimonials() },
          secondary: { label: "Add new testimonial", href: wordPressAdminNewTestimonial() },
        };
    }
  })();

  if (!base) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-5 text-[13px] text-amber-900">
        <p className="font-medium">WordPress URL not configured</p>
        <p className="mt-2 text-amber-800">
          Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_WORDPRESS_BASE_URL</code> in your environment
          (same value as <code className="rounded bg-amber-100 px-1">WORDPRESS_BASE_URL</code>) so admin links work.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-[15px] font-medium text-black">{config.title}</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[#888C99]">{config.body}</p>
      </div>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <a
          href={config.primary.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[38px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#DAFF07] px-4 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
        >
          {config.primary.label}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <a
          href={config.secondary.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[38px] flex-1 items-center justify-center gap-2 rounded-lg border border-[#EBEBEB] bg-white px-4 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]"
        >
          {config.secondary.label}
          <ExternalLink className="h-3.5 w-3.5 text-[#888C99]" />
        </a>
      </div>
      <p className="text-[12px] text-[#CCCCCC]">
        Site:{" "}
        <a href={base} className="text-[#888C99] underline" target="_blank" rel="noopener noreferrer">
          {base}
        </a>
      </p>
    </div>
  );
}
