export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  rating: number;
  displayContext: "home" | "about" | "both";
  sortOrder: number;
  /** ISO date string (YYYY-MM-DD) from WordPress post date when sourced from WP */
  reviewDate?: string;
}
