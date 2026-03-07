export interface Listing {
  id: string;
  address: string;
  description: string;
  listPrice: number;
  listingStatus: "active" | "sold" | "pending";
  representation?: string;
  neighborhood: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  yearBuilt: number;
  livingArea: number;
  lotArea: number;
  lotAreaUnit: string;
  taxes: number;
  listingBrokerage: string;
  mlsNumber: string;
  gallery: string[];
  thumbnail: string;
  homepageFeatured?: boolean;
  createdAt?: string;
}

const BOLT_API_URL = process.env.NEXT_PUBLIC_BOLT_API_URL || "";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "";

function statusFromBolt(s: string): "active" | "sold" | "pending" {
  if (s === "for_sale") return "active";
  if (s === "sold") return "sold";
  if (s === "pending") return "pending";
  return "active";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapBoltListing(row: any): Listing {
  const gallery: string[] = [];
  let thumbnail = "";

  if (Array.isArray(row.gallery)) {
    const sorted = [...row.gallery].sort(
      (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
    );
    sorted.forEach((img: any) => {
      if (img.url) gallery.push(img.url);
    });
  }
  thumbnail = row.thumbnail || gallery[0] || "";

  return {
    id: row.id,
    address: row.address ?? "",
    description: row.description ?? "",
    listPrice: Number(row.list_price ?? row.listPrice ?? 0),
    listingStatus: statusFromBolt(
      row.listing_status ?? row.listingStatus ?? "for_sale"
    ),
    representation: row.representation ?? undefined,
    neighborhood: row.neighborhood ?? "",
    city: row.city ?? "",
    bedrooms: Number(row.bedrooms ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    propertyType: row.property_type ?? row.propertyType ?? "",
    yearBuilt: Number(row.year_built ?? row.yearBuilt ?? 0),
    livingArea: Number(row.living_area_sqft ?? row.livingAreaSqft ?? 0),
    lotArea: Number(row.lot_area_value ?? row.lotAreaValue ?? 0),
    lotAreaUnit: row.lot_area_unit ?? row.lotAreaUnit ?? "acres",
    taxes: Number(row.taxes_annual ?? row.taxesAnnual ?? 0),
    listingBrokerage: row.listing_brokerage ?? row.listingBrokerage ?? "",
    mlsNumber: row.mls_number ?? row.mlsNumber ?? "",
    gallery,
    thumbnail,
    homepageFeatured: row.homepage_featured ?? row.homepageFeatured ?? false,
    createdAt: row.created_at ?? row.createdAt ?? undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function fetchListings(params?: Record<string, string>): Promise<Listing[]> {
  if (!BOLT_API_URL || !TENANT_ID) return fallbackListings;

  try {
    const url = new URL(`${BOLT_API_URL}/api/public/listings`);
    url.searchParams.set("tenantId", TENANT_ID);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) return fallbackListings;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return fallbackListings;
    return rows.map(mapBoltListing);
  } catch {
    return fallbackListings;
  }
}

export async function getActiveListings(): Promise<Listing[]> {
  const all = await fetchListings({ status: "for_sale" });
  return all.filter((l) => l.listingStatus === "active");
}

export async function getSoldListings(): Promise<Listing[]> {
  const all = await fetchListings({ status: "sold" });
  return all.filter((l) => l.listingStatus === "sold");
}

export async function getFeaturedListings(): Promise<Listing[]> {
  const all = await fetchListings({ featured: "true" });
  if (all.length === 0) {
    const recent = await fetchListings();
    return recent.slice(0, 6);
  }
  return all.sort((a, b) => b.listPrice - a.listPrice);
}

export async function getAllListings(): Promise<Listing[]> {
  return fetchListings();
}

export async function getListingById(id: string): Promise<Listing | undefined> {
  const all = await fetchListings();
  return all.find((l) => l.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(price);
}

// Hardcoded fallback data used when Bolt API is unavailable
const fallbackListings: Listing[] = [
  {
    id: "1",
    address: "33289 Lakeview Court",
    description:
      "<p>Stunning lakefront property with panoramic views of the Rocky Mountains.</p>",
    listPrice: 1200000,
    listingStatus: "active",
    representation: "Seller",
    neighborhood: "Lakeview Estates",
    city: "Sundre",
    bedrooms: 5,
    bathrooms: 4,
    propertyType: "Detached",
    yearBuilt: 2018,
    livingArea: 3800,
    lotArea: 2.5,
    lotAreaUnit: "acres",
    taxes: 6200,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2045671",
    gallery: [
      "/images/featured-1.webp",
      "/images/featured-2.webp",
      "/images/featured-3.webp",
    ],
    thumbnail: "/images/featured-1.webp",
    homepageFeatured: true,
  },
  {
    id: "2",
    address: "22034 Lakeview Drive",
    description:
      "<p>A beautifully crafted home nestled along Lakeview Drive.</p>",
    listPrice: 1350000,
    listingStatus: "active",
    neighborhood: "Lakeview",
    city: "Sundre",
    bedrooms: 5,
    bathrooms: 3.5,
    propertyType: "Detached",
    yearBuilt: 2020,
    livingArea: 4200,
    lotArea: 1.8,
    lotAreaUnit: "acres",
    taxes: 7100,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2051234",
    gallery: [
      "/images/featured-2.webp",
      "/images/featured-1.webp",
      "/images/featured-3.webp",
    ],
    thumbnail: "/images/featured-2.webp",
    homepageFeatured: true,
  },
  {
    id: "3",
    address: "33291 Lakeview Court",
    description:
      "<p>Contemporary ranch-style home on a generous lot.</p>",
    listPrice: 1200000,
    listingStatus: "active",
    representation: "Buyer",
    neighborhood: "Lakeview Estates",
    city: "Sundre",
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Detached",
    yearBuilt: 2019,
    livingArea: 3200,
    lotArea: 1.5,
    lotAreaUnit: "acres",
    taxes: 5800,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2048890",
    gallery: [
      "/images/featured-3.webp",
      "/images/featured-1.webp",
      "/images/featured-2.webp",
    ],
    thumbnail: "/images/featured-3.webp",
    homepageFeatured: true,
  },
  {
    id: "13",
    address: "78901 Range Road 54",
    description:
      "<p>Beautiful ranch property sold representing the buyer.</p>",
    listPrice: 1475000,
    listingStatus: "sold",
    representation: "Buyer",
    neighborhood: "Rural Sundre",
    city: "Sundre",
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Ranch/Farm",
    yearBuilt: 2010,
    livingArea: 2700,
    lotArea: 120,
    lotAreaUnit: "acres",
    taxes: 4800,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2015678",
    gallery: [
      "/images/featured-2.webp",
      "/images/featured-1.webp",
      "/images/featured-3.webp",
    ],
    thumbnail: "/images/featured-2.webp",
  },
  {
    id: "14",
    address: "12500 Mountain Avenue",
    description:
      "<p>Charming family home on a generous lot in Sundre.</p>",
    listPrice: 485000,
    listingStatus: "sold",
    representation: "Seller",
    neighborhood: "Mountain Avenue",
    city: "Sundre",
    bedrooms: 4,
    bathrooms: 2,
    propertyType: "Detached",
    yearBuilt: 1998,
    livingArea: 1600,
    lotArea: 8500,
    lotAreaUnit: "sq ft",
    taxes: 2900,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2022345",
    gallery: [
      "/images/featured-3.webp",
      "/images/featured-2.webp",
      "/images/featured-1.webp",
    ],
    thumbnail: "/images/featured-3.webp",
  },
  {
    id: "15",
    address: "6780 Ridgeview Place",
    description:
      "<p>Executive bungalow in Olds premier Ridgeview neighbourhood.</p>",
    listPrice: 795000,
    listingStatus: "sold",
    neighborhood: "Ridgeview",
    city: "Olds",
    bedrooms: 3,
    bathrooms: 2.5,
    propertyType: "Detached",
    yearBuilt: 2019,
    livingArea: 2200,
    lotArea: 10500,
    lotAreaUnit: "sq ft",
    taxes: 4100,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2028901",
    gallery: [
      "/images/featured-1.webp",
      "/images/featured-3.webp",
      "/images/featured-2.webp",
    ],
    thumbnail: "/images/featured-1.webp",
  },
];

export { fallbackListings as listings };
