'use client';

import { useState } from 'react';
import { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDateTime } from '@/lib/utils';
import { mockTeamMembers } from '@/lib/mock-data/leads';
import { Plus } from 'lucide-react';

interface NotesSectionProps {
  leadId: string;
  notes: Note[];
  currentUserId: string;
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
}

export function NotesSection({
  leadId,
  notes,
  currentUserId,
  onAddNote,
}: NotesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote({
        leadId,
        userId: currentUserId,
        content: newNoteContent.trim(),
      });
      setNewNoteContent('');
      setIsAdding(false);
    }
  };

  const getUserName = (userId: string) => {
    const user = mockTeamMembers.find((m) => m.id === userId);
    return user?.name || 'Unknown User';
  };

  const getUserInitial = (userId: string) => {
    const name = getUserName(userId);
    return name.charAt(0).toUpperCase();
  };

  const leadNotes = notes
    .filter((note) => note.leadId === leadId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notes</h3>
        {!isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <div className="p-4 border rounded-lg space-y-3 bg-gray-50">
          <Textarea
            placeholder="Write a note..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={3}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setNewNoteContent('');
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddNote}>
              Add Note
            </Button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {leadNotes.map((note) => (
          <div key={note.id} className="flex gap-3 p-4 border rounded-lg bg-white">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {getUserInitial(note.userId)}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium">{getUserName(note.userId)}</span>
                <span className="text-xs text-gray-500">
                  {formatDateTime(note.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {leadNotes.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No notes yet. Add one to keep track of important information.
        </div>
      )}
    </div>
  );
}
