import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lead, LeadStatus } from '@/lib/types';

interface LeadsState {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  initializeLeads: (leads: Lead[]) => void;
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set) => ({
      leads: [],
      addLead: (lead) => {
        set((state) => ({
          leads: [...state.leads, lead],
        }));
      },
      updateLead: (leadId, updates) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === leadId
              ? { ...lead, ...updates, updatedAt: new Date() }
              : lead
          ),
        }));
      },
      deleteLead: (leadId) => {
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== leadId),
        }));
      },
      updateLeadStatus: (leadId, status) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === leadId
              ? { ...lead, status, updatedAt: new Date() }
              : lead
          ),
        }));
      },
      initializeLeads: (leads) => {
        set({ leads });
      },
    }),
    {
      name: 'leads-storage',
      version: 2,
      migrate: (persistedState: any) => ({
        leads: Array.isArray(persistedState?.leads) ? persistedState.leads : [],
      }),
    }
  )
);
