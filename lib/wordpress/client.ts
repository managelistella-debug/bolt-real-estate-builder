import {
  getListingRestBase,
  getTestimonialRestBase,
  getWordPressBaseUrl,
  WORDPRESS_REVALIDATE_SECONDS,
} from "./env";
import type { WpRestPost } from "./types";

function buildUrl(path: string, searchParams: Record<string, string | number | undefined>) {
  const base = getWordPressBaseUrl();
  if (!base) throw new Error("WORDPRESS_BASE_URL is not configured.");
  const url = new URL(path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`);
  Object.entries(searchParams).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });
  return url.toString();
}

export async function wpFetchJson<T>(path: string, searchParams: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = buildUrl(path, searchParams);
  const res = await fetch(url, {
    next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WordPress HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

/** Paginate through all published items (max 100 per page). */
export async function wpFetchAllPosts(restBase: string, extra: Record<string, string | number | undefined> = {}): Promise<WpRestPost[]> {
  const all: WpRestPost[] = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const batch = await wpFetchJson<WpRestPost[]>(`/wp-json/wp/v2/${restBase}`, {
      per_page: perPage,
      page,
      status: "publish",
      _embed: 1,
      ...extra,
    });
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
    if (page > 50) break;
  }
  return all;
}

export async function wpFetchPostBySlug(restBase: string, slug: string): Promise<WpRestPost | null> {
  const rows = await wpFetchJson<WpRestPost[]>(`/wp-json/wp/v2/${restBase}`, {
    slug,
    per_page: 1,
    status: "publish",
    _embed: 1,
  });
  return rows[0] ?? null;
}

export async function fetchWpListingsRaw(): Promise<WpRestPost[]> {
  return wpFetchAllPosts(getListingRestBase());
}

export async function fetchWpListingBySlugRaw(slug: string): Promise<WpRestPost | null> {
  return wpFetchPostBySlug(getListingRestBase(), slug);
}

export async function fetchWpTestimonialsRaw(): Promise<WpRestPost[]> {
  return wpFetchAllPosts(getTestimonialRestBase());
}

export async function fetchWpPostsRaw(): Promise<WpRestPost[]> {
  return wpFetchAllPosts("post");
}

export async function fetchWpBlogPostBySlugRaw(slug: string): Promise<WpRestPost | null> {
  return wpFetchPostBySlug("post", slug);
}
