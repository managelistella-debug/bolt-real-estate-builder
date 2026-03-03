'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Upload, Download, Plus } from 'lucide-react';
import { LeadStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-4">
      {/* Stats and Actions Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Contacts</h2>
          <Badge variant="secondary" className="text-sm">
            {totalCount}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search and Filters Row */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, phone, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>

        {/* Tag Filter */}
        <Select
          value={selectedTags[0] || 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              onClearFilters();
            } else {
              onTagToggle(value);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {availableTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {statusFilter !== 'all' && (
            <Badge variant="secondary">
              Status: {statusFilter}
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary">
              Tag: {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
