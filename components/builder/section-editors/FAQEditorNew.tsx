'use client';

import { useState } from 'react';
import { FAQWidget, FAQItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, ChevronDown, ChevronRight, ChevronUp, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, type FontSizeValue } from '../FontSizeInput';

interface FAQEditorNewProps {
  widget: FAQWidget;
  onChange: (updates: Partial<FAQWidget>) => void;
}

export function FAQEditorNew({ widget, onChange }: FAQEditorNewProps) {
  const [expandedItemIds, setExpandedItemIds] = useState<Set<string>>(new Set());
  
  // Collapsible states
  const [sectionHeaderOpen, setSectionHeaderOpen] = useState(false);
  const [itemsOpen, setItemsOpen] = useState(true);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [spacingOpen, setSpacingOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [sectionHeaderStyleOpen, setSectionHeaderStyleOpen] = useState(false);
  const [questionStyleOpen, setQuestionStyleOpen] = useState(false);
  const [answerStyleOpen, setAnswerStyleOpen] = useState(false);
  const [iconStyleOpen, setIconStyleOpen] = useState(false);
  const [itemStyleOpen, setItemStyleOpen] = useState(false);
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
    padding: { top: 80, right: 20, bottom: 80, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  
  const layoutCfg = (widget.layout && typeof widget.layout === 'object' && 'height' in widget.layout)
    ? {
        height: widget.layout.height || defaultLayout.height,
        width: widget.layout.width || defaultLayout.width,
        padding: widget.layout.padding || defaultLayout.padding,
        margin: widget.layout.margin || defaultLayout.margin,
      }
    : defaultLayout;

  const background = widget.background || { type: 'color', color: 'transparent', opacity: 100, blur: 0 };
  const items = widget.items || [];

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const addItem = () => {
    const newItem: FAQItem = {
      id: generateId(),
      question: 'New Question',
      answer: 'Your answer goes here.',
      defaultOpen: false,
    };
    onChange({ items: [...items, newItem] });
    setExpandedItemIds(new Set([...expandedItemIds, newItem.id]));
  };

  const updateItem = (id: string, updates: Partial<FAQItem>) => {
    onChange({
      items: items.map(item => item.id === id ? { ...item, ...updates } : item),
    });
  };

  const removeItem = (id: string) => {
    onChange({ items: items.filter(item => item.id !== id) });
    const newExpanded = new Set(expandedItemIds);
    newExpanded.delete(id);
    setExpandedItemIds(newExpanded);
  };

  const reorderItem = (id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    const [removed] = newItems.splice(index, 1);
    newItems.splice(newIndex, 0, removed);
    onChange({ items: newItems });
  };

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItemIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Section Header */}
      <CollapsibleSection title="Section Header" open={sectionHeaderOpen} onToggle={() => setSectionHeaderOpen(!sectionHeaderOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Heading</Label>
              <Select
                value={(widget as any).headingTag || 'h2'}
                onValueChange={(value: any) => onChange({ headingTag: value } as any)}
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
              value={widget.heading || 'Have Questions?'}
              onChange={(e) => onChange({ heading: e.target.value })}
              placeholder="Section heading"
            />
          </div>
          <div className="space-y-2">
            <Label>Subheading (Optional)</Label>
            <Input
              value={widget.subheading || ''}
              onChange={(e) => onChange({ subheading: e.target.value })}
              placeholder="Optional subheading"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* FAQ Items */}
      <CollapsibleSection title={`FAQ Items (${items.length})`} open={itemsOpen} onToggle={() => setItemsOpen(!itemsOpen)}>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-medium text-sm truncate">{item.question}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => reorderItem(item.id, 'up')}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => reorderItem(item.id, 'down')}
                    disabled={index === items.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => toggleItemExpanded(item.id)}
                  >
                    {expandedItemIds.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedItemIds.has(item.id) && (
                <div className="mt-3 space-y-3 pt-3 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs">Question</Label>
                    <Input
                      value={item.question}
                      onChange={(e) => updateItem(item.id, { question: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Answer</Label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => updateItem(item.id, { answer: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`default-open-${item.id}`}
                      checked={item.defaultOpen || false}
                      onCheckedChange={(checked) => updateItem(item.id, { defaultOpen: !!checked })}
                    />
                    <Label htmlFor={`default-open-${item.id}`} className="text-xs font-normal">Default Open</Label>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button onClick={addItem} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add FAQ Item
          </Button>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Layout Tab
  const layoutTab = (
    <div className="space-y-2">
      {/* Spacing */}
      <CollapsibleSection title="Spacing" open={spacingOpen} onToggle={() => setSpacingOpen(!spacingOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Item Gap: {widget.itemGap || 16}px</Label>
            <input
              type="range"
              min="0"
              max="40"
              value={widget.itemGap || 16}
              onChange={(e) => onChange({ itemGap: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Question-Answer Gap: {widget.questionAnswerGap || 12}px</Label>
            <input
              type="range"
              min="0"
              max="30"
              value={widget.questionAnswerGap || 12}
              onChange={(e) => onChange({ questionAnswerGap: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Header Gap: {widget.headerGap || 40}px</Label>
            <input
              type="range"
              min="20"
              max="80"
              value={widget.headerGap || 40}
              onChange={(e) => onChange({ headerGap: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Section Height */}
      <CollapsibleSection title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
        <div className="flex gap-2">
          <Select
            value={layoutCfg.height.type || 'auto'}
            onValueChange={(value: 'auto' | 'vh' | 'pixels') => onChange({
              layout: { ...layoutCfg, height: { type: value, value: layoutCfg.height.value } }
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
          {layoutCfg.height.type !== 'auto' && (
            <Input
              type="number"
              value={layoutCfg.height.value || 100}
              onChange={(e) => onChange({
                layout: { ...layoutCfg, height: { ...layoutCfg.height, value: parseInt(e.target.value) || 100 } }
              })}
              className="w-24"
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Section Width */}
      <CollapsibleSection title="Section Width" open={sectionWidthOpen} onToggle={() => setSectionWidthOpen(!sectionWidthOpen)}>
        <Select
          value={layoutCfg.width || 'container'}
          onValueChange={(value: 'full' | 'container') => onChange({ layout: { ...layoutCfg, width: value } })}
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
                value={(layoutCfg.padding as any)[side] || 0}
                onChange={(e) => onChange({
                  layout: { ...layoutCfg, padding: { ...layoutCfg.padding, [side]: parseInt(e.target.value) || 0 } }
                })}
              />
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );

  // Style Tab
  const styleTab = (
    <div className="space-y-2">
      {/* Typography */}
      <CollapsibleSection title="Typography" open={typographyOpen} onToggle={() => setTypographyOpen(!typographyOpen)}>
        <div className="space-y-3">
          {/* Section Header Style */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setSectionHeaderStyleOpen(!sectionHeaderStyleOpen)}
            >
              <span className="text-sm font-medium">Section Header</span>
              {sectionHeaderStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {sectionHeaderStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Family</Label>
                  <Select defaultValue="Inter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={widget.headingSize || 48}
                    onChange={(value: FontSizeValue) => onChange({ headingSize: value.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Weight</Label>
                  <Select
                    value={String(widget.headingWeight || 700)}
                    onValueChange={(value) => onChange({ headingWeight: parseInt(value) } as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                      <SelectItem value="800">Extra Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Line Height</Label>
                  <Input
                    value={(widget as any).headingLineHeight || '1.2'}
                    onChange={(e) => onChange({ headingLineHeight: e.target.value } as any)}
                    placeholder="1.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Text Transform</Label>
                  <Select
                    value={(widget as any).headingTextTransform || 'none'}
                    onValueChange={(value) => onChange({ headingTextTransform: value } as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Normal</SelectItem>
                      <SelectItem value="uppercase">All Caps</SelectItem>
                      <SelectItem value="capitalize">Capitalize</SelectItem>
                      <SelectItem value="lowercase">Lowercase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.headingColor || '#1f2937'}
                      onChange={(e) => onChange({ headingColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.headingColor || '#1f2937'}
                      onChange={(e) => onChange({ headingColor: e.target.value })}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Alignment</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={widget.headingAlignment === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onChange({ headingAlignment: 'left' })}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={widget.headingAlignment === 'center' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onChange({ headingAlignment: 'center' })}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={widget.headingAlignment === 'right' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onChange({ headingAlignment: 'right' })}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Question Style */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setQuestionStyleOpen(!questionStyleOpen)}
            >
              <span className="text-sm font-medium">Questions</span>
              {questionStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {questionStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Family</Label>
                  <Select defaultValue="Inter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={widget.questionFontSize || 18}
                    onChange={(value: FontSizeValue) => onChange({ questionFontSize: value.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Weight</Label>
                  <Select
                    value={String(widget.questionFontWeight || 600)}
                    onValueChange={(value) => onChange({ questionFontWeight: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Line Height</Label>
                  <Input
                    value={(widget as any).questionLineHeight || '1.5'}
                    onChange={(e) => onChange({ questionLineHeight: e.target.value } as any)}
                    placeholder="1.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.questionColor || '#1f2937'}
                      onChange={(e) => onChange({ questionColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.questionColor || '#1f2937'}
                      onChange={(e) => onChange({ questionColor: e.target.value })}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Answer Style */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setAnswerStyleOpen(!answerStyleOpen)}
            >
              <span className="text-sm font-medium">Answers</span>
              {answerStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {answerStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Family</Label>
                  <Select defaultValue="Inter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={widget.answerFontSize || 16}
                    onChange={(value: FontSizeValue) => onChange({ answerFontSize: value.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Weight</Label>
                  <Select
                    value={String(widget.answerFontWeight || 400)}
                    onValueChange={(value) => onChange({ answerFontWeight: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Line Height</Label>
                  <Input
                    value={(widget as any).answerLineHeight || '1.6'}
                    onChange={(e) => onChange({ answerLineHeight: e.target.value } as any)}
                    placeholder="1.6"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.answerColor || '#6b7280'}
                      onChange={(e) => onChange({ answerColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.answerColor || '#6b7280'}
                      onChange={(e) => onChange({ answerColor: e.target.value })}
                      placeholder="#6b7280"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Icon Style */}
      <CollapsibleSection title="Icon Style" open={iconStyleOpen} onToggle={() => setIconStyleOpen(!iconStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Icon Style</Label>
            <Select
              value={widget.iconStyle || 'chevron'}
              onValueChange={(value: 'chevron' | 'plus' | 'arrow') => onChange({ iconStyle: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chevron">Chevron</SelectItem>
                <SelectItem value="plus">Plus</SelectItem>
                <SelectItem value="arrow">Arrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Icon Position</Label>
            <Select
              value={widget.iconPosition || 'left'}
              onValueChange={(value: 'left' | 'right') => onChange({ iconPosition: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Icon Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={widget.iconColor || '#10b981'}
                onChange={(e) => onChange({ iconColor: e.target.value })}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <Input
                value={widget.iconColor || '#10b981'}
                onChange={(e) => onChange({ iconColor: e.target.value })}
                placeholder="#10b981"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Icon Background</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={widget.iconBackgroundColor || '#d1fae5'}
                onChange={(e) => onChange({ iconBackgroundColor: e.target.value })}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <Input
                value={widget.iconBackgroundColor || '#d1fae5'}
                onChange={(e) => onChange({ iconBackgroundColor: e.target.value })}
                placeholder="#d1fae5"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Icon Circle Size: {widget.iconCircleSize || 40}px</Label>
            <input
              type="range"
              min="30"
              max="60"
              value={widget.iconCircleSize || 40}
              onChange={(e) => onChange({ iconCircleSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Item Style */}
      <CollapsibleSection title="Item Style" open={itemStyleOpen} onToggle={() => setItemStyleOpen(!itemStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Style</Label>
            <Select
              value={widget.itemStyle || 'clean'}
              onValueChange={(value: 'clean' | 'boxed' | 'separated') => onChange({ itemStyle: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clean">Clean</SelectItem>
                <SelectItem value="boxed">Boxed</SelectItem>
                <SelectItem value="separated">Separated with Dividers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {widget.itemStyle === 'boxed' && (
            <>
              <div className="space-y-2">
                <Label>Box Background</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={widget.boxBackgroundColor || '#f9fafb'}
                    onChange={(e) => onChange({ boxBackgroundColor: e.target.value })}
                    className="h-10 w-16 rounded border cursor-pointer"
                  />
                  <Input
                    value={widget.boxBackgroundColor || '#f9fafb'}
                    onChange={(e) => onChange({ boxBackgroundColor: e.target.value })}
                    placeholder="#f9fafb"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Border Radius: {widget.boxBorderRadius || 12}px</Label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={widget.boxBorderRadius || 12}
                  onChange={(e) => onChange({ boxBorderRadius: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Padding: {widget.boxPadding || 24}px</Label>
                <input
                  type="range"
                  min="12"
                  max="40"
                  value={widget.boxPadding || 24}
                  onChange={(e) => onChange({ boxPadding: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="box-shadow"
                  checked={widget.boxShadow || false}
                  onCheckedChange={(checked) => onChange({ boxShadow: !!checked })}
                />
                <Label htmlFor="box-shadow" className="text-sm font-normal">Drop Shadow</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="box-border"
                  checked={widget.boxBorder || false}
                  onCheckedChange={(checked) => onChange({ boxBorder: !!checked })}
                />
                <Label htmlFor="box-border" className="text-sm font-normal">Border</Label>
              </div>
            </>
          )}
          {widget.itemStyle === 'separated' && (
            <>
              <div className="space-y-2">
                <Label>Divider Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={widget.dividerColor || '#e5e7eb'}
                    onChange={(e) => onChange({ dividerColor: e.target.value })}
                    className="h-10 w-16 rounded border cursor-pointer"
                  />
                  <Input
                    value={widget.dividerColor || '#e5e7eb'}
                    onChange={(e) => onChange({ dividerColor: e.target.value })}
                    placeholder="#e5e7eb"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Divider Width: {widget.dividerWidth || 1}px</Label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={widget.dividerWidth || 1}
                  onChange={(e) => onChange({ dividerWidth: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </>
          )}
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
      sectionType="faq"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
