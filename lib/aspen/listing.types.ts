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
  ranchEstateFeatured?: boolean;
  createdAt?: string;
}
