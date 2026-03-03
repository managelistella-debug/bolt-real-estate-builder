import { create } from 'zustand';
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

function rowToLead(r: any): Lead {
  return {
    id: r.id,
    websiteId: r.website_id,
    tenantId: r.tenant_id,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    phone: r.phone ?? undefined,
    message: r.message ?? undefined,
    status: r.status,
    tags: r.tags ?? [],
    sourcePage: r.source_page,
    ownerId: r.owner_id ?? undefined,
    customFields: r.custom_fields ?? {},
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  };
}

function leadToRow(l: Lead) {
  const tenantId = l.tenantId || l.websiteId;
  return {
    id: l.id,
    tenant_id: tenantId,
    website_id: l.websiteId,
    first_name: l.firstName,
    last_name: l.lastName,
    email: l.email,
    phone: l.phone ?? null,
    message: l.message ?? null,
    status: l.status,
    tags: l.tags,
    source_page: l.sourcePage,
    owner_id: l.ownerId ?? null,
    custom_fields: l.customFields ?? {},
    created_at: l.createdAt instanceof Date ? l.createdAt.toISOString() : l.createdAt,
    updated_at: l.updatedAt instanceof Date ? l.updatedAt.toISOString() : l.updatedAt,
  };
}

function persistToApi(row: ReturnType<typeof leadToRow>) {
  fetch('/api/data/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  }).catch(() => undefined);
}

function deleteFromApi(id: string) {
  fetch(`/api/data/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => undefined);
}

export const useLeadsStore = create<LeadsState>()(
  (set, get) => ({
    leads: [],
    loaded: false,
    loading: false,

    fetchLeads: async (tenantId) => {
      if (get().loading) return;
      set({ loading: true });
      try {
        const res = await fetch(`/api/data/leads?tenantId=${encodeURIComponent(tenantId)}`);
        if (!res.ok) throw new Error('fetch failed');
        const rows = await res.json();
        set({ leads: rows.map(rowToLead), loaded: true });
      } catch {
        set({ loaded: true });
      } finally {
        set({ loading: false });
      }
    },

    addLead: (lead) => {
      set((state) => ({ leads: [...state.leads, lead] }));
      persistToApi(leadToRow(lead));
    },

    updateLead: (leadId, updates) => {
      let updated: Lead | undefined;
      set((state) => ({
        leads: state.leads.map((lead) => {
          if (lead.id !== leadId) return lead;
          updated = { ...lead, ...updates, updatedAt: new Date() };
          return updated;
        }),
      }));
      if (updated) persistToApi(leadToRow(updated));
    },

    deleteLead: (leadId) => {
      set((state) => ({ leads: state.leads.filter((l) => l.id !== leadId) }));
      deleteFromApi(leadId);
    },

    updateLeadStatus: (leadId, status) => {
      let updated: Lead | undefined;
      set((state) => ({
        leads: state.leads.map((lead) => {
          if (lead.id !== leadId) return lead;
          updated = { ...lead, status, updatedAt: new Date() };
          return updated;
        }),
      }));
      if (updated) persistToApi(leadToRow(updated));
    },

    initializeLeads: (leads) => {
      set({ leads });
    },
  })
);
