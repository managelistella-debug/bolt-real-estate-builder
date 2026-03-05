import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
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

export const useTestimonialsStore = create<TestimonialsState>()(
  persist(
    (set, get) => ({
      testimonials: [],
      loaded: false,
      loading: false,

      fetchTestimonials: async () => {
        set({ loaded: true });
      },

      addTestimonial: (payload) => {
        const t: CmsTestimonial = {
          ...payload,
          id: `testimonial_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ testimonials: [...state.testimonials, t] }));
      },

      updateTestimonial: (id, patch) => {
        set((state) => ({
          testimonials: state.testimonials.map((entry) => {
            if (entry.id !== id) return entry;
            return { ...entry, ...patch, updatedAt: new Date() };
          }),
        }));
      },

      deleteTestimonial: (id) => {
        set((state) => ({ testimonials: state.testimonials.filter((e) => e.id !== id) }));
      },

      getTestimonialsForCurrentUser: (userId) => {
        const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
        if (!effectiveUserId) return [];
        return get()
          .testimonials.filter((e) => e.userId === effectiveUserId)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },
    }),
    {
      name: 'testimonials-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ testimonials: state.testimonials }),
    }
  )
);
