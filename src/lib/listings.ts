import {
  fetchAllPublishedListings,
  fetchFeaturedListings,
  fetchListingBySlug,
  fetchListingsByPropertyType,
  fetchListingsByStatus,
} from "./sanity/queries";
import { imageUrl } from "./sanity/image";
import { formatLotSize, fromCanonicalSqft } from "./sanity/lotSize";
import type { Listing as SanityListing } from "./sanity/types";

export interface Listing {
  id: string;
  slug: string;
  address: string;
  city: string;
  neighborhood: string;
  description: string;
  listPrice: number;
  listingStatus: "active" | "sold";
  propertyType: string;
  bedrooms: number;
  bathrooms: string;
  livingArea: number;
  lotArea: number;
  lotAreaUnit: string;
  yearBuilt: number;
  taxes: number;
  mlsNumber: string;
  gallery: string[];
  thumbnail: string;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function descriptionToHtml(text: string): string {
  if (!text) return "";
  return text
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function toListing(l: SanityListing): Listing {
  const gallery = (l.gallery || []).map((img) => imageUrl(img, 1600) || "").filter(Boolean);
  const thumbnail = imageUrl(l.mainImage, 1200) || gallery[0] || "";
  const lotAreaUnit = l.lotSizeDisplayUnit || "sqft";
  const lotArea = l.lotSizeSqft
    ? roundTo(fromCanonicalSqft(l.lotSizeSqft, lotAreaUnit), lotAreaUnit === "acres" ? 2 : 0)
    : 0;

  return {
    id: l._id,
    slug: l.slug.current,
    address: l.address,
    city: l.city || "",
    neighborhood: l.neighborhood || "",
    description: descriptionToHtml(l.description || ""),
    listPrice: l.price || 0,
    listingStatus: l.status === "Sold" ? "sold" : "active",
    propertyType: (l.propertyType || []).join(", "),
    bedrooms: l.bedrooms || 0,
    bathrooms: l.bathrooms || "",
    livingArea: l.livingAreaSqft || 0,
    lotArea,
    lotAreaUnit: lotAreaUnit === "acres" ? "acres" : "sq ft",
    yearBuilt: l.yearBuilt || 0,
    taxes: l.propertyTaxes || 0,
    mlsNumber: l.mlsNumber || "",
    gallery,
    thumbnail,
  };
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  const listings = await fetchFeaturedListings(limit);
  if (listings.length > 0) return listings.map(toListing);
  // Fall back to the most recently added active listings if none are flagged featured.
  const active = await fetchListingsByStatus("Active");
  return active.slice(0, limit).map(toListing);
}

export async function getActiveListings(): Promise<Listing[]> {
  const listings = await fetchListingsByStatus("Active");
  return listings.map(toListing);
}

export async function getSoldListings(): Promise<Listing[]> {
  const listings = await fetchListingsByStatus("Sold");
  return listings.map(toListing);
}

/** Acreages collection page. */
export async function getRanchEstateListings(): Promise<Listing[]> {
  const listings = await fetchListingsByPropertyType("Acreage");
  return listings.map(toListing);
}

/** Recreational Properties collection page. */
export async function getRecreationalPropertyListings(): Promise<Listing[]> {
  const listings = await fetchListingsByPropertyType("Recreational");
  return listings.map(toListing);
}

export async function getAllListings(): Promise<Listing[]> {
  const listings = await fetchAllPublishedListings();
  return listings.map(toListing);
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  const listing = await fetchListingBySlug(slug);
  return listing ? toListing(listing) : undefined;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(price);
}

export { formatLotSize };
