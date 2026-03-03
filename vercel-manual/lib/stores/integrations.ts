import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CmsIntegrationConfig } from '@/lib/types';

interface IntegrationsState {
  configs: CmsIntegrationConfig[];
  getConfigForUser: (userId: string) => CmsIntegrationConfig | undefined;
  upsertConfig: (userId: string, patch: Partial<CmsIntegrationConfig>) => void;
}

const buildDefaultConfig = (userId: string): CmsIntegrationConfig => ({
  userId,
  google: {
    enabled: false,
  },
  resend: {
    enabled: false,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useIntegrationsStore = create<IntegrationsState>()(
  persist(
    (set, get) => ({
      configs: [],
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
      version: 1,
    }
  )
);
