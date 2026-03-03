'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Listing, ListingsSortOption, ListingsWidget, ListingStatus } from '@/lib/types';
import { useAuthStore } from '@/lib/stores/auth';
import { useBuilderStore } from '@/lib/stores/builder';
import { useListingsStore } from '@/lib/stores/listings';
import { useWebsiteStore } from '@/lib/stores/website';
import { resolveResponsiveValue, updateResponsiveValue } from '@/lib/responsive';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { GlobalColorInput } from '../controls/GlobalColorInput';
import { ResponsiveControlShell, ResponsiveDevicePicker } from '../controls/ResponsiveControlShell';
import { TypographyControl } from '../controls/TypographyControl';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const { deviceView } = useBuilderStore();
  const { listings } = useListingsStore();
  const [manualSearch, setManualSearch] = useState('');
  const [queryOpen, setQueryOpen] = useState(true);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [gridLayoutOpen, setGridLayoutOpen] = useState(true);
  const [paginationOpen, setPaginationOpen] = useState(true);
  const [sectionLayoutOpen, setSectionLayoutOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [cardStyleOpen, setCardStyleOpen] = useState(true);
  const [imageStyleOpen, setImageStyleOpen] = useState(true);
  const [statusStyleOpen, setStatusStyleOpen] = useState(false);
  const [paginationStyleOpen, setPaginationStyleOpen] = useState(false);
  const normalizedWidget = normalizeListingsWidget(widget);
  const query = normalizedWidget.query;

  const layout = normalizedWidget.layout || {
    height: { type: 'auto' as const },
    width: 'container' as const,
    padding: { top: 60, right: 20, bottom: 60, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  const background = normalizedWidget.background || {
    type: 'color' as const,
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };

  const userListings = useMemo(
    () => listings.filter((listing) => (user?.id ? listing.userId === user.id : true)),
    [listings, user?.id]
  );
  const selectableManualListings = useMemo(() => {
    const selectedSet = new Set(query.manualListingIds);
    const needle = manualSearch.trim().toLowerCase();
    return userListings.filter((listing) => {
      if (selectedSet.has(listing.id)) return false;
      if (!needle) return true;
      return (
        listing.address.toLowerCase().includes(needle) ||
        listing.city.toLowerCase().includes(needle) ||
        listing.neighborhood.toLowerCase().includes(needle)
      );
    });
  }, [manualSearch, query.manualListingIds, userListings]);
  const manualSelection = query.manualListingIds
    .map((id) => userListings.find((listing) => listing.id === id))
    .filter(Boolean) as Listing[];

  const activeColumns = resolveResponsiveValue<number>(
    normalizedWidget.columns as any,
    deviceView,
    normalizedWidget.columns.desktop
  );
  const activePerPage = resolveResponsiveValue<number>(
    normalizedWidget.perPage as any,
    deviceView,
    normalizedWidget.perPage.desktop
  );

  const updateQuery = (updates: Partial<ListingsWidget['query']>) => {
    onChange({ query: { ...query, ...updates } });
  };

  const updateFilters = (updates: Partial<ListingsWidget['query']['filters']>) => {
    updateQuery({ filters: { ...query.filters, ...updates } });
  };

  const toggleStatus = (status: ListingStatus, enabled: boolean) => {
    const statuses = query.filters.statuses || [];
    if (enabled) {
      updateFilters({ statuses: Array.from(new Set([...statuses, status])) });
      return;
    }
    updateFilters({ statuses: statuses.filter((item) => item !== status) });
  };

  const addManualListing = (listingId: string) => {
    updateQuery({ manualListingIds: [...query.manualListingIds, listingId] });
  };

  const removeManualListing = (listingId: string) => {
    updateQuery({ manualListingIds: query.manualListingIds.filter((id) => id !== listingId) });
  };

  const moveManualListing = (listingId: string, direction: 'up' | 'down') => {
    const ids = [...query.manualListingIds];
    const index = ids.indexOf(listingId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ids.length) return;
    [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
    updateQuery({ manualListingIds: ids });
  };

  const contentTab = (
    <div className="space-y-3">
      <CollapsibleSection title="Query" open={queryOpen} onToggle={() => setQueryOpen(!queryOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Query Mode</Label>
            <Select
              value={query.mode}
              onValueChange={(value: 'manual' | 'filters') => updateQuery({ mode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Selection</SelectItem>
                <SelectItem value="filters">Filters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {query.mode === 'manual' ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Search Listings to Add</Label>
                <Input
                  value={manualSearch}
                  onChange={(event) => setManualSearch(event.target.value)}
                  placeholder="Search by address, city, neighborhood"
                />
              </div>
              <div className="max-h-40 overflow-auto space-y-2 rounded-md border p-2">
                {selectableManualListings.length ? (
                  selectableManualListings.slice(0, 30).map((listing) => (
                    <button
                      key={listing.id}
                      type="button"
                      className="w-full text-left rounded px-2 py-1.5 hover:bg-muted text-sm"
                      onClick={() => addManualListing(listing.id)}
                    >
                      <Plus className="h-3 w-3 inline mr-2" />
                      {listing.address} - {listing.city}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground px-1 py-2">No listings found.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Selected Listings</Label>
                <div className="space-y-2">
                  {manualSelection.map((listing, index) => (
                    <div key={listing.id} className="flex items-center justify-between rounded-md border p-2">
                      <p className="text-sm">
                        {index + 1}. {listing.address}
                      </p>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveManualListing(listing.id, 'up')}>
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => moveManualListing(listing.id, 'down')}>
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => removeManualListing(listing.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {manualSelection.length === 0 && (
                    <p className="text-xs text-muted-foreground">No manual listings selected yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Filter by Listing Status</Label>
                <p className="text-xs text-muted-foreground">Leave all unchecked to show all statuses.</p>
                <div className="space-y-2">
                  {LISTING_STATUS_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`listings-status-${option.value}`}
                        checked={query.filters.statuses.includes(option.value)}
                        onCheckedChange={(checked) => toggleStatus(option.value, !!checked)}
                      />
                      <Label htmlFor={`listings-status-${option.value}`} className="text-sm font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>City (optional)</Label>
                <Input
                  value={query.filters.city || ''}
                  onChange={(event) => updateFilters({ city: event.target.value })}
                  placeholder="Austin"
                />
              </div>
              <div className="space-y-2">
                <Label>Neighborhood (optional)</Label>
                <Input
                  value={query.filters.neighborhood || ''}
                  onChange={(event) => updateFilters({ neighborhood: event.target.value })}
                  placeholder="Brentwood"
                />
              </div>
              <div className="space-y-2">
                <Label>Search Text (optional)</Label>
                <Input
                  value={query.filters.search || ''}
                  onChange={(event) => updateFilters({ search: event.target.value })}
                  placeholder="Address keyword"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Sort Listings</Label>
            <Select
              value={normalizedWidget.sortBy}
              onValueChange={(value: ListingsSortOption) => onChange({ sortBy: value })}
            >
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
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Listing Details Visibility" open={visibilityOpen} onToggle={() => setVisibilityOpen(!visibilityOpen)}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="listings-show-status"
              checked={normalizedWidget.showStatusBadge}
              onCheckedChange={(checked) => onChange({ showStatusBadge: !!checked })}
            />
            <Label htmlFor="listings-show-status" className="text-sm font-normal">
              Show status badge
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="listings-show-view-property"
              checked={normalizedWidget.showViewPropertyCta}
              onCheckedChange={(checked) => onChange({ showViewPropertyCta: !!checked })}
            />
            <Label htmlFor="listings-show-view-property" className="text-sm font-normal">
              Show View Property CTA
            </Label>
          </div>
          {normalizedWidget.showViewPropertyCta && (
            <div className="space-y-2">
              <Label>View Property Label</Label>
              <Input
                value={normalizedWidget.viewPropertyLabel}
                onChange={(event) => onChange({ viewPropertyLabel: event.target.value })}
              />
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  const layoutTab = (
    <div className="space-y-2">
      <CollapsibleSection showBreakpointIcon title="Listings Layout" open={gridLayoutOpen} onToggle={() => setGridLayoutOpen(!gridLayoutOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Layout Variant</Label>
            <Select
              value={normalizedWidget.layoutVariant}
              onValueChange={(value: ListingsWidget['layoutVariant']) => onChange({ layoutVariant: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern-grid">Modern Grid</SelectItem>
                <SelectItem value="text-over-image">Text Over Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ResponsiveControlShell
            label="Columns"
            hasOverride={
              normalizedWidget.columns.tablet !== normalizedWidget.columns.desktop ||
              normalizedWidget.columns.mobile !== normalizedWidget.columns.desktop
            }
          >
            <Input
              type="number"
              min={1}
              max={4}
              value={activeColumns}
              onChange={(event) =>
                onChange({
                  columns: updateResponsiveValue(
                    normalizedWidget.columns,
                    deviceView,
                    parseInt(event.target.value, 10) || 1
                  ) as any,
                })
              }
            />
          </ResponsiveControlShell>

          <ResponsiveControlShell
            label="Listings per Page"
            hasOverride={
              normalizedWidget.perPage.tablet !== normalizedWidget.perPage.desktop ||
              normalizedWidget.perPage.mobile !== normalizedWidget.perPage.desktop
            }
          >
            <Input
              type="number"
              min={1}
              max={50}
              value={activePerPage}
              onChange={(event) =>
                onChange({
                  perPage: updateResponsiveValue(
                    normalizedWidget.perPage,
                    deviceView,
                    parseInt(event.target.value, 10) || 1
                  ) as any,
                })
              }
            />
          </ResponsiveControlShell>

          <div className="space-y-2">
            <Label>Gap Between Items</Label>
            <Input
              type="number"
              min={0}
              max={80}
              value={normalizedWidget.spacing}
              onChange={(event) => onChange({ spacing: parseInt(event.target.value, 10) || 0 })}
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection showBreakpointIcon title="Pagination / Load Behavior" open={paginationOpen} onToggle={() => setPaginationOpen(!paginationOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Mode</Label>
            <Select
              value={normalizedWidget.pagination.mode}
              onValueChange={(value: ListingsWidget['pagination']['mode']) =>
                onChange({ pagination: { ...normalizedWidget.pagination, mode: value } })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (fixed list)</SelectItem>
                <SelectItem value="paged">Paged (next/previous)</SelectItem>
                <SelectItem value="load_more">Load More Button</SelectItem>
                <SelectItem value="infinite">Infinite Scroll</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(normalizedWidget.pagination.mode === 'paged' || normalizedWidget.pagination.mode === 'load_more') && (
            <div className="space-y-2">
              <Label>Previous Button Label</Label>
              <Input
                value={normalizedWidget.pagination.previousLabel}
                onChange={(event) =>
                  onChange({ pagination: { ...normalizedWidget.pagination, previousLabel: event.target.value } })
                }
              />
              <Label className="pt-2">Next Button Label</Label>
              <Input
                value={normalizedWidget.pagination.nextLabel}
                onChange={(event) =>
                  onChange({ pagination: { ...normalizedWidget.pagination, nextLabel: event.target.value } })
                }
              />
            </div>
          )}

          {(normalizedWidget.pagination.mode === 'load_more' || normalizedWidget.pagination.mode === 'infinite') && (
            <div className="space-y-2">
              <Label>Load More Button Label</Label>
              <Input
                value={normalizedWidget.pagination.loadMoreLabel}
                onChange={(event) =>
                  onChange({ pagination: { ...normalizedWidget.pagination, loadMoreLabel: event.target.value } })
                }
              />
              <Label className="pt-2">Batch Size</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={normalizedWidget.pagination.infiniteBatchSize}
                onChange={(event) =>
                  onChange({
                    pagination: {
                      ...normalizedWidget.pagination,
                      infiniteBatchSize: parseInt(event.target.value, 10) || 1,
                    },
                  })
                }
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="listings-show-page-indicator"
              checked={normalizedWidget.pagination.showPageIndicator}
              onCheckedChange={(checked) =>
                onChange({
                  pagination: { ...normalizedWidget.pagination, showPageIndicator: !!checked },
                })
              }
            />
            <Label htmlFor="listings-show-page-indicator" className="text-sm font-normal">
              Show page indicator text
            </Label>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection showBreakpointIcon title="Section Layout" open={sectionLayoutOpen} onToggle={() => setSectionLayoutOpen(!sectionLayoutOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
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
          <div className="grid grid-cols-2 gap-3">
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
      </CollapsibleSection>
    </div>
  );

  const styleTab = (
    <div className="space-y-2">
      <CollapsibleSection showBreakpointIcon title="Card Style" open={cardStyleOpen} onToggle={() => setCardStyleOpen(!cardStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Card Background</Label>
            <GlobalColorInput
              value={normalizedWidget.style.cardBackgroundColor}
              onChange={(nextColor) =>
                onChange({ style: { ...normalizedWidget.style, cardBackgroundColor: nextColor } })
              }
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#ffffff"
            />
          </div>
          <div className="space-y-2">
            <Label>Card Background Opacity ({normalizedWidget.style.cardBackgroundOpacity}%)</Label>
            <Input
              type="range"
              min={0}
              max={100}
              value={normalizedWidget.style.cardBackgroundOpacity}
              onChange={(event) =>
                onChange({
                  style: { ...normalizedWidget.style, cardBackgroundOpacity: parseInt(event.target.value, 10) || 0 },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Card Border Color</Label>
            <GlobalColorInput
              value={normalizedWidget.style.cardBorderColor}
              onChange={(nextColor) =>
                onChange({ style: { ...normalizedWidget.style, cardBorderColor: nextColor } })
              }
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#e5e7eb"
            />
          </div>
          <div className="space-y-2">
            <Label>Card Border Opacity ({normalizedWidget.style.cardBorderOpacity}%)</Label>
            <Input
              type="range"
              min={0}
              max={100}
              value={normalizedWidget.style.cardBorderOpacity}
              onChange={(event) =>
                onChange({
                  style: { ...normalizedWidget.style, cardBorderOpacity: parseInt(event.target.value, 10) || 0 },
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Border Width</Label>
              <Input
                type="number"
                value={normalizedWidget.style.cardBorderWidth}
                onChange={(event) =>
                  onChange({
                    style: { ...normalizedWidget.style, cardBorderWidth: parseInt(event.target.value, 10) || 0 },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Border Radius</Label>
              <Input
                type="number"
                value={normalizedWidget.style.cardBorderRadius}
                onChange={(event) =>
                  onChange({
                    style: { ...normalizedWidget.style, cardBorderRadius: parseInt(event.target.value, 10) || 0 },
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="listings-card-shadow"
              checked={normalizedWidget.style.cardShadow}
              onCheckedChange={(checked) =>
                onChange({ style: { ...normalizedWidget.style, cardShadow: !!checked } })
              }
            />
            <Label htmlFor="listings-card-shadow" className="text-sm font-normal">
              Card Drop Shadow
            </Label>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection showBreakpointIcon title="Card Image Style" open={imageStyleOpen} onToggle={() => setImageStyleOpen(!imageStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Image Border Color</Label>
            <GlobalColorInput
              value={normalizedWidget.style.imageBorderColor}
              onChange={(nextColor) =>
                onChange({ style: { ...normalizedWidget.style, imageBorderColor: nextColor } })
              }
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#e5e7eb"
            />
          </div>
          <div className="space-y-2">
            <Label>Image Border Opacity ({normalizedWidget.style.imageBorderOpacity}%)</Label>
            <Input
              type="range"
              min={0}
              max={100}
              value={normalizedWidget.style.imageBorderOpacity}
              onChange={(event) =>
                onChange({
                  style: { ...normalizedWidget.style, imageBorderOpacity: parseInt(event.target.value, 10) || 0 },
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Image Border Width</Label>
              <Input
                type="number"
                value={normalizedWidget.style.imageBorderWidth}
                onChange={(event) =>
                  onChange({
                    style: { ...normalizedWidget.style, imageBorderWidth: parseInt(event.target.value, 10) || 0 },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Image Border Radius</Label>
              <Input
                type="number"
                value={normalizedWidget.style.imageBorderRadius}
                onChange={(event) =>
                  onChange({
                    style: { ...normalizedWidget.style, imageBorderRadius: parseInt(event.target.value, 10) || 0 },
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="listings-image-shadow"
              checked={normalizedWidget.style.imageShadow}
              onCheckedChange={(checked) =>
                onChange({ style: { ...normalizedWidget.style, imageShadow: !!checked } })
              }
            />
            <Label htmlFor="listings-image-shadow" className="text-sm font-normal">
              Image Drop Shadow
            </Label>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection showBreakpointIcon title="Status Style" open={statusStyleOpen} onToggle={() => setStatusStyleOpen(!statusStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Status Text Color</Label>
            <GlobalColorInput
              value={normalizedWidget.style.statusTextColor}
              onChange={(nextColor) =>
                onChange({ style: { ...normalizedWidget.style, statusTextColor: nextColor } })
              }
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#ffffff"
            />
          </div>
          <div className="space-y-2">
            <Label>Status Text Opacity ({normalizedWidget.style.statusTextOpacity}%)</Label>
            <Input
              type="range"
              min={0}
              max={100}
              value={normalizedWidget.style.statusTextOpacity}
              onChange={(event) =>
                onChange({
                  style: { ...normalizedWidget.style, statusTextOpacity: parseInt(event.target.value, 10) || 0 },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Status Background</Label>
            <GlobalColorInput
              value={normalizedWidget.style.statusBackgroundColor}
              onChange={(nextColor) =>
                onChange({ style: { ...normalizedWidget.style, statusBackgroundColor: nextColor } })
              }
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#111827"
            />
          </div>
          <div className="space-y-2">
            <Label>Status Background Opacity ({normalizedWidget.style.statusBackgroundOpacity}%)</Label>
            <Input
              type="range"
              min={0}
              max={100}
              value={normalizedWidget.style.statusBackgroundOpacity}
              onChange={(event) =>
                onChange({
                  style: { ...normalizedWidget.style, statusBackgroundOpacity: parseInt(event.target.value, 10) || 0 },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Status Radius</Label>
            <Input
              type="number"
              value={normalizedWidget.style.statusBorderRadius}
              onChange={(event) =>
                onChange({
                  style: { ...normalizedWidget.style, statusBorderRadius: parseInt(event.target.value, 10) || 0 },
                })
              }
            />
          </div>
        </div>
      </CollapsibleSection>

      <TypographyControl
        label="Address Typography"
        defaultOpen={false}
        value={{
          fontFamily: normalizedWidget.style.typography.address.fontFamily,
          fontSize: { value: normalizedWidget.style.typography.address.fontSize, unit: 'px' as const },
          fontWeight: normalizedWidget.style.typography.address.fontWeight,
          color: normalizedWidget.style.typography.address.color,
        }}
        onChange={(updates) =>
          onChange({
            style: {
              ...normalizedWidget.style,
              typography: {
                ...normalizedWidget.style.typography,
                address: {
                  ...normalizedWidget.style.typography.address,
                  ...updates,
                  fontSize:
                    typeof updates.fontSize === 'object' && updates.fontSize && 'value' in updates.fontSize
                      ? Number(updates.fontSize.value)
                      : normalizedWidget.style.typography.address.fontSize,
                },
              },
            },
          })
        }
        colorOpacity={normalizedWidget.style.typography.address.colorOpacity}
        onColorOpacityChange={(next) =>
          onChange({
            style: {
              ...normalizedWidget.style,
              typography: {
                ...normalizedWidget.style.typography,
                address: { ...normalizedWidget.style.typography.address, colorOpacity: next },
              },
            },
          })
        }
      />

      <TypographyControl
        label="City Typography"
        defaultOpen={false}
        value={{
          fontFamily: normalizedWidget.style.typography.city.fontFamily,
          fontSize: { value: normalizedWidget.style.typography.city.fontSize, unit: 'px' as const },
          fontWeight: normalizedWidget.style.typography.city.fontWeight,
          color: normalizedWidget.style.typography.city.color,
        }}
        onChange={(updates) =>
          onChange({
            style: {
              ...normalizedWidget.style,
              typography: {
                ...normalizedWidget.style.typography,
                city: {
                  ...normalizedWidget.style.typography.city,
                  ...updates,
                  fontSize:
                    typeof updates.fontSize === 'object' && updates.fontSize && 'value' in updates.fontSize
                      ? Number(updates.fontSize.value)
                      : normalizedWidget.style.typography.city.fontSize,
                },
              },
            },
          })
        }
        colorOpacity={normalizedWidget.style.typography.city.colorOpacity}
        onColorOpacityChange={(next) =>
          onChange({
            style: {
              ...normalizedWidget.style,
              typography: {
                ...normalizedWidget.style.typography,
                city: { ...normalizedWidget.style.typography.city, colorOpacity: next },
              },
            },
          })
        }
      />

      <TypographyControl
        label="Price Typography"
        defaultOpen={false}
        value={{
          fontFamily: normalizedWidget.style.typography.price.fontFamily,
          fontSize: { value: normalizedWidget.style.typography.price.fontSize, unit: 'px' as const },
          fontWeight: normalizedWidget.style.typography.price.fontWeight,
          color: normalizedWidget.style.typography.price.color,
        }}
        onChange={(updates) =>
          onChange({
            style: {
              ...normalizedWidget.style,
              typography: {
                ...normalizedWidget.style.typography,
                price: {
                  ...normalizedWidget.style.typography.price,
                  ...updates,
                  fontSize:
                    typeof updates.fontSize === 'object' && updates.fontSize && 'value' in updates.fontSize
                      ? Number(updates.fontSize.value)
                      : normalizedWidget.style.typography.price.fontSize,
                },
              },
            },
          })
        }
        colorOpacity={normalizedWidget.style.typography.price.colorOpacity}
        onColorOpacityChange={(next) =>
          onChange({
            style: {
              ...normalizedWidget.style,
              typography: {
                ...normalizedWidget.style.typography,
                price: { ...normalizedWidget.style.typography.price, colorOpacity: next },
              },
            },
          })
        }
      />

      <TypographyControl
        label="Status Typography"
        defaultOpen={false}
        value={{
          fontFamily: normalizedWidget.style.typography.status.fontFamily,
          fontSize: { value: normalizedWidget.style.typography.status.fontSize, unit: 'px' as const },
          fontWeight: normalizedWidget.style.typography.status.fontWeight,
          color: normalizedWidget.style.typography.status.color,
        }}
        onChange={(updates) =>
          onChange({
            style: {
              ...normalizedWidget.style,
              typography: {
                ...normalizedWidget.style.typography,
                status: {
                  ...normalizedWidget.style.typography.status,
                  ...updates,
                  fontSize:
                    typeof updates.fontSize === 'object' && updates.fontSize && 'value' in updates.fontSize
                      ? Number(updates.fontSize.value)
                      : normalizedWidget.style.typography.status.fontSize,
                },
              },
            },
          })
        }
        colorOpacity={normalizedWidget.style.typography.status.colorOpacity}
        onColorOpacityChange={(next) =>
          onChange({
            style: {
              ...normalizedWidget.style,
              typography: {
                ...normalizedWidget.style.typography,
                status: { ...normalizedWidget.style.typography.status, colorOpacity: next },
              },
            },
          })
        }
      />

      <TypographyControl
        label="Action Typography"
        defaultOpen={false}
        value={{
          fontFamily: normalizedWidget.style.typography.action.fontFamily,
          fontSize: { value: normalizedWidget.style.typography.action.fontSize, unit: 'px' as const },
          fontWeight: normalizedWidget.style.typography.action.fontWeight,
          color: normalizedWidget.style.typography.action.color,
        }}
        onChange={(updates) =>
          onChange({
            style: {
              ...normalizedWidget.style,
              typography: {
                ...normalizedWidget.style.typography,
                action: {
                  ...normalizedWidget.style.typography.action,
                  ...updates,
                  fontSize:
                    typeof updates.fontSize === 'object' && updates.fontSize && 'value' in updates.fontSize
                      ? Number(updates.fontSize.value)
                      : normalizedWidget.style.typography.action.fontSize,
                },
              },
            },
          })
        }
        colorOpacity={normalizedWidget.style.typography.action.colorOpacity}
        onColorOpacityChange={(next) =>
          onChange({
            style: {
              ...normalizedWidget.style,
              typography: {
                ...normalizedWidget.style.typography,
                action: { ...normalizedWidget.style.typography.action, colorOpacity: next },
              },
            },
          })
        }
      />

      <CollapsibleSection
        showBreakpointIcon
        title="Pagination Button Style"
        open={paginationStyleOpen}
        onToggle={() => setPaginationStyleOpen(!paginationStyleOpen)}
      >
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Text Color</Label>
            <GlobalColorInput
              value={normalizedWidget.style.paginationButton.textColor}
              onChange={(nextColor) =>
                onChange({
                  style: {
                    ...normalizedWidget.style,
                    paginationButton: { ...normalizedWidget.style.paginationButton, textColor: nextColor },
                  },
                })
              }
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#111827"
            />
          </div>
          <OpacitySlider
            label="Text Color Opacity"
            value={normalizedWidget.style.paginationButton.textColorOpacity}
            onChange={(next) =>
              onChange({
                style: {
                  ...normalizedWidget.style,
                  paginationButton: { ...normalizedWidget.style.paginationButton, textColorOpacity: next },
                },
              })
            }
          />
          <div className="space-y-2">
            <Label>Background Color</Label>
            <GlobalColorInput
              value={normalizedWidget.style.paginationButton.backgroundColor}
              onChange={(nextColor) =>
                onChange({
                  style: {
                    ...normalizedWidget.style,
                    paginationButton: { ...normalizedWidget.style.paginationButton, backgroundColor: nextColor },
                  },
                })
              }
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#ffffff"
            />
          </div>
          <OpacitySlider
            label="Background Color Opacity"
            value={normalizedWidget.style.paginationButton.backgroundColorOpacity}
            onChange={(next) =>
              onChange({
                style: {
                  ...normalizedWidget.style,
                  paginationButton: { ...normalizedWidget.style.paginationButton, backgroundColorOpacity: next },
                },
              })
            }
          />
          <div className="space-y-2">
            <Label>Border Color</Label>
            <GlobalColorInput
              value={normalizedWidget.style.paginationButton.borderColor}
              onChange={(nextColor) =>
                onChange({
                  style: {
                    ...normalizedWidget.style,
                    paginationButton: { ...normalizedWidget.style.paginationButton, borderColor: nextColor },
                  },
                })
              }
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#d1d5db"
            />
          </div>
          <OpacitySlider
            label="Border Color Opacity"
            value={normalizedWidget.style.paginationButton.borderColorOpacity}
            onChange={(next) =>
              onChange({
                style: {
                  ...normalizedWidget.style,
                  paginationButton: { ...normalizedWidget.style.paginationButton, borderColorOpacity: next },
                },
              })
            }
          />
          <div className="space-y-2">
            <Label>Border Radius</Label>
            <Input
              type="number"
              min={0}
              value={normalizedWidget.style.paginationButton.borderRadius}
              onChange={(event) =>
                onChange({
                  style: {
                    ...normalizedWidget.style,
                    paginationButton: {
                      ...normalizedWidget.style.paginationButton,
                      borderRadius: parseInt(event.target.value, 10) || 0,
                    },
                  },
                })
              }
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection showBreakpointIcon title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <GlobalColorInput
              value={background.color}
              onChange={(nextColor) => onChange({ background: { ...background, color: nextColor } })}
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="transparent"
              placeholder="transparent"
            />
          </div>
          <div className="space-y-2">
            <Label>Background Opacity ({background.opacity ?? 100}%)</Label>
            <Input
              type="range"
              min={0}
              max={100}
              value={background.opacity ?? 100}
              onChange={(event) =>
                onChange({
                  background: { ...background, opacity: parseInt(event.target.value, 10) || 0 },
                })
              }
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  return <SectionEditorTabs sectionType="listings" contentTab={contentTab} layoutTab={layoutTab} styleTab={styleTab} />;
}

function CollapsibleSection({
  title,
  open,
  onToggle,
  showBreakpointIcon = false,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  showBreakpointIcon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg">
      <button
        type="button"
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{title}</span>
          {showBreakpointIcon && (
            <div onClick={(event) => event.stopPropagation()} onMouseDown={(event) => event.stopPropagation()}>
              <ResponsiveDevicePicker className="h-6 w-6" />
            </div>
          )}
        </div>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && <div className="p-4 pt-0 space-y-3">{children}</div>}
    </div>
  );
}

function OpacitySlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (nextValue: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label} ({value}%)</Label>
      <Input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(parseInt(event.target.value, 10) || 0)}
      />
    </div>
  );
}

function normalizeListingsWidget(widget: ListingsWidget): ListingsWidget {
  const oldWidget = widget as any;
  const legacyColumns = typeof oldWidget.columns === 'number' ? oldWidget.columns : undefined;
  const legacyMaxItems = typeof oldWidget.maxItems === 'number' ? oldWidget.maxItems : undefined;
  const legacyStatuses = Array.isArray(oldWidget.statuses) ? oldWidget.statuses : [];
  const existingColumns =
    oldWidget.columns && typeof oldWidget.columns === 'object' && 'desktop' in oldWidget.columns
      ? oldWidget.columns
      : undefined;

  const columns = existingColumns || {
    desktop: legacyColumns || 3,
    tablet: Math.max(1, Math.min(2, legacyColumns || 2)),
    mobile: 1,
  };

  const perPage = oldWidget.perPage || {
    desktop: legacyMaxItems || 9,
    tablet: Math.min(legacyMaxItems || 9, 6),
    mobile: Math.min(legacyMaxItems || 9, 3),
  };

  const styleDefaults: ListingsWidget['style'] = {
    cardBackgroundColor: '#ffffff',
    cardBackgroundOpacity: 100,
    cardBorderColor: '#e5e7eb',
    cardBorderOpacity: 100,
    cardBorderWidth: 1,
    cardBorderRadius: 12,
    cardShadow: true,
    imageBorderRadius: 8,
    imageBorderColor: '#e5e7eb',
    imageBorderOpacity: 100,
    imageBorderWidth: 0,
    imageShadow: false,
    statusTextColor: '#ffffff',
    statusTextOpacity: 100,
    statusBackgroundColor: '#111827',
    statusBackgroundOpacity: 100,
    statusBorderRadius: 9999,
    typography: {
      address: { fontFamily: 'Inter', fontSize: 18, fontWeight: '700', color: '#111827', colorOpacity: 100 },
      city: { fontFamily: 'Inter', fontSize: 14, fontWeight: '400', color: '#6b7280', colorOpacity: 100 },
      price: { fontFamily: 'Inter', fontSize: 20, fontWeight: '700', color: '#111827', colorOpacity: 100 },
      status: { fontFamily: 'Inter', fontSize: 11, fontWeight: '700', color: '#ffffff', colorOpacity: 100 },
      action: { fontFamily: 'Inter', fontSize: 13, fontWeight: '600', color: '#111827', colorOpacity: 100 },
    },
    paginationButton: {
      textColor: '#111827',
      textColorOpacity: 100,
      backgroundColor: '#ffffff',
      backgroundColorOpacity: 100,
      borderColor: '#d1d5db',
      borderColorOpacity: 100,
      borderRadius: 8,
    },
  };

  return {
    ...widget,
    layoutVariant:
      oldWidget.layoutVariant === 'compact-rows'
        ? 'text-over-image'
        : oldWidget.layoutVariant === 'editorial-split'
          ? 'modern-grid'
          : (oldWidget.layoutVariant || 'modern-grid'),
    query: oldWidget.query || {
      mode: 'filters',
      manualListingIds: [],
      filters: {
        statuses: legacyStatuses,
        city: '',
        neighborhood: '',
        search: '',
      },
    },
    sortBy: oldWidget.sortBy || 'date_added_desc',
    columns,
    perPage,
    spacing: typeof oldWidget.spacing === 'number' ? oldWidget.spacing : 20,
    pagination: oldWidget.pagination || {
      mode: legacyMaxItems ? 'none' : 'paged',
      loadMoreLabel: 'View More',
      previousLabel: 'Previous',
      nextLabel: 'Next',
      infiniteBatchSize: 3,
      showPageIndicator: true,
    },
    showStatusBadge: typeof oldWidget.showStatusBadge === 'boolean' ? oldWidget.showStatusBadge : true,
    showViewPropertyCta: typeof oldWidget.showViewPropertyCta === 'boolean' ? oldWidget.showViewPropertyCta : true,
    viewPropertyLabel: oldWidget.viewPropertyLabel || 'View Property',
    style: {
      ...styleDefaults,
      ...(oldWidget.style || {}),
      typography: {
        ...styleDefaults.typography,
        ...(oldWidget.style?.typography || {}),
        address: {
          ...styleDefaults.typography.address,
          ...(oldWidget.style?.typography?.address || {}),
        },
        city: {
          ...styleDefaults.typography.city,
          ...(oldWidget.style?.typography?.city || {}),
        },
        price: {
          ...styleDefaults.typography.price,
          ...(oldWidget.style?.typography?.price || {}),
        },
        status: {
          ...styleDefaults.typography.status,
          ...(oldWidget.style?.typography?.status || {}),
        },
        action: {
          ...styleDefaults.typography.action,
          ...(oldWidget.style?.typography?.action || {}),
        },
      },
      paginationButton: {
        ...styleDefaults.paginationButton,
        ...(oldWidget.style?.paginationButton || {}),
      },
    },
  };
}
