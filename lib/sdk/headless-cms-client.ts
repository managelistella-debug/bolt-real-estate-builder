/**
 * HeadlessCMS — Standalone SDK for external websites.
 *
 * Copy this single file into your project and configure it with environment
 * variables. Zero dependencies beyond the Fetch API (Node 18+, any modern browser).
 *
 * Usage (Next.js App Router):
 *
 *   import { createCmsClient } from '@/lib/headless-cms-client';
 *
 *   const cms = createCmsClient({
 *     baseUrl:  process.env.CMS_BASE_URL!,
 *     tenantId: process.env.TENANT_ID!,
 *     apiKey:   process.env.CMS_READ_TOKEN!,
 *   });
 *
 *   // In a server component or generateStaticParams:
 *   const { items } = await cms.getListings({ status: 'for_sale' });
 *   const listing  = await cms.getListingBySlug('123-main-st');
 */

// ─── Types ──────────────────────────────────────────────────────────────────────

export type ListingStatus = 'for_sale' | 'pending' | 'sold';
export type LotAreaUnit = 'sqft' | 'acres';
export type ListingRepresentation = 'buyer_representation' | 'seller_representation';

export interface ListingGalleryImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface Listing {
  id: string;
  userId: string;
  tenantId?: string;
  slug: string;
  address: string;
  description: string;
  listPrice: number;
  neighborhood: string;
  city: string;
  listingStatus: ListingStatus;
  bedrooms: number;
  bathrooms: number | string;
  propertyType: string;
  yearBuilt: number;
  livingAreaSqft: number | string;
  lotAreaValue: number | string;
  lotAreaUnit: LotAreaUnit;
  taxesAnnual: number;
  listingBrokerage: string;
  mlsNumber: string;
  representation?: ListingRepresentation;
  gallery: ListingGalleryImage[];
  customOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  userId: string;
  tenantId?: string;
  title: string;
  slug: string;
  excerpt?: string;
  metaDescription?: string;
  contentHtml: string;
  featuredImage?: string;
  authorName?: string;
  tags: string[];
  templateId: string;
  customOrder: number;
  category?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsTestimonial {
  id: string;
  userId: string;
  tenantId?: string;
  quote: string;
  authorName: string;
  authorTitle?: string;
  rating?: number;
  source?: 'manual' | 'google';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Client Config ──────────────────────────────────────────────────────────────

export interface CmsClientConfig {
  /** Full URL of the HeadlessCMS app, e.g. "https://cms.example.com" */
  baseUrl: string;
  /** Tenant identifier issued during provisioning */
  tenantId: string;
  /** Public API key with `content:read` scope */
  apiKey: string;
  /** ISR revalidation interval in seconds (default 60) */
  revalidate?: number;
}

// ─── Query Options ──────────────────────────────────────────────────────────────

export interface ListingsQueryOptions {
  status?: ListingStatus;
  city?: string;
  propertyType?: string;
  search?: string;
  /** Filter by specific listing IDs */
  ids?: string[];
  sort?: 'price_asc' | 'price_desc' | 'date_added_desc' | 'custom_order';
  page?: number;
  pageSize?: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface BlogQueryOptions {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  tag?: string;
  sort?: 'published_desc' | 'published_asc' | 'title_asc' | 'title_desc';
  page?: number;
  pageSize?: number;
}

export interface TestimonialsQueryOptions {
  source?: 'manual' | 'google';
  minRating?: number;
  sort?: 'sort_order_asc' | 'rating_desc' | 'created_desc';
  page?: number;
  pageSize?: number;
}

// ─── Internal helpers ───────────────────────────────────────────────────────────

interface PaginatedResponse<T> {
  apiVersion: string;
  tenant: string;
  items: T[];
  pagination: Pagination;
}

interface SingleResponse<T> {
  apiVersion: string;
  tenant: string;
  item: T;
}

async function request<T>(url: string, apiKey: string, revalidate: number): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`HeadlessCMS request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

function buildListingsQs(prefix: string, opts?: ListingsQueryOptions): string {
  if (!opts) return `${prefix}/listings`;
  const sp = new URLSearchParams();
  if (opts.status) sp.set('status', opts.status);
  if (opts.city) sp.set('city', opts.city);
  if (opts.propertyType) sp.set('propertyType', opts.propertyType);
  if (opts.search) sp.set('search', opts.search);
  if (opts.ids?.length) sp.set('ids', opts.ids.join(','));
  if (opts.sort) sp.set('sort', opts.sort);
  if (opts.page) sp.set('page', String(opts.page));
  if (opts.pageSize) sp.set('pageSize', String(opts.pageSize));
  const qs = sp.toString();
  return qs ? `${prefix}/listings?${qs}` : `${prefix}/listings`;
}

function buildBlogQs(prefix: string, opts?: BlogQueryOptions): string {
  const sp = new URLSearchParams();
  if (opts?.status) sp.set('status', opts.status);
  if (opts?.category) sp.set('category', opts.category);
  if (opts?.tag) sp.set('tag', opts.tag);
  if (opts?.sort) sp.set('sort', opts.sort);
  if (opts?.page) sp.set('page', String(opts.page));
  if (opts?.pageSize) sp.set('pageSize', String(opts.pageSize));
  const qs = sp.toString();
  return qs ? `${prefix}/blogs?${qs}` : `${prefix}/blogs`;
}

function buildTestimonialsQs(prefix: string, opts?: TestimonialsQueryOptions): string {
  const sp = new URLSearchParams();
  if (opts?.source) sp.set('source', opts.source);
  if (opts?.minRating) sp.set('minRating', String(opts.minRating));
  if (opts?.sort) sp.set('sort', opts.sort);
  if (opts?.page) sp.set('page', String(opts.page));
  if (opts?.pageSize) sp.set('pageSize', String(opts.pageSize));
  const qs = sp.toString();
  return qs ? `${prefix}/testimonials?${qs}` : `${prefix}/testimonials`;
}

// ─── Public Client ──────────────────────────────────────────────────────────────

export function createCmsClient(config: CmsClientConfig) {
  const prefix = `${config.baseUrl.replace(/\/$/, '')}/api/public/${config.tenantId}`;
  const ttl = config.revalidate ?? 60;

  return {
    /**
     * Fetch a paginated list of listings with optional filters.
     *
     * @example
     * const { items, pagination } = await cms.getListings({ status: 'for_sale', sort: 'price_desc' });
     */
    async getListings(
      options?: ListingsQueryOptions,
    ): Promise<{ items: Listing[]; pagination: Pagination }> {
      const data = await request<PaginatedResponse<Listing>>(
        buildListingsQs(prefix, options),
        config.apiKey,
        ttl,
      );
      return { items: data.items ?? [], pagination: data.pagination };
    },

    /**
     * Fetch a single listing by its URL slug.
     *
     * @returns The listing, or `null` if not found.
     */
    async getListingBySlug(slug: string): Promise<Listing | null> {
      try {
        const data = await request<SingleResponse<Listing>>(
          `${prefix}/listings/${encodeURIComponent(slug)}`,
          config.apiKey,
          ttl,
        );
        return data.item ?? null;
      } catch {
        return null;
      }
    },

    /** Fetch blog posts (published by default). */
    async getPosts(options?: BlogQueryOptions): Promise<BlogPost[]> {
      const merged: BlogQueryOptions = { status: 'published', ...options };
      const data = await request<PaginatedResponse<BlogPost>>(
        buildBlogQs(prefix, merged),
        config.apiKey,
        ttl,
      );
      return data.items ?? [];
    },

    /** Fetch a single blog post by slug. */
    async getPostBySlug(slug: string): Promise<BlogPost | null> {
      try {
        const data = await request<SingleResponse<BlogPost>>(
          `${prefix}/blogs/${encodeURIComponent(slug)}`,
          config.apiKey,
          ttl,
        );
        return data.item ?? null;
      } catch {
        return null;
      }
    },

    /** Fetch testimonials for this tenant. */
    async getTestimonials(options?: TestimonialsQueryOptions): Promise<CmsTestimonial[]> {
      const data = await request<PaginatedResponse<CmsTestimonial>>(
        buildTestimonialsQs(prefix, options),
        config.apiKey,
        ttl,
      );
      return data.items ?? [];
    },

    /** Fetch a single testimonial by id. */
    async getTestimonialById(id: string): Promise<CmsTestimonial | null> {
      try {
        const data = await request<SingleResponse<CmsTestimonial>>(
          `${prefix}/testimonials/${encodeURIComponent(id)}`,
          config.apiKey,
          ttl,
        );
        return data.item ?? null;
      } catch {
        return null;
      }
    },

    /** Fetch tenant-level global settings (phone, social links, etc.). */
    async getGlobals(): Promise<Record<string, unknown>> {
      try {
        const data = await request<SingleResponse<Record<string, unknown>>>(
          `${prefix}/globals`,
          config.apiKey,
          ttl,
        );
        return data.item ?? {};
      } catch {
        return {};
      }
    },
  };
}
