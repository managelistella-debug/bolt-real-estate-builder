'use client';

import { useEffect, useState, useMemo } from 'react';
import { useLeadsStore } from '@/lib/stores/leads';
import { useAuthStore } from '@/lib/stores/auth';
import { mockLeads, mockTasks, mockNotes } from '@/lib/mock-data/leads';
import { SearchAndFilters } from '@/components/crm/SearchAndFilters';
import { LeadsTable } from '@/components/crm/LeadsTable';
import { LeadDetailDrawer } from '@/components/crm/LeadDetailDrawer';
import { AddLeadDialog } from '@/components/crm/AddLeadDialog';
import { Lead, LeadStatus, Task, Note } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

export default function LeadsPage() {
  const { user } = useAuthStore();
  const {
    leads,
    tasks,
    notes,
    initializeLeads,
    initializeTasks,
    initializeNotes,
    addLead,
    updateLead,
    deleteLead,
    addTask,
    toggleTaskComplete,
    deleteTask,
    addNote,
  } = useLeadsStore();

  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Initialize mock data
  useEffect(() => {
    if (leads.length === 0) {
      initializeLeads(mockLeads);
      initializeTasks(mockTasks);
      initializeNotes(mockNotes);
    }
  }, []);

  // Filter and search logic
  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.firstName.toLowerCase().includes(query) ||
          lead.lastName.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.phone?.toLowerCase().includes(query) ||
          lead.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((lead) =>
        selectedTags.some((tag) => lead.tags.includes(tag))
      );
    }

    // Sort by most recent first
    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [leads, searchQuery, statusFilter, selectedTags]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    leads.forEach((lead) => {
      lead.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [leads]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setSelectedTags([]);
  };

  const handleImport = () => {
    toast({
      title: 'Coming soon',
      description: 'CSV import functionality will be available soon.',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Coming soon',
      description: 'CSV export functionality will be available soon.',
    });
  };

  const handleAddLead = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: LeadStatus;
    tags: string[];
    ownerId?: string;
  }) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      websiteId: 'website-1',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || undefined,
      status: data.status,
      tags: data.tags,
      sourcePage: '/manual',
      ownerId: data.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addLead(newLead);
    toast({
      title: 'Contact added',
      description: `${data.firstName} ${data.lastName} has been added to your contacts.`,
    });
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
    };
    addTask(newTask);
    toast({
      title: 'Task added',
      description: 'New task has been created.',
    });
  };

  const handleAddNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date(),
    };
    addNote(newNote);
    toast({
      title: 'Note added',
      description: 'Note has been saved.',
    });
  };

  const handleDeleteLead = (leadId: string) => {
    deleteLead(leadId);
    toast({
      title: 'Contact deleted',
      description: 'The contact has been permanently deleted.',
      variant: 'destructive',
    });
  };

  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    updateLead(leadId, updates);
    toast({
      title: 'Contact updated',
      description: 'Changes have been saved.',
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Search and Filters */}
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            selectedTags={selectedTags}
            availableTags={allTags}
            onTagToggle={handleTagToggle}
            onClearFilters={handleClearFilters}
            onImport={handleImport}
            onExport={handleExport}
            onAddNew={() => setShowAddDialog(true)}
            totalCount={leads.length}
          />

          {/* Leads Table */}
          <LeadsTable
            leads={filteredLeads}
            onLeadClick={setSelectedLead}
          />
        </div>
      </div>

      {/* Lead Detail Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        tasks={tasks}
        notes={notes}
        currentUserId={user?.id || '1'}
        onClose={() => setSelectedLead(null)}
        onUpdateLead={handleUpdateLead}
        onAddTask={handleAddTask}
        onToggleTaskComplete={toggleTaskComplete}
        onDeleteTask={deleteTask}
        onAddNote={handleAddNote}
        onDeleteLead={handleDeleteLead}
      />

      {/* Add Lead Dialog */}
      <AddLeadDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddLead}
      />
    </div>
  );
}
