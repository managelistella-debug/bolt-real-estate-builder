import { getServiceClient } from '@/lib/supabase/server';
import type { BlogPost, Listing, ListingGalleryImage } from '@/lib/types';

type ListingRow = {
  id: string;
  user_id: string;
  tenant_id: string | null;
  slug: string;
  address: string;
  description: string;
  list_price: number;
  neighborhood: string;
  city: string;
  listing_status: Listing['listingStatus'];
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  year_built: number;
  living_area_sqft: number;
  lot_area_value: number;
  lot_area_unit: Listing['lotAreaUnit'];
  taxes_annual: number;
  listing_brokerage: string;
  mls_number: string;
  representation: Listing['representation'] | null;
  gallery: ListingGalleryImage[] | null;
  custom_order: number;
  created_at: string;
  updated_at: string;
};

type BlogRow = {
  id: string;
  user_id: string;
  tenant_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  meta_description: string | null;
  content_html: string;
  featured_image: string | null;
  author_name: string | null;
  tags: string[] | null;
  category: string | null;
  status: BlogPost['status'];
  template_id: string;
  custom_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function rowToListing(row: ListingRow): Listing {
  const sortedGallery = [...(row.gallery ?? [])].sort((a, b) => a.order - b.order);
  return {
    id: row.id,
    userId: row.user_id,
    tenantId: row.tenant_id ?? undefined,
    slug: row.slug,
    address: row.address,
    description: row.description,
    listPrice: Number(row.list_price),
    neighborhood: row.neighborhood,
    city: row.city,
    listingStatus: row.listing_status,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    propertyType: row.property_type,
    yearBuilt: row.year_built,
    livingAreaSqft: row.living_area_sqft,
    lotAreaValue: Number(row.lot_area_value),
    lotAreaUnit: row.lot_area_unit,
    taxesAnnual: Number(row.taxes_annual),
    listingBrokerage: row.listing_brokerage,
    mlsNumber: row.mls_number,
    representation: row.representation ?? undefined,
    gallery: sortedGallery,
    thumbnail: sortedGallery[0]?.url,
    customOrder: row.custom_order ?? 0,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function rowToBlog(row: BlogRow): BlogPost {
  return {
    id: row.id,
    userId: row.user_id,
    tenantId: row.tenant_id ?? undefined,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    contentHtml: row.content_html,
    featuredImage: row.featured_image ?? undefined,
    authorName: row.author_name ?? undefined,
    tags: row.tags ?? [],
    category: row.category ?? undefined,
    status: row.status,
    templateId: row.template_id,
    customOrder: row.custom_order ?? 0,
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function normalizeHost(host?: string | null) {
  if (!host) return '';
  return host.replace(/:\d+$/, '').toLowerCase();
}

async function resolveTenantIdByHost(host?: string | null): Promise<string | null> {
  const normalizedHost = normalizeHost(host);
  if (!normalizedHost || normalizedHost.includes('localhost')) return null;
  const { data } = await getServiceClient()
    .from('tenant_domains')
    .select('tenant_id')
    .eq('domain', normalizedHost)
    .eq('status', 'connected')
    .maybeSingle();
  return data?.tenant_id ?? null;
}

export async function getPublicListingBySlug(slug: string, host?: string | null): Promise<Listing | null> {
  const tenantId = await resolveTenantIdByHost(host);
  const sb = getServiceClient();
  let query = sb
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .limit(1);

  if (tenantId) query = query.eq('tenant_id', tenantId);

  const { data } = await query.maybeSingle<ListingRow>();
  if (!data) return null;
  return rowToListing(data);
}

export async function getPublishedBlogBySlug(slug: string, host?: string | null): Promise<BlogPost | null> {
  const tenantId = await resolveTenantIdByHost(host);
  const sb = getServiceClient();
  let query = sb
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .limit(1);

  if (tenantId) query = query.eq('tenant_id', tenantId);

  const { data } = await query.maybeSingle<BlogRow>();
  if (!data) return null;
  return rowToBlog(data);
}

export async function getRecentPublishedBlogs(
  limit: number,
  options?: { excludeId?: string; host?: string | null },
): Promise<BlogPost[]> {
  const tenantId = await resolveTenantIdByHost(options?.host);
  const sb = getServiceClient();
  let query = sb
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit + 1);

  if (tenantId) query = query.eq('tenant_id', tenantId);

  const { data } = await query;
  if (!data?.length) return [];

  return (data as BlogRow[])
    .filter((row) => row.id !== options?.excludeId)
    .slice(0, limit)
    .map(rowToBlog);
}
