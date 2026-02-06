'use client';

import { useState } from 'react';
import { StickyFormWidget } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, type FontSizeValue } from '../FontSizeInput';

interface StickyFormEditorNewProps {
  widget: StickyFormWidget;
  onChange: (updates: Partial<StickyFormWidget>) => void;
}

export function StickyFormEditorNew({ widget, onChange }: StickyFormEditorNewProps) {
  const [contentOpen, setContentOpen] = useState(true);
  const [positionOpen, setPositionOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [buttonStyleOpen, setButtonStyleOpen] = useState(false);
  const [cardStyleOpen, setCardStyleOpen] = useState(false);

  const CollapsibleSection = ({ title, open, onToggle, children }: any) => (
    <div className="border rounded-lg">
      <button type="button" className="w-full flex items-center justify-between p-3 hover:bg-muted/50" onClick={onToggle}>
        <span className="font-medium text-sm">{title}</span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && <div className="p-4 pt-0 space-y-3">{children}</div>}
    </div>
  );

  const contentTab = (
    <div className="space-y-3">
      <CollapsibleSection title="Form Content" open={contentOpen} onToggle={() => setContentOpen(!contentOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input value={widget.heading} onChange={(e) => onChange({ heading: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea value={widget.description || ''} onChange={(e) => onChange({ description: e.target.value })} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input value={widget.buttonText} onChange={(e) => onChange({ buttonText: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Name Field Label</Label>
            <Input value={widget.nameLabel || 'Name'} onChange={(e) => onChange({ nameLabel: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email Field Label</Label>
            <Input value={widget.emailLabel || 'Email'} onChange={(e) => onChange({ emailLabel: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Phone Field Label</Label>
            <Input value={widget.phoneLabel || 'Phone'} onChange={(e) => onChange({ phoneLabel: e.target.value })} />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  const layoutTab = (
    <div className="space-y-2">
      <CollapsibleSection title="Position" open={positionOpen} onToggle={() => setPositionOpen(!positionOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Position</Label>
            <Select value={widget.position || 'bottom-right'} onValueChange={(value: any) => onChange({ position: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Offset from Edge: {widget.offset || 20}px</Label>
            <input type="range" min="10" max="50" value={widget.offset || 20} onChange={(e) => onChange({ offset: parseInt(e.target.value) })} className="w-full" />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  const styleTab = (
    <div className="space-y-2">
      <CollapsibleSection title="Typography" open={typographyOpen} onToggle={() => setTypographyOpen(!typographyOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Heading Font Size</Label>
            <FontSizeInput value={(widget as any).headingSize || 20} onChange={(value: FontSizeValue) => onChange({ headingSize: value.value } as any)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Heading Color</Label>
            <div className="flex gap-2">
              <input type="color" value={(widget as any).headingColor || '#1f2937'} onChange={(e) => onChange({ headingColor: e.target.value } as any)} className="h-10 w-16 rounded border cursor-pointer" />
              <Input value={(widget as any).headingColor || '#1f2937'} onChange={(e) => onChange({ headingColor: e.target.value } as any)} placeholder="#1f2937" />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Button Style" open={buttonStyleOpen} onToggle={() => setButtonStyleOpen(!buttonStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input type="color" value={(widget as any).buttonBackgroundColor || '#10b981'} onChange={(e) => onChange({ buttonBackgroundColor: e.target.value } as any)} className="h-10 w-16 rounded border cursor-pointer" />
              <Input value={(widget as any).buttonBackgroundColor || '#10b981'} onChange={(e) => onChange({ buttonBackgroundColor: e.target.value } as any)} placeholder="#10b981" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex gap-2">
              <input type="color" value={(widget as any).buttonTextColor || '#ffffff'} onChange={(e) => onChange({ buttonTextColor: e.target.value } as any)} className="h-10 w-16 rounded border cursor-pointer" />
              <Input value={(widget as any).buttonTextColor || '#ffffff'} onChange={(e) => onChange({ buttonTextColor: e.target.value } as any)} placeholder="#ffffff" />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Card Style" open={cardStyleOpen} onToggle={() => setCardStyleOpen(!cardStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input type="color" value={(widget as any).cardBackgroundColor || '#ffffff'} onChange={(e) => onChange({ cardBackgroundColor: e.target.value } as any)} className="h-10 w-16 rounded border cursor-pointer" />
              <Input value={(widget as any).cardBackgroundColor || '#ffffff'} onChange={(e) => onChange({ cardBackgroundColor: e.target.value } as any)} placeholder="#ffffff" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Border Radius: {(widget as any).cardBorderRadius || 12}px</Label>
            <input type="range" min="0" max="30" value={(widget as any).cardBorderRadius || 12} onChange={(e) => onChange({ cardBorderRadius: parseInt(e.target.value) } as any)} className="w-full" />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  return <SectionEditorTabs sectionType="sticky-form" contentTab={contentTab} layoutTab={layoutTab} styleTab={styleTab} />;
}
