import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
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

export const useIntegrationsStore = create<IntegrationsState>()(
  persist(
    (set, get) => ({
      configs: [],
      loaded: false,
      loading: false,

      fetchConfig: async () => {
        set({ loaded: true });
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
            return { configs: [created, ...state.configs] };
          }
          const updated: CmsIntegrationConfig = {
            ...existing,
            ...patch,
            google: { ...existing.google, ...(patch.google || {}) },
            resend: { ...existing.resend, ...(patch.resend || {}) },
            updatedAt: new Date(),
          };
          return {
            configs: state.configs.map((entry) => (entry.userId === userId ? updated : entry)),
          };
        }),
    }),
    {
      name: 'integrations-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ configs: state.configs }),
    }
  )
);
