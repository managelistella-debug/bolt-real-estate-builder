import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lead, Task, Note, LeadStatus } from '@/lib/types';

interface LeadsState {
  leads: Lead[];
  tasks: Task[];
  notes: Note[];
  
  // Lead operations
  addLead: (lead: Lead) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  
  // Task operations
  addTask: (task: Task) => void;
  toggleTaskComplete: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  
  // Note operations
  addNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  
  // Initialization
  initializeLeads: (leads: Lead[]) => void;
  initializeTasks: (tasks: Task[]) => void;
  initializeNotes: (notes: Note[]) => void;
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set) => ({
      leads: [],
      tasks: [],
      notes: [],
  
  // Lead operations
  addLead: (lead) => {
    set((state) => ({
      leads: [...state.leads, lead],
    }));
  },
  
  updateLead: (leadId, updates) => {
    set((state) => ({
      leads: state.leads.map(lead =>
        lead.id === leadId
          ? { ...lead, ...updates, updatedAt: new Date() }
          : lead
      ),
    }));
  },
  
  deleteLead: (leadId) => {
    set((state) => ({
      leads: state.leads.filter(lead => lead.id !== leadId),
      tasks: state.tasks.filter(task => task.leadId !== leadId),
      notes: state.notes.filter(note => note.leadId !== leadId),
    }));
  },
  
  updateLeadStatus: (leadId, status) => {
    set((state) => ({
      leads: state.leads.map(lead =>
        lead.id === leadId
          ? { ...lead, status, updatedAt: new Date() }
          : lead
      ),
    }));
  },
  
  // Task operations
  addTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },
  
  toggleTaskComplete: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === taskId
          ? { 
              ...task, 
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
            }
          : task
      ),
    }));
  },
  
  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== taskId),
    }));
  },
  
  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
  },
  
  // Note operations
  addNote: (note) => {
    set((state) => ({
      notes: [...state.notes, note],
    }));
  },
  
  deleteNote: (noteId) => {
    set((state) => ({
      notes: state.notes.filter(note => note.id !== noteId),
    }));
  },
  
  // Initialization
  initializeLeads: (leads) => {
    set({ leads });
  },
  
  initializeTasks: (tasks) => {
    set({ tasks });
  },
  
  initializeNotes: (notes) => {
    set({ notes });
  },
}),
    {
      name: 'leads-storage',
      version: 1,
    }
  )
);
