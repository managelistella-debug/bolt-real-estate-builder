'use client';

import { useState } from 'react';
import { ImageNavigationWidget, ImageNavigationItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, type FontSizeValue } from '../FontSizeInput';
import { ImageUpload } from '../ImageUpload';

interface ImageNavigationEditorNewProps {
  widget: ImageNavigationWidget;
  onChange: (updates: Partial<ImageNavigationWidget>) => void;
}

export function ImageNavigationEditorNew({ widget, onChange }: ImageNavigationEditorNewProps) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [itemsOpen, setItemsOpen] = useState(true);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);

  const CollapsibleSection = ({ title, open, onToggle, children }: any) => (
    <div className="border rounded-lg">
      <button type="button" className="w-full flex items-center justify-between p-3 hover:bg-muted/50" onClick={onToggle}>
        <span className="font-medium text-sm">{title}</span>
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
      <CollapsibleSection title="Columns" open={columnsOpen} onToggle={() => setColumnsOpen(!columnsOpen)}>
        <div className="space-y-2">
          <Label>Columns: {widget.columns}</Label>
          <input type="range" min="2" max="6" value={widget.columns} onChange={(e) => onChange({ columns: parseInt(e.target.value) })} className="w-full" />
        </div>
      </CollapsibleSection>
    </div>
  );

  const styleTab = (
    <div className="space-y-2">
      <CollapsibleSection title="Typography" open={typographyOpen} onToggle={() => setTypographyOpen(!typographyOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Title Font Size</Label>
            <FontSizeInput value={(widget as any).titleSize || 18} onChange={(value: FontSizeValue) => onChange({ titleSize: value.value } as any)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Title Color</Label>
            <div className="flex gap-2">
              <input type="color" value={(widget as any).titleColor || '#1f2937'} onChange={(e) => onChange({ titleColor: e.target.value } as any)} className="h-10 w-16 rounded border cursor-pointer" />
              <Input value={(widget as any).titleColor || '#1f2937'} onChange={(e) => onChange({ titleColor: e.target.value } as any)} placeholder="#1f2937" />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2">
            <input type="color" value={(widget as any).backgroundColor || 'transparent'} onChange={(e) => onChange({ backgroundColor: e.target.value } as any)} className="h-10 w-16 rounded border cursor-pointer" />
            <Input value={(widget as any).backgroundColor || 'transparent'} onChange={(e) => onChange({ backgroundColor: e.target.value } as any)} placeholder="transparent" />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  return <SectionEditorTabs sectionType="image-navigation" contentTab={contentTab} layoutTab={layoutTab} styleTab={styleTab} />;
}
