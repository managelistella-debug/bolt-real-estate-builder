'use client';

import { useState } from 'react';
import { IconTextWidget, IconTextItem, IconTextLayout, IconSize } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { BackgroundControl } from '@/components/builder/BackgroundControl';
import { IconPicker } from '@/components/builder/IconPicker';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { getIcon } from '@/lib/icons/iconLibrary';

interface IconTextEditorProps {
  widget: IconTextWidget;
  onChange: (updates: Partial<IconTextWidget>) => void;
}

export function IconTextEditor({ widget, onChange }: IconTextEditorProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [sectionHeaderExpanded, setSectionHeaderExpanded] = useState(false);
  const [layoutStyleExpanded, setLayoutStyleExpanded] = useState(true);
  const [boxStyleExpanded, setBoxStyleExpanded] = useState(false);
  const [viewMoreExpanded, setViewMoreExpanded] = useState(false);
  const [backgroundExpanded, setBackgroundExpanded] = useState(false);
  const [sectionLayoutExpanded, setSectionLayoutExpanded] = useState(false);

  // Ensure defaults with robust safeguards
  const alignment = widget.alignment || 'center';
  const background = widget.background || { type: 'color', color: 'transparent', opacity: 100, blur: 0 };
  
  const defaultLayout = {
    height: { type: 'auto' as const },
    width: 'container' as const,
    padding: { top: 60, right: 20, bottom: 60, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  
  // Ensure layout is an object and has proper structure
  const layout = (widget.layout && typeof widget.layout === 'object' && 'height' in widget.layout)
    ? {
        height: widget.layout.height || defaultLayout.height,
        width: widget.layout.width || defaultLayout.width,
        padding: widget.layout.padding || defaultLayout.padding,
        margin: widget.layout.margin || defaultLayout.margin,
      }
    : defaultLayout;

  const toggleItemExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

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
      items: widget.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    });
  };

  const deleteItem = (itemId: string) => {
    onChange({
      items: widget.items.filter((item) => item.id !== itemId),
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...widget.items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    // Update order property
    const reorderedItems = newItems.map((item, idx) => ({ ...item, order: idx }));
    onChange({ items: reorderedItems });
    setDraggedIndex(index);
  };

  const openIconPicker = (itemId: string) => {
    setEditingItemId(itemId);
    setIconPickerOpen(true);
  };

  const handleIconSelect = (iconName: string) => {
    if (editingItemId) {
      updateItem(editingItemId, { icon: iconName });
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Section Header (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setSectionHeaderExpanded(!sectionHeaderExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Section Header (Optional)</h4>
          {sectionHeaderExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {sectionHeaderExpanded && (
          <div className="p-4 pt-0 space-y-4">
            <div className="space-y-2">
              <Label>Section Heading</Label>
              <Input
                value={widget.sectionHeading || ''}
                onChange={(e) => onChange({ sectionHeading: e.target.value })}
                placeholder="e.g., Our Services"
              />
            </div>
            <div className="space-y-2">
              <Label>Heading Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={widget.sectionHeadingColor || '#1f2937'}
                  onChange={(e) => onChange({ sectionHeadingColor: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={widget.sectionHeadingColor || '#1f2937'}
                  onChange={(e) => onChange({ sectionHeadingColor: e.target.value })}
                  placeholder="#1f2937"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Section Subheading</Label>
              <Input
                value={widget.sectionSubheading || ''}
                onChange={(e) => onChange({ sectionSubheading: e.target.value })}
                placeholder="e.g., Landscaping in Coquitlam..."
              />
            </div>
            <div className="space-y-2">
              <Label>Subheading Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={widget.sectionSubheadingColor || '#6b7280'}
                  onChange={(e) => onChange({ sectionSubheadingColor: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={widget.sectionSubheadingColor || '#6b7280'}
                  onChange={(e) => onChange({ sectionSubheadingColor: e.target.value })}
                  placeholder="#6b7280"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layout & Style (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setLayoutStyleExpanded(!layoutStyleExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Layout & Style</h4>
          {layoutStyleExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {layoutStyleExpanded && (
          <div className="p-4 pt-0 space-y-4">
            <div className="space-y-2">
              <Label>Layout Style</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onChange({ alignment: 'left' })}
                  className={`p-3 border-2 rounded-lg text-sm transition-all ${
                    alignment === 'left' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">Left Aligned</div>
                  <div className="text-xs text-muted-foreground mt-1">Icon left, text right</div>
                </button>
                <button
                  onClick={() => onChange({ alignment: 'center' })}
                  className={`p-3 border-2 rounded-lg text-sm transition-all ${
                    alignment === 'center' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">Center Aligned</div>
                  <div className="text-xs text-muted-foreground mt-1">Icon above text</div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Columns</Label>
              <Input
                type="number"
                min={1}
                max={6}
                value={widget.columns}
                onChange={(e) => onChange({ columns: parseInt(e.target.value) || 1 })}
              />
              <p className="text-xs text-muted-foreground">Number of columns (1-6)</p>
            </div>

            <div className="space-y-2">
              <Label>Gap Between Items</Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={widget.gap}
                  onChange={(e) => onChange({ gap: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">{widget.gap}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Icon Size</Label>
              <Select value={widget.iconSize} onValueChange={(value) => onChange({ iconSize: value as IconSize })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small (32px)</SelectItem>
                  <SelectItem value="md">Medium (48px)</SelectItem>
                  <SelectItem value="lg">Large (64px)</SelectItem>
                  <SelectItem value="xl">X-Large (80px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Box Style (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setBoxStyleExpanded(!boxStyleExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Box Style (Optional)</h4>
          {boxStyleExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {boxStyleExpanded && (
          <div className="p-4 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Box/Card Style</Label>
              <button
                onClick={() => onChange({ boxed: !widget.boxed })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  widget.boxed ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    widget.boxed ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {widget.boxed && (
              <>
                <div className="space-y-2">
                  <Label>Box Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.boxBackground || '#ffffff'}
                      onChange={(e) => onChange({ boxBackground: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.boxBackground || '#ffffff'}
                      onChange={(e) => onChange({ boxBackground: e.target.value })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={widget.boxBorderRadius ?? 12}
                      onChange={(e) => onChange({ boxBorderRadius: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{widget.boxBorderRadius ?? 12}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Box Padding</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={8}
                      max={60}
                      value={widget.boxPadding ?? 24}
                      onChange={(e) => onChange({ boxPadding: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{widget.boxPadding ?? 24}px</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable Shadow</Label>
                  <button
                    onClick={() => onChange({ boxShadow: !widget.boxShadow })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      widget.boxShadow !== false ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        widget.boxShadow !== false ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable Border</Label>
                  <button
                    onClick={() => onChange({ boxBorder: !widget.boxBorder })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      widget.boxBorder ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        widget.boxBorder ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {widget.boxBorder && (
                  <>
                    <div className="space-y-2">
                      <Label>Border Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={widget.boxBorderColor || '#e5e7eb'}
                          onChange={(e) => onChange({ boxBorderColor: e.target.value })}
                          className="h-10 w-16 rounded border cursor-pointer"
                        />
                        <Input
                          value={widget.boxBorderColor || '#e5e7eb'}
                          onChange={(e) => onChange({ boxBorderColor: e.target.value })}
                          placeholder="#e5e7eb"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Border Width</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={1}
                          max={8}
                          value={widget.boxBorderWidth ?? 1}
                          onChange={(e) => onChange({ boxBorderWidth: parseInt(e.target.value) })}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium w-12 text-right">{widget.boxBorderWidth ?? 1}px</span>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Items Management */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Items ({widget.items.length}/20)</Label>
          <Button size="sm" onClick={addItem} disabled={widget.items.length >= 20}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {widget.items.map((item, index) => {
            const IconComponent = getIcon(item.icon);
            const isExpanded = expandedItems.has(item.id);
            return (
              <Card
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                className={`${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <button
                      onClick={() => toggleItemExpanded(item.id)}
                      className="flex-1 flex items-center gap-2 text-left hover:bg-muted/50 px-2 py-1 rounded"
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" color={item.iconColor} />
                      <span className="font-medium text-sm truncate">
                        {item.heading || `Item ${index + 1}`}
                      </span>
                      {isExpanded ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="space-y-3 mt-3 pl-6 border-l-2 border-muted">
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openIconPicker(item.id)}
                          className="w-full justify-start"
                        >
                          <IconComponent className="w-5 h-5 mr-2" color={item.iconColor} />
                          <span className="capitalize">{item.icon}</span>
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Icon Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={item.iconColor}
                            onChange={(e) => updateItem(item.id, { iconColor: e.target.value })}
                            className="h-10 w-16 rounded border cursor-pointer"
                          />
                          <Input
                            value={item.iconColor}
                            onChange={(e) => updateItem(item.id, { iconColor: e.target.value })}
                            placeholder="#10b981"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Icon Background Color (Optional)</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={item.iconBgColor || '#d1fae5'}
                            onChange={(e) => updateItem(item.id, { iconBgColor: e.target.value })}
                            className="h-10 w-16 rounded border cursor-pointer"
                          />
                          <Input
                            value={item.iconBgColor || ''}
                            onChange={(e) => updateItem(item.id, { iconBgColor: e.target.value })}
                            placeholder="#d1fae5 (optional)"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Heading (Optional)</Label>
                        <Input
                          value={item.heading || ''}
                          onChange={(e) => updateItem(item.id, { heading: e.target.value })}
                          placeholder="Feature title..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Heading Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={item.headingColor || '#1f2937'}
                            onChange={(e) => updateItem(item.id, { headingColor: e.target.value })}
                            className="h-10 w-16 rounded border cursor-pointer"
                          />
                          <Input
                            value={item.headingColor || '#1f2937'}
                            onChange={(e) => updateItem(item.id, { headingColor: e.target.value })}
                            placeholder="#1f2937"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Subheading (Optional)</Label>
                        <Textarea
                          value={item.subheading || ''}
                          onChange={(e) => updateItem(item.id, { subheading: e.target.value })}
                          placeholder="Description or details..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Subheading Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={item.subheadingColor || '#6b7280'}
                            onChange={(e) => updateItem(item.id, { subheadingColor: e.target.value })}
                            className="h-10 w-16 rounded border cursor-pointer"
                          />
                          <Input
                            value={item.subheadingColor || '#6b7280'}
                            onChange={(e) => updateItem(item.id, { subheadingColor: e.target.value })}
                            placeholder="#6b7280"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* View More Button (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setViewMoreExpanded(!viewMoreExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">View More Button</h4>
          {viewMoreExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {viewMoreExpanded && (
          <div className="p-4 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable View More</Label>
              <button
                onClick={() => onChange({ showViewMore: !widget.showViewMore })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  widget.showViewMore ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    widget.showViewMore ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {widget.showViewMore && (
              <>
                <div className="space-y-2">
                  <Label>Items Before View More</Label>
                  <Input
                    type="number"
                    min={1}
                    max={widget.items.length}
                    value={widget.itemsBeforeViewMore || 6}
                    onChange={(e) => onChange({ itemsBeforeViewMore: parseInt(e.target.value) || 6 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Show this many items, then display the View More button
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={widget.viewMoreText || 'View More'}
                    onChange={(e) => onChange({ viewMoreText: e.target.value })}
                    placeholder="View More"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Button URL</Label>
                  <Input
                    value={widget.viewMoreUrl || ''}
                    onChange={(e) => onChange({ viewMoreUrl: e.target.value })}
                    placeholder="/services"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Background (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setBackgroundExpanded(!backgroundExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Background</h4>
          {backgroundExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {backgroundExpanded && (
          <div className="p-4 pt-0">
            <BackgroundControl value={background} onChange={(bg) => onChange({ background: bg })} />
          </div>
        )}
      </div>

      {/* Section Layout (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setSectionLayoutExpanded(!sectionLayoutExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Section Layout</h4>
          {sectionLayoutExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {sectionLayoutExpanded && (
          <div className="p-4 pt-0 space-y-4">
            {/* Height */}
            <div className="space-y-2">
              <Label>Height</Label>
              <div className="flex gap-2">
                <Select
                  value={layout.height.type || 'auto'}
                  onValueChange={(value) =>
                    onChange({
                      layout: {
                        ...layout,
                        height: {
                          type: value as any,
                          value: layout.height.value,
                        },
                      },
                    })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="vh">VH</SelectItem>
                    <SelectItem value="pixels">Pixels</SelectItem>
                  </SelectContent>
                </Select>
                {layout.height.type !== 'auto' && (
                  <Input
                    type="number"
                    value={layout.height.value || 100}
                    onChange={(e) =>
                      onChange({
                        layout: {
                          ...layout,
                          height: {
                            ...layout.height,
                            value: parseInt(e.target.value) || 100,
                          },
                        },
                      })
                    }
                  />
                )}
              </div>
            </div>

            {/* Width */}
            <div className="space-y-2">
              <Label>Width</Label>
              <Select
                value={layout.width || 'container'}
                onValueChange={(value) =>
                  onChange({
                    layout: {
                      ...layout,
                      width: value as 'full' | 'container',
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Width</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Padding */}
            <div className="space-y-2">
              <Label>Padding (px)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Top"
                  value={layout.padding.top || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layout,
                        padding: {
                          ...layout.padding,
                          top: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Right"
                  value={layout.padding.right || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layout,
                        padding: {
                          ...layout.padding,
                          right: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Bottom"
                  value={layout.padding.bottom || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layout,
                        padding: {
                          ...layout.padding,
                          bottom: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Left"
                  value={layout.padding.left || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layout,
                        padding: {
                          ...layout.padding,
                          left: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Margin */}
            <div className="space-y-2">
              <Label>Margin (px)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Top"
                  value={layout.margin.top || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layout,
                        margin: {
                          ...layout.margin,
                          top: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Right"
                  value={layout.margin.right || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layout,
                        margin: {
                          ...layout.margin,
                          right: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Bottom"
                  value={layout.margin.bottom || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layout,
                        margin: {
                          ...layout.margin,
                          bottom: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Left"
                  value={layout.margin.left || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layout,
                        margin: {
                          ...layout.margin,
                          left: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Icon Picker Dialog */}
      <IconPicker
        open={iconPickerOpen}
        onOpenChange={setIconPickerOpen}
        selectedIcon={editingItemId ? widget.items.find(i => i.id === editingItemId)?.icon || 'check' : 'check'}
        onSelectIcon={handleIconSelect}
        currentColor={editingItemId ? widget.items.find(i => i.id === editingItemId)?.iconColor : '#10b981'}
      />
    </div>
  );
}
