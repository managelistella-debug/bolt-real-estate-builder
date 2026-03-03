import { CmsFormSubmission, Lead } from '@/lib/types';
import { ensureTenantRecord, getTenantRecord, upsertTenantRecord, verifyTenantApiKey } from './tenantStore';

export async function ensureTenantDataset(tenantId: string) {
  return ensureTenantRecord(tenantId);
}

export async function getTenantDataset(tenantId: string) {
  return getTenantRecord(tenantId);
}

export async function verifyPublicApiKey(tenantId: string, apiKey: string, requiredScope: 'content:read' | 'forms:write') {
  return verifyTenantApiKey(tenantId, apiKey, requiredScope);
}

export async function createLeadAndSubmission(tenantId: string, input: {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  message?: string;
  sourcePage?: string;
  formKey: string;
  payload: Record<string, string>;
}) {
  const dataset = await ensureTenantRecord(tenantId);
  const submission: CmsFormSubmission = {
    id: `submission_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: dataset.userId,
    tenantId: dataset.tenantId,
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
  const lead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    websiteId: dataset.websiteId,
    tenantId: dataset.tenantId,
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
  await upsertTenantRecord(tenantId, (current) => ({
    ...current,
    leads: [lead, ...current.leads],
    submissions: [submission, ...current.submissions],
  }));

  return { lead, submission };
}

export async function seedTenantApiKey(tenantId: string, key: string) {
  await upsertTenantRecord(tenantId, (current) => {
    if (current.apiKeys.some((entry) => entry.key === key)) {
      return current;
    }
    return {
      ...current,
      apiKeys: [
        ...current.apiKeys,
        {
          key,
          scopes: ['content:read', 'forms:write'],
          createdAt: new Date().toISOString(),
        },
      ],
    };
  });
}

export async function upsertTenantContent(input: {
  tenantId: string;
  type: 'listing' | 'blog' | 'testimonial' | 'media';
  payload: any;
}) {
  await upsertTenantRecord(input.tenantId, (current) => {
    if (input.type === 'listing') {
      return {
        ...current,
        listings: [input.payload, ...current.listings.filter((item) => item.id !== input.payload.id)],
      };
    }
    if (input.type === 'blog') {
      return {
        ...current,
        blogs: [input.payload, ...current.blogs.filter((item) => item.id !== input.payload.id)],
      };
    }
    if (input.type === 'testimonial') {
      return {
        ...current,
        testimonials: [input.payload, ...current.testimonials.filter((item) => item.id !== input.payload.id)],
      };
    }
    return {
      ...current,
      mediaCollections: [input.payload, ...current.mediaCollections.filter((item) => item.id !== input.payload.id)],
    };
  });
}
