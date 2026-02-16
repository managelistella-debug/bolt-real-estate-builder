'use client';

import { useState } from 'react';
import { ImageNavigationWidget, ImageNavigationItem, TypographyConfig } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { ImageUpload } from '../ImageUpload';
import { TypographyControl } from '../controls/TypographyControl';
import { useWebsiteStore } from '@/lib/stores/website';
import { GlobalColorInput } from '../controls/GlobalColorInput';
import { SectionAnimationsControl } from '../controls/SectionAnimationsControl';
import { Switch } from '@/components/ui/switch';
import { useBuilderStore } from '@/lib/stores/builder';
import { resolveResponsiveValue, updateResponsiveValue } from '@/lib/responsive';
import { ResponsiveControlShell } from '../controls/ResponsiveControlShell';
import { ResponsiveDevicePicker } from '../controls/ResponsiveControlShell';

interface ImageNavigationEditorNewProps {
  widget: ImageNavigationWidget;
  onChange: (updates: Partial<ImageNavigationWidget>) => void;
}

export function ImageNavigationEditorNew({ widget, onChange }: ImageNavigationEditorNewProps) {
  const { website } = useWebsiteStore();
  const { deviceView } = useBuilderStore();
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [itemsOpen, setItemsOpen] = useState(true);
  const [columnsOpen, setColumnsOpen] = useState(true);
  const [sectionLayoutOpen, setSectionLayoutOpen] = useState(false);
  const [cardStyleOpen, setCardStyleOpen] = useState(true);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [animationsOpen, setAnimationsOpen] = useState(false);
  const desktopColumns = widget.desktopColumns ?? widget.columns ?? 3;
  const tabletColumns = widget.tabletColumns ?? desktopColumns;
  const mobileColumns = widget.mobileColumns ?? 1;
  const columnsResponsive = widget.columnsResponsive || {
    desktop: desktopColumns,
    tablet: widget.tabletColumns,
    mobile: widget.mobileColumns,
  };
  const activeColumns = resolveResponsiveValue<number>(columnsResponsive, deviceView, desktopColumns);
  const gap = widget.gap ?? 24;
  const cardBorderRadius = widget.cardBorderRadius ?? 12;
  const showCardBorder = widget.showCardBorder ?? false;
  const cardBorderWidth = widget.cardBorderWidth ?? 1;
  const cardBorderColor = widget.cardBorderColor || '#e5e7eb';
  const defaultLayout = {
    height: { type: 'auto' as const },
    width: 'container' as const,
    padding: { top: 80, right: 24, bottom: 80, left: 24 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  const rawLayout = widget.layout as any;
  const layoutCfg = (rawLayout && typeof rawLayout === 'object' && 'height' in rawLayout)
    ? {
        ...defaultLayout,
        ...rawLayout,
        height: rawLayout.height || defaultLayout.height,
        width: rawLayout.width || defaultLayout.width,
        padding: { ...defaultLayout.padding, ...(rawLayout.padding || {}) },
        margin: { ...defaultLayout.margin, ...(rawLayout.margin || {}) },
      }
    : {
        ...defaultLayout,
        width: rawLayout?.fullWidth ? 'full' : 'container',
        padding: {
          top: rawLayout?.paddingTop ?? defaultLayout.padding.top,
          right: rawLayout?.paddingRight ?? defaultLayout.padding.right,
          bottom: rawLayout?.paddingBottom ?? defaultLayout.padding.bottom,
          left: rawLayout?.paddingLeft ?? defaultLayout.padding.left,
        },
      };

  // Helper function to get typography config
  const getTitleTypography = (): TypographyConfig => {
    return (widget as any).titleTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 1.125, unit: 'rem' },
      fontWeight: '600',
      lineHeight: '1.3',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#1f2937',
    };
  };

  const CollapsibleSection = ({ title, open, onToggle, showBreakpointIcon = false, children }: any) => (
    <div className="border rounded-lg">
      <button type="button" className="w-full flex items-center justify-between p-3 hover:bg-muted/50" onClick={onToggle}>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{title}</span>
          {showBreakpointIcon && (
            <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
              <ResponsiveDevicePicker className="h-6 w-6" />
            </div>
          )}
        </div>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && <div className="p-4 pt-0 space-y-3">{children}</div>}
    </div>
  );

  const addItem = () => {
    const newItem: ImageNavigationItem = {
      id: `item_${Date.now()}`,
      title: 'New Item',
      image: '',
      url: '',
    };
    onChange({ items: [...widget.items, newItem] });
  };

  const updateItem = (id: string, updates: Partial<ImageNavigationItem>) => {
    onChange({
      items: widget.items.map(item => item.id === id ? { ...item, ...updates } : item),
    });
  };

  const removeItem = (id: string) => {
    onChange({ items: widget.items.filter(item => item.id !== id) });
  };

  const contentTab = (
    <div className="space-y-3">
      <CollapsibleSection title={`Navigation Items (${widget.items.length})`} open={itemsOpen} onToggle={() => setItemsOpen(!itemsOpen)}>
        <div className="space-y-2">
          {widget.items.map((item) => (
            <div key={item.id} className="border rounded-lg p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{item.title}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}>
                    {expandedItemId === item.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedItemId === item.id && (
                <div className="mt-3 space-y-3 pt-3 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs">Title</Label>
                    <Input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Image</Label>
                    <ImageUpload value={item.image} onChange={(url) => updateItem(item.id, { image: url })} folder="navigation" maxSizeMB={1} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Link URL</Label>
                    <Input value={item.url} onChange={(e) => updateItem(item.id, { url: e.target.value })} placeholder="/page-url" />
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button onClick={addItem} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>
      </CollapsibleSection>
    </div>
  );

  const layoutTab = (
    <div className="space-y-2">
      <CollapsibleSection showBreakpointIcon title="Grid Layout" open={columnsOpen} onToggle={() => setColumnsOpen(!columnsOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <ResponsiveControlShell
              label="Images Per Row"
              hasOverride={!!columnsResponsive.tablet || !!columnsResponsive.mobile}
            >
            <Input
              id="responsive-columns"
              type="number"
              min={1}
              max={6}
              value={activeColumns}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                onChange({
                  columns: deviceView === 'desktop' ? value : widget.columns,
                  desktopColumns: deviceView === 'desktop' ? value : desktopColumns,
                  tabletColumns: deviceView === 'tablet' ? value : tabletColumns,
                  mobileColumns: deviceView === 'mobile' ? value : mobileColumns,
                  columnsResponsive: updateResponsiveValue(columnsResponsive, deviceView, value),
                });
              }}
            />
            </ResponsiveControlShell>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-gap">Gap Between Images (px)</Label>
            <Input
              id="image-gap"
              type="number"
              min={0}
              max={100}
              value={gap}
              onChange={(e) => onChange({ gap: parseInt(e.target.value, 10) })}
            />
          </div>
        </div>
      </CollapsibleSection>
      <CollapsibleSection showBreakpointIcon title="Section Layout" open={sectionLayoutOpen} onToggle={() => setSectionLayoutOpen(!sectionLayoutOpen)}>
        <div className="space-y-2">
          <Label>Section Width</Label>
          <Select
            value={layoutCfg.width || 'container'}
            onValueChange={(value: 'full' | 'container') =>
              onChange({
                layout: {
                  ...layoutCfg,
                  width: value,
                } as any,
              })
            }
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
      </CollapsibleSection>
    </div>
  );

  const styleTab = (
    <div className="space-y-2">
      <CollapsibleSection showBreakpointIcon title="Card Style" open={cardStyleOpen} onToggle={() => setCardStyleOpen(!cardStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="card-border-radius">Card Border Radius (px)</Label>
            <Input
              id="card-border-radius"
              type="number"
              min={0}
              max={60}
              value={cardBorderRadius}
              onChange={(e) => onChange({ cardBorderRadius: parseInt(e.target.value, 10) })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-card-border">Show Border Outline</Label>
            <Switch
              id="show-card-border"
              checked={showCardBorder}
              onCheckedChange={(checked) => onChange({ showCardBorder: checked })}
            />
          </div>

          {showCardBorder && (
            <>
              <div className="space-y-2">
                <Label>Border Color</Label>
                <GlobalColorInput
                  value={cardBorderColor}
                  onChange={(nextColor) => onChange({ cardBorderColor: nextColor })}
                  globalStyles={website?.globalStyles}
                  defaultColor="#e5e7eb"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-border-width">Border Width (px)</Label>
                <Input
                  id="card-border-width"
                  type="number"
                  min={1}
                  max={10}
                  value={cardBorderWidth}
                  onChange={(e) => onChange({ cardBorderWidth: parseInt(e.target.value, 10) })}
                />
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Title Typography */}
      <TypographyControl
        label="Title Typography"
        defaultOpen={true}
        value={getTitleTypography()}
        responsiveFontSize={(getTitleTypography() as any).fontSizeResponsive}
        onResponsiveFontSizeChange={(next) => {
          onChange({
            titleTypography: {
              ...getTitleTypography(),
              fontSizeResponsive: next,
            } as any,
          });
        }}
        onChange={(updates) => {
          onChange({
            titleTypography: {
              ...getTitleTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['h4', 'body']}
      />

      <CollapsibleSection showBreakpointIcon title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
        <div className="space-y-2">
          <Label>Background Color</Label>
          <GlobalColorInput
            value={(widget as any).backgroundColor}
            onChange={(nextColor) => onChange({ backgroundColor: nextColor } as any)}
            globalStyles={website?.globalStyles}
            defaultColor="#ffffff"
            placeholder="transparent"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection showBreakpointIcon title="Animations" open={animationsOpen} onToggle={() => setAnimationsOpen(!animationsOpen)}>
        <SectionAnimationsControl
          sectionType="image-navigation"
          widget={widget as any}
          onChange={(updates) => onChange(updates as any)}
          globalStyles={website?.globalStyles}
        />
      </CollapsibleSection>
    </div>
  );

  return <SectionEditorTabs sectionType="image-navigation" contentTab={contentTab} layoutTab={layoutTab} styleTab={styleTab} />;
}
