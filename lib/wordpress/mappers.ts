import type { BlogPost } from "../aspen/blog.types";
import type { Listing } from "../aspen/listing.types";
import type { Testimonial } from "../aspen/testimonials.types";
import type { WpRestPost } from "./types";

function asString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" && !Number.isNaN(v)) return String(v);
  return String(v).trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function parsePrice(raw: unknown): number {
  const s = asString(raw).replace(/[$,]/g, "");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function parseNum(raw: unknown): number {
  const n = typeof raw === "number" ? raw : parseFloat(asString(raw).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function getPropertyType(raw: unknown): string {
  if (Array.isArray(raw)) return raw.map((x) => asString(x)).filter(Boolean).join(", ");
  return asString(raw);
}

/** Maps ACF listing_status + common variants to Aspen listingStatus */
function normalizeListingStatus(raw: unknown): Listing["listingStatus"] {
  const s = asString(raw).toLowerCase();
  if (s === "sold") return "sold";
  if (s === "pending") return "pending";
  // WordPress may send "Active", "active", "for_sale", etc.
  if (
    s === "active" ||
    s === "for_sale" ||
    s === "for sale" ||
    s === "for-sale"
  ) {
    return "active";
  }
  return "active";
}

/** Maps to Supabase-style listing_status for public API / embed */
export function listingStatusToApiEnum(status: Listing["listingStatus"]): "for_sale" | "sold" | "pending" {
  if (status === "sold") return "sold";
  if (status === "pending") return "pending";
  return "for_sale";
}

function getFeaturedImage(post: WpRestPost): string {
  const emb = post._embedded?.["wp:featuredmedia"]?.[0];
  return asString(emb?.source_url);
}

function getGalleryUrls(post: WpRestPost, featured: string): string[] {
  const acf = post.acf ?? {};
  const galleryRaw = acf.gallery;
  const urls: string[] = [];

  if (Array.isArray(galleryRaw)) {
    const first = galleryRaw[0];
    if (typeof first === "string") {
      galleryRaw.forEach((u) => {
        const t = asString(u);
        if (t) urls.push(t);
      });
    } else {
      const ids = galleryRaw.map((x) => (typeof x === "number" ? x : parseInt(asString(x), 10))).filter((n) => Number.isFinite(n));
      const embedded = post._embedded?.["acf:attachment"] ?? [];
      const byId = new Map<number, string>();
      embedded.forEach((m) => {
        const mid = typeof m.id === "number" ? m.id : parseInt(asString(m.id), 10);
        const url = asString(m.source_url);
        if (Number.isFinite(mid) && url) byId.set(mid, url);
      });
      ids.forEach((id) => {
        const u = byId.get(id);
        if (u) urls.push(u);
      });
    }
  }

  if (urls.length === 0 && featured) return [featured];
  return urls;
}

function acfBool(raw: unknown): boolean {
  if (raw === true || raw === 1 || raw === "1") return true;
  if (raw === false || raw === 0 || raw === "0") return false;
  const s = asString(raw).toLowerCase();
  return s === "yes" || s === "true";
}

export function mapWpListingToListing(post: WpRestPost): Listing {
  const acf = post.acf ?? {};
  const featured = getFeaturedImage(post);
  const gallery = getGalleryUrls(post, featured);
  const thumbnail = featured || gallery[0] || "";

  const city = asString(acf.city ?? acf.City);

  return {
    id: String(post.id),
    slug: post.slug || String(post.id),
    address: asString(acf.address),
    description: asString(acf.description),
    listPrice: parsePrice(acf.price_add_comma ?? acf.list_price),
    listingStatus: normalizeListingStatus(acf.listing_status),
    representation: asString(acf.representation) || undefined,
    neighborhood: asString(acf.neighborhood),
    city,
    bedrooms: parseNum(acf.bed ?? acf.bedrooms),
    bathrooms: asString(acf.bath ?? acf.bathrooms),
    propertyType: getPropertyType(acf.property_type),
    yearBuilt: parseNum(acf.year_built),
    livingArea: asString(acf.size_sqft ?? acf.living_area_sqft),
    lotArea: asString(acf.lot_size ?? acf.lot_area_value),
    lotAreaUnit: (() => {
      const u = asString(acf.lot_size_type ?? acf.lot_area_unit).toLowerCase();
      if (u.includes("acre")) return "acres";
      if (u === "sqft" || u === "sq ft" || u.includes("square")) return "sq ft";
      return u || "acres";
    })(),
    taxes: parsePrice(acf.property_taxes ?? acf.taxes_annual),
    listingBrokerage: asString(acf.listing_brokerage),
    mlsNumber: asString(acf.listing_id ?? acf.mls_number),
    gallery,
    thumbnail,
    homepageFeatured: acfBool(acf.homepage_featured),
    ranchEstateFeatured: acfBool(acf.ranch_estate_featured),
    createdAt: post.date,
  };
}

function extractTerms(post: WpRestPost): { category: string; tags: string[] } {
  const termGroups = post._embedded?.["wp:term"];
  if (!Array.isArray(termGroups)) return { category: "", tags: [] };
  const categories: string[] = [];
  const tags: string[] = [];
  for (const group of termGroups) {
    if (!Array.isArray(group)) continue;
    for (const t of group) {
      const name = asString(t?.name);
      if (!name) continue;
      if (t?.taxonomy === "category") categories.push(name);
      else if (t?.taxonomy === "post_tag") tags.push(name);
    }
  }
  return {
    category: categories[0] || "",
    tags,
  };
}

export function mapWpPostToBlogPost(post: WpRestPost): BlogPost {
  const acf = post.acf ?? {};
  const featured = getFeaturedImage(post);
  const title = post.title?.rendered ? stripHtml(decodeEntities(post.title.rendered)) : "";
  const content = post.content?.rendered ?? "";
  const excerptRaw = post.excerpt?.rendered ?? "";
  const excerpt = excerptRaw ? stripHtml(decodeEntities(excerptRaw)) : "";
  const { category, tags } = extractTerms(post);
  const author =
    asString(acf.author_name ?? acf.author) ||
    asString((post as { author_name?: string }).author_name) ||
    "Editor";

  return {
    id: String(post.id),
    title,
    slug: post.slug,
    author,
    publishDate: (post.date || "").slice(0, 10),
    featuredImage: featured || "/images/featured-1.webp",
    featuredImageAlt: title,
    excerpt,
    content,
    category,
    tags,
  };
}

export function mapWpTestimonialToTestimonial(post: WpRestPost): Testimonial {
  const acf = post.acf ?? {};
  /** ACF: Text Area `testimonial` (see WP field group); fallbacks for older `quote` or post body */
  const quoteRaw =
    asString(acf.testimonial) ||
    asString(acf.quote) ||
    (post.content?.rendered ? stripHtml(post.content.rendered) : "");
  const quote = quoteRaw || stripHtml(post.content?.rendered ?? "");
  const author = asString(acf.author_name ?? acf.author);
  /** ACF: Radio `star_rating`; fallbacks `rating` */
  let rating = parseNum(acf.star_rating ?? acf.rating);
  if (rating < 1) rating = 5;
  if (rating > 5) rating = 5;

  const ctxRaw = asString(acf.display_context).toLowerCase();
  let displayContext: Testimonial["displayContext"] = "both";
  if (ctxRaw === "home") displayContext = "home";
  else if (ctxRaw === "about") displayContext = "about";

  return {
    id: String(post.id),
    quote,
    author: author || "Client",
    rating,
    displayContext,
    sortOrder: parseNum(acf.sort_order ?? post.menu_order),
    reviewDate: (post.date || "").slice(0, 10),
  };
}
