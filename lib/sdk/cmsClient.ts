import { BlogPost, Listing } from '@/lib/types';

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

    async getPosts(): Promise<BlogPost[]> {
      const data = await getJson<PaginatedResponse<BlogPost>>(`${prefix}/blogs`, config.apiKey);
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
  };
}
