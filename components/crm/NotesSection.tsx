'use client';

import { useState } from 'react';
import { Note } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { mockTeamMembers } from '@/lib/mock-data/leads';
import { Plus } from 'lucide-react';

interface NotesSectionProps {
  leadId: string;
  notes: Note[];
  currentUserId: string;
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
}

export function NotesSection({ leadId, notes, currentUserId, onAddNote }: NotesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote({ leadId, userId: currentUserId, content: newNoteContent.trim() });
      setNewNoteContent('');
      setIsAdding(false);
    }
  };

  const getUserName = (userId: string) => mockTeamMembers.find((m) => m.id === userId)?.name || 'Unknown User';
  const getUserInitial = (userId: string) => getUserName(userId).charAt(0).toUpperCase();

  const leadNotes = notes.filter((n) => n.leadId === leadId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-black">Notes</h3>
        {!isAdding && (
          <button type="button" onClick={() => setIsAdding(true)} className="flex h-[28px] items-center gap-1 rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
            <Plus className="h-3 w-3" /> Add Note
          </button>
        )}
      </div>

      {isAdding && (
        <div className="space-y-2 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3">
          <textarea placeholder="Write a note..." value={newNoteContent} onChange={(e) => setNewNoteContent(e.target.value)} rows={3} autoFocus className="w-full resize-none rounded-lg border border-[#EBEBEB] bg-white px-3 py-2 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]" />
          <div className="flex justify-end gap-1.5">
            <button type="button" onClick={() => { setIsAdding(false); setNewNoteContent(''); }} className="h-[28px] rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">Cancel</button>
            <button type="button" onClick={handleAddNote} className="h-[28px] rounded-lg bg-[#DAFF07] px-2.5 text-[12px] text-black hover:bg-[#C8ED00]">Add Note</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {leadNotes.map((note) => (
          <div key={note.id} className="flex gap-3 rounded-lg border border-[#EBEBEB] bg-white p-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#DAFF07]/20 text-[11px] font-medium text-black">
              {getUserInitial(note.userId)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-baseline gap-2">
                <span className="text-[13px] font-medium text-black">{getUserName(note.userId)}</span>
                <span className="text-[11px] text-[#CCCCCC]">{formatDateTime(note.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap text-[13px] text-[#888C99]">{note.content}</p>
            </div>
          </div>
        ))}
      </div>

      {leadNotes.length === 0 && !isAdding && (
        <div className="py-6 text-center text-[13px] text-[#CCCCCC]">No notes yet. Add one to keep track of important information.</div>
      )}
    </div>
  );
}
