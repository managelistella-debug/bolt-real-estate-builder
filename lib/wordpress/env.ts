/**
 * WordPress headless CMS configuration.
 * Set WORDPRESS_BASE_URL (e.g. https://yoursite.hostingersite.com) to load listings, posts, and testimonials from WP REST.
 */

export function getWordPressBaseUrl(): string | null {
  const raw = process.env.WORDPRESS_BASE_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export function isWordPressConfigured(): boolean {
  return !!getWordPressBaseUrl();
}

/** REST route segment after /wp/v2/ (e.g. listing → /wp/v2/listing) */
export function getListingRestBase(): string {
  return (process.env.WORDPRESS_LISTING_REST_BASE || "listing").replace(/^\/+|\/+$/g, "");
}

export function getTestimonialRestBase(): string {
  return (process.env.WORDPRESS_TESTIMONIAL_REST_BASE || "testimonial").replace(/^\/+|\/+$/g, "");
}

export const WORDPRESS_REVALIDATE_SECONDS = Number(
  process.env.WORDPRESS_REVALIDATE_SECONDS || "300"
);
