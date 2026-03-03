import { BlogPost, CmsFormSubmission, CmsIntegrationConfig, CmsTestimonial, ImageCollection, Lead, Listing } from '@/lib/types';

type TenantDataset = {
  userId: string;
  websiteId: string;
  apiKeys: Array<{ key: string; scopes: Array<'content:read' | 'forms:write'> }>;
  listings: Listing[];
  blogs: BlogPost[];
  testimonials: CmsTestimonial[];
  mediaCollections: ImageCollection[];
  leads: Lead[];
  submissions: CmsFormSubmission[];
  integrations: CmsIntegrationConfig;
};

const now = new Date();

const datasets = new Map<string, TenantDataset>([
  [
    'business-1',
    {
      userId: '3',
      websiteId: 'website-3',
      apiKeys: [{ key: 'demo_public_key_business_1', scopes: ['content:read', 'forms:write'] }],
      listings: [],
      blogs: [],
      testimonials: [],
      mediaCollections: [],
      leads: [],
      submissions: [],
      integrations: {
        userId: '3',
        google: { enabled: false },
        resend: { enabled: false },
        createdAt: now,
        updatedAt: now,
      },
    },
  ],
]);

export function ensureTenantDataset(tenantId: string): TenantDataset {
  const existing = datasets.get(tenantId);
  if (existing) return existing;
  const created: TenantDataset = {
    userId: tenantId,
    websiteId: `website-${tenantId}`,
    apiKeys: [],
    listings: [],
    blogs: [],
    testimonials: [],
    mediaCollections: [],
    leads: [],
    submissions: [],
    integrations: {
      userId: tenantId,
      google: { enabled: false },
      resend: { enabled: false },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
  datasets.set(tenantId, created);
  return created;
}

export function getTenantDataset(tenantId: string): TenantDataset | undefined {
  return datasets.get(tenantId);
}

export function verifyPublicApiKey(tenantId: string, apiKey: string, requiredScope: 'content:read' | 'forms:write') {
  const dataset = getTenantDataset(tenantId);
  if (!dataset) return false;
  return dataset.apiKeys.some((entry) => entry.key === apiKey && entry.scopes.includes(requiredScope));
}

export function createLeadAndSubmission(tenantId: string, input: {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  message?: string;
  sourcePage?: string;
  formKey: string;
  payload: Record<string, string>;
}) {
  const dataset = ensureTenantDataset(tenantId);
  const submission: CmsFormSubmission = {
    id: `submission_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: dataset.userId,
    websiteId: dataset.websiteId,
    formKey: input.formKey,
    sourcePage: input.sourcePage,
    contact: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
    },
    payload: input.payload,
    createdAt: new Date(),
  };
  dataset.submissions.unshift(submission);

  const lead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    websiteId: dataset.websiteId,
    firstName: input.firstName || 'Unknown',
    lastName: input.lastName || '',
    email: input.email,
    phone: input.phone,
    message: input.message,
    status: 'new',
    tags: [],
    sourcePage: input.sourcePage || input.formKey,
    customFields: input.payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  dataset.leads.unshift(lead);

  return { lead, submission };
}
