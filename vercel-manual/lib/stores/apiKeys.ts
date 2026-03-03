import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TenantApiKey } from '@/lib/types';

interface ApiKeysState {
  keys: TenantApiKey[];
  createKey: (input: {
    userId: string;
    websiteId: string;
    label: string;
    scopes: TenantApiKey['scopes'];
    rawKey: string;
  }) => TenantApiKey;
  revokeKey: (id: string) => void;
  getKeysForUser: (userId: string) => TenantApiKey[];
}

export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set, get) => ({
      keys: [],
      createKey: ({ userId, websiteId, label, scopes, rawKey }) => {
        const key: TenantApiKey = {
          id: `api_key_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId,
          websiteId,
          label,
          scopes,
          keyPreview: `${rawKey.slice(0, 4)}...${rawKey.slice(-4)}`,
          keyHash: rawKey,
          createdAt: new Date(),
        };
        set((state) => ({ keys: [key, ...state.keys] }));
        return key;
      },
      revokeKey: (id) =>
        set((state) => ({
          keys: state.keys.map((entry) => (entry.id === id ? { ...entry, revokedAt: new Date() } : entry)),
        })),
      getKeysForUser: (userId) => get().keys.filter((entry) => entry.userId === userId),
    }),
    {
      name: 'api-keys-storage',
      version: 1,
    }
  )
);
