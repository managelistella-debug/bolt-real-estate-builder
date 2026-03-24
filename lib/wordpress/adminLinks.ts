/** Client-safe base URL for WordPress (set NEXT_PUBLIC_WORDPRESS_BASE_URL to match WORDPRESS_BASE_URL). */
export function getPublicWordPressBaseUrl(): string {
  if (typeof process === "undefined") return "";
  return (process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL || "").replace(/\/$/, "");
}

export function getListingPostType(): string {
  return process.env.NEXT_PUBLIC_WORDPRESS_LISTING_POST_TYPE || "listing";
}

export function getTestimonialPostType(): string {
  return process.env.NEXT_PUBLIC_WORDPRESS_TESTIMONIAL_POST_TYPE || "testimonial";
}

export function wordPressAdminUrl(path: string): string {
  const base = getPublicWordPressBaseUrl();
  if (!base) return "#";
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function wordPressAdminListings(): string {
  return wordPressAdminUrl(`/wp-admin/edit.php?post_type=${getListingPostType()}`);
}

export function wordPressAdminNewListing(): string {
  return wordPressAdminUrl(`/wp-admin/post-new.php?post_type=${getListingPostType()}`);
}

export function wordPressAdminBlogs(): string {
  return wordPressAdminUrl("/wp-admin/edit.php");
}

export function wordPressAdminNewPost(): string {
  return wordPressAdminUrl("/wp-admin/post-new.php");
}

export function wordPressAdminTestimonials(): string {
  return wordPressAdminUrl(`/wp-admin/edit.php?post_type=${getTestimonialPostType()}`);
}

export function wordPressAdminNewTestimonial(): string {
  return wordPressAdminUrl(`/wp-admin/post-new.php?post_type=${getTestimonialPostType()}`);
}
