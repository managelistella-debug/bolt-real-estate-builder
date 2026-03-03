'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadStatus } from '@/lib/types';
import { mockTeamMembers } from '@/lib/mock-data/leads';
import { LeadTag } from './LeadTag';

const darkInput = 'h-[34px] w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-white/30 focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const darkLabel = 'text-[13px] text-white/50';
const darkSelectTrigger = 'flex h-[34px] w-full items-center rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white';
const darkSelectContent = 'rounded-lg border border-white/10 bg-[#1e1e1e] text-[13px] text-white';

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { firstName: string; lastName: string; email: string; phone: string; status: LeadStatus; tags: string[]; ownerId?: string }) => void;
}

export function AddLeadDialog({ open, onOpenChange, onSubmit }: AddLeadDialogProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [ownerId, setOwnerId] = useState<string>('none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ firstName, lastName, email, phone, status, tags, ownerId: ownerId === 'none' ? undefined : ownerId });
    setFirstName(''); setLastName(''); setEmail(''); setPhone('');
    setStatus('new'); setTags([]); setTagInput(''); setOwnerId('none');
    onOpenChange(false);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) { setTags([...tags, trimmed]); setTagInput(''); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={darkLabel}>First Name *</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={darkInput} />
            </div>
            <div className="space-y-1.5">
              <label className={darkLabel}>Last Name *</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required className={darkInput} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={darkInput} />
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className={darkInput} />
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
              <SelectTrigger className={darkSelectTrigger}><SelectValue /></SelectTrigger>
              <SelectContent className={darkSelectContent}>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Owner</label>
            <Select value={ownerId} onValueChange={setOwnerId}>
              <SelectTrigger className={darkSelectTrigger}><SelectValue placeholder="Select owner" /></SelectTrigger>
              <SelectContent className={darkSelectContent}>
                <SelectItem value="none">None</SelectItem>
                {mockTeamMembers.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Tags</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} placeholder="Add a tag" className={darkInput} />
              <button type="button" onClick={handleAddTag} className="h-[34px] rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/50 hover:bg-white/10 hover:text-white">Add</button>
            </div>
            {tags.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {tags.map((tag) => <LeadTag key={tag} tag={tag} onRemove={() => setTags(tags.filter((t) => t !== tag))} />)}
              </div>
            )}
          </div>

          <DialogFooter className="gap-1.5 pt-2">
            <button type="button" onClick={() => onOpenChange(false)} className="h-[30px] rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/50 hover:bg-white/10 hover:text-white">Cancel</button>
            <button type="submit" className="h-[30px] rounded-lg bg-[#DAFF07] px-4 text-[13px] text-black hover:bg-[#C8ED00]">Add Contact</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
