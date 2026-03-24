import type { Listing } from "../aspen/listing.types";
import { fetchWpListingsRaw } from "./client";
import { mapWpListingToListing } from "./mappers";
import { listingToPublicApiRow } from "./publicRows";

function firstValidGalleryUrl(gallery: unknown): string | null {
  if (!Array.isArray(gallery)) return null;
  for (const item of gallery) {
    const url =
      typeof item === "string"
        ? item
        : item && typeof item === "object" && "url" in item
          ? String((item as { url?: unknown }).url ?? "")
          : "";
    const trimmed = url.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

function listingToEnrichedRow(l: Listing): Record<string, unknown> {
  const row = listingToPublicApiRow(l);
  return {
    ...row,
    thumbnail: row.thumbnail || firstValidGalleryUrl(row.gallery),
    homepage_featured: row.homepage_featured ?? false,
  };
}

function matchesStatus(rowStatus: unknown, wanted: string[]): boolean {
  const s = String(rowStatus ?? "").toLowerCase();
  return wanted.some((w) => w.toLowerCase() === s);
}

/** Filters + sorts in-memory for WordPress-backed listing rows (legacy API shape). */
export async function getWordPressPublicListingsResponse(sp: URLSearchParams): Promise<{
  enriched: Record<string, unknown>[];
  total: number;
}> {
  const raw = await fetchWpListingsRaw();
  let listings = raw.map(mapWpListingToListing);

  const slug = sp.get("slug");
  if (slug) {
    listings = listings.filter((l) => l.slug === slug);
  }

  const status = sp.get("status");
  if (status) {
    const statuses = status.split(",").map((s) => s.trim()).filter(Boolean);
    listings = listings.filter((l) => {
      const api =
        l.listingStatus === "active"
          ? "for_sale"
          : l.listingStatus === "sold"
            ? "sold"
            : "pending";
      return matchesStatus(api, statuses);
    });
  }

  const city = sp.get("city");
  if (city) {
    const cities = city.split(",").map((c) => c.trim()).filter(Boolean);
    listings = listings.filter((l) =>
      cities.some((c) => l.city.toLowerCase().includes(c.toLowerCase()))
    );
  }

  const neighborhood = sp.get("neighborhood");
  if (neighborhood) {
    const nbs = neighborhood.split(",").map((n) => n.trim()).filter(Boolean);
    listings = listings.filter((l) =>
      nbs.some((n) => l.neighborhood.toLowerCase().includes(n.toLowerCase()))
    );
  }

  const propertyType = sp.get("propertyType");
  if (propertyType) {
    const types = propertyType.split(",").map((t) => t.trim()).filter(Boolean);
    listings = listings.filter((l) =>
      types.some((t) => l.propertyType.toLowerCase().includes(t.toLowerCase()))
    );
  }

  const sort = sp.get("sort") || "newest";
  const sorted = [...listings].sort((a, b) => {
    switch (sort) {
      case "price_asc":
        return a.listPrice - b.listPrice;
      case "price_desc":
        return b.listPrice - a.listPrice;
      case "oldest":
        return (a.createdAt || "").localeCompare(b.createdAt || "");
      case "custom_order":
        return 0;
      case "newest":
      default:
        return (b.createdAt || "").localeCompare(a.createdAt || "");
    }
  });

  let enriched = sorted.map(listingToEnrichedRow);

  if (sp.get("featured") === "true") {
    enriched = enriched.filter((r) => r.homepage_featured);
  }

  const total = enriched.length;

  const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
  const perPageParam = sp.get("perPage");
  const perPage = perPageParam ? Math.max(1, parseInt(perPageParam, 10)) : null;
  const limitParam = sp.get("limit");
  const hardLimit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : null;

  if (hardLimit && !perPage) {
    enriched = enriched.slice(0, hardLimit);
  } else if (perPage) {
    const from = (page - 1) * perPage;
    const to = from + perPage;
    enriched = enriched.slice(from, to);
  }

  return { enriched, total };
}
