export type IntegrationProvider = 'google_reviews' | 'resend';

export interface TenantApiKey {
  id: string;
  userId: string;
  websiteId: string;
  label: string;
  keyPreview: string;
  keyHash: string;
  scopes: Array<'content:read' | 'content:write' | 'forms:write'>;
  createdAt: Date;
  lastUsedAt?: Date;
  revokedAt?: Date;
}

export interface CmsTestimonial {
  id: string;
  userId: string;
  quote: string;
  authorName: string;
  authorTitle?: string;
  rating?: number;
  source?: 'manual' | 'google';
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CmsFieldMapping {
  id: string;
  userId: string;
  formKey: string;
  externalField: string;
  internalField: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CmsFormSubmission {
  id: string;
  userId: string;
  websiteId: string;
  formKey: string;
  sourcePage?: string;
  contact: {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
  };
  payload: Record<string, string>;
  createdAt: Date;
}

export interface GoogleReviewsIntegrationConfig {
  apiKey?: string;
  placeId?: string;
  enabled: boolean;
  lastSyncedAt?: Date;
}

export interface ResendIntegrationConfig {
  apiKey?: string;
  defaultRecipient?: string;
  enabled: boolean;
}

export interface CmsIntegrationConfig {
  userId: string;
  google: GoogleReviewsIntegrationConfig;
  resend: ResendIntegrationConfig;
  createdAt: Date;
  updatedAt: Date;
}
