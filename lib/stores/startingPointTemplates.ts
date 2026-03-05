import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getAllStartingPointTemplates } from '@/lib/templates/registry';

interface TemplateOverride {
  visible: boolean;
  assignedUserIds: string[];
}

interface StartingPointTemplatesState {
  overrides: Record<string, TemplateOverride>;

  toggleVisibility: (templateId: string) => void;
  setVisibility: (templateId: string, visible: boolean) => void;
  assignToUser: (templateId: string, userId: string) => void;
  unassignFromUser: (templateId: string, userId: string) => void;
  isVisibleToUser: (templateId: string, userId: string) => boolean;
  getEffectiveVisibility: (templateId: string) => boolean;
  getAssignedUserIds: (templateId: string) => string[];
}

function getDefaultForTemplate(templateId: string): TemplateOverride {
  const t = getAllStartingPointTemplates().find((t) => t.id === templateId);
  return {
    visible: t?.visible ?? true,
    assignedUserIds: t?.assignedUserIds ?? [],
  };
}

export const useStartingPointTemplatesStore = create<StartingPointTemplatesState>()(
  persist(
    (set, get) => ({
      overrides: {},

      toggleVisibility: (templateId) => {
        set((state) => {
          const current = state.overrides[templateId] ?? getDefaultForTemplate(templateId);
          return {
            overrides: {
              ...state.overrides,
              [templateId]: { ...current, visible: !current.visible },
            },
          };
        });
      },

      setVisibility: (templateId, visible) => {
        set((state) => {
          const current = state.overrides[templateId] ?? getDefaultForTemplate(templateId);
          return {
            overrides: {
              ...state.overrides,
              [templateId]: { ...current, visible },
            },
          };
        });
      },

      assignToUser: (templateId, userId) => {
        set((state) => {
          const current = state.overrides[templateId] ?? getDefaultForTemplate(templateId);
          if (current.assignedUserIds.includes(userId)) return state;
          return {
            overrides: {
              ...state.overrides,
              [templateId]: {
                ...current,
                assignedUserIds: [...current.assignedUserIds, userId],
              },
            },
          };
        });
      },

      unassignFromUser: (templateId, userId) => {
        set((state) => {
          const current = state.overrides[templateId] ?? getDefaultForTemplate(templateId);
          return {
            overrides: {
              ...state.overrides,
              [templateId]: {
                ...current,
                assignedUserIds: current.assignedUserIds.filter((id) => id !== userId),
              },
            },
          };
        });
      },

      isVisibleToUser: (templateId, userId) => {
        const override = get().overrides[templateId];
        const defaults = getDefaultForTemplate(templateId);
        const effective = override ?? defaults;
        return effective.visible || effective.assignedUserIds.includes(userId);
      },

      getEffectiveVisibility: (templateId) => {
        const override = get().overrides[templateId];
        if (override) return override.visible;
        return getDefaultForTemplate(templateId).visible;
      },

      getAssignedUserIds: (templateId) => {
        const override = get().overrides[templateId];
        if (override) return override.assignedUserIds;
        return getDefaultForTemplate(templateId).assignedUserIds;
      },
    }),
    {
      name: 'starting-point-templates-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
