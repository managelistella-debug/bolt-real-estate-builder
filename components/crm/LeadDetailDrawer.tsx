'use client';

import { useState, useEffect } from 'react';
import { Lead, Task, Note } from '@/lib/types';
import { ContactDetailsForm } from './ContactDetailsForm';
import { TasksList } from './TasksList';
import { NotesSection } from './NotesSection';
import { X, Maximize2, Minimize2, Phone, Mail, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  tasks: Task[];
  notes: Note[];
  currentUserId: string;
  onClose: () => void;
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  onDeleteLead: (leadId: string) => void;
}

export function LeadDetailDrawer({
  lead,
  tasks,
  notes,
  currentUserId,
  onClose,
  onUpdateLead,
  onAddTask,
  onToggleTaskComplete,
  onDeleteTask,
  onAddNote,
  onDeleteLead,
}: LeadDetailDrawerProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lead) {
        if (showDeleteConfirm) setShowDeleteConfirm(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lead, showDeleteConfirm, onClose]);

  useEffect(() => {
    document.body.style.overflow = lead ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [lead]);

  if (!lead) return null;

  const handleDelete = () => { onDeleteLead(lead.id); setShowDeleteConfirm(false); onClose(); };

  return (
    <>
      <div className={cn('fixed inset-0 z-40 bg-black/40 transition-opacity', lead ? 'opacity-100' : 'pointer-events-none opacity-0')} onClick={onClose} />

      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out',
          isFullScreen ? 'w-full' : 'w-[600px]',
          lead ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
      >
        <div className="flex items-center justify-between border-b border-[#EBEBEB] bg-white px-5 py-3">
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"><X className="h-4 w-4" /></button>
            <button type="button" onClick={() => setIsFullScreen(!isFullScreen)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => { if (lead.phone) window.location.href = `tel:${lead.phone}`; }} disabled={!lead.phone} className="flex h-[30px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[#888C99] hover:bg-[#F5F5F3] hover:text-black disabled:opacity-40">
              <Phone className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={() => { window.location.href = `mailto:${lead.email}`; }} className="flex h-[30px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
              <Mail className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-5">
            <ContactDetailsForm lead={lead} onUpdate={onUpdateLead} />
            <div className="border-t border-[#EBEBEB]" />
            <TasksList leadId={lead.id} tasks={tasks} onAddTask={onAddTask} onToggleComplete={onToggleTaskComplete} onDeleteTask={onDeleteTask} />
            <div className="border-t border-[#EBEBEB]" />
            <NotesSection leadId={lead.id} notes={notes} currentUserId={currentUserId} onAddNote={onAddNote} />
          </div>
        </div>

        <div className="border-t border-[#EBEBEB] bg-white px-5 py-3">
          <button type="button" onClick={() => setShowDeleteConfirm(true)} className="flex h-[34px] w-full items-center justify-center gap-1.5 rounded-lg bg-red-500/10 text-[13px] text-red-500 hover:bg-red-500/20">
            <Trash2 className="h-3.5 w-3.5" /> Delete Contact
          </button>
        </div>
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {lead.firstName} {lead.lastName}? This will also delete all associated tasks and notes. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-1.5">
            <button type="button" onClick={() => setShowDeleteConfirm(false)} className="h-[30px] rounded-lg border border-white/20 bg-white/10 px-3 text-[13px] text-white hover:bg-white/20">Cancel</button>
            <button type="button" onClick={handleDelete} className="h-[30px] rounded-lg bg-red-500 px-3 text-[13px] text-white hover:bg-red-600">Delete</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
