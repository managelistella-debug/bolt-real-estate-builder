import { getServiceClient } from '@/lib/supabase/server';
import {
  BlogPost,
  CmsFormSubmission,
  CmsIntegrationConfig,
  CmsTestimonial,
  ImageCollection,
  Lead,
  Listing,
} from '@/lib/types';

type ApiScope = 'content:read' | 'content:write' | 'forms:write';

export interface TenantApiKeyRecord {
  key: string;
  scopes: ApiScope[];
  createdAt: string;
}

export interface TenantGlobalSettings {
  phone?: string;
  emailRouting?: string[];
  socialLinks?: Array<{ platform: string; url: string }>;
  brokerageInfo?: string;
  footerText?: string;
  updatedAt: string;
}

export interface TenantDomainRecord {
  domain: string;
  projectId?: string;
  status: 'not_started' | 'pending_dns' | 'verifying' | 'connected' | 'error';
  isPrimary: boolean;
  verificationError?: string;
  updatedAt: string;
}

export interface TenantIntegrationRecord {
  revalidationWebhookUrl?: string;
  revalidationStatus: 'idle' | 'ok' | 'error';
  updatedAt: string;
}

export interface TenantRecord {
  tenantId: string;
  userId: string;
  websiteId: string;
  apiKeys: TenantApiKeyRecord[];
  listings: Listing[];
  blogs: BlogPost[];
  testimonials: CmsTestimonial[];
  mediaCollections: ImageCollection[];
  leads: Lead[];
  submissions: CmsFormSubmission[];
  integrations: CmsIntegrationConfig;
  globals: TenantGlobalSettings;
  domains: TenantDomainRecord[];
  infra: TenantIntegrationRecord;
}

// ---------------------------------------------------------------------------
// Row ↔ App mappers
// ---------------------------------------------------------------------------

