'use client';

import React, { useState } from 'react';
import { ImageTextColumnsWidget, ImageTextColumnItem, LayoutConfig, BackgroundConfig } from '@/lib/types';
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

interface ImageTextColumnsEditorNewProps {
  widget: ImageTextColumnsWidget;
  onChange: (updates: Partial<ImageTextColumnsWidget>) => void;
}

export function ImageTextColumnsEditorNew({ widget, onChange }: ImageTextColumnsEditorNewProps) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [sectionHeaderOpen, setSectionHeaderOpen] = useState(false);
  const [columnItemsOpen, setColumnItemsOpen] = useState(true);

  const layoutConfig = widget.layout || {
    fullWidth: true,
    maxWidth: 1200,
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
  };

  const backgroundConfig = widget.background || {
    type: 'color',
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };

  const updateLayout = (updates: Partial<LayoutConfig>) => {
    onChange({ layout: { ...layoutConfig, ...updates } });
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
          <Label htmlFor="desktopColumns">Desktop Columns (1-4)</Label>
          <Input
            id="desktopColumns"
            type="number"
            min={1}
            max={4}
            value={widget.desktopColumns || 3}
            onChange={(e) => onChange({ desktopColumns: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tabletColumns">Tablet Columns (1-3)</Label>
          <Input
            id="tabletColumns"
            type="number"
            min={1}
            max={3}
            value={widget.tabletColumns || 2}
            onChange={(e) => onChange({ tabletColumns: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobileColumns">Mobile Columns (1-2)</Label>
          <Input
            id="mobileColumns"
            type="number"
            min={1}
            max={2}
            value={widget.mobileColumns || 1}
            onChange={(e) => onChange({ mobileColumns: parseInt(e.target.value) })}
          />
        </div>
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
          <Label htmlFor="fullWidth">Full Width</Label>
          <Switch
            id="fullWidth"
            checked={layoutConfig.fullWidth ?? true}
            onCheckedChange={(checked) => updateLayout({ fullWidth: checked })}
          />
        </div>
        {!layoutConfig.fullWidth && (
          <div className="space-y-2">
            <Label htmlFor="maxWidth">Max Width (px)</Label>
            <Input
              id="maxWidth"
              type="number"
              min={600}
              max={1400}
              value={layoutConfig.maxWidth ?? 1200}
              onChange={(e) => updateLayout({ maxWidth: parseInt(e.target.value) })}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="paddingTop">Padding Top (px)</Label>
          <Input
            id="paddingTop"
            type="number"
            min={0}
            max={200}
            value={layoutConfig.paddingTop ?? 80}
            onChange={(e) => updateLayout({ paddingTop: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paddingBottom">Padding Bottom (px)</Label>
          <Input
            id="paddingBottom"
            type="number"
            min={0}
            max={200}
            value={layoutConfig.paddingBottom ?? 80}
            onChange={(e) => updateLayout({ paddingBottom: parseInt(e.target.value) })}
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
      </div>

      {/* Text Styling */}
      <div className="border rounded-lg p-3 space-y-3">
        <h4 className="font-medium text-sm">Text Styling</h4>
        <div className="space-y-2">
          <Label>Text Alignment</Label>
          <div className="flex gap-2">
            {getAlignmentButton('left', <AlignLeft className="h-4 w-4" />)}
            {getAlignmentButton('center', <AlignCenter className="h-4 w-4" />)}
            {getAlignmentButton('right', <AlignRight className="h-4 w-4" />)}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Subtitle Color</Label>
          {renderColorPicker(widget.subtitleColor, (color) => onChange({ subtitleColor: color }), '#1f2937')}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitleSize">Subtitle Size (px)</Label>
          <Input
            id="subtitleSize"
            type="number"
            min={14}
            max={32}
            value={widget.subtitleSize ?? 20}
            onChange={(e) => onChange({ subtitleSize: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitleFontWeight">Subtitle Font Weight</Label>
          <Select
            value={String(widget.subtitleFontWeight ?? 600)}
            onValueChange={(value) => onChange({ subtitleFontWeight: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="400">Normal</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="600">Semibold</SelectItem>
              <SelectItem value="700">Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Description Color</Label>
          {renderColorPicker(widget.descriptionColor, (color) => onChange({ descriptionColor: color }), '#6b7280')}
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionSize">Description Size (px)</Label>
          <Input
            id="descriptionSize"
            type="number"
            min={12}
            max={24}
            value={widget.descriptionSize ?? 16}
            onChange={(e) => onChange({ descriptionSize: parseInt(e.target.value) })}
          />
        </div>
      </div>

      {/* Background */}
      <div className="border rounded-lg p-3">
        <h4 className="font-medium text-sm mb-3">Background</h4>
        <BackgroundControl value={backgroundConfig} onChange={updateBackground} />
      </div>
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="multi-column"
      tabs={{
        content: contentTab,
        layout: layoutTab,
        style: styleTab,
      }}
    />
  );
}
