import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CmsTestimonial } from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

function toSnakeRow(t: CmsTestimonial) {
  return {
    id: t.id,
    tenant_id: t.tenantId,
    user_id: t.userId,
    quote: t.quote,
    author_name: t.authorName,
    author_title: t.authorTitle || null,
    rating: t.rating ?? null,
    date: t.date || null,
    source: t.source || 'manual',
    sort_order: t.sortOrder,
  };
}

function syncToDb(t: CmsTestimonial) {
  fetch('/api/data/testimonials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toSnakeRow(t)),
  }).catch(() => {});
}

function deleteFromDb(id: string) {
  fetch(`/api/data/testimonials?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }).catch(() => {});
}

interface TestimonialsState {
  testimonials: CmsTestimonial[];
  loaded: boolean;
  loading: boolean;
  fetchTestimonials: (tenantId: string) => Promise<void>;
  addTestimonial: (payload: Omit<CmsTestimonial, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTestimonial: (id: string, patch: Partial<Omit<CmsTestimonial, 'id' | 'userId'>>) => void;
  deleteTestimonial: (id: string) => void;
  getTestimonialsForCurrentUser: (userId?: string) => CmsTestimonial[];
  syncAllToDb: (tenantId: string) => void;
}

export const useTestimonialsStore = create<TestimonialsState>()(
  persist(
    (set, get) => ({
      testimonials: [],
      loaded: false,
      loading: false,

      fetchTestimonials: async (tenantId: string) => {
        if (get().loading) return;
        set({ loading: true });
        try {
          const res = await fetch(`/api/data/testimonials?tenantId=${encodeURIComponent(tenantId)}`);
          if (res.ok) {
            const rows = await res.json();
            const mapped: CmsTestimonial[] = (rows || []).map((r: any) => ({
              id: r.id,
              userId: r.user_id,
              tenantId: r.tenant_id,
              quote: r.quote || '',
              authorName: r.author_name || '',
              authorTitle: r.author_title || undefined,
              rating: r.rating ?? undefined,
              date: r.date || undefined,
              source: r.source || 'manual',
              sortOrder: r.sort_order ?? 0,
              createdAt: new Date(r.created_at),
              updatedAt: new Date(r.updated_at),
            }));
            set((state) => {
              const otherTenant = state.testimonials.filter((t) => t.tenantId !== tenantId && t.userId !== (mapped[0]?.userId));
              return { testimonials: [...otherTenant, ...mapped], loaded: true, loading: false };
            });
          } else {
            set({ loaded: true, loading: false });
          }
        } catch {
          set({ loaded: true, loading: false });
        }
      },

      addTestimonial: (payload) => {
        const t: CmsTestimonial = {
          ...payload,
          id: `testimonial_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ testimonials: [...state.testimonials, t] }));
        syncToDb(t);
      },

      updateTestimonial: (id, patch) => {
        set((state) => ({
          testimonials: state.testimonials.map((entry) => {
            if (entry.id !== id) return entry;
            const updated = { ...entry, ...patch, updatedAt: new Date() };
            syncToDb(updated);
            return updated;
          }),
        }));
      },

      deleteTestimonial: (id) => {
        set((state) => ({ testimonials: state.testimonials.filter((e) => e.id !== id) }));
        deleteFromDb(id);
      },

      getTestimonialsForCurrentUser: (userId) => {
        const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
        if (!effectiveUserId) return [];
        return get()
          .testimonials.filter((e) => e.userId === effectiveUserId)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },

      syncAllToDb: (tenantId) => {
        const all = get().testimonials;
        all.forEach((t) => {
          const patched = t.tenantId ? t : { ...t, tenantId };
          if (!t.tenantId) {
            set((state) => ({
              testimonials: state.testimonials.map((e) =>
                e.id === t.id ? { ...e, tenantId } : e
              ),
            }));
          }
          syncToDb(patched);
        });
      },
    }),
    {
      name: 'testimonials-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ testimonials: state.testimonials }),
    }
  )
);
