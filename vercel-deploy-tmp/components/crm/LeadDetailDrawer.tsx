'use client';

import { useState, useEffect } from 'react';
import { Lead, Task, Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ContactDetailsForm } from './ContactDetailsForm';
import { TasksList } from './TasksList';
import { NotesSection } from './NotesSection';
import {
  X,
  Maximize2,
  Minimize2,
  Phone,
  Mail,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lead) {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lead, showDeleteConfirm, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (lead) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lead]);

  if (!lead) return null;

  const handleDelete = () => {
    onDeleteLead(lead.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handlePhoneClick = () => {
    if (lead.phone) {
      window.location.href = `tel:${lead.phone}`;
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${lead.email}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity',
          lead ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full bg-white z-50 flex flex-col transition-all duration-300 ease-in-out shadow-2xl',
          isFullScreen ? 'w-full' : 'w-[600px]',
          lead ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="h-8 w-8 p-0"
            >
              {isFullScreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePhoneClick}
              disabled={!lead.phone}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleEmailClick}>
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Contact Details */}
            <ContactDetailsForm lead={lead} onUpdate={onUpdateLead} />

            {/* Divider */}
            <div className="border-t" />

            {/* Tasks */}
            <TasksList
              leadId={lead.id}
              tasks={tasks}
              onAddTask={onAddTask}
              onToggleComplete={onToggleTaskComplete}
              onDeleteTask={onDeleteTask}
            />

            {/* Divider */}
            <div className="border-t" />

            {/* Notes */}
            <NotesSection
              leadId={lead.id}
              notes={notes}
              currentUserId={currentUserId}
              onAddNote={onAddNote}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-white">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Contact
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {lead.firstName} {lead.lastName}? This
              will also delete all associated tasks and notes. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
