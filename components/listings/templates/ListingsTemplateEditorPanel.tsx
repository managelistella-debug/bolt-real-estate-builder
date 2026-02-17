'use client';

import { ListingCollectionTemplate, ListingCollectionTemplatePreset, ListingsSortOption, ListingStatus } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ListingsTemplateEditorPanelProps {
  template: ListingCollectionTemplate;
  onChange: (updates: Partial<ListingCollectionTemplate>) => void;
}

const PRESET_OPTIONS: Array<{ value: ListingCollectionTemplatePreset; label: string }> = [
  { value: 'editorial', label: 'Editorial' },
  { value: 'hero-featured', label: 'Hero Featured' },
  { value: 'compact', label: 'Compact' },
];

const STATUS_OPTIONS: Array<{ value: ListingStatus; label: string }> = [
  { value: 'for_sale', label: 'For Sale' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
];

const SORT_OPTIONS: Array<{ value: ListingsSortOption; label: string }> = [
  { value: 'date_added_desc', label: 'Newest to Oldest' },
  { value: 'price_desc', label: 'Price High to Low' },
  { value: 'price_asc', label: 'Price Low to High' },
  { value: 'custom_order', label: 'Custom Order' },
];

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(parseFloat(event.target.value) || 0)}
      />
    </div>
  );
}

