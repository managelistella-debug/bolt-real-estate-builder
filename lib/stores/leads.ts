import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Lead, LeadStatus } from '@/lib/types';

interface LeadsState {
  leads: Lead[];
  loaded: boolean;
  loading: boolean;
  fetchLeads: (tenantId: string) => Promise<void>;
  addLead: (lead: Lead) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  initializeLeads: (leads: Lead[]) => void;
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set, get) => ({
      leads: [],
      loaded: false,
      loading: false,

      fetchLeads: async () => {
        set({ loaded: true });
      },

      addLead: (lead) => {
        set((state) => ({ leads: [...state.leads, lead] }));
      },

      updateLead: (leadId, updates) => {
        set((state) => ({
          leads: state.leads.map((lead) => {
            if (lead.id !== leadId) return lead;
            return { ...lead, ...updates, updatedAt: new Date() };
          }),
        }));
      },

      deleteLead: (leadId) => {
        set((state) => ({ leads: state.leads.filter((l) => l.id !== leadId) }));
      },

      updateLeadStatus: (leadId, status) => {
        set((state) => ({
          leads: state.leads.map((lead) => {
            if (lead.id !== leadId) return lead;
            return { ...lead, status, updatedAt: new Date() };
          }),
        }));
      },

      initializeLeads: (leads) => {
        set({ leads });
      },
    }),
    {
      name: 'leads-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ leads: state.leads }),
    }
  )
);
