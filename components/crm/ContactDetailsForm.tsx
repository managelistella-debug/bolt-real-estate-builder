'use client';

import { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockTeamMembers } from '@/lib/mock-data/leads';
import { LeadTag } from './LeadTag';
import { Save } from 'lucide-react';

const darkInput = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const darkSelectTrigger = 'flex h-[34px] w-full items-center rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black';
const darkSelectContent = 'rounded-lg border border-[#EBEBEB] bg-white text-[13px] text-black';

interface ContactDetailsFormProps {
  lead: Lead;
  onUpdate: (leadId: string, updates: Partial<Lead>) => void;
}

export function ContactDetailsForm({ lead, onUpdate }: ContactDetailsFormProps) {
  const [firstName, setFirstName] = useState(lead.firstName);
  const [lastName, setLastName] = useState(lead.lastName);
  const [email, setEmail] = useState(lead.email);
  const [phone, setPhone] = useState(lead.phone || '');
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [tags, setTags] = useState<string[]>(lead.tags);
  const [tagInput, setTagInput] = useState('');
  const [ownerId, setOwnerId] = useState(lead.ownerId || 'none');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = firstName !== lead.firstName || lastName !== lead.lastName || email !== lead.email || phone !== (lead.phone || '') || status !== lead.status || JSON.stringify(tags) !== JSON.stringify(lead.tags) || ownerId !== (lead.ownerId || 'none');
    setHasChanges(changed);
  }, [firstName, lastName, email, phone, status, tags, ownerId, lead]);

  const handleSave = () => {
    onUpdate(lead.id, { firstName, lastName, email, phone: phone || undefined, status, tags, ownerId: ownerId === 'none' ? undefined : ownerId });
    setHasChanges(false);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) { setTags([...tags, trimmed]); setTagInput(''); }
  };

  const handleRemoveTag = (t: string) => setTags(tags.filter((tag) => tag !== t));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-black">Contact Details</h3>
        {hasChanges && (
          <button type="button" onClick={handleSave} className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]">
            <Save className="h-3.5 w-3.5" /> Save Changes
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[13px] text-[#888C99]">First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={darkInput} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] text-[#888C99]">Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={darkInput} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] text-[#888C99]">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={darkInput} />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] text-[#888C99]">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={darkInput} />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] text-[#888C99]">Status</label>
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
          <label className="text-[13px] text-[#888C99]">Owner</label>
          <Select value={ownerId} onValueChange={setOwnerId}>
            <SelectTrigger className={darkSelectTrigger}><SelectValue placeholder="Select owner" /></SelectTrigger>
            <SelectContent className={darkSelectContent}>
              <SelectItem value="none">None</SelectItem>
              {mockTeamMembers.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] text-[#888C99]">Tags</label>
          <div className="flex gap-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} placeholder="Add a tag" className={darkInput} />
            <button type="button" onClick={handleAddTag} className="h-[34px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">Add</button>
          </div>
          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {tags.map((tag) => <LeadTag key={tag} tag={tag} onRemove={() => handleRemoveTag(tag)} />)}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] text-[#888C99]">Source Page</label>
          <input value={lead.sourcePage} disabled className={`${darkInput} opacity-60`} />
        </div>

        {lead.message && (
          <div className="space-y-1.5">
            <label className="text-[13px] text-[#888C99]">Original Message</label>
            <div className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3 text-[13px] text-[#888C99]">{lead.message}</div>
          </div>
        )}
      </div>
    </div>
  );
}
