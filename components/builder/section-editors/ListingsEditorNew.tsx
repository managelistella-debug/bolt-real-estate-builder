'use client';

import { useEffect } from 'react';
import { ListingsSortOption, ListingsWidget, ListingStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { useWebsiteStore } from '@/lib/stores/website';
import { GlobalColorInput } from '../controls/GlobalColorInput';
import { useAuthStore } from '@/lib/stores/auth';
import { useListingsTemplatesStore } from '@/lib/stores/listingsTemplates';

interface ListingsEditorNewProps {
  widget: ListingsWidget;
  onChange: (updates: Partial<ListingsWidget>) => void;
}

const LISTING_STATUS_OPTIONS: Array<{ value: ListingStatus; label: string }> = [
  { value: 'for_sale', label: 'For Sale' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
];

const SORT_OPTIONS: Array<{ value: ListingsSortOption; label: string }> = [
  { value: 'date_added_desc', label: 'Date Added (Newest First)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'custom_order', label: 'Custom Order' },
];

export function ListingsEditorNew({ widget, onChange }: ListingsEditorNewProps) {
  const { currentWebsite } = useWebsiteStore();
  const { user } = useAuthStore();
  const { initializeTemplatesForUser, getTemplatesForUser } = useListingsTemplatesStore();
  const layout = widget.layout || {
    height: { type: 'auto' as const },
    width: 'container' as const,
    padding: { top: 60, right: 20, bottom: 60, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  const background = widget.background || {
    type: 'color' as const,
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };

  const statuses = widget.statuses || [];
  const templates = getTemplatesForUser(user?.id);

  useEffect(() => {
    if (user) {
      initializeTemplatesForUser(user.id);
    }
  }, [initializeTemplatesForUser, user]);

  const toggleStatus = (status: ListingStatus, enabled: boolean) => {
    if (enabled) {
      onChange({ statuses: Array.from(new Set([...statuses, status])) });
      return;
    }
    onChange({ statuses: statuses.filter((item) => item !== status) });
  };

  const contentTab = (
    <div className="space-y-4">
      <div className="space-y-2 p-3 border rounded-lg">
        <Label>Use Saved Listings Template (Optional)</Label>
        <Select
          value={widget.templateId || 'none'}
          onValueChange={(value) => onChange({ templateId: value === 'none' ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (use block-level settings)</SelectItem>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 p-3 border rounded-lg">
        <Label>Filter by Listing Status</Label>
        <p className="text-xs text-muted-foreground">
          Leave all unchecked to show all statuses.
        </p>
        <div className="space-y-2">
          {LISTING_STATUS_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`listings-status-${option.value}`}
                checked={statuses.includes(option.value)}
                onCheckedChange={(checked) => toggleStatus(option.value, !!checked)}
              />
              <Label htmlFor={`listings-status-${option.value}`} className="text-sm font-normal">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 p-3 border rounded-lg">
        <Label>Sort Listings</Label>
        <Select value={widget.sortBy} onValueChange={(value: ListingsSortOption) => onChange({ sortBy: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 p-3 border rounded-lg">
        <Checkbox
          id="listings-show-status"
          checked={widget.showStatusBadge}
          onCheckedChange={(checked) => onChange({ showStatusBadge: !!checked })}
        />
        <Label htmlFor="listings-show-status" className="text-sm font-normal">
          Show status badge on listing image
        </Label>
      </div>

      <div className="space-y-2 p-3 border rounded-lg">
        <Label>Max Listings to Display</Label>
        <Input
          type="number"
          min={1}
          max={24}
          value={widget.maxItems || ''}
          placeholder="Show all"
          onChange={(event) =>
            onChange({
              maxItems: event.target.value ? parseInt(event.target.value, 10) : undefined,
            })
          }
        />
      </div>
    </div>
  );

  const layoutTab = (
    <div className="space-y-4">
      <div className="space-y-2 p-3 border rounded-lg">
        <Label>Columns</Label>
        <Input
          type="number"
          min={1}
          max={4}
          value={widget.columns}
          onChange={(event) => onChange({ columns: parseInt(event.target.value, 10) || 1 })}
        />
      </div>

      <div className="space-y-2 p-3 border rounded-lg">
        <Label>Section Width</Label>
        <Select
          value={layout.width || 'container'}
          onValueChange={(value: 'full' | 'container') => onChange({ layout: { ...layout, width: value } })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="container">Container</SelectItem>
            <SelectItem value="full">Full Width</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg">
        <div className="space-y-2">
          <Label className="text-xs">Padding Top</Label>
          <Input
            type="number"
            value={layout.padding.top || 0}
            onChange={(event) =>
              onChange({
                layout: { ...layout, padding: { ...layout.padding, top: parseInt(event.target.value, 10) || 0 } },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Padding Bottom</Label>
          <Input
            type="number"
            value={layout.padding.bottom || 0}
            onChange={(event) =>
              onChange({
                layout: {
                  ...layout,
                  padding: { ...layout.padding, bottom: parseInt(event.target.value, 10) || 0 },
                },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Padding Left</Label>
          <Input
            type="number"
            value={layout.padding.left || 0}
            onChange={(event) =>
              onChange({
                layout: { ...layout, padding: { ...layout.padding, left: parseInt(event.target.value, 10) || 0 } },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Padding Right</Label>
          <Input
            type="number"
            value={layout.padding.right || 0}
            onChange={(event) =>
              onChange({
                layout: {
                  ...layout,
                  padding: { ...layout.padding, right: parseInt(event.target.value, 10) || 0 },
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );

  const styleTab = (
    <div className="space-y-3 p-3 border rounded-lg">
      <Label>Background Color</Label>
      <GlobalColorInput
        value={background.color}
        onChange={(nextColor) => onChange({ background: { ...background, color: nextColor } })}
        globalStyles={currentWebsite?.globalStyles}
        defaultColor="transparent"
        placeholder="transparent"
      />
    </div>
  );

  return <SectionEditorTabs sectionType="listings" contentTab={contentTab} layoutTab={layoutTab} styleTab={styleTab} />;
}
