import { create } from 'zustand';
import { CmsIntegrationConfig } from '@/lib/types';

interface IntegrationsState {
  configs: CmsIntegrationConfig[];
  loaded: boolean;
  loading: boolean;
  fetchConfig: (tenantId: string) => Promise<void>;
  getConfigForUser: (userId: string) => CmsIntegrationConfig | undefined;
  upsertConfig: (userId: string, patch: Partial<CmsIntegrationConfig>) => void;
}

const buildDefaultConfig = (userId: string): CmsIntegrationConfig => ({
  userId,
  tenantId: userId,
  google: { enabled: false },
  resend: { enabled: false },
  revalidationStatus: 'idle',
  webhookStatus: 'idle',
  contactRouting: { enabled: true, forwardTo: [] },
  createdAt: new Date(),
  updatedAt: new Date(),
});

function rowToConfig(r: any): CmsIntegrationConfig {
  return {
    userId: r.user_id,
    tenantId: r.tenant_id,
    google: r.google ?? { enabled: false },
    resend: r.resend ?? { enabled: false },
    contactRouting: r.contact_routing ?? { enabled: true, forwardTo: [] },
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

function configToRow(c: CmsIntegrationConfig) {
  const tenantId = c.tenantId || c.userId;
  return {
    tenant_id: tenantId,
    user_id: c.userId,
    google: c.google,
    resend: c.resend,
    contact_routing: c.contactRouting ?? { enabled: true, forwardTo: [] },
  };
}

function persistToApi(row: ReturnType<typeof configToRow>) {
  fetch('/api/data/integrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  }).catch(() => undefined);
}

export const useIntegrationsStore = create<IntegrationsState>()(
  (set, get) => ({
    configs: [],
    loaded: false,
    loading: false,

    fetchConfig: async (tenantId) => {
      if (get().loading) return;
      set({ loading: true });
      try {
        const res = await fetch(`/api/data/integrations?tenantId=${encodeURIComponent(tenantId)}`);
        if (!res.ok) throw new Error('fetch failed');
        const row = await res.json();
        if (row) {
          const config = rowToConfig(row);
          set((state) => {
            const others = state.configs.filter((c) => c.userId !== config.userId);
            return { configs: [config, ...others], loaded: true };
          });
        } else {
          set({ loaded: true });
        }
      } catch {
        set({ loaded: true });
      } finally {
        set({ loading: false });
      }
    },

    getConfigForUser: (userId) => get().configs.find((entry) => entry.userId === userId),

    upsertConfig: (userId, patch) =>
      set((state) => {
        const existing = state.configs.find((entry) => entry.userId === userId);
        if (!existing) {
          const next = buildDefaultConfig(userId);
          const created: CmsIntegrationConfig = {
            ...next,
            ...patch,
            google: { ...next.google, ...(patch.google || {}) },
            resend: { ...next.resend, ...(patch.resend || {}) },
            updatedAt: new Date(),
          };
          persistToApi(configToRow(created));
          return { configs: [created, ...state.configs] };
        }
        const updated: CmsIntegrationConfig = {
          ...existing,
          ...patch,
          google: { ...existing.google, ...(patch.google || {}) },
          resend: { ...existing.resend, ...(patch.resend || {}) },
          updatedAt: new Date(),
        };
        persistToApi(configToRow(updated));
        return {
          configs: state.configs.map((entry) => (entry.userId === userId ? updated : entry)),
        };
      }),
  })
);
