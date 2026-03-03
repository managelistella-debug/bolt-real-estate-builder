'use client';

import { Lead, LeadStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { LeadTag } from './LeadTag';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockTeamMembers } from '@/lib/mock-data/leads';

interface LeadsTableProps {
  leads: Lead[];
  onLeadDelete: (leadId: string) => void;
  onLeadStatusChange: (leadId: string, status: LeadStatus) => void;
  submissionMetaByEmail: Record<string, { source: string; submittedAt: Date; formKey: string }>;
}

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-[#DAFF07]/20 text-[#5A6600] border-[#DAFF07]/30',
  contacted: 'bg-[#FFF4D6] text-[#8A6200] border-[#F5E6B0]',
  in_progress: 'bg-[#F0EDFF] text-[#5B3DC5] border-[#DDD6FF]',
  closed: 'bg-[#E4F9EC] text-[#0D7A3E] border-[#B8EDCC]',
  lost: 'bg-[#F5F5F3] text-[#888C99] border-[#EBEBEB]',
};

const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_progress: 'In Progress',
  closed: 'Closed',
  lost: 'Lost',
};

export function LeadsTable({ leads, onLeadDelete, onLeadStatusChange, submissionMetaByEmail }: LeadsTableProps) {
  const getOwnerName = (ownerId?: string) => {
    if (!ownerId) return '–';
    return mockTeamMembers.find((m) => m.id === ownerId)?.name || '–';
  };

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg className="mx-auto mb-4 h-10 w-10 text-[#CCCCCC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-[15px] font-medium text-black">No contacts found</p>
        <p className="mt-1 text-[13px] text-[#888C99]">Try adjusting your search or filters, or add a new contact to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EBEBEB] bg-[#F5F5F3]">
              {['Name', 'Email', 'Phone', 'Source', 'Submitted', 'Tags', 'Pipeline Stage', 'Owner', 'Created', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] font-normal uppercase tracking-wider text-[#888C99]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBEBEB]">
            {leads.map((lead) => {
              const submission = submissionMetaByEmail[lead.email.toLowerCase()];
              return (
                <tr key={lead.id} className="transition-colors hover:bg-[#F5F5F3]/50">
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] font-medium text-black">{lead.firstName} {lead.lastName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-[#888C99]">{lead.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-[#888C99]">{lead.phone || '–'}</td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[#888C99]">{submission?.source || lead.sourcePage || '–'}</span>
                    <br /><span className="text-[11px] text-[#CCCCCC]">{submission?.formKey ? `Form: ${submission.formKey}` : 'Manual/Imported'}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-[#888C99]">{submission ? formatDate(submission.submittedAt) : '–'}</td>
                  <td className="px-4 py-3"><div className="flex max-w-xs flex-wrap gap-1">{lead.tags.map((tag) => <LeadTag key={tag} tag={tag} />)}</div></td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Select value={lead.status} onValueChange={(v) => onLeadStatusChange(lead.id, v as LeadStatus)}>
                      <SelectTrigger className={`h-7 w-[130px] rounded-full border text-[11px] ${statusColors[lead.status]}`}>
                        <SelectValue>{statusLabels[lead.status]}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border border-[#EBEBEB] bg-white text-[13px]">
                        {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-[#888C99]">{getOwnerName(lead.ownerId)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-[#888C99]">{formatDate(lead.createdAt)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button type="button" onClick={() => onLeadDelete(lead.id)} className="text-[11px] text-[#CCCCCC] hover:text-red-500">Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
