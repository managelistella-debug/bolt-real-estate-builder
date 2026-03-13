export interface Listing {
  id: string;
  slug: string;
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

export async function getActiveListings(): Promise<Listing[]> {
  return fallbackListings.filter((listing) => listing.listingStatus === "active");
}

export async function getSoldListings(): Promise<Listing[]> {
  return fallbackListings.filter((listing) => listing.listingStatus === "sold");
}

export async function getFeaturedListings(): Promise<Listing[]> {
  const featured = fallbackListings
    .filter((listing) => listing.homepageFeatured)
    .sort((a, b) => b.listPrice - a.listPrice);
  if (featured.length > 0) return featured;
  return fallbackListings.slice(0, 6);
}

export async function getAllListings(): Promise<Listing[]> {
  return [...fallbackListings];
}

export async function getListingById(id: string): Promise<Listing | undefined> {
  return fallbackListings.find((listing) => listing.id === id);
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  return fallbackListings.find((listing) => listing.slug === slug);
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
    slug: "33289-lakeview-court",
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
    slug: "22034-lakeview-drive",
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
    slug: "33291-lakeview-court",
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
    slug: "78901-range-road-54",
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
    slug: "12500-mountain-avenue",
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
    slug: "6780-ridgeview-place",
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
