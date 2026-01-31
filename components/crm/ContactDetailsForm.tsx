'use client';

import { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { mockTeamMembers } from '@/lib/mock-data/leads';
import { LeadTag } from './LeadTag';
import { Save } from 'lucide-react';

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
    const changed =
      firstName !== lead.firstName ||
      lastName !== lead.lastName ||
      email !== lead.email ||
      phone !== (lead.phone || '') ||
      status !== lead.status ||
      JSON.stringify(tags) !== JSON.stringify(lead.tags) ||
      ownerId !== (lead.ownerId || 'none');
    setHasChanges(changed);
  }, [firstName, lastName, email, phone, status, tags, ownerId, lead]);

  const handleSave = () => {
    onUpdate(lead.id, {
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      status,
      tags,
      ownerId: ownerId === 'none' ? undefined : ownerId,
    });
    setHasChanges(false);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        {hasChanges && (
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as LeadStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner">Owner</Label>
          <Select value={ownerId} onValueChange={setOwnerId}>
            <SelectTrigger>
              <SelectValue placeholder="Select owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {mockTeamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag"
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <LeadTag key={tag} tag={tag} onRemove={() => handleRemoveTag(tag)} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Source Page</Label>
          <Input value={lead.sourcePage} disabled className="bg-gray-50" />
        </div>

        {lead.message && (
          <div className="space-y-2">
            <Label>Original Message</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
              {lead.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
