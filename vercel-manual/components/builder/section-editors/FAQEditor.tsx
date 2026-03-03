'use client';

import { useState } from 'react';
import { FAQWidget, FAQItem, FAQIconStyle, FAQItemStyle, TextAlignment } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BackgroundControl } from '@/components/builder/BackgroundControl';
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface FAQEditorProps {
  widget: FAQWidget;
  onChange: (updates: Partial<FAQWidget>) => void;
}

export function FAQEditor({ widget, onChange }: FAQEditorProps) {
  const [contentExpanded, setContentExpanded] = useState(true);
  const [itemsExpanded, setItemsExpanded] = useState(true);
  const [expandedItemIds, setExpandedItemIds] = useState<Set<string>>(new Set());
  const [iconSettingsExpanded, setIconSettingsExpanded] = useState(false);
  const [itemStyleExpanded, setItemStyleExpanded] = useState(false);
  const [typographyExpanded, setTypographyExpanded] = useState(false);
  const [spacingExpanded, setSpacingExpanded] = useState(false);
  const [backgroundExpanded, setBackgroundExpanded] = useState(false);
  const [sectionLayoutExpanded, setSectionLayoutExpanded] = useState(false);

  // Ensure defaults
  const heading = widget.heading || 'Have Questions?';
  const headingColor = widget.headingColor || '#1f2937';
  const headingSize = widget.headingSize || 48;
  const headingAlignment = widget.headingAlignment || 'center';
  
  const subheading = widget.subheading || '';
  const subheadingColor = widget.subheadingColor || '#6b7280';
  const subheadingSize = widget.subheadingSize || 18;
  const subheadingAlignment = widget.subheadingAlignment || 'center';
  
  const items = widget.items || [];
  
  const questionFontSize = widget.questionFontSize || 18;
  const questionColor = widget.questionColor || '#1f2937';
  const questionAlignment = widget.questionAlignment || 'left';
  const questionFontWeight = widget.questionFontWeight || 600;
  
  const answerFontSize = widget.answerFontSize || 16;
  const answerColor = widget.answerColor || '#6b7280';
  const answerAlignment = widget.answerAlignment || 'left';
  const answerFontWeight = widget.answerFontWeight || 400;
  
  const iconStyle = widget.iconStyle || 'chevron';
  const iconColor = widget.iconColor || '#10b981';
  const iconBackgroundColor = widget.iconBackgroundColor || '#d1fae5';
  const iconCircleSize = widget.iconCircleSize || 40;
  const iconPosition = widget.iconPosition || 'left';
  
  const itemStyle = widget.itemStyle || 'clean';
  
  const boxBackgroundColor = widget.boxBackgroundColor || '#f9fafb';
  const boxBorderRadius = widget.boxBorderRadius || 12;
  const boxPadding = widget.boxPadding || 24;
  const boxShadow = widget.boxShadow || false;
  const boxBorder = widget.boxBorder || false;
  const boxBorderColor = widget.boxBorderColor || '#e5e7eb';
  const boxBorderWidth = widget.boxBorderWidth || 1;
  
  const dividerColor = widget.dividerColor || '#e5e7eb';
  const dividerWidth = widget.dividerWidth || 1;
  
  const itemGap = widget.itemGap || 16;
  const questionAnswerGap = widget.questionAnswerGap || 12;
  const headerGap = widget.headerGap || 40;
  
  const background = widget.background || { type: 'color', color: 'transparent', opacity: 100, blur: 0 };
  
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

  const generateId = () => Math.random().toString(36).substring(2, 11);

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

  const addFAQItem = () => {
    const newItem: FAQItem = {
      id: generateId(),
      question: 'New Question',
      answer: 'Your answer here.',
    };
    onChange({ items: [...items, newItem] });
  };

  const updateFAQItem = (id: string, updates: Partial<FAQItem>) => {
    onChange({
      items: items.map(item => item.id === id ? { ...item, ...updates } : item)
    });
  };

  const removeFAQItem = (id: string) => {
    onChange({ items: items.filter(item => item.id !== id) });
  };

  const moveFAQItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    onChange({ items: newItems });
  };

  const getAlignmentButtons = (value: TextAlignment, onChange: (val: TextAlignment) => void) => (
    <div className="flex gap-1">
      <Button
        type="button"
        variant={value === 'left' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('left')}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={value === 'center' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('center')}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={value === 'right' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('right')}
      >
        <AlignRight className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Content Section */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setContentExpanded(!contentExpanded)}
        >
          <span className="font-medium">Content</span>
          {contentExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {contentExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div>
              <Label>Heading</Label>
              <Input
                value={heading}
                onChange={(e) => onChange({ heading: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Heading Color</Label>
                <Input
                  type="color"
                  value={headingColor}
                  onChange={(e) => onChange({ headingColor: e.target.value })}
                />
              </div>
              <div>
                <Label>Heading Size (px)</Label>
                <Input
                  type="number"
                  value={headingSize}
                  onChange={(e) => onChange({ headingSize: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Heading Alignment</Label>
              {getAlignmentButtons(headingAlignment, (val) => onChange({ headingAlignment: val }))}
            </div>
            <div>
              <Label>Subheading (Optional)</Label>
              <Input
                value={subheading}
                onChange={(e) => onChange({ subheading: e.target.value })}
                placeholder="Optional subheading"
              />
            </div>
            {subheading && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Subheading Color</Label>
                    <Input
                      type="color"
                      value={subheadingColor}
                      onChange={(e) => onChange({ subheadingColor: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Subheading Size (px)</Label>
                    <Input
                      type="number"
                      value={subheadingSize}
                      onChange={(e) => onChange({ subheadingSize: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Subheading Alignment</Label>
                  {getAlignmentButtons(subheadingAlignment, (val) => onChange({ subheadingAlignment: val }))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* FAQ Items Section */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setItemsExpanded(!itemsExpanded)}
        >
          <span className="font-medium">FAQ Items</span>
          {itemsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {itemsExpanded && (
          <div className="p-4 space-y-4 border-t">
            {items.map((item, index) => {
              const isExpanded = expandedItemIds.has(item.id);
              return (
                <div key={item.id} className="border rounded-lg">
                  <div 
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 gap-2"
                    onClick={() => toggleItemExpanded(item.id)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {item.question || `Question ${index + 1}`}
                      </span>
                    </div>
                    <div className="flex gap-1 items-center flex-shrink-0">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFAQItem(index, 'up');
                          }}
                        >
                          ↑
                        </Button>
                      )}
                      {index < items.length - 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFAQItem(index, 'down');
                          }}
                        >
                          ↓
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFAQItem(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="p-3 space-y-3 border-t">
                      <div>
                        <Label>Question</Label>
                        <Input
                          value={item.question}
                          onChange={(e) => updateFAQItem(item.id, { question: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Answer</Label>
                        <Textarea
                          value={item.answer}
                          onChange={(e) => updateFAQItem(item.id, { answer: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <Button type="button" onClick={addFAQItem} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ Item
            </Button>
          </div>
        )}
      </div>

      {/* Icon Settings */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setIconSettingsExpanded(!iconSettingsExpanded)}
        >
          <span className="font-medium">Icon Settings</span>
          {iconSettingsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {iconSettingsExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div>
              <Label>Icon Style</Label>
              <Select value={iconStyle} onValueChange={(val: FAQIconStyle) => onChange({ iconStyle: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chevron">Chevron</SelectItem>
                  <SelectItem value="plus-minus">Plus/Minus</SelectItem>
                  <SelectItem value="arrow">Arrow</SelectItem>
                  <SelectItem value="caret">Caret</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Icon Color</Label>
                <Input
                  type="color"
                  value={iconColor}
                  onChange={(e) => onChange({ iconColor: e.target.value })}
                />
              </div>
              <div>
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={iconBackgroundColor}
                  onChange={(e) => onChange({ iconBackgroundColor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Circle Size: {iconCircleSize}px</Label>
              <input
                type="range"
                min="24"
                max="64"
                value={iconCircleSize}
                onChange={(e) => onChange({ iconCircleSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <Label>Icon Position</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant={iconPosition === 'left' ? 'default' : 'outline'}
                  onClick={() => onChange({ iconPosition: 'left' })}
                  className="flex-1"
                >
                  Before Text
                </Button>
                <Button
                  type="button"
                  variant={iconPosition === 'right' ? 'default' : 'outline'}
                  onClick={() => onChange({ iconPosition: 'right' })}
                  className="flex-1"
                >
                  After Text
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Item Style */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setItemStyleExpanded(!itemStyleExpanded)}
        >
          <span className="font-medium">Item Style</span>
          {itemStyleExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {itemStyleExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div>
              <Label>Style</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant={itemStyle === 'clean' ? 'default' : 'outline'}
                  onClick={() => onChange({ itemStyle: 'clean' })}
                  className="flex-1"
                >
                  Clean
                </Button>
                <Button
                  type="button"
                  variant={itemStyle === 'boxed' ? 'default' : 'outline'}
                  onClick={() => onChange({ itemStyle: 'boxed' })}
                  className="flex-1"
                >
                  Boxed
                </Button>
                <Button
                  type="button"
                  variant={itemStyle === 'dividers' ? 'default' : 'outline'}
                  onClick={() => onChange({ itemStyle: 'dividers' })}
                  className="flex-1"
                >
                  Dividers
                </Button>
              </div>
            </div>

            {/* Box Styling (conditional) */}
            {itemStyle === 'boxed' && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-sm">Box Styling</h4>
                <div>
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={boxBackgroundColor}
                    onChange={(e) => onChange({ boxBackgroundColor: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Border Radius: {boxBorderRadius}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={boxBorderRadius}
                    onChange={(e) => onChange({ boxBorderRadius: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Padding: {boxPadding}px</Label>
                  <input
                    type="range"
                    min="8"
                    max="48"
                    value={boxPadding}
                    onChange={(e) => onChange({ boxPadding: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="boxShadow"
                    checked={boxShadow}
                    onChange={(e) => onChange({ boxShadow: e.target.checked })}
                  />
                  <Label htmlFor="boxShadow">Shadow</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="boxBorder"
                    checked={boxBorder}
                    onChange={(e) => onChange({ boxBorder: e.target.checked })}
                  />
                  <Label htmlFor="boxBorder">Border</Label>
                </div>
                {boxBorder && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Border Color</Label>
                      <Input
                        type="color"
                        value={boxBorderColor}
                        onChange={(e) => onChange({ boxBorderColor: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Border Width (px)</Label>
                      <Input
                        type="number"
                        value={boxBorderWidth}
                        onChange={(e) => onChange({ boxBorderWidth: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Divider Styling (conditional) */}
            {itemStyle === 'dividers' && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-sm">Divider Styling</h4>
                <div>
                  <Label>Divider Color</Label>
                  <Input
                    type="color"
                    value={dividerColor}
                    onChange={(e) => onChange({ dividerColor: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Divider Width: {dividerWidth}px</Label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={dividerWidth}
                    onChange={(e) => onChange({ dividerWidth: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Typography */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setTypographyExpanded(!typographyExpanded)}
        >
          <span className="font-medium">Typography</span>
          {typographyExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {typographyExpanded && (
          <div className="p-4 space-y-4 border-t">
            <h4 className="font-medium text-sm">Question</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={questionFontSize}
                  onChange={(e) => onChange({ questionFontSize: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Color</Label>
                <Input
                  type="color"
                  value={questionColor}
                  onChange={(e) => onChange({ questionColor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Font Weight</Label>
              <Select value={questionFontWeight.toString()} onValueChange={(val) => onChange({ questionFontWeight: parseInt(val) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400">Normal (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semi-Bold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Alignment</Label>
              {getAlignmentButtons(questionAlignment, (val) => onChange({ questionAlignment: val }))}
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm mb-4">Answer</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Font Size (px)</Label>
                  <Input
                    type="number"
                    value={answerFontSize}
                    onChange={(e) => onChange({ answerFontSize: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={answerColor}
                    onChange={(e) => onChange({ answerColor: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label>Font Weight</Label>
                <Select value={answerFontWeight.toString()} onValueChange={(val) => onChange({ answerFontWeight: parseInt(val) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi-Bold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4">
                <Label>Alignment</Label>
                {getAlignmentButtons(answerAlignment, (val) => onChange({ answerAlignment: val }))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacing */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setSpacingExpanded(!spacingExpanded)}
        >
          <span className="font-medium">Spacing</span>
          {spacingExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {spacingExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div>
              <Label>Item Gap: {itemGap}px</Label>
              <input
                type="range"
                min="0"
                max="48"
                value={itemGap}
                onChange={(e) => onChange({ itemGap: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <Label>Question/Answer Gap: {questionAnswerGap}px</Label>
              <input
                type="range"
                min="0"
                max="32"
                value={questionAnswerGap}
                onChange={(e) => onChange({ questionAnswerGap: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <Label>Header Gap: {headerGap}px</Label>
              <input
                type="range"
                min="0"
                max="80"
                value={headerGap}
                onChange={(e) => onChange({ headerGap: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Background */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setBackgroundExpanded(!backgroundExpanded)}
        >
          <span className="font-medium">Background</span>
          {backgroundExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {backgroundExpanded && (
          <div className="p-4 border-t">
            <BackgroundControl
              value={background}
              onChange={(val) => onChange({ background: val })}
            />
          </div>
        )}
      </div>

      {/* Section Layout */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setSectionLayoutExpanded(!sectionLayoutExpanded)}
        >
          <span className="font-medium">Section Layout</span>
          {sectionLayoutExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {sectionLayoutExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div>
              <Label>Section Width</Label>
              <Select
                value={layoutCfg.width}
                onValueChange={(val: 'full' | 'container') => onChange({ layout: { ...layoutCfg, width: val } })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="full">Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Padding</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label className="text-xs">Top</Label>
                  <Input
                    type="number"
                    value={layoutCfg.padding.top}
                    onChange={(e) => onChange({
                      layout: {
                        ...layoutCfg,
                        padding: { ...layoutCfg.padding, top: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    type="number"
                    value={layoutCfg.padding.bottom}
                    onChange={(e) => onChange({
                      layout: {
                        ...layoutCfg,
                        padding: { ...layoutCfg.padding, bottom: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Left</Label>
                  <Input
                    type="number"
                    value={layoutCfg.padding.left}
                    onChange={(e) => onChange({
                      layout: {
                        ...layoutCfg,
                        padding: { ...layoutCfg.padding, left: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Right</Label>
                  <Input
                    type="number"
                    value={layoutCfg.padding.right}
                    onChange={(e) => onChange({
                      layout: {
                        ...layoutCfg,
                        padding: { ...layoutCfg.padding, right: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
