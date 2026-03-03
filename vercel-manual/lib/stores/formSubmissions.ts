import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CmsFieldMapping, CmsFormSubmission } from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

interface FormSubmissionsState {
  submissions: CmsFormSubmission[];
  fieldMappings: CmsFieldMapping[];
  addSubmission: (submission: Omit<CmsFormSubmission, 'id' | 'createdAt'>) => CmsFormSubmission;
  upsertFieldMapping: (mapping: Omit<CmsFieldMapping, 'id' | 'createdAt' | 'updatedAt'>) => void;
  getSubmissionsForCurrentUser: (userId?: string) => CmsFormSubmission[];
  getFieldMappingsForCurrentUser: (userId?: string) => CmsFieldMapping[];
}

export const useFormSubmissionsStore = create<FormSubmissionsState>()(
  persist(
    (set, get) => ({
      submissions: [],
      fieldMappings: [],
      addSubmission: (submission) => {
        const created: CmsFormSubmission = {
          ...submission,
          id: `submission_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date(),
        };
        set((state) => ({ submissions: [created, ...state.submissions] }));
        return created;
      },
      upsertFieldMapping: (mapping) =>
        set((state) => {
          const existing = state.fieldMappings.find(
            (entry) =>
              entry.userId === mapping.userId &&
              entry.formKey === mapping.formKey &&
              entry.externalField === mapping.externalField
          );
          if (!existing) {
            return {
              fieldMappings: [
                ...state.fieldMappings,
                {
                  ...mapping,
                  id: `mapping_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            };
          }
          return {
            fieldMappings: state.fieldMappings.map((entry) =>
              entry.id === existing.id
                ? { ...entry, internalField: mapping.internalField, updatedAt: new Date() }
                : entry
            ),
          };
        }),
      getSubmissionsForCurrentUser: (userId) => {
        const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
        if (!effectiveUserId) return [];
        return get().submissions.filter((entry) => entry.userId === effectiveUserId);
      },
      getFieldMappingsForCurrentUser: (userId) => {
        const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
        if (!effectiveUserId) return [];
        return get().fieldMappings.filter((entry) => entry.userId === effectiveUserId);
      },
    }),
    {
      name: 'form-submissions-storage',
      version: 1,
    }
  )
);
