import type { BlogPost } from "./blog.types";
export type { BlogPost } from "./blog.types";

import { fetchWpBlogPostBySlugRaw, fetchWpPostsRaw } from "../wordpress/client";
import { mapWpPostToBlogPost } from "../wordpress/mappers";
import { getWordPressBaseUrl } from "../wordpress/env";

async function fetchPostsFromWordPress(): Promise<BlogPost[]> {
  if (!getWordPressBaseUrl()) return [];
  try {
    const raw = await fetchWpPostsRaw();
    return raw.map(mapWpPostToBlogPost);
  } catch {
    return [];
  }
}

async function getResolvedPosts(): Promise<BlogPost[]> {
  if (!getWordPressBaseUrl()) return [...fallbackPosts];
  return fetchPostsFromWordPress();
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getResolvedPosts();
  return posts.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (getWordPressBaseUrl()) {
    try {
      const raw = await fetchWpBlogPostBySlugRaw(slug);
      if (raw) return mapWpPostToBlogPost(raw);
    } catch {
      /* fall through */
    }
    return undefined;
  }
  const posts = await getResolvedPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  const posts = await getResolvedPosts();
  return posts.find((post) => post.id === id);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 Things to Know Before Buying an Acreage in Sundre",
    slug: "5-things-before-buying-acreage-sundre",
    author: "Aspen Muraski",
    publishDate: "2026-02-28",
    featuredImage: "/images/featured-1.webp",
    featuredImageAlt:
      "Aerial view of an acreage property near Sundre with mountain backdrop",
    excerpt:
      "Purchasing an acreage is different from buying a home in town. From water wells to septic systems, here are five essential things every buyer should know before making the move to rural living near Sundre.",
    content:
      '<h2>1. Water Supply Matters</h2><p>Unlike properties in town, most acreages rely on private wells for water.</p><h2>2. Septic Systems Need Inspection</h2><p>Acreages typically use septic systems rather than municipal sewer.</p>',
    category: "Buying",
    tags: ["Acreages", "Sundre", "Buying Tips", "Rural Living"],
  },
  {
    id: "2",
    title: "How Aspen's Marketing Strategy Sells Properties Faster",
    slug: "aspens-marketing-strategy-sells-faster",
    author: "Aspen Muraski",
    publishDate: "2026-02-15",
    featuredImage: "/images/featured-2.webp",
    featuredImageAlt:
      "Professional real estate photography setup in a luxury home",
    excerpt:
      "In today's competitive market, great marketing is what separates a property that sits from one that sells.",
    content:
      "<h2>Professional Photography</h2><p>First impressions happen online. Aspen invests in professional photography and cinematic video tours.</p>",
    category: "Selling",
    tags: ["Marketing", "Selling Tips", "Photography", "Social Media"],
  },
  {
    id: "3",
    title:
      "Understanding Mountain View County Zoning for Rural Properties",
    slug: "mountain-view-county-zoning-rural-properties",
    author: "Aspen Muraski",
    publishDate: "2026-01-30",
    featuredImage: "/images/featured-3.webp",
    featuredImageAlt:
      "Rural property with fenced land in Mountain View County",
    excerpt:
      "Zoning regulations in Mountain View County affect everything from building a shop to keeping livestock.",
    content:
      "<h2>What Is Zoning?</h2><p>Zoning dictates how land can be used within a municipality.</p>",
    category: "Market Insights",
    tags: ["Zoning", "Mountain View County", "Rural Living", "Land Use"],
  },
];

export { fallbackPosts as blogPosts };
