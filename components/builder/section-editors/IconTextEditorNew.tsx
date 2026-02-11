'use client';

import { useState } from 'react';
import { IconTextWidget, IconTextItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ChevronDown, ChevronRight, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, type FontSizeValue } from '../FontSizeInput';
import { TypographyControl } from '../controls/TypographyControl';
import { ButtonControl } from '../controls/ButtonControl';
import { IconPicker } from '../IconPicker';
import { cn } from '@/lib/utils';
import { useWebsiteStore } from '@/lib/stores/website';

interface IconTextEditorNewProps {
  widget: IconTextWidget;
  onChange: (updates: Partial<IconTextWidget>) => void;
}

export function IconTextEditorNew({ widget, onChange }: IconTextEditorNewProps) {
  const { currentWebsite } = useWebsiteStore();
  const globalStyles = currentWebsite?.globalStyles;

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  // Collapsible states
  const [sectionHeaderOpen, setSectionHeaderOpen] = useState(false);
  const [itemsOpen, setItemsOpen] = useState(true);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [alignmentOpen, setAlignmentOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [sectionHeaderStyleOpen, setSectionHeaderStyleOpen] = useState(false);
  const [itemHeadingStyleOpen, setItemHeadingStyleOpen] = useState(false);
  const [itemSubheadingStyleOpen, setItemSubheadingStyleOpen] = useState(false);
  const [iconStyleOpen, setIconStyleOpen] = useState(false);
  const [boxStyleOpen, setBoxStyleOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);

  const CollapsibleSection = ({ 
    title, 
    open, 
    onToggle, 
    children 
  }: { 
    title: string; 
    open: boolean; 
    onToggle: () => void; 
    children: React.ReactNode;
  }) => (
    <div className="border rounded-lg">
      <button
        type="button"
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <span className="font-medium text-sm">{title}</span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && (
        <div className="p-4 pt-0 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  const defaultLayout = {
    height: { type: 'auto' as const },
    width: 'container' as const,
    padding: { top: 60, right: 20, bottom: 60, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  
  const layout = (widget.layout && typeof widget.layout === 'object' && 'height' in widget.layout)
    ? {
        height: widget.layout.height || defaultLayout.height,
        width: widget.layout.width || defaultLayout.width,
        padding: widget.layout.padding || defaultLayout.padding,
        margin: widget.layout.margin || defaultLayout.margin,
      }
    : defaultLayout;

  const background = widget.background || { type: 'color', color: 'transparent', opacity: 100, blur: 0 };

  // Get typography configs
  const getSectionHeaderTypography = () => ({
    fontFamily: (widget as any).headerFontFamily || 'Inter',
    fontSize: (widget as any).headerFontSize || widget.headingSize || { value: 36, unit: 'px' as const },
    fontWeight: (widget as any).headerFontWeight || widget.headingWeight || '700',
    lineHeight: (widget as any).headerLineHeight || '1.2',
    textTransform: (widget as any).headerTextTransform || 'none' as const,
    color: widget.headingColor || '#1f2937',
  });

  const getItemTitleTypography = () => ({
    fontFamily: (widget as any).itemTitleFontFamily || 'Inter',
    fontSize: (widget as any).itemTitleFontSize || widget.titleFontSize || { value: 20, unit: 'px' as const },
    fontWeight: (widget as any).itemTitleFontWeight || widget.titleFontWeight || '600',
    lineHeight: (widget as any).itemTitleLineHeight || '1.4',
    textTransform: (widget as any).itemTitleTextTransform || 'none' as const,
    color: widget.titleColor || '#1f2937',
  });

  const getItemDescriptionTypography = () => ({
    fontFamily: (widget as any).itemDescFontFamily || 'Inter',
    fontSize: (widget as any).itemDescFontSize || widget.descriptionFontSize || { value: 16, unit: 'px' as const },
    fontWeight: (widget as any).itemDescFontWeight || widget.descriptionFontWeight || '400',
    lineHeight: (widget as any).itemDescLineHeight || '1.6',
    textTransform: (widget as any).itemDescTextTransform || 'none' as const,
    color: widget.descriptionColor || '#6b7280',
  });

  const addItem = () => {
    if (widget.items.length >= 20) return;
    const newItem: IconTextItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      icon: 'check',
      iconColor: '#10b981',
      iconBgColor: '#d1fae5',
      heading: `Item ${widget.items.length + 1}`,
      headingColor: '#1f2937',
      subheading: 'Description of this item',
      subheadingColor: '#6b7280',
      order: widget.items.length,
    };
    onChange({ items: [...widget.items, newItem] });
    setExpandedItems(new Set([...expandedItems, newItem.id]));
  };

  const updateItem = (itemId: string, updates: Partial<IconTextItem>) => {
    onChange({
      items: widget.items.map((item) => item.id === itemId ? { ...item, ...updates } : item),
    });
  };

  const deleteItem = (itemId: string) => {
    onChange({ items: widget.items.filter((item) => item.id !== itemId) });
  };

  const toggleItemExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Section Header */}
      <CollapsibleSection title="Section Header (Optional)" open={sectionHeaderOpen} onToggle={() => setSectionHeaderOpen(!sectionHeaderOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Heading</Label>
              <Select
                value={(widget as any).sectionHeadingTag || 'h2'}
                onValueChange={(value: any) => onChange({ sectionHeadingTag: value } as any)}
              >
                <SelectTrigger className="w-20 h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                  <SelectItem value="p">P</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              value={widget.sectionHeading || ''}
              onChange={(e) => onChange({ sectionHeading: e.target.value })}
              placeholder="Optional section heading"
            />
          </div>
          <div className="space-y-2">
            <Label>Subheading</Label>
            <Input
              value={widget.sectionSubheading || ''}
              onChange={(e) => onChange({ sectionSubheading: e.target.value })}
              placeholder="Optional subheading"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Items */}
      <CollapsibleSection title={`Items (${widget.items.length})`} open={itemsOpen} onToggle={() => setItemsOpen(!itemsOpen)}>
        <div className="space-y-2">
          {widget.items.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-medium text-sm">{item.heading}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => toggleItemExpanded(item.id)}
                  >
                    {expandedItems.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedItems.has(item.id) && (
                <div className="mt-3 space-y-3 pt-3 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs">Icon</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingItemId(item.id);
                        setIconPickerOpen(true);
                      }}
                      className="w-full justify-start"
                    >
                      <span className="mr-2">{item.icon}</span>
                      Change Icon
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Heading</Label>
                    <Input
                      value={item.heading}
                      onChange={(e) => updateItem(item.id, { heading: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Subheading</Label>
                    <Textarea
                      value={item.subheading}
                      onChange={(e) => updateItem(item.id, { subheading: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button onClick={addItem} variant="outline" className="w-full" disabled={widget.items.length >= 20}>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>
      </CollapsibleSection>

      {iconPickerOpen && editingItemId && (
        <IconPicker
          onSelect={(iconName) => {
            updateItem(editingItemId, { icon: iconName });
            setIconPickerOpen(false);
            setEditingItemId(null);
          }}
          onClose={() => {
            setIconPickerOpen(false);
            setEditingItemId(null);
          }}
        />
      )}
    </div>
  );

  // Layout Tab
  const layoutTab = (
    <div className="space-y-2">
      {/* Columns */}
      <CollapsibleSection title="Columns" open={columnsOpen} onToggle={() => setColumnsOpen(!columnsOpen)}>
        <div className="space-y-2">
          <Label>Columns per Row: {widget.columns || 3}</Label>
          <input
            type="range"
            min="1"
            max="6"
            value={widget.columns || 3}
            onChange={(e) => onChange({ columns: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label>Gap: {widget.gap || 24}px</Label>
          <input
            type="range"
            min="0"
            max="60"
            value={widget.gap || 24}
            onChange={(e) => onChange({ gap: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </CollapsibleSection>

      {/* Section Height */}
      <CollapsibleSection title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
        <div className="flex gap-2">
          <Select
            value={layout.height.type || 'auto'}
            onValueChange={(value: 'auto' | 'vh' | 'pixels') => onChange({
              layout: { ...layout, height: { type: value, value: layout.height.value } }
            })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="vh">View Height</SelectItem>
              <SelectItem value="pixels">Pixels</SelectItem>
            </SelectContent>
          </Select>
          {layout.height.type !== 'auto' && (
            <Input
              type="number"
              value={layout.height.value || 100}
              onChange={(e) => onChange({
                layout: { ...layout, height: { ...layout.height, value: parseInt(e.target.value) || 100 } }
              })}
              className="w-24"
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Section Width */}
      <CollapsibleSection title="Section Width" open={sectionWidthOpen} onToggle={() => setSectionWidthOpen(!sectionWidthOpen)}>
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
      </CollapsibleSection>

      {/* Padding */}
      <CollapsibleSection title="Padding" open={paddingOpen} onToggle={() => setPaddingOpen(!paddingOpen)}>
        <div className="grid grid-cols-4 gap-2">
          {['top', 'right', 'bottom', 'left'].map((side) => (
            <div key={side} className="space-y-1">
              <Label className="text-xs capitalize">{side}</Label>
              <Input
                type="number"
                value={(layout.padding as any)[side] || 0}
                onChange={(e) => onChange({
                  layout: { ...layout, padding: { ...layout.padding, [side]: parseInt(e.target.value) || 0 } }
                })}
              />
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Alignment */}
      <CollapsibleSection title="Text Alignment" open={alignmentOpen} onToggle={() => setAlignmentOpen(!alignmentOpen)}>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={widget.alignment === 'left' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ alignment: 'left' })}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={widget.alignment === 'center' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ alignment: 'center' })}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={widget.alignment === 'right' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ alignment: 'right' })}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Style Tab
  const styleTab = (
    <div className="space-y-2">
      {/* Section Header Typography */}
      {widget.sectionHeading && (
        <TypographyControl
          label="Section Header Typography"
          value={getSectionHeaderTypography()}
          onChange={(updates) => {
            onChange({
              headerFontFamily: updates.fontFamily,
              headerFontSize: updates.fontSize as any,
              headingSize: updates.fontSize, // Keep both for compatibility
              headerFontWeight: updates.fontWeight,
              headingWeight: updates.fontWeight, // Keep both for compatibility
              headerLineHeight: updates.lineHeight,
              headerTextTransform: updates.textTransform,
              headingColor: updates.color,
              sectionHeadingColor: updates.color, // Legacy compatibility
              sectionHeadingSize: updates.fontSize, // Legacy compatibility
            } as any);
          }}
          showGlobalStyleSelector={true}
          availableGlobalStyles={['h2', 'h3', 'h4']}
        />
      )}

      {/* Item Title Typography */}
      <TypographyControl
        label="Item Title Typography"
        value={getItemTitleTypography()}
        onChange={(updates) => {
          onChange({
            itemTitleFontFamily: updates.fontFamily,
            itemTitleFontSize: updates.fontSize as any,
            titleFontSize: updates.fontSize, // Keep both for compatibility
            itemTitleFontWeight: updates.fontWeight,
            titleFontWeight: updates.fontWeight, // Keep both for compatibility
            itemTitleLineHeight: updates.lineHeight,
            itemTitleTextTransform: updates.textTransform,
            titleColor: updates.color,
            itemHeadingColor: updates.color, // Legacy compatibility
            itemHeadingSize: updates.fontSize, // Legacy compatibility
          } as any);
        }}
        showGlobalStyleSelector={true}
        availableGlobalStyles={['h3', 'h4', 'h5']}
      />

      {/* Item Description Typography */}
      <TypographyControl
        label="Item Description Typography"
        value={getItemDescriptionTypography()}
        onChange={(updates) => {
          onChange({
            itemDescFontFamily: updates.fontFamily,
            itemDescFontSize: updates.fontSize as any,
            descriptionFontSize: updates.fontSize, // Keep both for compatibility
            itemDescFontWeight: updates.fontWeight,
            descriptionFontWeight: updates.fontWeight, // Keep both for compatibility
            itemDescLineHeight: updates.lineHeight,
            itemDescTextTransform: updates.textTransform,
            descriptionColor: updates.color,
            itemSubheadingColor: updates.color, // Legacy compatibility
            itemSubheadingSize: updates.fontSize, // Legacy compatibility
          } as any);
        }}
        showGlobalStyleSelector={true}
        availableGlobalStyles={['body']}
      />

      {/* Icon Style */}
      <CollapsibleSection title="Icon Style" open={iconStyleOpen} onToggle={() => setIconStyleOpen(!iconStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Icon Size: {widget.iconSize || 24}px</Label>
            <input
              type="range"
              min="16"
              max="64"
              value={widget.iconSize || 24}
              onChange={(e) => onChange({ iconSize: parseInt(e.target.value) as any })}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Default Icon Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={(widget as any).defaultIconColor || '#10b981'}
                onChange={(e) => onChange({ defaultIconColor: e.target.value } as any)}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <Input
                value={(widget as any).defaultIconColor || '#10b981'}
                onChange={(e) => onChange({ defaultIconColor: e.target.value } as any)}
                placeholder="#10b981"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Default Icon Background</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={(widget as any).defaultIconBgColor || '#d1fae5'}
                onChange={(e) => onChange({ defaultIconBgColor: e.target.value } as any)}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <Input
                value={(widget as any).defaultIconBgColor || '#d1fae5'}
                onChange={(e) => onChange({ defaultIconBgColor: e.target.value } as any)}
                placeholder="#d1fae5"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Background */}
      <CollapsibleSection title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={background.type || 'color'}
              onValueChange={(value: 'color' | 'image' | 'video' | 'gradient') => onChange({
                background: { ...background, type: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {background.type === 'color' && (
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={background.color || 'transparent'}
                  onChange={(e) => onChange({ background: { ...background, color: e.target.value } })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={background.color || 'transparent'}
                  onChange={(e) => onChange({ background: { ...background, color: e.target.value } })}
                  placeholder="transparent"
                />
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="icon-text"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
