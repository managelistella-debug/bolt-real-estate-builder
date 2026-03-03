import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CmsTestimonial } from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

interface TestimonialsState {
  testimonials: CmsTestimonial[];
  addTestimonial: (payload: Omit<CmsTestimonial, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTestimonial: (id: string, patch: Partial<Omit<CmsTestimonial, 'id' | 'userId'>>) => void;
  deleteTestimonial: (id: string) => void;
  getTestimonialsForCurrentUser: (userId?: string) => CmsTestimonial[];
}

export const useTestimonialsStore = create<TestimonialsState>()(
  persist(
    (set, get) => ({
      testimonials: [],
      addTestimonial: (payload) =>
        set((state) => ({
          testimonials: [
            ...state.testimonials,
            {
              ...payload,
              id: `testimonial_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateTestimonial: (id, patch) =>
        set((state) => ({
          testimonials: state.testimonials.map((entry) =>
            entry.id === id ? { ...entry, ...patch, updatedAt: new Date() } : entry
          ),
        })),
      deleteTestimonial: (id) =>
        set((state) => ({
          testimonials: state.testimonials.filter((entry) => entry.id !== id),
        })),
      getTestimonialsForCurrentUser: (userId) => {
        const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
        if (!effectiveUserId) return [];
        return get().testimonials
          .filter((entry) => entry.userId === effectiveUserId)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },
    }),
    {
      name: 'testimonials-storage',
      version: 1,
    }
  )
);
