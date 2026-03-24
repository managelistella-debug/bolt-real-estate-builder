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
  /** From WordPress ACF as plain text (e.g. "1 + 1", "2.5") */
  bathrooms: string;
  propertyType: string;
  yearBuilt: number;
  /** Square feet: string from WP keeps commas/text; number = legacy/demo data */
  livingArea: number | string;
  lotArea: number | string;
  lotAreaUnit: string;
  taxes: number;
  listingBrokerage: string;
  mlsNumber: string;
  gallery: string[];
  thumbnail: string;
  homepageFeatured?: boolean;
  ranchEstateFeatured?: boolean;
  createdAt?: string;
}
