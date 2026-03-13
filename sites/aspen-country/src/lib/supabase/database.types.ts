export type ListingStatus = "for_sale" | "sold" | "pending";

export interface ListingRow {
  id: string;
  tenant_id: string;
  user_id: string;
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
  living_area_sqft: number;
  lot_area_value: number;
  lot_area_unit: string;
  taxes_annual: number;
  listing_brokerage: string;
  mls_number: string;
  gallery: Array<{ url: string; order?: number }>;
  custom_order: number;
  thumbnail?: string | null;
  homepage_featured?: boolean | null;
  ranch_estate_featured?: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostRow {
  id: string;
  tenant_id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  meta_description: string | null;
  content_html: string;
  featured_image: string | null;
  author_name: string | null;
  tags: string[];
  category: string | null;
  status: "draft" | "published" | "archived";
  template_id: string;
  custom_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  tenant_id: string;
  user_id: string;
  quote: string;
  author_name: string;
  author_title: string | null;
  rating: number | null;
  source: "manual" | "google";
  sort_order: number;
  display_context?: "home" | "about" | "both" | null;
  is_published?: boolean | null;
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
