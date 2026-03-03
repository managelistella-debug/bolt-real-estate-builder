/**
 * Simplified Section Editors with Content/Layout/Style Tabs
 * All remaining section editors are consolidated here for consistency
 */

'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionEditorTabs } from './SectionEditorTabs';
import { BackgroundControl } from './BackgroundControl';
import { ImageUpload } from './ImageUpload';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

// ========================================
// IMAGE GALLERY EDITOR
// ========================================
import { ImageGalleryWidget } from '@/lib/types';

interface ImageGalleryEditorNewProps {
  widget: ImageGalleryWidget;
  onChange: (updates: Partial<ImageGalleryWidget>) => void;
}

export function ImageGalleryEditorNew({ widget, onChange }: ImageGalleryEditorNewProps) {
  const contentTab = (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select a collection or add images manually
      </p>
      <div className="space-y-2">
        <Label>Collection ID (Optional)</Label>
        <Input
          value={widget.collectionId || ''}
          onChange={(e) => onChange({ collectionId: e.target.value })}
          placeholder="collection-id"
        />
      </div>
    </div>
  );

  const layoutTab = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Columns</Label>
        <Input
          type="number"
          min="1"
          max="6"
          value={widget.columns}
          onChange={(e) => onChange({ columns: parseInt(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label>Gap: {widget.gap}px</Label>
        <input
          type="range"
          min="0"
          max="40"
          value={widget.gap}
          onChange={(e) => onChange({ gap: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Aspect Ratio</Label>
        <Select
          value={widget.aspectRatio || '3:2'}
          onValueChange={(value: any) => onChange({ aspectRatio: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1:1">1:1 (Square)</SelectItem>
            <SelectItem value="3:2">3:2</SelectItem>
            <SelectItem value="4:3">4:3</SelectItem>
            <SelectItem value="4:5">4:5 (Portrait)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Padding (px)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Top"
            value={widget.layout?.padding?.top || 60}
            onChange={(e) => onChange({
              layout: { 
                ...widget.layout, 
                padding: { ...widget.layout?.padding, top: parseInt(e.target.value) } as any
              } as any
            })}
          />
          <Input
            type="number"
            placeholder="Right"
            value={widget.layout?.padding?.right || 40}
            onChange={(e) => onChange({
              layout: { 
                ...widget.layout, 
                padding: { ...widget.layout?.padding, right: parseInt(e.target.value) } as any
              } as any
            })}
          />
          <Input
            type="number"
            placeholder="Bottom"
            value={widget.layout?.padding?.bottom || 60}
            onChange={(e) => onChange({
              layout: { 
                ...widget.layout, 
                padding: { ...widget.layout?.padding, bottom: parseInt(e.target.value) } as any
              } as any
            })}
          />
          <Input
            type="number"
            placeholder="Left"
            value={widget.layout?.padding?.left || 40}
            onChange={(e) => onChange({
              layout: { 
                ...widget.layout, 
                padding: { ...widget.layout?.padding, left: parseInt(e.target.value) } as any
              } as any
            })}
          />
        </div>
      </div>
    </div>
  );

  const styleTab = (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Background</h3>
      <BackgroundControl
        background={widget.background || { type: 'color', color: 'transparent', opacity: 100, blur: 0 }}
        onChange={(bg) => onChange({ background: bg })}
      />
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="image-gallery"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}

// ========================================
// CUSTOM CODE EDITOR
// ========================================
import { CustomCodeWidget } from '@/lib/types';

interface CustomCodeEditorNewProps {
  widget: CustomCodeWidget;
  onChange: (updates: Partial<CustomCodeWidget>) => void;
}

export function CustomCodeEditorNew({ widget, onChange }: CustomCodeEditorNewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Custom Code Embed</h3>
          <p className="text-sm text-muted-foreground">
            Add your custom HTML, CSS, and JavaScript code below.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>HTML</Label>
            <Textarea
              value={widget.html}
              onChange={(e) => onChange({ html: e.target.value })}
              rows={10}
              className="font-mono text-xs"
              placeholder="<div>Your HTML here</div>"
            />
          </div>

          <div className="space-y-2">
            <Label>CSS</Label>
            <Textarea
              value={widget.css}
              onChange={(e) => onChange({ css: e.target.value })}
              rows={8}
              className="font-mono text-xs"
              placeholder=".custom { color: blue; }"
            />
          </div>

          <div className="space-y-2">
            <Label>JavaScript</Label>
            <Textarea
              value={widget.javascript}
              onChange={(e) => onChange({ javascript: e.target.value })}
              rows={8}
              className="font-mono text-xs"
              placeholder="console.log('Hello');"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
