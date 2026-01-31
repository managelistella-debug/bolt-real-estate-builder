import { create } from 'zustand';
import { Lead, Task, Note, LeadStatus } from '@/lib/types';

interface LeadsState {
  leads: Lead[];
  tasks: Task[];
  notes: Note[];
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  addNote: (note: Note) => void;
  addTask: (task: Task) => void;
  toggleTaskComplete: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  addLead: (lead: Lead) => void;
}

export const useLeadsStore = create<LeadsState>((set) => ({
  leads: [],
  tasks: [],
  notes: [],
  
  updateLeadStatus: (leadId, status) => {
    set((state) => ({
      leads: state.leads.map(lead =>
        lead.id === leadId
          ? { ...lead, status, updatedAt: new Date() }
          : lead
      ),
    }));
  },
  
  addNote: (note) => {
    set((state) => ({
      notes: [...state.notes, note],
    }));
  },
  
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
  
  addLead: (lead) => {
    set((state) => ({
      leads: [...state.leads, lead],
    }));
  },
}));
