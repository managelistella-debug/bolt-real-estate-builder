'use client';

import React, { useState } from 'react';
import { ImageTextColumnsWidget, ImageTextColumnItem, LayoutConfig, BackgroundConfig, TypographyConfig } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown, AlignLeft, AlignCenter, AlignRight, ChevronRight } from 'lucide-react';
import { BackgroundControl } from '../BackgroundControl';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ImageUpload } from '../ImageUpload';
import { Switch } from '@/components/ui/switch';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { cn } from '@/lib/utils';
import { TypographyControl } from '../controls/TypographyControl';
import { SectionAnimationsControl } from '../controls/SectionAnimationsControl';
import { useWebsiteStore } from '@/lib/stores/website';
import { useBuilderStore } from '@/lib/stores/builder';
import { resolveResponsiveValue, updateResponsiveValue } from '@/lib/responsive';
import { ResponsiveControlShell } from '../controls/ResponsiveControlShell';
import { ResponsiveDevicePicker } from '../controls/ResponsiveControlShell';

interface ImageTextColumnsEditorNewProps {
  widget: ImageTextColumnsWidget;
  onChange: (updates: Partial<ImageTextColumnsWidget>) => void;
}

export function ImageTextColumnsEditorNew({ widget, onChange }: ImageTextColumnsEditorNewProps) {
  const { website } = useWebsiteStore();
  const { deviceView } = useBuilderStore();
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [sectionHeaderOpen, setSectionHeaderOpen] = useState(true);
  const [columnItemsOpen, setColumnItemsOpen] = useState(false);

  // Helper functions to get typography configs
  const getSectionHeaderTypography = (): TypographyConfig => {
    return (widget as any).sectionHeaderTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 2, unit: 'rem' },
      fontWeight: '700',
      lineHeight: '1.2',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#1f2937',
    };
  };

  const getSubtitleTypography = (): TypographyConfig => {
    return (widget as any).subtitleTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 1.25, unit: 'rem' },
      fontWeight: '600',
      lineHeight: '1.3',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#1f2937',
    };
  };

  const getDescriptionTypography = (): TypographyConfig => {
    return (widget as any).descriptionTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 1, unit: 'rem' },
      fontWeight: '400',
      lineHeight: '1.6',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#6b7280',
    };
  };

  const defaultLayout: LayoutConfig = {
    height: { type: 'auto' },
    width: 'container',
    padding: { top: 80, right: 24, bottom: 80, left: 24 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  const rawLayout = widget.layout as any;
  const layoutConfig: LayoutConfig = (rawLayout && typeof rawLayout === 'object' && 'height' in rawLayout)
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

  const backgroundConfig = widget.background || {
    type: 'color',
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };
  const columnsResponsive = widget.columnsResponsive || {
    desktop: widget.desktopColumns || 3,
    tablet: widget.tabletColumns || 2,
    mobile: widget.mobileColumns || 1,
  };
  const activeColumns = resolveResponsiveValue<number>(columnsResponsive, deviceView, widget.desktopColumns || 3);

  const updateLayout = (updates: Partial<LayoutConfig>) => {
    onChange({
      layout: {
        ...layoutConfig,
        ...updates,
        padding: updates.padding ? { ...layoutConfig.padding, ...updates.padding } : layoutConfig.padding,
        margin: updates.margin ? { ...layoutConfig.margin, ...updates.margin } : layoutConfig.margin,
      } as any,
    });
  };

  const updateBackground = (updates: Partial<BackgroundConfig>) => {
    onChange({ background: { ...backgroundConfig, ...updates } });
  };

  const addItem = () => {
    const newItem: ImageTextColumnItem = {
      id: `item_${Date.now()}`,
      image: '',
      subtitle: 'New Column',
      description: 'Add your description here.',
      buttonText: '',
      buttonUrl: '',
      order: (widget.items || []).length,
    };
    onChange({ items: [...(widget.items || []), newItem] });
  };

  const updateItem = (id: string, updates: Partial<ImageTextColumnItem>) => {
    onChange({
      items: (widget.items || []).map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const removeItem = (id: string) => {
    onChange({
      items: (widget.items || []).filter(item => item.id !== id),
    });
    if (expandedItemId === id) {
      setExpandedItemId(null);
    }
  };

  const renderColorPicker = (value: string | undefined, onSelect: (color: string) => void, defaultValue: string = '#000000') => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <div className="w-4 h-4 rounded-full mr-2 border" style={{ backgroundColor: value || defaultValue }} />
          {value || defaultValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={value || defaultValue} onChange={onSelect} />
      </PopoverContent>
    </Popover>
  );

  const getAlignmentButton = (align: 'left' | 'center' | 'right', icon: React.ReactNode) => (
    <Button
      variant={widget.textAlign === align ? 'default' : 'outline'}
      size="icon"
      onClick={() => onChange({ textAlign: align })}
    >
      {icon}
    </Button>
  );

  const CollapsibleSection = ({ 
    title, 
    open, 
    onToggle, 
    showBreakpointIcon = false,
    children 
  }: { 
    title: string; 
    open: boolean; 
    onToggle: () => void; 
    showBreakpointIcon?: boolean;
    children: React.ReactNode;
  }) => (
    <div className="border rounded-lg">
      <button
        type="button"
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
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
      {open && (
        <div className="p-4 pt-0 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Section Header */}
      <CollapsibleSection title="Section Header" open={sectionHeaderOpen} onToggle={() => setSectionHeaderOpen(!sectionHeaderOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="sectionHeading">Heading</Label>
            <Input
              id="sectionHeading"
              value={widget.sectionHeading || ''}
              onChange={(e) => onChange({ sectionHeading: e.target.value })}
              placeholder="Optional section heading"
            />
          </div>
          {widget.sectionHeading && (
            <>
              <div className="space-y-2">
                <Label>Heading Color</Label>
                {renderColorPicker(widget.sectionHeadingColor, (color) => onChange({ sectionHeadingColor: color }), '#000000')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sectionHeadingSize">Heading Size (px)</Label>
                <Input
                  id="sectionHeadingSize"
                  type="number"
                  min={24}
                  max={72}
                  value={widget.sectionHeadingSize ?? 48}
                  onChange={(e) => onChange({ sectionHeadingSize: parseInt(e.target.value) })}
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="sectionSubheading">Subheading</Label>
            <Input
              id="sectionSubheading"
              value={widget.sectionSubheading || ''}
              onChange={(e) => onChange({ sectionSubheading: e.target.value })}
              placeholder="Optional section subheading"
            />
          </div>
          {widget.sectionSubheading && (
            <>
              <div className="space-y-2">
                <Label>Subheading Color</Label>
                {renderColorPicker(widget.sectionSubheadingColor, (color) => onChange({ sectionSubheadingColor: color }), '#6b7280')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sectionSubheadingSize">Subheading Size (px)</Label>
                <Input
                  id="sectionSubheadingSize"
                  type="number"
                  min={14}
                  max={32}
                  value={widget.sectionSubheadingSize ?? 18}
                  onChange={(e) => onChange({ sectionSubheadingSize: parseInt(e.target.value) })}
                />
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Column Items */}
      <CollapsibleSection title="Column Items" open={columnItemsOpen} onToggle={() => setColumnItemsOpen(!columnItemsOpen)}>
        <div className="space-y-2">
          {(widget.items || []).map((item, index) => (
            <div key={item.id} className="border rounded-md overflow-hidden bg-muted/20">
              {/* Collapsed State - Click to expand */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium text-sm truncate">
                    {item.subtitle || `Column ${index + 1}`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              {/* Expanded State */}
              {expandedItemId === item.id && (
                <div className="p-3 pt-0 space-y-3 border-t">
                  <div className="space-y-2">
                    <Label htmlFor={`subtitle-${item.id}`}>Title</Label>
                    <Input
                      id={`subtitle-${item.id}`}
                      value={item.subtitle}
                      onChange={(e) => updateItem(item.id, { subtitle: e.target.value })}
                      placeholder="Column title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`description-${item.id}`}>Description</Label>
                    <Textarea
                      id={`description-${item.id}`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      rows={3}
                      placeholder="Column description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`image-${item.id}`}>Image</Label>
                    <ImageUpload
                      value={item.image}
                      onChange={(url) => updateItem(item.id, { image: url })}
                      folder="columns"
                      maxSizeMB={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`buttonText-${item.id}`}>Button Text (Optional)</Label>
                    <Input
                      id={`buttonText-${item.id}`}
                      value={item.buttonText || ''}
                      onChange={(e) => updateItem(item.id, { buttonText: e.target.value })}
                      placeholder="Learn more"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`buttonUrl-${item.id}`}>Button Link URL (Optional)</Label>
                    <Input
                      id={`buttonUrl-${item.id}`}
                      value={item.buttonUrl || ''}
                      onChange={(e) => updateItem(item.id, { buttonUrl: e.target.value })}
                      placeholder="/services"
                    />
                    <p className="text-xs text-muted-foreground">
                      Button only displays when a link URL is provided.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button onClick={addItem} variant="outline" className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Column
        </Button>
      </CollapsibleSection>
    </div>
  );

  // Layout Tab
  const layoutTab = (
    <div className="space-y-3">
      {/* Column Layout */}
      <div className="border rounded-lg p-3 space-y-3">
        <h4 className="font-medium text-sm">Column Layout</h4>
        <div className="space-y-2">
          <Label htmlFor="layoutStyle">Content Layout</Label>
          <Select
            value={widget.layoutStyle || 'text-below'}
            onValueChange={(value: 'text-below' | 'text-overlay') =>
              onChange(
                value === 'text-overlay'
                  ? { layoutStyle: value, textAlign: 'center' }
                  : { layoutStyle: value }
              )
            }
          >
            <SelectTrigger id="layoutStyle">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-below">Text Under Image</SelectItem>
              <SelectItem value="text-overlay">Text Overlay (Centered)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveControlShell
          label="Columns"
          hasOverride={!!columnsResponsive.tablet || !!columnsResponsive.mobile}
        >
          <Input
            id="responsiveColumns"
            type="number"
            min={1}
            max={4}
            value={activeColumns}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              onChange({
                desktopColumns: deviceView === 'desktop' ? value : widget.desktopColumns,
                tabletColumns: deviceView === 'tablet' ? value : widget.tabletColumns,
                mobileColumns: deviceView === 'mobile' ? value : widget.mobileColumns,
                columnsResponsive: updateResponsiveValue(columnsResponsive, deviceView, value),
              });
            }}
          />
        </ResponsiveControlShell>
        <div className="space-y-2">
          <Label htmlFor="gap">Gap Between Columns (px)</Label>
          <Input
            id="gap"
            type="number"
            min={0}
            max={100}
            value={widget.gap || 24}
            onChange={(e) => onChange({ gap: parseInt(e.target.value) })}
          />
        </div>
      </div>

      {/* Section Layout */}
      <div className="border rounded-lg p-3 space-y-3">
        <h4 className="font-medium text-sm">Section Layout</h4>
        <div className="space-y-2">
          <Label htmlFor="sectionWidth">Section Width</Label>
          <Select
            value={layoutConfig.width || 'container'}
            onValueChange={(value: 'full' | 'container') => updateLayout({ width: value })}
          >
            <SelectTrigger id="sectionWidth">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="container">Container</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="paddingTop">Padding Top (px)</Label>
          <Input
            id="paddingTop"
            type="number"
            min={0}
            max={200}
            value={layoutConfig.padding?.top ?? 80}
            onChange={(e) => updateLayout({ padding: { top: parseInt(e.target.value) || 0 } as any })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paddingBottom">Padding Bottom (px)</Label>
          <Input
            id="paddingBottom"
            type="number"
            min={0}
            max={200}
            value={layoutConfig.padding?.bottom ?? 80}
            onChange={(e) => updateLayout({ padding: { bottom: parseInt(e.target.value) || 0 } as any })}
          />
        </div>
      </div>
    </div>
  );

  // Style Tab
  const styleTab = (
    <div className="space-y-3">
      {/* Image Styling */}
      <div className="border rounded-lg p-3 space-y-3">
        <h4 className="font-medium text-sm">Image Styling</h4>
        <div className="space-y-2">
          <Label htmlFor="imageAspectRatio">Aspect Ratio</Label>
          <Select
            value={widget.imageAspectRatio || '3:2'}
            onValueChange={(value: '1:1' | '3:2' | '4:3' | '16:9') => onChange({ imageAspectRatio: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1:1">1:1 (Square)</SelectItem>
              <SelectItem value="3:2">3:2</SelectItem>
              <SelectItem value="4:3">4:3</SelectItem>
              <SelectItem value="16:9">16:9</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageBorderRadius">Border Radius (px)</Label>
          <Input
            id="imageBorderRadius"
            type="number"
            min={0}
            max={50}
            value={widget.imageBorderRadius ?? 12}
            onChange={(e) => onChange({ imageBorderRadius: parseInt(e.target.value) })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="showImageBorder">Show Image Border</Label>
          <Switch
            id="showImageBorder"
            checked={widget.showImageBorder ?? false}
            onCheckedChange={(checked) => onChange({ showImageBorder: checked })}
          />
        </div>
        {(widget.showImageBorder ?? false) && (
          <>
            <div className="space-y-2">
              <Label>Image Border Color</Label>
              {renderColorPicker(widget.imageBorderColor, (color) => onChange({ imageBorderColor: color }), '#e5e7eb')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageBorderWidth">Image Border Width (px)</Label>
              <Input
                id="imageBorderWidth"
                type="number"
                min={1}
                max={10}
                value={widget.imageBorderWidth ?? 1}
                onChange={(e) => onChange({ imageBorderWidth: parseInt(e.target.value) })}
              />
            </div>
          </>
        )}
      </div>

      {/* Text Alignment */}
      <div className="border rounded-lg p-3 space-y-3">
        <h4 className="font-medium text-sm">Text Alignment</h4>
        {widget.layoutStyle === 'text-overlay' ? (
          <p className="text-sm text-muted-foreground">
            Overlay layout is centered horizontally and vertically.
          </p>
        ) : (
          <div className="flex gap-2">
            {getAlignmentButton('left', <AlignLeft className="h-4 w-4" />)}
            {getAlignmentButton('center', <AlignCenter className="h-4 w-4" />)}
            {getAlignmentButton('right', <AlignRight className="h-4 w-4" />)}
          </div>
        )}
      </div>

      {/* Section Header Typography (optional) */}
      {widget.sectionHeading && (
        <TypographyControl
          label="Section Header Typography"
          defaultOpen={true}
          value={getSectionHeaderTypography()}
          responsiveFontSize={(getSectionHeaderTypography() as any).fontSizeResponsive}
          onResponsiveFontSizeChange={(next) => {
            onChange({
              sectionHeaderTypography: {
                ...getSectionHeaderTypography(),
                fontSizeResponsive: next,
              } as any,
            });
          }}
          onChange={(updates) => {
            onChange({
              sectionHeaderTypography: {
                ...getSectionHeaderTypography(),
                ...updates,
              } as any,
            });
          }}
          showGlobalStyleSelector={true}
          globalStyles={website?.globalStyles}
          availableGlobalStyles={['h2', 'h3']}
        />
      )}

      {/* Subtitle Typography */}
      <TypographyControl
        label="Subtitle Typography"
        defaultOpen={false}
        value={getSubtitleTypography()}
        responsiveFontSize={(getSubtitleTypography() as any).fontSizeResponsive}
        onResponsiveFontSizeChange={(next) => {
          onChange({
            subtitleTypography: {
              ...getSubtitleTypography(),
              fontSizeResponsive: next,
            } as any,
          });
        }}
        onChange={(updates) => {
          onChange({
            subtitleTypography: {
              ...getSubtitleTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['h4', 'body']}
      />

      {/* Description Typography */}
      <TypographyControl
        label="Description Typography"
        defaultOpen={false}
        value={getDescriptionTypography()}
        responsiveFontSize={(getDescriptionTypography() as any).fontSizeResponsive}
        onResponsiveFontSizeChange={(next) => {
          onChange({
            descriptionTypography: {
              ...getDescriptionTypography(),
              fontSizeResponsive: next,
            } as any,
          });
        }}
        onChange={(updates) => {
          onChange({
            descriptionTypography: {
              ...getDescriptionTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['body']}
      />

      {/* Background */}
      <div className="border rounded-lg p-3">
        <h4 className="font-medium text-sm mb-3">Background</h4>
        <BackgroundControl value={backgroundConfig} onChange={updateBackground} />
      </div>

      <div className="border rounded-lg p-3 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Animations</h4>
          <ResponsiveDevicePicker className="h-6 w-6" />
        </div>
        <SectionAnimationsControl
          sectionType="image-text-columns"
          widget={widget as any}
          onChange={(updates) => onChange(updates as any)}
          globalStyles={website?.globalStyles}
        />
      </div>
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="multi-column"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
