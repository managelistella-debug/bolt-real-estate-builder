'use client';

import { Search, Upload, Download, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadStatus } from '@/lib/types';

const darkInput = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const darkSelectTrigger = 'flex h-[34px] items-center rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black';
const darkSelectContent = 'rounded-lg border border-[#EBEBEB] bg-white text-[13px] text-black';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: LeadStatus | 'all';
  onStatusFilterChange: (value: LeadStatus | 'all') => void;
  selectedTags: string[];
  availableTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
  onImport: () => void;
  onExport: () => void;
  onAddNew: () => void;
  totalCount: number;
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedTags,
  availableTags,
  onTagToggle,
  onClearFilters,
  onImport,
  onExport,
  onAddNew,
  totalCount,
}: SearchAndFiltersProps) {
  const hasActiveFilters = statusFilter !== 'all' || selectedTags.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-medium text-black">Contacts</h2>
          <span className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[11px] text-[#888C99]">{totalCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={onImport} className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
            <Upload className="h-3.5 w-3.5" /> Import
          </button>
          <button type="button" onClick={onExport} className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button type="button" onClick={onAddNew} className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]">
            <Plus className="h-3.5 w-3.5" /> Add Contact
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
          <input type="text" placeholder="Search by name, email, phone, or tags..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className={`${darkInput} pl-8`} />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className={`w-[160px] ${darkSelectTrigger}`}><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent className={darkSelectContent}>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedTags[0] || 'all'} onValueChange={(v) => { if (v === 'all') onClearFilters(); else onTagToggle(v); }}>
          <SelectTrigger className={`w-[160px] ${darkSelectTrigger}`}><SelectValue placeholder="Filter by tag" /></SelectTrigger>
          <SelectContent className={darkSelectContent}>
            <SelectItem value="all">All Tags</SelectItem>
            {availableTags.map((tag) => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <button type="button" onClick={onClearFilters} className="h-[30px] rounded-lg px-2 text-[13px] text-[#888C99] hover:text-black">Clear filters</button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[#888C99]">Active:</span>
          {statusFilter !== 'all' && <span className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[11px] text-[#888C99]">Status: {statusFilter}</span>}
          {selectedTags.map((tag) => <span key={tag} className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[11px] text-[#888C99]">Tag: {tag}</span>)}
        </div>
      )}
    </div>
  );
}
