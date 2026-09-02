import { sanityReadClient } from "./client";
import type { BlogCategory, BlogPostWithCategory, Listing, Testimonial } from "./types";

// Next.js patches the global `fetch` and defaults Server Component fetches to
// `force-cache` (cached indefinitely). Admin edits need to show up without a
// redeploy, so every Sanity read opts out of that cache explicitly — Sanity's
// own CDN (`useCdn: true` on the client) still gives fast reads with a short,
// normal edge-cache window on top of this.
const NO_STORE = { cache: "no-store" as const };

const LISTING_FIELDS = `{
  _id, _createdAt, _updatedAt, address, city, neighborhood, slug, status, price,
  bedrooms, bathrooms, livingAreaSqft, lotSizeSqft, lotSizeDisplayUnit, propertyType,
  yearBuilt, propertyTaxes, dateListed, mlsNumber, description, mainImage, gallery,
  featured, sortOrder, published
}`;

export async function fetchFeaturedListings(limit = 6): Promise<Listing[]> {
  return sanityReadClient.fetch(
    `*[_type == "listing" && published == true && featured == true]
      | order(sortOrder asc, _createdAt desc) [0...$limit] ${LISTING_FIELDS}`,
    { limit },
    NO_STORE
  );
}

export async function fetchListingsByStatus(status: "Active" | "Sold"): Promise<Listing[]> {
  return sanityReadClient.fetch(
    `*[_type == "listing" && published == true && status == $status]
      | order(sortOrder asc, _createdAt desc) ${LISTING_FIELDS}`,
    { status },
    NO_STORE
  );
}

export async function fetchListingsByPropertyType(type: string): Promise<Listing[]> {
  return sanityReadClient.fetch(
    `*[_type == "listing" && published == true && $type in propertyType]
      | order(sortOrder asc, _createdAt desc) ${LISTING_FIELDS}`,
    { type },
    NO_STORE
  );
}

export async function fetchAllPublishedListings(): Promise<Listing[]> {
  return sanityReadClient.fetch(
    `*[_type == "listing" && published == true] | order(sortOrder asc, _createdAt desc) ${LISTING_FIELDS}`,
    {},
    NO_STORE
  );
}

export async function fetchListingBySlug(slug: string): Promise<Listing | null> {
  return sanityReadClient.fetch(
    `*[_type == "listing" && published == true && slug.current == $slug][0] ${LISTING_FIELDS}`,
    { slug },
    NO_STORE
  );
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return sanityReadClient.fetch(
    `*[_type == "testimonial" && published == true] | order(order asc, _createdAt asc){
      _id, _createdAt, quote, name, order, published
    }`,
    {},
    NO_STORE
  );
}

const BLOG_POST_FIELDS = `{
  _id, _createdAt, title, slug, publishedDate, authorName, authorImage,
  featuredImage, excerpt, tags, content, published,
  "category": category->{_id, name, slug}
}`;

export async function fetchAllPublishedPosts(): Promise<BlogPostWithCategory[]> {
  return sanityReadClient.fetch(
    `*[_type == "blogPost" && published == true] | order(publishedDate desc, _createdAt desc) ${BLOG_POST_FIELDS}`,
    {},
    NO_STORE
  );
}

export async function fetchRecentPosts(limit = 4): Promise<BlogPostWithCategory[]> {
  return sanityReadClient.fetch(
    `*[_type == "blogPost" && published == true]
      | order(publishedDate desc, _createdAt desc) [0...$limit] ${BLOG_POST_FIELDS}`,
    { limit },
    NO_STORE
  );
}

export async function fetchPostBySlug(slug: string): Promise<BlogPostWithCategory | null> {
  return sanityReadClient.fetch(
    `*[_type == "blogPost" && published == true && slug.current == $slug][0] ${BLOG_POST_FIELDS}`,
    { slug },
    NO_STORE
  );
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  return sanityReadClient.fetch(
    `*[_type == "blogCategory"] | order(name asc){_id, name, slug}`,
    {},
    NO_STORE
  );
}
