import type { BlogPost as AspenBlogPost } from "../aspen/blog.types";
import type { Listing as AspenListing } from "../aspen/listing.types";
import type { BlogPost, Listing, ListingGalleryImage } from "../types";

function normalizeRepresentation(
  r?: string
): Listing["representation"] | undefined {
  if (!r) return undefined;
  const s = r.toLowerCase();
  if (s.includes("buyer")) return "buyer_representation";
  if (s.includes("seller")) return "seller_representation";
  return undefined;
}

export function aspenListingToHeadless(l: AspenListing): Listing {
  const gallery: ListingGalleryImage[] = l.gallery.map((url, i) => ({
    id: `img-${i}`,
    url,
    order: i,
  }));
  const statusMap = {
    active: "for_sale" as const,
    sold: "sold" as const,
    pending: "pending" as const,
  };
  return {
    id: l.id,
    userId: "wordpress",
    tenantId: undefined,
    slug: l.slug,
    address: l.address,
    description: l.description,
    listPrice: l.listPrice,
    neighborhood: l.neighborhood,
    city: l.city,
    listingStatus: statusMap[l.listingStatus],
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    propertyType: l.propertyType,
    yearBuilt: l.yearBuilt,
    livingAreaSqft: l.livingArea,
    lotAreaValue: l.lotArea,
    lotAreaUnit: l.lotAreaUnit.toLowerCase().includes("acre") ? "acres" : "sqft",
    taxesAnnual: l.taxes,
    listingBrokerage: l.listingBrokerage,
    mlsNumber: l.mlsNumber,
    representation: normalizeRepresentation(l.representation),
    gallery,
    thumbnail: l.thumbnail,
    homepageFeatured: l.homepageFeatured,
    customOrder: 0,
    createdAt: l.createdAt ? new Date(l.createdAt) : new Date(),
    updatedAt: l.createdAt ? new Date(l.createdAt) : new Date(),
  };
}

export function aspenBlogPostToHeadless(p: AspenBlogPost): BlogPost {
  const d = new Date(p.publishDate);
  return {
    id: p.id,
    userId: "wordpress",
    tenantId: undefined,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    metaDescription: p.excerpt,
    contentHtml: p.content,
    featuredImage: p.featuredImage,
    authorName: p.author,
    tags: p.tags,
    category: p.category,
    status: "published",
    templateId: "wordpress",
    customOrder: 0,
    publishedAt: d,
    createdAt: d,
    updatedAt: d,
  };
}
