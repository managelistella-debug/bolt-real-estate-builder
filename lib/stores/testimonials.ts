import { create } from 'zustand';
import { CmsTestimonial } from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

interface TestimonialsState {
  testimonials: CmsTestimonial[];
  loaded: boolean;
  loading: boolean;
  fetchTestimonials: (tenantId: string) => Promise<void>;
  addTestimonial: (payload: Omit<CmsTestimonial, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTestimonial: (id: string, patch: Partial<Omit<CmsTestimonial, 'id' | 'userId'>>) => void;
  deleteTestimonial: (id: string) => void;
  getTestimonialsForCurrentUser: (userId?: string) => CmsTestimonial[];
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

function testimonialToRow(t: CmsTestimonial) {
  const tenantId = t.tenantId || t.userId;
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

function persistToApi(row: ReturnType<typeof testimonialToRow>) {
  fetch('/api/data/testimonials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  }).catch(() => undefined);
}

function deleteFromApi(id: string) {
  fetch(`/api/data/testimonials?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => undefined);
}

export const useTestimonialsStore = create<TestimonialsState>()(
  (set, get) => ({
    testimonials: [],
    loaded: false,
    loading: false,

    fetchTestimonials: async (tenantId) => {
      if (get().loading) return;
      set({ loading: true });
      try {
        const res = await fetch(`/api/data/testimonials?tenantId=${encodeURIComponent(tenantId)}`);
        if (!res.ok) throw new Error('fetch failed');
        const rows = await res.json();
        set({ testimonials: rows.map(rowToTestimonial), loaded: true });
      } catch {
        set({ loaded: true });
      } finally {
        set({ loading: false });
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
      persistToApi(testimonialToRow(t));
    },

    updateTestimonial: (id, patch) => {
      let updated: CmsTestimonial | undefined;
      set((state) => ({
        testimonials: state.testimonials.map((entry) => {
          if (entry.id !== id) return entry;
          updated = { ...entry, ...patch, updatedAt: new Date() };
          return updated;
        }),
      }));
      if (updated) persistToApi(testimonialToRow(updated));
    },

    deleteTestimonial: (id) => {
      set((state) => ({ testimonials: state.testimonials.filter((e) => e.id !== id) }));
      deleteFromApi(id);
    },

    getTestimonialsForCurrentUser: (userId) => {
      const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
      if (!effectiveUserId) return [];
      return get()
        .testimonials.filter((e) => e.userId === effectiveUserId)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    },
  })
);
