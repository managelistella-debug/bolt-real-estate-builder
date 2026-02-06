'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageTextWidget } from '@/lib/types';
import { AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { SectionEditorTabs } from './SectionEditorTabs';

interface ImageTextEditorNewProps {
  widget: ImageTextWidget;
  onChange: (updates: Partial<ImageTextWidget>) => void;
}

export function ImageTextEditorNew({ widget, onChange }: ImageTextEditorNewProps) {
  
  // Content Tab
  const contentTab = (
    <div className="space-y-4">
      <ImageUpload
        label="Section Image"
        value={widget.image}
        onChange={(url) => onChange({ image: url })}
        maxSizeMB={1}
      />

      <div className="space-y-2">
        <Label>Title (Optional)</Label>
        <Input
          value={widget.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Section title"
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea
          value={widget.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Add your content here..."
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label>Button Text (Optional)</Label>
        <Input
          value={widget.cta?.text || ''}
          onChange={(e) => onChange({ cta: { ...widget.cta, text: e.target.value, url: widget.cta?.url || '' } })}
          placeholder="Learn More"
        />
      </div>

      {widget.cta?.text && (
        <div className="space-y-2">
          <Label>Button URL</Label>
          <Input
            value={widget.cta?.url || ''}
            onChange={(e) => onChange({ cta: { ...widget.cta, url: e.target.value } })}
            placeholder="https://..."
          />
        </div>
      )}

      {/* Effects Placeholder */}
      <div className="pt-4 border-t">
        <Label className="text-sm text-muted-foreground">Animation Effects</Label>
        <p className="text-xs text-muted-foreground mt-1">Coming soon...</p>
      </div>
    </div>
  );

  // Layout Tab
  const layoutTab = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Layout</Label>
        <Select
          value={widget.layout}
          onValueChange={(value: 'image-left' | 'image-right') => onChange({ layout: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image-left">Image Left</SelectItem>
            <SelectItem value="image-right">Image Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Mobile Layout</Label>
        <Select
          value={widget.mobileLayout || 'stacked-image-top'}
          onValueChange={(value: 'stacked-image-top' | 'stacked-image-bottom' | 'horizontal') => onChange({ mobileLayout: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stacked-image-top">Stacked - Image Top</SelectItem>
            <SelectItem value="stacked-image-bottom">Stacked - Image Bottom</SelectItem>
            <SelectItem value="horizontal">Side by Side</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Image Height</Label>
        <div className="flex gap-2">
          <Select
            value={widget.imageHeight?.type || 'auto'}
            onValueChange={(value: 'auto' | 'vh' | 'pixels') => onChange({
              imageHeight: { ...widget.imageHeight, type: value as any }
            })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto (3:2)</SelectItem>
              <SelectItem value="vh">View Height</SelectItem>
              <SelectItem value="pixels">Pixels</SelectItem>
            </SelectContent>
          </Select>
          {widget.imageHeight?.type !== 'auto' && (
            <Input
              type="number"
              value={widget.imageHeight?.value || (widget.imageHeight?.type === 'pixels' ? 350 : 50)}
              onChange={(e) => onChange({
                imageHeight: { ...widget.imageHeight, value: parseInt(e.target.value) }
              })}
              className="w-20"
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Padding (px)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Top"
            value={widget.padding?.top || 60}
            onChange={(e) => onChange({
              padding: { ...widget.padding, top: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Right"
            value={widget.padding?.right || 40}
            onChange={(e) => onChange({
              padding: { ...widget.padding, right: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Bottom"
            value={widget.padding?.bottom || 60}
            onChange={(e) => onChange({
              padding: { ...widget.padding, bottom: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Left"
            value={widget.padding?.left || 40}
            onChange={(e) => onChange({
              padding: { ...widget.padding, left: parseInt(e.target.value) }
            })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Text Horizontal Alignment</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={widget.textAlign === 'left' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ textAlign: 'left' })}
            className="w-full"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={(widget.textAlign || 'left') === 'center' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ textAlign: 'center' })}
            className="w-full"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={widget.textAlign === 'right' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ textAlign: 'right' })}
            className="w-full"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Text Vertical Alignment</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={widget.textVerticalAlign === 'top' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ textVerticalAlign: 'top' })}
            className="w-full"
          >
            <AlignVerticalJustifyStart className="h-4 w-4" />
          </Button>
          <Button
            variant={(widget.textVerticalAlign || 'middle') === 'middle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ textVerticalAlign: 'middle' })}
            className="w-full"
          >
            <AlignVerticalJustifyCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={widget.textVerticalAlign === 'bottom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ textVerticalAlign: 'bottom' })}
            className="w-full"
          >
            <AlignVerticalJustifyEnd className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Style Tab
  const styleTab = (
    <div className="space-y-4">
      {/* Section Background */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-sm">Section Background</h3>
        <div className="space-y-2">
          <Label>Background Type</Label>
          <Select
            value={widget.background?.type || 'none'}
            onValueChange={(value: 'none' | 'color' | 'image' | 'video') => onChange({
              background: { ...widget.background, type: value }
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Transparent)</SelectItem>
              <SelectItem value="color">Color</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {widget.background?.type === 'color' && (
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={widget.background?.color || '#ffffff'}
                onChange={(e) => onChange({
                  background: { ...widget.background, color: e.target.value }
                })}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <Input
                value={widget.background?.color || '#ffffff'}
                onChange={(e) => onChange({
                  background: { ...widget.background, color: e.target.value }
                })}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Styling */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-sm">Image Styling</h3>
        
        <div className="space-y-2">
          <Label>Border Radius: {widget.imageBorderRadius || 0}px</Label>
          <input
            type="range"
            min="0"
            max="50"
            value={widget.imageBorderRadius || 0}
            onChange={(e) => onChange({ imageBorderRadius: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Image Fit</Label>
          <Select
            value={widget.imageObjectFit || 'cover'}
            onValueChange={(value: 'cover' | 'contain' | 'fill') => onChange({ imageObjectFit: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover (default)</SelectItem>
              <SelectItem value="contain">Contain</SelectItem>
              <SelectItem value="fill">Fill</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Button Style */}
      {widget.cta?.text && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Button Style</h3>
          
          <div className="space-y-2">
            <Label>Border Radius: {widget.buttonStyles?.radius || 8}px</Label>
            <input
              type="range"
              min="0"
              max="50"
              value={widget.buttonStyles?.radius || 8}
              onChange={(e) => onChange({
                buttonStyles: { 
                  ...widget.buttonStyles, 
                  radius: parseInt(e.target.value),
                  bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                  textColor: widget.buttonStyles?.textColor || '#ffffff',
                  hasShadow: widget.buttonStyles?.hasShadow ?? true,
                  shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                  strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                  strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                }
              })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={widget.buttonStyles?.bgColor || '#3b82f6'}
                onChange={(e) => onChange({
                  buttonStyles: { 
                    ...widget.buttonStyles, 
                    bgColor: e.target.value,
                    radius: widget.buttonStyles?.radius || 8,
                    textColor: widget.buttonStyles?.textColor || '#ffffff',
                    hasShadow: widget.buttonStyles?.hasShadow ?? true,
                    shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                    strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                    strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                  }
                })}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <Input
                value={widget.buttonStyles?.bgColor || '#3b82f6'}
                onChange={(e) => onChange({
                  buttonStyles: { 
                    ...widget.buttonStyles, 
                    bgColor: e.target.value,
                    radius: widget.buttonStyles?.radius || 8,
                    textColor: widget.buttonStyles?.textColor || '#ffffff',
                    hasShadow: widget.buttonStyles?.hasShadow ?? true,
                    shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                    strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                    strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                  }
                })}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={widget.buttonStyles?.textColor || '#ffffff'}
                onChange={(e) => onChange({
                  buttonStyles: { 
                    ...widget.buttonStyles, 
                    textColor: e.target.value,
                    radius: widget.buttonStyles?.radius || 8,
                    bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                    hasShadow: widget.buttonStyles?.hasShadow ?? true,
                    shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                    strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                    strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                  }
                })}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <Input
                value={widget.buttonStyles?.textColor || '#ffffff'}
                onChange={(e) => onChange({
                  buttonStyles: { 
                    ...widget.buttonStyles, 
                    textColor: e.target.value,
                    radius: widget.buttonStyles?.radius || 8,
                    bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                    hasShadow: widget.buttonStyles?.hasShadow ?? true,
                    shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                    strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                    strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                  }
                })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="image-text"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
