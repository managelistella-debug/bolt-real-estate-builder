/**
 * Minimal WordPress REST shapes. ACF keys follow the navi-style mapping; adjust in mappers if your WP JSON differs.
 */

export type WpRendered = { rendered: string };

export type WpMedia = {
  id?: number;
  source_url?: string;
  alt_text?: string;
};

export type WpTerm = {
  id?: number;
  name?: string;
  slug?: string;
  taxonomy?: string;
};

export type WpRestPost = {
  id: number;
  date?: string;
  date_gmt?: string;
  modified?: string;
  slug: string;
  status?: string;
  link?: string;
  title?: WpRendered;
  content?: WpRendered;
  excerpt?: WpRendered;
  menu_order?: number;
  acf?: Record<string, unknown>;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
    "acf:attachment"?: WpMedia[];
    [key: string]: unknown;
  };
};