function rowToListing(r: any): Listing {
  return {
    id: r.id,
    userId: r.user_id,
    tenantId: r.tenant_id,
    slug: r.slug,
    address: r.address,
    description: r.description,
    listPrice: Number(r.list_price),
    neighborhood: r.neighborhood,
    city: r.city,
    listingStatus: r.listing_status,
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    propertyType: r.property_type,
    yearBuilt: r.year_built,
    livingAreaSqft: r.living_area_sqft,
    lotAreaValue: Number(r.lot_area_value),
    lotAreaUnit: r.lot_area_unit,
    taxesAnnual: Number(r.taxes_annual),
    listingBrokerage: r.listing_brokerage,
    mlsNumber: r.mls_number,
    representation: r.representation ?? undefined,
    gallery: r.gallery ?? [],
    customOrder: r.custom_order,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

function listingToRow(l: Listing, tenantId: string) {
  return {
    id: l.id,
    tenant_id: tenantId,
    user_id: l.userId,
    slug: l.slug,
    address: l.address,
    description: l.description,
    list_price: l.listPrice,
    neighborhood: l.neighborhood,
    city: l.city,
    listing_status: l.listingStatus,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    property_type: l.propertyType,
    year_built: l.yearBuilt,
    living_area_sqft: l.livingAreaSqft,
    lot_area_value: l.lotAreaValue,
    lot_area_unit: l.lotAreaUnit,
    taxes_annual: l.taxesAnnual,
    listing_brokerage: l.listingBrokerage,
    mls_number: l.mlsNumber,
    representation: l.representation ?? null,
    gallery: l.gallery,
    custom_order: l.customOrder,
    created_at: l.createdAt instanceof Date ? l.createdAt.toISOString() : l.createdAt,
    updated_at: l.updatedAt instanceof Date ? l.updatedAt.toISOString() : l.updatedAt,
  };
}

function rowToBlogPost(r: any): BlogPost {
  return {
    id: r.id,
    userId: r.user_id,
    tenantId: r.tenant_id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt ?? undefined,
    metaDescription: r.meta_description ?? undefined,
    contentHtml: r.content_html,
    featuredImage: r.featured_image ?? undefined,
    authorName: r.author_name ?? undefined,
    tags: r.tags ?? [],
    category: r.category ?? undefined,
    status: r.status,
    templateId: r.template_id,
    customOrder: r.custom_order,
    publishedAt: r.published_at ? new Date(r.published_at) : undefined,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

function blogToRow(b: BlogPost, tenantId: string) {
  return {
    id: b.id,
    tenant_id: tenantId,
    user_id: b.userId,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt ?? null,
    meta_description: b.metaDescription ?? null,
    content_html: b.contentHtml,
    featured_image: b.featuredImage ?? null,
    author_name: b.authorName ?? null,
    tags: b.tags,
    category: b.category ?? null,
    status: b.status,
    template_id: b.templateId,
    custom_order: b.customOrder,
    published_at: b.publishedAt ? (b.publishedAt instanceof Date ? b.publishedAt.toISOString() : b.publishedAt) : null,
    created_at: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
    updated_at: b.updatedAt instanceof Date ? b.updatedAt.toISOString() : b.updatedAt,
  };
}

function rowToTestimonial(r: any): CmsTestimonial {
  return {
    id: r.id,
    userId: r.user_id,
    tenantId: r.tenant_id,
    quote: r.quote,
    authorName: r.author_name,
    authorTitle: r.author_title ?? undefined,
    rating: r.rating ?? undefined,
    source: r.source ?? 'manual',
    sortOrder: r.sort_order,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

function testimonialToRow(t: CmsTestimonial, tenantId: string) {
  return {
    id: t.id,
    tenant_id: tenantId,
    user_id: t.userId,
    quote: t.quote,
    author_name: t.authorName,
    author_title: t.authorTitle ?? null,
    rating: t.rating ?? null,
    source: t.source ?? 'manual',
    sort_order: t.sortOrder,
    created_at: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
    updated_at: t.updatedAt instanceof Date ? t.updatedAt.toISOString() : t.updatedAt,
  };
}

function rowToCollection(r: any): ImageCollection {
  return {
    id: r.id,
    userId: r.user_id,
    name: r.name,
    images: r.images ?? [],
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

function collectionToRow(c: ImageCollection, tenantId: string) {
  return {
    id: c.id,
    tenant_id: tenantId,
    user_id: c.userId,
    name: c.name,
    images: c.images,
    created_at: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    updated_at: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
  };
}

function rowToLead(r: any): Lead {
  return {
    id: r.id,
    websiteId: r.website_id,
    tenantId: r.tenant_id,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    phone: r.phone ?? undefined,
    message: r.message ?? undefined,
    status: r.status,
    tags: r.tags ?? [],
    sourcePage: r.source_page,
    ownerId: r.owner_id ?? undefined,
    customFields: r.custom_fields ?? {},
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

function leadToRow(l: Lead, tenantId: string) {
  return {
    id: l.id,
    tenant_id: tenantId,
    website_id: l.websiteId,
    first_name: l.firstName,
    last_name: l.lastName,
    email: l.email,
    phone: l.phone ?? null,
    message: l.message ?? null,
    status: l.status,
    tags: l.tags,
    source_page: l.sourcePage,
    owner_id: l.ownerId ?? null,
    custom_fields: l.customFields ?? {},
    created_at: l.createdAt instanceof Date ? l.createdAt.toISOString() : l.createdAt,
    updated_at: l.updatedAt instanceof Date ? l.updatedAt.toISOString() : l.updatedAt,
  };
}

function rowToSubmission(r: any): CmsFormSubmission {
  return {
    id: r.id,
    userId: r.user_id,
    tenantId: r.tenant_id,
    websiteId: r.website_id,
    formKey: r.form_key,
    sourcePage: r.source_page ?? undefined,
    contact: r.contact ?? {},
    payload: r.payload ?? {},
    createdAt: new Date(r.created_at),
  };
}

function submissionToRow(s: CmsFormSubmission, tenantId: string) {
  return {
    id: s.id,
    tenant_id: tenantId,
    user_id: s.userId,
    website_id: s.websiteId,
    form_key: s.formKey,
    source_page: s.sourcePage ?? null,
    contact: s.contact,
    payload: s.payload,
    created_at: s.createdAt instanceof Date ? s.createdAt.toISOString() : s.createdAt,
  };
}

function rowToDomain(r: any): TenantDomainRecord {
  return {
    domain: r.domain,
    projectId: r.project_id ?? undefined,
    status: r.status,
    isPrimary: r.is_primary,
    verificationError: r.verification_error ?? undefined,
    updatedAt: r.updated_at,
  };
}

function rowToGlobals(r: any | null): TenantGlobalSettings {
  if (!r) return { updatedAt: new Date().toISOString() };
  return {
    phone: r.phone ?? undefined,
    emailRouting: r.email_routing ?? [],
    socialLinks: r.social_links ?? [],
    brokerageInfo: r.brokerage_info ?? undefined,
    footerText: r.footer_text ?? undefined,
    updatedAt: r.updated_at ?? new Date().toISOString(),
  };
}

function rowToInfra(r: any | null): TenantIntegrationRecord {
  if (!r) return { revalidationStatus: 'idle', updatedAt: new Date().toISOString() };
  return {
    revalidationWebhookUrl: r.revalidation_webhook_url ?? undefined,
    revalidationStatus: r.revalidation_status ?? 'idle',
    updatedAt: r.updated_at ?? new Date().toISOString(),
  };
}

function rowToIntegrationConfig(r: any | null, tenantId: string): CmsIntegrationConfig {
  if (!r) {
    return {
      userId: tenantId,
      tenantId,
      google: { enabled: false },
      resend: { enabled: false },
      contactRouting: { enabled: true, forwardTo: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  return {
    userId: r.user_id,
    tenantId,
    google: r.google ?? { enabled: false },
    resend: r.resend ?? { enabled: false },
    contactRouting: r.contact_routing ?? { enabled: true, forwardTo: [] },
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

// ---------------------------------------------------------------------------
// Public API — same signatures as before
// ---------------------------------------------------------------------------

function db() {
  return getServiceClient();
}

export async function getTenantRecord(tenantId: string): Promise<TenantRecord | undefined> {
  const supabase = db();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single();

  if (!tenant) return undefined;

  const [
    apiKeysRes,
    listingsRes,
    blogsRes,
    testimonialsRes,
    collectionsRes,
    leadsRes,
    submissionsRes,
    globalsRes,
    domainsRes,
    infraRes,
    integrationsRes,
  ] = await Promise.all([
    supabase.from('api_keys').select('*').eq('tenant_id', tenantId),
    supabase.from('listings').select('*').eq('tenant_id', tenantId).order('custom_order'),
    supabase.from('blog_posts').select('*').eq('tenant_id', tenantId).order('custom_order'),
    supabase.from('testimonials').select('*').eq('tenant_id', tenantId).order('sort_order'),
    supabase.from('image_collections').select('*').eq('tenant_id', tenantId),
    supabase.from('leads').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }),
    supabase.from('form_submissions').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }),
    supabase.from('tenant_globals').select('*').eq('tenant_id', tenantId).single(),
    supabase.from('tenant_domains').select('*').eq('tenant_id', tenantId),
    supabase.from('tenant_infra').select('*').eq('tenant_id', tenantId).single(),
    supabase.from('integration_configs').select('*').eq('tenant_id', tenantId).single(),
  ]);

  return {
    tenantId: tenant.id,
    userId: tenant.user_id,
    websiteId: tenant.website_id,
    apiKeys: (apiKeysRes.data ?? []).map((r) => ({
      key: r.key,
      scopes: r.scopes as ApiScope[],
      createdAt: r.created_at,
    })),
    listings: (listingsRes.data ?? []).map(rowToListing),
    blogs: (blogsRes.data ?? []).map(rowToBlogPost),
    testimonials: (testimonialsRes.data ?? []).map(rowToTestimonial),
    mediaCollections: (collectionsRes.data ?? []).map(rowToCollection),
    leads: (leadsRes.data ?? []).map(rowToLead),
    submissions: (submissionsRes.data ?? []).map(rowToSubmission),
    integrations: rowToIntegrationConfig(integrationsRes.data, tenantId),
    globals: rowToGlobals(globalsRes.data),
    domains: (domainsRes.data ?? []).map(rowToDomain),
    infra: rowToInfra(infraRes.data),
  };
}

export async function ensureTenantRecord(tenantId: string): Promise<TenantRecord> {
  const existing = await getTenantRecord(tenantId);
  if (existing) return existing;

  const supabase = db();
  const now = new Date().toISOString();

  await supabase.from('tenants').insert({
    id: tenantId,
    user_id: tenantId,
    website_id: `website-${tenantId}`,
  });

  await supabase.from('api_keys').insert({
    tenant_id: tenantId,
    key: `demo_public_key_${tenantId}`,
    scopes: ['content:read', 'forms:write'],
  });

  await supabase.from('tenant_globals').insert({ tenant_id: tenantId });
  await supabase.from('tenant_infra').insert({ tenant_id: tenantId });
  await supabase.from('integration_configs').insert({
    tenant_id: tenantId,
    user_id: tenantId,
  });

  const created = await getTenantRecord(tenantId);
  return created!;
}

export async function upsertTenantRecord(
  tenantId: string,
  updater: (current: TenantRecord) => TenantRecord,
): Promise<TenantRecord> {
  const current = (await getTenantRecord(tenantId)) ?? (await ensureTenantRecord(tenantId));
  const next = updater(current);
  const supabase = db();

  // Diff and persist each sub-collection
  await syncListings(supabase, tenantId, current.listings, next.listings);
  await syncBlogPosts(supabase, tenantId, current.blogs, next.blogs);
  await syncTestimonials(supabase, tenantId, current.testimonials, next.testimonials);
  await syncCollections(supabase, tenantId, current.mediaCollections, next.mediaCollections);
  await syncLeads(supabase, tenantId, current.leads, next.leads);
  await syncSubmissions(supabase, tenantId, current.submissions, next.submissions);

  // Globals
  if (JSON.stringify(next.globals) !== JSON.stringify(current.globals)) {
    await supabase.from('tenant_globals').upsert({
      tenant_id: tenantId,
      phone: next.globals.phone ?? null,
      email_routing: next.globals.emailRouting ?? [],
      social_links: next.globals.socialLinks ?? [],
      brokerage_info: next.globals.brokerageInfo ?? null,
      footer_text: next.globals.footerText ?? null,
    });
  }

  // Infra
  if (JSON.stringify(next.infra) !== JSON.stringify(current.infra)) {
    await supabase.from('tenant_infra').upsert({
      tenant_id: tenantId,
      revalidation_webhook_url: next.infra.revalidationWebhookUrl ?? null,
      revalidation_status: next.infra.revalidationStatus,
    });
  }

  // Integrations
  if (JSON.stringify(next.integrations) !== JSON.stringify(current.integrations)) {
    await supabase.from('integration_configs').upsert({
      tenant_id: tenantId,
      user_id: next.integrations.userId,
      google: next.integrations.google,
      resend: next.integrations.resend,
      contact_routing: next.integrations.contactRouting ?? { enabled: true, forwardTo: [] },
    });
  }

  // API keys
  if (JSON.stringify(next.apiKeys) !== JSON.stringify(current.apiKeys)) {
    const currentKeys = new Set(current.apiKeys.map((k) => k.key));
    const newKeys = next.apiKeys.filter((k) => !currentKeys.has(k.key));
    for (const nk of newKeys) {
      await supabase.from('api_keys').insert({
        tenant_id: tenantId,
        key: nk.key,
        scopes: nk.scopes,
      });
    }
  }

  // Domains
  if (JSON.stringify(next.domains) !== JSON.stringify(current.domains)) {
    await supabase.from('tenant_domains').delete().eq('tenant_id', tenantId);
    if (next.domains.length > 0) {
      await supabase.from('tenant_domains').insert(
        next.domains.map((d) => ({
          tenant_id: tenantId,
          domain: d.domain,
          project_id: d.projectId ?? null,
          status: d.status,
          is_primary: d.isPrimary,
          verification_error: d.verificationError ?? null,
        })),
      );
    }
  }

  return (await getTenantRecord(tenantId))!;
}

export async function verifyTenantApiKey(
  tenantId: string,
  apiKey: string,
  scope: ApiScope,
): Promise<boolean> {
  const supabase = db();
  const { data } = await supabase
    .from('api_keys')
    .select('scopes')
    .eq('tenant_id', tenantId)
    .eq('key', apiKey)
    .single();

  if (!data) return false;
  return (data.scopes as string[]).includes(scope);
}

// ---------------------------------------------------------------------------
// Sub-collection sync helpers (upsert new/changed, delete removed)
// ---------------------------------------------------------------------------

type SupabaseClient = ReturnType<typeof getServiceClient>;

async function syncListings(sb: SupabaseClient, tid: string, prev: Listing[], next: Listing[]) {
  const prevIds = new Set(prev.map((x) => x.id));
  const nextIds = new Set(next.map((x) => x.id));

  const removed = prev.filter((x) => !nextIds.has(x.id));
  const upserted = next.filter((x) => {
    if (!prevIds.has(x.id)) return true;
    const old = prev.find((o) => o.id === x.id);
    return JSON.stringify(old) !== JSON.stringify(x);
  });

  if (removed.length) {
    await sb.from('listings').delete().in('id', removed.map((x) => x.id));
  }
  for (const item of upserted) {
    await sb.from('listings').upsert(listingToRow(item, tid));
  }
}

async function syncBlogPosts(sb: SupabaseClient, tid: string, prev: BlogPost[], next: BlogPost[]) {
  const prevIds = new Set(prev.map((x) => x.id));
  const nextIds = new Set(next.map((x) => x.id));

  const removed = prev.filter((x) => !nextIds.has(x.id));
  const upserted = next.filter((x) => {
    if (!prevIds.has(x.id)) return true;
    const old = prev.find((o) => o.id === x.id);
    return JSON.stringify(old) !== JSON.stringify(x);
  });

  if (removed.length) {
    await sb.from('blog_posts').delete().in('id', removed.map((x) => x.id));
  }
  for (const item of upserted) {
    await sb.from('blog_posts').upsert(blogToRow(item, tid));
  }
}

async function syncTestimonials(sb: SupabaseClient, tid: string, prev: CmsTestimonial[], next: CmsTestimonial[]) {
  const prevIds = new Set(prev.map((x) => x.id));
  const nextIds = new Set(next.map((x) => x.id));

  const removed = prev.filter((x) => !nextIds.has(x.id));
  const upserted = next.filter((x) => {
    if (!prevIds.has(x.id)) return true;
    const old = prev.find((o) => o.id === x.id);
    return JSON.stringify(old) !== JSON.stringify(x);
  });

  if (removed.length) {
    await sb.from('testimonials').delete().in('id', removed.map((x) => x.id));
  }
  for (const item of upserted) {
    await sb.from('testimonials').upsert(testimonialToRow(item, tid));
  }
}

async function syncCollections(sb: SupabaseClient, tid: string, prev: ImageCollection[], next: ImageCollection[]) {
  const prevIds = new Set(prev.map((x) => x.id));
  const nextIds = new Set(next.map((x) => x.id));

  const removed = prev.filter((x) => !nextIds.has(x.id));
  const upserted = next.filter((x) => {
    if (!prevIds.has(x.id)) return true;
    const old = prev.find((o) => o.id === x.id);
    return JSON.stringify(old) !== JSON.stringify(x);
  });

  if (removed.length) {
    await sb.from('image_collections').delete().in('id', removed.map((x) => x.id));
  }
  for (const item of upserted) {
    await sb.from('image_collections').upsert(collectionToRow(item, tid));
  }
}

async function syncLeads(sb: SupabaseClient, tid: string, prev: Lead[], next: Lead[]) {
  const prevIds = new Set(prev.map((x) => x.id));
  const nextIds = new Set(next.map((x) => x.id));

  const removed = prev.filter((x) => !nextIds.has(x.id));
  const upserted = next.filter((x) => {
    if (!prevIds.has(x.id)) return true;
    const old = prev.find((o) => o.id === x.id);
    return JSON.stringify(old) !== JSON.stringify(x);
  });

  if (removed.length) {
    await sb.from('leads').delete().in('id', removed.map((x) => x.id));
  }
  for (const item of upserted) {
    await sb.from('leads').upsert(leadToRow(item, tid));
  }
}

async function syncSubmissions(sb: SupabaseClient, tid: string, prev: CmsFormSubmission[], next: CmsFormSubmission[]) {
  const prevIds = new Set(prev.map((x) => x.id));
  const nextIds = new Set(next.map((x) => x.id));

  const added = next.filter((x) => !prevIds.has(x.id));

  for (const item of added) {
    await sb.from('form_submissions').insert(submissionToRow(item, tid));
  }
}
