import { BlogPost, CmsTestimonial, Listing } from '@/lib/types';

export interface CmsClientConfig {
  baseUrl: string;
  tenantId: string;
  apiKey: string;
}

export interface ListingsQueryOptions {
  status?: 'for_sale' | 'pending' | 'sold';
  city?: string;
  propertyType?: string;
  search?: string;
  ids?: string[];
  sort?: 'price_asc' | 'price_desc' | 'date_added_desc' | 'custom_order';
  page?: number;
  pageSize?: number;
}

interface PaginatedResponse<T> {
  apiVersion: 'v1';
  tenant: string;
  items: T[];
  pagination: { page: number; pageSize: number; total: number };
}

interface SingleResponse<T> {
  apiVersion: 'v1';
  tenant: string;
  item: T;
}

interface TestimonialsQueryOptions {
  source?: 'manual' | 'google';
  minRating?: number;
  sort?: 'sort_order_asc' | 'rating_desc' | 'created_desc';
  page?: number;
  pageSize?: number;
}

function buildHeaders(apiKey: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  };
}

async function getJson<T>(url: string, apiKey: string): Promise<T> {
  const response = await fetch(url, {
    headers: buildHeaders(apiKey),
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    throw new Error(`CMS request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

function buildListingsUrl(prefix: string, options?: ListingsQueryOptions): string {
  const url = new URL(`${prefix}/listings`, 'http://placeholder');
  if (!options) return `${prefix}/listings`;

  if (options.status) url.searchParams.set('status', options.status);
  if (options.city) url.searchParams.set('city', options.city);
  if (options.propertyType) url.searchParams.set('propertyType', options.propertyType);
  if (options.search) url.searchParams.set('search', options.search);
  if (options.ids?.length) url.searchParams.set('ids', options.ids.join(','));
  if (options.sort) url.searchParams.set('sort', options.sort);
  if (options.page) url.searchParams.set('page', String(options.page));
  if (options.pageSize) url.searchParams.set('pageSize', String(options.pageSize));

  return `${prefix}/listings${url.search}`;
}

export function createCmsClient(config: CmsClientConfig) {
  const prefix = `${config.baseUrl.replace(/\/$/, '')}/api/public/${config.tenantId}`;

  return {
    async getListings(options?: ListingsQueryOptions): Promise<{
      items: Listing[];
      pagination: { page: number; pageSize: number; total: number };
    }> {
      const data = await getJson<PaginatedResponse<Listing>>(
        buildListingsUrl(prefix, options),
        config.apiKey,
      );
      return { items: data.items || [], pagination: data.pagination };
    },

    async getListingBySlug(slug: string): Promise<Listing | null> {
      const data = await getJson<SingleResponse<Listing>>(
        `${prefix}/listings/${encodeURIComponent(slug)}`,
        config.apiKey,
      );
      return data.item || null;
    },

    async getPosts(options?: {
      status?: 'draft' | 'published' | 'archived';
      category?: string;
      tag?: string;
      sort?: 'published_desc' | 'published_asc' | 'title_asc' | 'title_desc';
      page?: number;
      pageSize?: number;
    }): Promise<BlogPost[]> {
      const url = new URL(`${prefix}/blogs`, 'http://placeholder');
      const merged = { status: 'published', ...options };
      if (merged.status) url.searchParams.set('status', merged.status);
      if (merged.category) url.searchParams.set('category', merged.category);
      if (merged.tag) url.searchParams.set('tag', merged.tag);
      if (merged.sort) url.searchParams.set('sort', merged.sort);
      if (merged.page) url.searchParams.set('page', String(merged.page));
      if (merged.pageSize) url.searchParams.set('pageSize', String(merged.pageSize));
      const data = await getJson<PaginatedResponse<BlogPost>>(`${prefix}/blogs${url.search}`, config.apiKey);
      return data.items || [];
    },

    async getPostBySlug(slug: string): Promise<BlogPost | null> {
      const data = await getJson<SingleResponse<BlogPost>>(
        `${prefix}/blogs/${encodeURIComponent(slug)}`,
        config.apiKey,
      );
      return data.item || null;
    },

    async getGlobals(): Promise<Record<string, unknown>> {
      const data = await getJson<SingleResponse<Record<string, unknown>>>(
        `${prefix}/globals`,
        config.apiKey,
      );
      return data.item || {};
    },

    async getTestimonials(options?: TestimonialsQueryOptions): Promise<CmsTestimonial[]> {
      const url = new URL(`${prefix}/testimonials`, 'http://placeholder');
      if (options?.source) url.searchParams.set('source', options.source);
      if (options?.minRating) url.searchParams.set('minRating', String(options.minRating));
      if (options?.sort) url.searchParams.set('sort', options.sort);
      if (options?.page) url.searchParams.set('page', String(options.page));
      if (options?.pageSize) url.searchParams.set('pageSize', String(options.pageSize));
      const data = await getJson<PaginatedResponse<CmsTestimonial>>(`${prefix}/testimonials${url.search}`, config.apiKey);
      return data.items || [];
    },

    async getTestimonialById(id: string): Promise<CmsTestimonial | null> {
      try {
        const data = await getJson<SingleResponse<CmsTestimonial>>(
          `${prefix}/testimonials/${encodeURIComponent(id)}`,
          config.apiKey,
        );
        return data.item || null;
      } catch {
        return null;
      }
    },
  };
}
