import type { BlogPost } from "../aspen/blog.types";
import type { Listing } from "../aspen/listing.types";
import type { Testimonial } from "../aspen/testimonials.types";
import { listingStatusToApiEnum } from "./mappers";

/** Shape compatible with legacy Supabase `listings` rows for `/api/public/listings`. */
export function listingToPublicApiRow(l: Listing): Record<string, unknown> {
  const st = listingStatusToApiEnum(l.listingStatus);
  return {
    id: l.id,
    tenant_id: "wordpress",
    user_id: "wordpress",
    slug: l.slug,
    address: l.address,
    description: l.description,
    list_price: l.listPrice,
    listing_status: st,
    representation: l.representation ?? null,
    neighborhood: l.neighborhood,
    city: l.city,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    property_type: l.propertyType,
    year_built: l.yearBuilt,
    living_area_sqft: l.livingArea,
    lot_area_value: l.lotArea,
    lot_area_unit: l.lotAreaUnit.toLowerCase().includes("acre") ? "acres" : "sqft",
    taxes_annual: l.taxes,
    listing_brokerage: l.listingBrokerage,
    mls_number: l.mlsNumber,
    gallery: l.gallery.map((url, i) => ({ url, order: i })),
    custom_order: 0,
    thumbnail: l.thumbnail,
    homepage_featured: l.homepageFeatured ?? false,
    ranch_estate_featured: l.ranchEstateFeatured ?? false,
    created_at: l.createdAt ?? new Date().toISOString(),
    updated_at: l.createdAt ?? new Date().toISOString(),
  };
}

/** Embed [`EmbedListingDetail`](components/embeds/EmbedListingDetail.tsx) expects snake_case + `listing_status` enum. */
export function listingToEmbedRow(l: Listing): Record<string, unknown> {
  const st = listingStatusToApiEnum(l.listingStatus);
  const gallery = l.gallery.map((url, i) => ({
    id: `g${i}`,
    url,
    order: i,
  }));
  return {
    id: l.id,
    slug: l.slug,
    address: l.address,
    description: l.description,
    list_price: l.listPrice,
    neighborhood: l.neighborhood,
    city: l.city,
    listing_status: st,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    property_type: l.propertyType,
    year_built: l.yearBuilt,
    living_area_sqft: l.livingArea,
    lot_area_value: l.lotArea,
    lot_area_unit: l.lotAreaUnit.toLowerCase().includes("acre") ? "acres" : "sqft",
    taxes_annual: l.taxes,
    listing_brokerage: l.listingBrokerage,
    mls_number: l.mlsNumber,
    representation: l.representation,
    gallery,
    thumbnail: l.thumbnail,
  };
}

export function blogPostToPublicApiRow(p: BlogPost): Record<string, unknown> {
  return {
    id: p.id,
    tenant_id: "wordpress",
    user_id: "wordpress",
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    meta_description: p.excerpt || p.title,
    content_html: p.content,
    featured_image: p.featuredImage,
    author_name: p.author,
    tags: p.tags,
    category: p.category,
    status: "published",
    template_id: "wordpress",
    custom_order: 0,
    published_at: `${p.publishDate}T12:00:00.000Z`,
    created_at: `${p.publishDate}T12:00:00.000Z`,
    updated_at: `${p.publishDate}T12:00:00.000Z`,
  };
}

export function testimonialToPublicApiRow(t: Testimonial): Record<string, unknown> {
  return {
    id: t.id,
    tenant_id: "wordpress",
    user_id: "wordpress",
    quote: t.quote,
    author_name: t.author,
    rating: t.rating,
    display_context: t.displayContext,
    sort_order: t.sortOrder,
    is_published: true,
    date: t.reviewDate ?? null,
    created_at: t.reviewDate ? `${t.reviewDate}T12:00:00.000Z` : new Date().toISOString(),
    updated_at: t.reviewDate ? `${t.reviewDate}T12:00:00.000Z` : new Date().toISOString(),
  };
}
