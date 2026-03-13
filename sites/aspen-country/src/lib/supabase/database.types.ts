export type ListingStatus = "active" | "sold" | "pending";

export interface ListingRow {
  id: string;
  slug: string;
  address: string;
  description: string;
  list_price: number;
  listing_status: ListingStatus;
  representation: string | null;
  neighborhood: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  year_built: number;
  living_area: number;
  lot_area: number;
  lot_area_unit: string;
  taxes: number;
  listing_brokerage: string;
  mls_number: string;
  gallery: string[];
  thumbnail: string;
  homepage_featured: boolean;
  ranch_estate_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  author: string;
  publish_date: string;
  featured_image: string;
  featured_image_alt: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  quote: string;
  author: string;
  rating: number;
  display_context: "home" | "about" | "both";
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: ListingRow;
        Insert: Partial<ListingRow>;
        Update: Partial<ListingRow>;
        Relationships: [];
      };
      blog_posts: {
        Row: BlogPostRow;
        Insert: Partial<BlogPostRow>;
        Update: Partial<BlogPostRow>;
        Relationships: [];
      };
      testimonials: {
        Row: TestimonialRow;
        Insert: Partial<TestimonialRow>;
        Update: Partial<TestimonialRow>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "owner" | "editor";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string;
          role?: "owner" | "editor";
          created_at?: string;
        };
        Update: Partial<{
          email: string;
          name: string;
          role: "owner" | "editor";
        }>;
        Relationships: [];
      };
    };
  };
}
