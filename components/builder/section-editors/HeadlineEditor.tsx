'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HeadlineWidget } from '@/lib/types';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface HeadlineEditorProps {
  widget: HeadlineWidget;
  onChange: (updates: Partial<HeadlineWidget>) => void;
}

export function HeadlineEditor({ widget, onChange }: HeadlineEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={widget.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Section Headline"
        />
      </div>

      <div className="space-y-2">
        <Label>Subtitle (Optional)</Label>
        <Input
          value={widget.subtitle || ''}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          placeholder="Optional subtitle"
        />
      </div>

      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={widget.background.color}
            onChange={(e) => onChange({ background: { ...widget.background, color: e.target.value } })}
            className="h-10 w-16 rounded border cursor-pointer"
          />
          <Input
            value={widget.background.color}
            onChange={(e) => onChange({ background: { ...widget.background, color: e.target.value } })}
            placeholder="#f9fafb"
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Section Height</Label>
        <div className="flex gap-2">
          <Select
            value={widget.height?.type || 'auto'}
            onValueChange={(value: 'auto' | 'vh' | 'percentage' | 'pixels') => onChange({
              height: { ...widget.height, type: value }
            })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="vh">View Height</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="pixels">Pixels</SelectItem>
            </SelectContent>
          </Select>
          {widget.height?.type !== 'auto' && (
            <Input
              type="number"
              value={widget.height?.value || 100}
              onChange={(e) => onChange({
                height: { ...widget.height, value: parseInt(e.target.value) }
              })}
              className="w-20"
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Text Alignment</Label>
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
            variant={widget.textAlign === 'center' ? 'default' : 'outline'}
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
        <Label>Padding (px)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Top"
            value={widget.padding?.top || 40}
            onChange={(e) => onChange({
              padding: { ...widget.padding, top: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Right"
            value={widget.padding?.right || 20}
            onChange={(e) => onChange({
              padding: { ...widget.padding, right: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Bottom"
            value={widget.padding?.bottom || 40}
            onChange={(e) => onChange({
              padding: { ...widget.padding, bottom: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Left"
            value={widget.padding?.left || 20}
            onChange={(e) => onChange({
              padding: { ...widget.padding, left: parseInt(e.target.value) }
            })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Margin (px)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Top"
            value={widget.margin?.top || 0}
            onChange={(e) => onChange({
              margin: { ...widget.margin, top: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Right"
            value={widget.margin?.right || 0}
            onChange={(e) => onChange({
              margin: { ...widget.margin, right: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Bottom"
            value={widget.margin?.bottom || 0}
            onChange={(e) => onChange({
              margin: { ...widget.margin, bottom: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Left"
            value={widget.margin?.left || 0}
            onChange={(e) => onChange({
              margin: { ...widget.margin, left: parseInt(e.target.value) }
            })}
          />
        </div>
      </div>
    </div>
  );
}
