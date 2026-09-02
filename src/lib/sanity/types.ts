/**
 * Aspen's Sanity document shapes. There is no Sanity Studio in this project —
 * these plain TS types are the schema, same as CMS-ARCHITECTURE.md's approach
 * for the reference site. Enforced only by the admin API routes, not Sanity itself.
 */

export interface SanityImageRef {
  _type: "image";
  _key?: string;
  asset: { _type: "reference"; _ref: string };
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export type ListingStatus = "Active" | "Sold";

export type PropertyType =
  | "Acreage"
  | "Detach"
  | "Apartment/Condo"
  | "Recreational"
  | "Estate";

export const PROPERTY_TYPE_OPTIONS: PropertyType[] = [
  "Acreage",
  "Detach",
  "Apartment/Condo",
  "Recreational",
  "Estate",
];

export type LotSizeUnit = "sqft" | "acres";

export const SQFT_PER_ACRE = 43560;

export interface Listing {
  _id: string;
  _type: "listing";
  _createdAt?: string;
  _updatedAt?: string;
  address: string;
  city: string;
  neighborhood?: string;
  slug: SanitySlug;
  status: ListingStatus;
  price?: number;
  bedrooms?: number;
  /** Free text on purpose — values like "2.5" or "1 + den" show up in source data. */
  bathrooms?: string;
  livingAreaSqft?: number;
  /** Canonical lot size, always stored in square feet. Convert for display via lotSizeDisplayUnit. */
  lotSizeSqft?: number;
  lotSizeDisplayUnit?: LotSizeUnit;
  propertyType: PropertyType[];
  yearBuilt?: number;
  propertyTaxes?: number;
  /** Admin-only ISO date (YYYY-MM-DD). Drives listing order; never rendered. */
  dateListed?: string;
  mlsNumber?: string;
  description?: string;
  mainImage?: SanityImageRef;
  gallery?: SanityImageRef[];
  featured: boolean;
  sortOrder: number;
  published: boolean;
}

export interface Testimonial {
  _id: string;
  _type: "testimonial";
  _createdAt?: string;
  quote: string;
  name: string;
  order: number;
  published: boolean;
}

export interface BlogCategory {
  _id: string;
  _type: "blogCategory";
  name: string;
  slug: SanitySlug;
}

export interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

export interface PortableTextMarkDef {
  _type: "link";
  _key: string;
  href: string;
}

export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3" | "h4";
  listItem?: "bullet" | "number";
  level?: number;
  markDefs: PortableTextMarkDef[];
  children: PortableTextSpan[];
}

export interface PortableTextImageBlock {
  _type: "image";
  _key: string;
  asset: { _type: "reference"; _ref: string };
}

export type PortableTextContent = (PortableTextBlock | PortableTextImageBlock)[];

export interface BlogPost {
  _id: string;
  _type: "blogPost";
  _createdAt?: string;
  title: string;
  slug: SanitySlug;
  category?: { _type: "reference"; _ref: string };
  publishedDate: string;
  authorName: string;
  authorImage?: SanityImageRef;
  featuredImage?: SanityImageRef;
  excerpt: string;
  tags: string[];
  content: PortableTextContent;
  published: boolean;
}

/** Expanded shape returned by GROQ when `category->` is dereferenced. */
export interface BlogPostWithCategory extends Omit<BlogPost, "category"> {
  category?: BlogCategory;
}
