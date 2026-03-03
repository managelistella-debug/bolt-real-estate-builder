'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';
import { useFormSubmissionsStore } from '@/lib/stores/formSubmissions';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { useIntegrationsStore } from '@/lib/stores/integrations';
import { useLeadsStore } from '@/lib/stores/leads';
import { useWebsiteStore } from '@/lib/stores/website';
import { SearchAndFilters } from '@/components/crm/SearchAndFilters';
import { LeadsTable } from '@/components/crm/LeadsTable';
import { AddLeadDialog } from '@/components/crm/AddLeadDialog';
import { Lead, LeadStatus } from '@/lib/types';
import { mockLeads } from '@/lib/mock-data/leads';
import { Upload } from 'lucide-react';

export default function LeadsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { getConfigForUser, upsertConfig } = useIntegrationsStore();
  const { websites } = useWebsiteStore();
  const { leads, addLead, initializeLeads, deleteLead, updateLeadStatus } = useLeadsStore();
  const config = user ? getConfigForUser(user.id) : undefined;
  const {
    getSubmissionsForCurrentUser,
    getFieldMappingsForCurrentUser,
    upsertFieldMapping,
  } = useFormSubmissionsStore();
  const [mappingFormKey, setMappingFormKey] = useState('contact-form');
  const [mappingExternalField, setMappingExternalField] = useState('');
  const [mappingInternalField, setMappingInternalField] = useState('');
  const [forwardToInput, setForwardToInput] = useState((config?.contactRouting?.forwardTo || []).join(', '));
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (leads.length === 0) {
      initializeLeads(mockLeads);
    }
  }, [initializeLeads, leads.length]);

  const effectiveWebsiteId = useMemo(() => {
    if (!user) return 'website-1';
    return websites.find((site) => site.userId === user.id)?.id || `website-${user.id}`;
  }, [user, websites]);

  const submissions = useMemo(
    () => (user ? getSubmissionsForCurrentUser(user.id) : []),
    [getSubmissionsForCurrentUser, user]
  );
  const fieldMappings = useMemo(
    () => (user ? getFieldMappingsForCurrentUser(user.id) : []),
    [getFieldMappingsForCurrentUser, user]
  );
  const latestSubmissions = useMemo(() => submissions.slice(0, 20), [submissions]);
  const scopedLeads = useMemo(
    () => leads.filter((lead) => lead.websiteId === effectiveWebsiteId),
    [effectiveWebsiteId, leads]
  );
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    scopedLeads.forEach((lead) => lead.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [scopedLeads]);
  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return scopedLeads.filter((lead) => {
      const searchMatch =
        !query ||
        `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        (lead.phone || '').toLowerCase().includes(query) ||
        lead.tags.some((tag) => tag.toLowerCase().includes(query));
      const statusMatch = statusFilter === 'all' || lead.status === statusFilter;
      const tagsMatch = selectedTags.length === 0 || selectedTags.some((tag) => lead.tags.includes(tag));
      return searchMatch && statusMatch && tagsMatch;
    });
  }, [scopedLeads, searchQuery, selectedTags, statusFilter]);
  const submissionMetaByEmail = useMemo(() => {
    const map: Record<string, { source: string; submittedAt: Date; formKey: string }> = {};
    submissions.forEach((submission) => {
      const key = submission.contact.email.toLowerCase();
      const existing = map[key];
      if (!existing || new Date(submission.createdAt).getTime() > existing.submittedAt.getTime()) {
        map[key] = {
          source: submission.sourcePage || submission.formKey,
          submittedAt: new Date(submission.createdAt),
          formKey: submission.formKey,
        };
      }
    });
    return map;
  }, [submissions]);

  const handleCsvImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onload = () => {
      const csv = String(reader.result || '');
      const lines = csv.split('\n').map((line) => line.trim()).filter(Boolean);
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map((header) => header.trim().toLowerCase());
      const indexOf = (name: string) => headers.indexOf(name);
      const firstNameIndex = indexOf('firstname');
      const lastNameIndex = indexOf('lastname');
      const emailIndex = indexOf('email');
      const phoneIndex = indexOf('phone');
      const statusIndex = indexOf('status');
      const sourceIndex = indexOf('source');
      let imported = 0;

      lines.slice(1).forEach((line) => {
        const cols = line.split(',').map((value) => value.trim());
        const email = cols[emailIndex] || '';
        if (!email) return;
        const rawStatus = (cols[statusIndex] || 'new') as LeadStatus;
        const status: LeadStatus =
          rawStatus === 'contacted' ||
          rawStatus === 'in_progress' ||
          rawStatus === 'closed' ||
          rawStatus === 'lost'
            ? rawStatus
            : 'new';

        addLead({
          id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          tenantId: user.id,
          websiteId: effectiveWebsiteId,
          firstName: cols[firstNameIndex] || 'Unknown',
          lastName: cols[lastNameIndex] || '',
          email,
          phone: cols[phoneIndex] || undefined,
          status,
          tags: ['imported'],
          sourcePage: cols[sourceIndex] || 'csv-import',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        imported += 1;
      });

      toast({
        title: 'Contacts imported',
        description: `Imported ${imported} contacts from CSV.`,
      });
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <Header
        title="CRM"
        description="Manage contacts and pipeline stages. Tasks and reminders are removed to keep CRM simple."
      />
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedTags={selectedTags}
          availableTags={allTags}
          onTagToggle={(tag) =>
            setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((value) => value !== tag) : [tag]))
          }
          onClearFilters={() => {
            setStatusFilter('all');
            setSelectedTags([]);
          }}
          onImport={() => document.getElementById('crm-csv-upload')?.click()}
          onExport={() => {
            const lines = [
              'firstName,lastName,email,phone,status,source',
              ...filteredLeads.map((lead) =>
                [
                  lead.firstName,
                  lead.lastName,
                  lead.email,
                  lead.phone || '',
                  lead.status,
                  lead.sourcePage,
                ].join(',')
              ),
            ];
            const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'crm-contacts.csv';
            anchor.click();
            URL.revokeObjectURL(url);
          }}
          onAddNew={() => setShowAddDialog(true)}
          totalCount={filteredLeads.length}
        />
        <input
          id="crm-csv-upload"
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleCsvImport}
        />

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Contacts</h3>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('crm-csv-upload')?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Contacts CSV
            </Button>
          </div>
          <LeadsTable
            leads={filteredLeads}
            onLeadDelete={(leadId) => {
              deleteLead(leadId);
              toast({ title: 'Contact removed', description: 'Contact deleted from CRM.' });
            }}
            onLeadStatusChange={(leadId, status) => {
              updateLeadStatus(leadId, status);
              toast({
                title: 'Pipeline stage updated',
                description: `Moved contact to ${status.replace('_', ' ')}.`,
              });
            }}
            submissionMetaByEmail={submissionMetaByEmail}
          />
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold">Email Forwarding</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Comma-separated recipients used for contact form forwarding.
          </p>
          <div className="flex gap-2">
            <Input
              value={forwardToInput}
              onChange={(event) => setForwardToInput(event.target.value)}
              placeholder="team@agency.com, assistant@agency.com"
            />
            <Button
              onClick={() => {
                if (!user) return;
                const forwardTo = forwardToInput
                  .split(',')
                  .map((entry) => entry.trim())
                  .filter(Boolean);
                upsertConfig(user.id, {
                  contactRouting: {
                    enabled: true,
                    forwardTo,
                  },
                });
                toast({
                  title: 'Routing updated',
                  description: 'Email forwarding settings were saved.',
                });
              }}
            >
              Save
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <h3 className="font-semibold">Recent Form Submissions</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Latest submissions received by your headless forms API.
            </p>
            {latestSubmissions.map((submission) => (
              <div key={submission.id} className="mb-2 rounded border p-2 text-sm">
                <p className="font-medium">{submission.contact.email}</p>
                <p className="text-xs text-muted-foreground">{submission.formKey}</p>
              </div>
            ))}
            {latestSubmissions.length === 0 && (
              <p className="text-sm text-muted-foreground">No submissions yet.</p>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold">Form Field Mapping</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Map incoming payload keys to internal contact fields.
            </p>
            <div className="grid gap-2">
              <Input
                value={mappingFormKey}
                onChange={(event) => setMappingFormKey(event.target.value)}
                placeholder="Form key"
              />
              <Input
                value={mappingExternalField}
                onChange={(event) => setMappingExternalField(event.target.value)}
                placeholder="External field (e.g. full_name)"
              />
              <Input
                value={mappingInternalField}
                onChange={(event) => setMappingInternalField(event.target.value)}
                placeholder="Internal field (e.g. firstName)"
              />
              <Button
                onClick={() => {
                  if (!user || !mappingExternalField || !mappingInternalField) return;
                  upsertFieldMapping({
                    userId: user.id,
                    tenantId: user.id,
                    formKey: mappingFormKey,
                    externalField: mappingExternalField,
                    internalField: mappingInternalField,
                  });
                  setMappingExternalField('');
                  setMappingInternalField('');
                }}
              >
                Save Mapping
              </Button>
            </div>
            <div className="mt-3 space-y-1">
              {fieldMappings.slice(0, 6).map((entry) => (
                <p key={entry.id} className="text-xs text-muted-foreground">
                  {entry.formKey}: {entry.externalField} -&gt; {entry.internalField}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <AddLeadDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={(data) => {
          if (!user) return;
          addLead({
            id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            tenantId: user.id,
            websiteId: effectiveWebsiteId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || undefined,
            status: data.status,
            tags: data.tags,
            sourcePage: 'manual-entry',
            ownerId: data.ownerId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          toast({
            title: 'Contact added',
            description: `${data.firstName} ${data.lastName} was added to CRM.`,
          });
        }}
      />
    </div>
  );
}
