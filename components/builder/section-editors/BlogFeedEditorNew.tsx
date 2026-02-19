'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { BlogFeedWidget, BlogPost, BlogSortOption, BlogStatus } from '@/lib/types';
import { useAuthStore } from '@/lib/stores/auth';
import { useBuilderStore } from '@/lib/stores/builder';
import { useBlogsStore } from '@/lib/stores/blogs';
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

interface BlogFeedEditorNewProps {
  widget: BlogFeedWidget;
  onChange: (updates: Partial<BlogFeedWidget>) => void;
}

const BLOG_STATUS_OPTIONS: Array<{ value: BlogStatus; label: string }> = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

const SORT_OPTIONS: Array<{ value: BlogSortOption; label: string }> = [
  { value: 'date_desc', label: 'Date (Newest First)' },
  { value: 'date_asc', label: 'Date (Oldest First)' },
  { value: 'title_asc', label: 'Title (A-Z)' },
  { value: 'title_desc', label: 'Title (Z-A)' },
  { value: 'custom_order', label: 'Custom Order' },
];

export function BlogFeedEditorNew({ widget, onChange }: BlogFeedEditorNewProps) {
  const { currentWebsite } = useWebsiteStore();
  const { user } = useAuthStore();
  const { deviceView } = useBuilderStore();
  const { blogs } = useBlogsStore();

  const [manualSearch, setManualSearch] = useState('');
  const [queryOpen, setQueryOpen] = useState(true);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(true);
  const [paginationOpen, setPaginationOpen] = useState(true);
  const [sectionLayoutOpen, setSectionLayoutOpen] = useState(false);
  const [cardStyleOpen, setCardStyleOpen] = useState(true);
  const [imageStyleOpen, setImageStyleOpen] = useState(true);
  const [paginationStyleOpen, setPaginationStyleOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);

  const normalizedWidget = normalizeBlogFeedWidget(widget);
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

  const userBlogs = useMemo(
    () => blogs.filter((post) => (user?.id ? post.userId === user.id : true)),
    [blogs, user?.id]
  );
  const selectableManualBlogs = useMemo(() => {
    const selectedSet = new Set(query.manualBlogIds);
    const needle = manualSearch.trim().toLowerCase();
    return userBlogs.filter((post) => {
      if (selectedSet.has(post.id)) return false;
      if (!needle) return true;
      return (
        post.title.toLowerCase().includes(needle) ||
        (post.category || '').toLowerCase().includes(needle) ||
        (post.excerpt || '').toLowerCase().includes(needle)
      );
    });
  }, [manualSearch, query.manualBlogIds, userBlogs]);
  const manualSelection = query.manualBlogIds
    .map((id) => userBlogs.find((post) => post.id === id))
    .filter(Boolean) as BlogPost[];

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

  const updateQuery = (updates: Partial<BlogFeedWidget['query']>) => {
    onChange({ query: { ...query, ...updates } });
  };

  const updateFilters = (updates: Partial<BlogFeedWidget['query']['filters']>) => {
    updateQuery({ filters: { ...query.filters, ...updates } });
  };

  const toggleStatus = (status: BlogStatus, enabled: boolean) => {
    const statuses = query.filters.statuses || [];
    if (enabled) {
      updateFilters({ statuses: Array.from(new Set([...statuses, status])) });
      return;
    }
    updateFilters({ statuses: statuses.filter((item) => item !== status) });
  };

  const addManualBlog = (blogId: string) => {
    updateQuery({ manualBlogIds: [...query.manualBlogIds, blogId] });
  };

  const removeManualBlog = (blogId: string) => {
    updateQuery({ manualBlogIds: query.manualBlogIds.filter((id) => id !== blogId) });
  };

  const moveManualBlog = (blogId: string, direction: 'up' | 'down') => {
    const ids = [...query.manualBlogIds];
    const index = ids.indexOf(blogId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ids.length) return;
    [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
    updateQuery({ manualBlogIds: ids });
  };

  const updateTypography = (
    key: keyof BlogFeedWidget['style']['typography'],
    updates: Record<string, any>,
    colorOpacity?: number
  ) => {
    const current = normalizedWidget.style.typography[key];
    const next = {
      ...current,
      ...updates,
      fontSize:
        typeof updates.fontSize === 'object' && updates.fontSize && 'value' in updates.fontSize
          ? Number(updates.fontSize.value)
          : current.fontSize,
      colorOpacity: typeof colorOpacity === 'number' ? colorOpacity : current.colorOpacity,
    };

    onChange({
      style: {
        ...normalizedWidget.style,
        typography: {
          ...normalizedWidget.style.typography,
          [key]: next,
        },
      },
    });
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
                <Label>Search Blog Posts to Add</Label>
                <Input
                  value={manualSearch}
                  onChange={(event) => setManualSearch(event.target.value)}
                  placeholder="Search by title, category, excerpt"
                />
              </div>
              <div className="max-h-40 overflow-auto space-y-2 rounded-md border p-2">
                {selectableManualBlogs.length ? (
                  selectableManualBlogs.slice(0, 30).map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      className="w-full text-left rounded px-2 py-1.5 hover:bg-muted text-sm"
                      onClick={() => addManualBlog(post.id)}
                    >
                      <Plus className="h-3 w-3 inline mr-2" />
                      {post.title}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground px-1 py-2">No blog posts found.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Selected Blog Posts</Label>
                <div className="space-y-2">
                  {manualSelection.map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between rounded-md border p-2">
                      <p className="text-sm">
                        {index + 1}. {post.title}
                      </p>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveManualBlog(post.id, 'up')}>
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => moveManualBlog(post.id, 'down')}>
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => removeManualBlog(post.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {manualSelection.length === 0 && (
                    <p className="text-xs text-muted-foreground">No manual blog posts selected yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Filter by Status</Label>
                <p className="text-xs text-muted-foreground">Leave all unchecked to show all statuses.</p>
                <div className="space-y-2">
                  {BLOG_STATUS_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`blog-feed-status-${option.value}`}
                        checked={query.filters.statuses.includes(option.value)}
                        onCheckedChange={(checked) => toggleStatus(option.value, !!checked)}
                      />
                      <Label htmlFor={`blog-feed-status-${option.value}`} className="text-sm font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category (optional)</Label>
                <Input
                  value={query.filters.category || ''}
                  onChange={(event) => updateFilters({ category: event.target.value })}
                  placeholder="Real Estate Tips"
                />
              </div>
              <div className="space-y-2">
                <Label>Search Text (optional)</Label>
                <Input
                  value={query.filters.search || ''}
                  onChange={(event) => updateFilters({ search: event.target.value })}
                  placeholder="Keyword"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Sort Blog Posts</Label>
            <Select
              value={normalizedWidget.sortBy}
              onValueChange={(value: BlogSortOption) => onChange({ sortBy: value })}
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

      <CollapsibleSection title="Blog Details Visibility" open={visibilityOpen} onToggle={() => setVisibilityOpen(!visibilityOpen)}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="blog-feed-show-date"
              checked={normalizedWidget.showDate}
              onCheckedChange={(checked) => onChange({ showDate: !!checked })}
            />
            <Label htmlFor="blog-feed-show-date" className="text-sm font-normal">
              Show date
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="blog-feed-show-excerpt"
              checked={normalizedWidget.showExcerpt}
              onCheckedChange={(checked) => onChange({ showExcerpt: !!checked })}
            />
            <Label htmlFor="blog-feed-show-excerpt" className="text-sm font-normal">
              Show excerpt
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="blog-feed-show-read-more"
              checked={normalizedWidget.showReadMore}
              onCheckedChange={(checked) => onChange({ showReadMore: !!checked })}
            />
            <Label htmlFor="blog-feed-show-read-more" className="text-sm font-normal">
              Show Read More CTA
            </Label>
          </div>
          {normalizedWidget.showReadMore && (
            <div className="space-y-2">
              <Label>Read More Label</Label>
              <Input
                value={normalizedWidget.readMoreLabel}
                onChange={(event) => onChange({ readMoreLabel: event.target.value })}
              />
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  const layoutTab = (
    <div className="space-y-2">
      <CollapsibleSection showBreakpointIcon title="Blog Feed Layout" open={layoutOpen} onToggle={() => setLayoutOpen(!layoutOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Layout Variant</Label>
            <Select
              value={normalizedWidget.layoutVariant}
              onValueChange={(value: BlogFeedWidget['layoutVariant']) => onChange({ layoutVariant: value })}
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
            label="Posts per Page"
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
              onValueChange={(value: BlogFeedWidget['pagination']['mode']) =>
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
              id="blog-feed-show-page-indicator"
              checked={normalizedWidget.pagination.showPageIndicator}
              onCheckedChange={(checked) =>
                onChange({ pagination: { ...normalizedWidget.pagination, showPageIndicator: !!checked } })
              }
            />
            <Label htmlFor="blog-feed-show-page-indicator" className="text-sm font-normal">
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
                    layout: { ...layout, padding: { ...layout.padding, right: parseInt(event.target.value, 10) || 0 } },
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
              onChange={(nextColor) => onChange({ style: { ...normalizedWidget.style, cardBackgroundColor: nextColor } })}
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#ffffff"
            />
          </div>
          <OpacitySlider
            label="Card Background Opacity"
            value={normalizedWidget.style.cardBackgroundOpacity}
            onChange={(next) => onChange({ style: { ...normalizedWidget.style, cardBackgroundOpacity: next } })}
          />
          <div className="space-y-2">
            <Label>Card Border Color</Label>
            <GlobalColorInput
              value={normalizedWidget.style.cardBorderColor}
              onChange={(nextColor) => onChange({ style: { ...normalizedWidget.style, cardBorderColor: nextColor } })}
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#e5e7eb"
            />
          </div>
          <OpacitySlider
            label="Card Border Opacity"
            value={normalizedWidget.style.cardBorderOpacity}
            onChange={(next) => onChange({ style: { ...normalizedWidget.style, cardBorderOpacity: next } })}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Border Width</Label>
              <Input
                type="number"
                value={normalizedWidget.style.cardBorderWidth}
                onChange={(event) => onChange({ style: { ...normalizedWidget.style, cardBorderWidth: parseInt(event.target.value, 10) || 0 } })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Border Radius</Label>
              <Input
                type="number"
                value={normalizedWidget.style.cardBorderRadius}
                onChange={(event) => onChange({ style: { ...normalizedWidget.style, cardBorderRadius: parseInt(event.target.value, 10) || 0 } })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="blog-feed-card-shadow"
              checked={normalizedWidget.style.cardShadow}
              onCheckedChange={(checked) => onChange({ style: { ...normalizedWidget.style, cardShadow: !!checked } })}
            />
            <Label htmlFor="blog-feed-card-shadow" className="text-sm font-normal">
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
              onChange={(nextColor) => onChange({ style: { ...normalizedWidget.style, imageBorderColor: nextColor } })}
              globalStyles={currentWebsite?.globalStyles}
              defaultColor="#e5e7eb"
            />
          </div>
          <OpacitySlider
            label="Image Border Opacity"
            value={normalizedWidget.style.imageBorderOpacity}
            onChange={(next) => onChange({ style: { ...normalizedWidget.style, imageBorderOpacity: next } })}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Image Border Width</Label>
              <Input
                type="number"
                value={normalizedWidget.style.imageBorderWidth}
                onChange={(event) => onChange({ style: { ...normalizedWidget.style, imageBorderWidth: parseInt(event.target.value, 10) || 0 } })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Image Border Radius</Label>
              <Input
                type="number"
                value={normalizedWidget.style.imageBorderRadius}
                onChange={(event) => onChange({ style: { ...normalizedWidget.style, imageBorderRadius: parseInt(event.target.value, 10) || 0 } })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="blog-feed-image-shadow"
              checked={normalizedWidget.style.imageShadow}
              onCheckedChange={(checked) => onChange({ style: { ...normalizedWidget.style, imageShadow: !!checked } })}
            />
            <Label htmlFor="blog-feed-image-shadow" className="text-sm font-normal">
              Image Drop Shadow
            </Label>
          </div>
        </div>
      </CollapsibleSection>

      <TypographyControl
        label="Title Typography"
        defaultOpen={false}
        value={{
          fontFamily: normalizedWidget.style.typography.title.fontFamily,
          fontSize: { value: normalizedWidget.style.typography.title.fontSize, unit: 'px' as const },
          fontWeight: normalizedWidget.style.typography.title.fontWeight,
          color: normalizedWidget.style.typography.title.color,
        }}
        onChange={(updates) => updateTypography('title', updates)}
        colorOpacity={normalizedWidget.style.typography.title.colorOpacity}
        onColorOpacityChange={(next) => updateTypography('title', {}, next)}
      />

      <TypographyControl
        label="Date Typography"
        defaultOpen={false}
        value={{
          fontFamily: normalizedWidget.style.typography.date.fontFamily,
          fontSize: { value: normalizedWidget.style.typography.date.fontSize, unit: 'px' as const },
          fontWeight: normalizedWidget.style.typography.date.fontWeight,
          color: normalizedWidget.style.typography.date.color,
        }}
        onChange={(updates) => updateTypography('date', updates)}
        colorOpacity={normalizedWidget.style.typography.date.colorOpacity}
        onColorOpacityChange={(next) => updateTypography('date', {}, next)}
      />

      <TypographyControl
        label="Excerpt Typography"
        defaultOpen={false}
        value={{
          fontFamily: normalizedWidget.style.typography.excerpt.fontFamily,
          fontSize: { value: normalizedWidget.style.typography.excerpt.fontSize, unit: 'px' as const },
          fontWeight: normalizedWidget.style.typography.excerpt.fontWeight,
          color: normalizedWidget.style.typography.excerpt.color,
        }}
        onChange={(updates) => updateTypography('excerpt', updates)}
        colorOpacity={normalizedWidget.style.typography.excerpt.colorOpacity}
        onColorOpacityChange={(next) => updateTypography('excerpt', {}, next)}
      />

      <TypographyControl
        label="Read More Typography"
        defaultOpen={false}
        value={{
          fontFamily: normalizedWidget.style.typography.action.fontFamily,
          fontSize: { value: normalizedWidget.style.typography.action.fontSize, unit: 'px' as const },
          fontWeight: normalizedWidget.style.typography.action.fontWeight,
          color: normalizedWidget.style.typography.action.color,
        }}
        onChange={(updates) => updateTypography('action', updates)}
        colorOpacity={normalizedWidget.style.typography.action.colorOpacity}
        onColorOpacityChange={(next) => updateTypography('action', {}, next)}
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
          <OpacitySlider
            label="Background Opacity"
            value={background.opacity ?? 100}
            onChange={(next) => onChange({ background: { ...background, opacity: next } })}
          />
        </div>
      </CollapsibleSection>
    </div>
  );

  return <SectionEditorTabs sectionType="blog-feed" contentTab={contentTab} layoutTab={layoutTab} styleTab={styleTab} />;
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

function normalizeBlogFeedWidget(widget: BlogFeedWidget): BlogFeedWidget {
  const oldWidget = widget as any;
  const styleDefaults: BlogFeedWidget['style'] = {
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
    typography: {
      title: { fontFamily: 'Inter', fontSize: 22, fontWeight: '700', color: '#111827', colorOpacity: 100 },
      date: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', color: '#6b7280', colorOpacity: 100 },
      excerpt: { fontFamily: 'Inter', fontSize: 15, fontWeight: '400', color: '#374151', colorOpacity: 100 },
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
    layoutVariant: oldWidget.layoutVariant || 'modern-grid',
    query: oldWidget.query || {
      mode: 'filters',
      manualBlogIds: [],
      filters: {
        statuses: ['published'],
        category: '',
        tags: [],
        search: '',
      },
    },
    sortBy: oldWidget.sortBy || 'date_desc',
    columns: oldWidget.columns || { desktop: 3, tablet: 2, mobile: 1 },
    perPage: oldWidget.perPage || { desktop: 9, tablet: 6, mobile: 3 },
    spacing: typeof oldWidget.spacing === 'number' ? oldWidget.spacing : 20,
    pagination: oldWidget.pagination || {
      mode: 'paged',
      loadMoreLabel: 'Load More',
      previousLabel: 'Previous',
      nextLabel: 'Next',
      infiniteBatchSize: 3,
      showPageIndicator: true,
    },
    showDate: typeof oldWidget.showDate === 'boolean' ? oldWidget.showDate : true,
    showExcerpt: typeof oldWidget.showExcerpt === 'boolean' ? oldWidget.showExcerpt : true,
    showReadMore: typeof oldWidget.showReadMore === 'boolean' ? oldWidget.showReadMore : true,
    readMoreLabel: oldWidget.readMoreLabel || 'Read More',
    style: {
      ...styleDefaults,
      ...(oldWidget.style || {}),
      typography: {
        ...styleDefaults.typography,
        ...(oldWidget.style?.typography || {}),
        title: {
          ...styleDefaults.typography.title,
          ...(oldWidget.style?.typography?.title || {}),
        },
        date: {
          ...styleDefaults.typography.date,
          ...(oldWidget.style?.typography?.date || {}),
        },
        excerpt: {
          ...styleDefaults.typography.excerpt,
          ...(oldWidget.style?.typography?.excerpt || {}),
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
