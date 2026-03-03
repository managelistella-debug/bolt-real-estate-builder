import { promises as fs } from 'fs';
import path from 'path';
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
  vercelProjectId?: string;
  vercelTeamId?: string;
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

interface TenantStoreData {
  version: number;
  tenants: Record<string, TenantRecord>;
}

const STORE_PATH = path.join(process.cwd(), 'data', 'tenant-store.json');
const EMPTY_STORE: TenantStoreData = {
  version: 1,
  tenants: {},
};

async function ensureDir() {
  const dir = path.dirname(STORE_PATH);
  await fs.mkdir(dir, { recursive: true });
}

async function readStore(): Promise<TenantStoreData> {
  await ensureDir();
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as TenantStoreData;
    return parsed?.tenants ? parsed : EMPTY_STORE;
  } catch {
    await writeStore(EMPTY_STORE);
    return EMPTY_STORE;
  }
}

async function writeStore(store: TenantStoreData): Promise<void> {
  await ensureDir();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function nowIso(): string {
  return new Date().toISOString();
}

function defaultTenant(tenantId: string): TenantRecord {
  const now = nowIso();
  return {
    tenantId,
    userId: tenantId,
    websiteId: `website-${tenantId}`,
    apiKeys: [
      {
        key: `demo_public_key_${tenantId}`,
        scopes: ['content:read', 'forms:write'],
        createdAt: now,
      },
    ],
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
      createdAt: new Date(now),
      updatedAt: new Date(now),
    },
    globals: {
      updatedAt: now,
    },
    domains: [],
    infra: {
      revalidationStatus: 'idle',
      updatedAt: now,
    },
  };
}

export async function getTenantRecord(tenantId: string): Promise<TenantRecord | undefined> {
  const store = await readStore();
  return store.tenants[tenantId];
}

export async function ensureTenantRecord(tenantId: string): Promise<TenantRecord> {
  const store = await readStore();
  const existing = store.tenants[tenantId];
  if (existing) return existing;
  const created = defaultTenant(tenantId);
  store.tenants[tenantId] = created;
  await writeStore(store);
  return created;
}

export async function upsertTenantRecord(tenantId: string, updater: (current: TenantRecord) => TenantRecord): Promise<TenantRecord> {
  const store = await readStore();
  const current = store.tenants[tenantId] || defaultTenant(tenantId);
  const next = updater(current);
  store.tenants[tenantId] = next;
  await writeStore(store);
  return next;
}

export async function verifyTenantApiKey(tenantId: string, apiKey: string, scope: ApiScope): Promise<boolean> {
  const tenant = await getTenantRecord(tenantId);
  if (!tenant) return false;
  return tenant.apiKeys.some((entry) => entry.key === apiKey && entry.scopes.includes(scope));
}