export function ListingsTemplateEditorPanel({ template, onChange }: ListingsTemplateEditorPanelProps) {
  const toggleStatus = (status: ListingStatus, enabled: boolean) => {
    const statuses = enabled
      ? Array.from(new Set([...template.statuses, status]))
      : template.statuses.filter((item) => item !== status);
    onChange({ statuses });
  };

  return (
    <div className="space-y-4 p-4 overflow-auto">
      <div className="space-y-2 rounded-md border p-3">
        <Label>Template Name</Label>
        <Input value={template.name} onChange={(event) => onChange({ name: event.target.value })} />
        <Label className="mt-2">Public Page Slug</Label>
        <Input value={template.pageSlug} onChange={(event) => onChange({ pageSlug: event.target.value })} />
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Preset Layout</Label>
        <Select value={template.preset} onValueChange={(value: ListingCollectionTemplatePreset) => onChange({ preset: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRESET_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Listing Status Filter</Label>
        <p className="text-xs text-muted-foreground">Active = select For Sale + Pending.</p>
        <div className="space-y-2">
          {STATUS_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`status-${option.value}`}
                checked={template.statuses.includes(option.value)}
                onCheckedChange={(checked) => toggleStatus(option.value, !!checked)}
              />
              <Label htmlFor={`status-${option.value}`} className="text-sm font-normal">{option.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Default Sort</Label>
        <Select value={template.sortBy} onValueChange={(value: ListingsSortOption) => onChange({ sortBy: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Columns Per Breakpoint</Label>
        <div className="grid grid-cols-3 gap-2">
          <NumberField
            label="Desktop"
            value={template.columns.desktop}
            min={1}
            max={3}
            onChange={(value) => onChange({ columns: { ...template.columns, desktop: value } })}
          />
          <NumberField
            label="Tablet"
            value={template.columns.tablet}
            min={1}
            max={3}
            onChange={(value) => onChange({ columns: { ...template.columns, tablet: value } })}
          />
          <NumberField
            label="Mobile"
            value={template.columns.mobile}
            min={1}
            max={3}
            onChange={(value) => onChange({ columns: { ...template.columns, mobile: value } })}
          />
        </div>
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Field Visibility</Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(template.showFields).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 text-sm capitalize">
              <Checkbox
                checked={value}
                onCheckedChange={(checked) =>
                  onChange({ showFields: { ...template.showFields, [key]: !!checked } as any })
                }
              />
              {key}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Typography</Label>
        {(['address', 'city', 'price'] as const).map((field) => (
          <div key={field} className="space-y-2 rounded border p-2">
            <p className="text-xs font-semibold uppercase">{field}</p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={template.typography[field].fontFamily}
                onChange={(event) =>
                  onChange({
                    typography: {
                      ...template.typography,
                      [field]: { ...template.typography[field], fontFamily: event.target.value },
                    },
                  })
                }
                placeholder="Font family"
              />
              <Input
                type="number"
                value={template.typography[field].fontSize}
                onChange={(event) =>
                  onChange({
                    typography: {
                      ...template.typography,
                      [field]: { ...template.typography[field], fontSize: parseInt(event.target.value, 10) || 0 },
                    },
                  })
                }
                placeholder="Font size"
              />
              <Input
                value={template.typography[field].fontWeight}
                onChange={(event) =>
                  onChange({
                    typography: {
                      ...template.typography,
                      [field]: { ...template.typography[field], fontWeight: event.target.value },
                    },
                  })
                }
                placeholder="Font weight"
              />
              <Input
                type="color"
                value={template.typography[field].color}
                onChange={(event) =>
                  onChange({
                    typography: {
                      ...template.typography,
                      [field]: { ...template.typography[field], color: event.target.value },
                    },
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Status Badge Styles</Label>
        {STATUS_OPTIONS.map((status) => (
          <div key={status.value} className="space-y-2 rounded border p-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase">{status.label}</p>
              <label className="flex items-center gap-2 text-xs">
                <Checkbox
                  checked={template.statusBadgeStyles[status.value].enabled}
                  onCheckedChange={(checked) =>
                    onChange({
                      statusBadgeStyles: {
                        ...template.statusBadgeStyles,
                        [status.value]: {
                          ...template.statusBadgeStyles[status.value],
                          enabled: !!checked,
                        },
                      },
                    })
                  }
                />
                Enabled
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="color"
                value={template.statusBadgeStyles[status.value].backgroundColor}
                onChange={(event) =>
                  onChange({
                    statusBadgeStyles: {
                      ...template.statusBadgeStyles,
                      [status.value]: {
                        ...template.statusBadgeStyles[status.value],
                        backgroundColor: event.target.value,
                      },
                    },
                  })
                }
              />
              <Input
                type="color"
                value={template.statusBadgeStyles[status.value].textColor}
                onChange={(event) =>
                  onChange({
                    statusBadgeStyles: {
                      ...template.statusBadgeStyles,
                      [status.value]: {
                        ...template.statusBadgeStyles[status.value],
                        textColor: event.target.value,
                      },
                    },
                  })
                }
              />
              <Input
                type="number"
                value={template.statusBadgeStyles[status.value].borderRadius}
                onChange={(event) =>
                  onChange({
                    statusBadgeStyles: {
                      ...template.statusBadgeStyles,
                      [status.value]: {
                        ...template.statusBadgeStyles[status.value],
                        borderRadius: parseInt(event.target.value, 10) || 0,
                      },
                    },
                  })
                }
                placeholder="Radius"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Representation Badge Styles</Label>
        {(['buyer_representation', 'seller_representation'] as const).map((key) => (
          <div key={key} className="space-y-2 rounded border p-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase">{key.replace('_', ' ')}</p>
              <label className="flex items-center gap-2 text-xs">
                <Checkbox
                  checked={template.representationBadgeStyles[key].enabled}
                  onCheckedChange={(checked) =>
                    onChange({
                      representationBadgeStyles: {
                        ...template.representationBadgeStyles,
                        [key]: {
                          ...template.representationBadgeStyles[key],
                          enabled: !!checked,
                        },
                      },
                    })
                  }
                />
                Enabled
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="color"
                value={template.representationBadgeStyles[key].backgroundColor}
                onChange={(event) =>
                  onChange({
                    representationBadgeStyles: {
                      ...template.representationBadgeStyles,
                      [key]: {
                        ...template.representationBadgeStyles[key],
                        backgroundColor: event.target.value,
                      },
                    },
                  })
                }
              />
              <Input
                type="color"
                value={template.representationBadgeStyles[key].textColor}
                onChange={(event) =>
                  onChange({
                    representationBadgeStyles: {
                      ...template.representationBadgeStyles,
                      [key]: {
                        ...template.representationBadgeStyles[key],
                        textColor: event.target.value,
                      },
                    },
                  })
                }
              />
              <Input
                type="number"
                value={template.representationBadgeStyles[key].borderRadius}
                onChange={(event) =>
                  onChange({
                    representationBadgeStyles: {
                      ...template.representationBadgeStyles,
                      [key]: {
                        ...template.representationBadgeStyles[key],
                        borderRadius: parseInt(event.target.value, 10) || 0,
                      },
                    },
                  })
                }
                placeholder="Radius"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Hero Section</Label>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={template.hero.enabled}
            onCheckedChange={(checked) =>
              onChange({
                hero: {
                  ...template.hero,
                  enabled: !!checked,
                },
              })
            }
          />
          <span className="text-sm">Enable hero image</span>
        </div>
        {template.hero.enabled && (
          <div className="space-y-2">
            <Input
              value={template.hero.imageUrl || ''}
              onChange={(event) => onChange({ hero: { ...template.hero, imageUrl: event.target.value } })}
              placeholder="Hero image URL"
            />
            <Input
              value={template.hero.heading || ''}
              onChange={(event) => onChange({ hero: { ...template.hero, heading: event.target.value } })}
              placeholder="Hero heading"
            />
            <Input
              value={template.hero.subheading || ''}
              onChange={(event) => onChange({ hero: { ...template.hero, subheading: event.target.value } })}
              placeholder="Hero subheading"
            />
          </div>
        )}
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Background</Label>
        <Input type="color" value={template.backgroundColor} onChange={(event) => onChange({ backgroundColor: event.target.value })} />
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label>Pagination</Label>
        <Select
          value={template.pagination.mode}
          onValueChange={(value: 'paged' | 'infinite') =>
            onChange({ pagination: { ...template.pagination, mode: value } })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paged">Paged</SelectItem>
            <SelectItem value="infinite">Infinite Scroll</SelectItem>
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="Items per page"
            value={template.pagination.itemsPerPage}
            min={1}
            max={30}
            onChange={(value) => onChange({ pagination: { ...template.pagination, itemsPerPage: value } })}
          />
          <NumberField
            label="Infinite batch"
            value={template.pagination.infiniteBatch}
            min={1}
            max={30}
            onChange={(value) => onChange({ pagination: { ...template.pagination, infiniteBatch: value } })}
          />
        </div>
      </div>
    </div>
  );
}
