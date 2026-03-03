'use client';

import React, { useState, useEffect } from 'react';
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
import { TypographyControl } from '../controls/TypographyControl';
import { GlobalColorInput } from '../controls/GlobalColorInput';
import { SectionAnimationsControl } from '../controls/SectionAnimationsControl';
import { useWebsiteStore } from '@/lib/stores/website';
import { ResponsiveDevicePicker } from '../controls/ResponsiveControlShell';

interface FAQEditorNewProps {
  widget: FAQWidget;
  onChange: (updates: Partial<FAQWidget>) => void;
}

export function FAQEditorNew({ widget, onChange }: FAQEditorNewProps) {
  const { currentWebsite } = useWebsiteStore();
  const globalStyles = currentWebsite?.globalStyles;

  const [expandedItemIds, setExpandedItemIds] = useState<Set<string>>(new Set());
  
  // Collapsible states
  const [sectionHeaderOpen, setSectionHeaderOpen] = useState(true);
  const [itemsOpen, setItemsOpen] = useState(false);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [spacingOpen, setSpacingOpen] = useState(true);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [sectionHeaderStyleOpen, setSectionHeaderStyleOpen] = useState(false);
  const [questionStyleOpen, setQuestionStyleOpen] = useState(false);
  const [answerStyleOpen, setAnswerStyleOpen] = useState(false);
  const [iconStyleOpen, setIconStyleOpen] = useState(true);
  const [itemStyleOpen, setItemStyleOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [animationsOpen, setAnimationsOpen] = useState(false);

  const CollapsibleSection = ({ 
    title, 
    open, 
    onToggle, 
    showBreakpointIcon = false,
    children 
  }: { 
    title: string; 
    open: boolean; 
    onToggle: () => void; 
    showBreakpointIcon?: boolean;
    children: React.ReactNode;
  }) => (
    <div className="border rounded-lg">
      <button
        type="button"
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
          <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{title}</span>
          {showBreakpointIcon && (
            <div
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <ResponsiveDevicePicker className="h-6 w-6" />
            </div>
          )}
        </div>
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

  // Migration: Convert old widget format to new format on first render
  useEffect(() => {
    let needsUpdate = false;
    const updates: any = {};

    // Migrate heading fontSize
    const headingFontSize = (widget as any).headingFontSize || widget.headingSize;
    if (headingFontSize && typeof headingFontSize !== 'object') {
      if (typeof headingFontSize === 'number') {
        updates.headingFontSize = { value: headingFontSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof headingFontSize === 'string') {
        const match = headingFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.headingFontSize = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    // Migrate question fontSize
    const questionFontSize = widget.questionFontSize;
    if (questionFontSize && typeof questionFontSize !== 'object') {
      if (typeof questionFontSize === 'number') {
        updates.questionFontSizeObj = { value: questionFontSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof questionFontSize === 'string') {
        const match = questionFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.questionFontSizeObj = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    // Migrate answer fontSize
    const answerFontSize = widget.answerFontSize;
    if (answerFontSize && typeof answerFontSize !== 'object') {
      if (typeof answerFontSize === 'number') {
        updates.answerFontSizeObj = { value: answerFontSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof answerFontSize === 'string') {
        const match = answerFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.answerFontSizeObj = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      onChange(updates);
    }
  }, []); // Only run once on mount

  // Get typography configs with proper format handling
  const getSectionHeaderTypography = () => {
    let fontSize = { value: 48, unit: 'px' as const };
    const rawFontSize = (widget as any).headingFontSize || widget.headingSize;
    
    if (rawFontSize) {
      if (typeof rawFontSize === 'object' && rawFontSize.value !== undefined) {
        fontSize = rawFontSize;
      } else if (typeof rawFontSize === 'number') {
        fontSize = { value: rawFontSize, unit: 'px' as const };
      } else if (typeof rawFontSize === 'string') {
        const match = rawFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          fontSize = { value: parseFloat(match[1]), unit: match[2] as any };
        }
      }
    }

    return {
      fontFamily: (widget as any).headingFontFamily || 'Inter',
      fontSize,
      fontWeight: (widget as any).headingFontWeight || widget.headingWeight || '700',
      lineHeight: (widget as any).headingLineHeight || '1.2',
      textTransform: (widget as any).headingTextTransform || 'none' as const,
      letterSpacing: (widget as any).headingLetterSpacing || '-0.02em',
      color: widget.headingColor || '#1f2937',
      useGlobalStyle: (widget as any).headingUseGlobalStyle,
      globalStyleId: (widget as any).headingGlobalStyleId,
    };
  };

  const getQuestionTypography = () => {
    let fontSize = { value: 18, unit: 'px' as const };
    const rawFontSize = (widget as any).questionFontSizeObj || widget.questionFontSize;
    
    if (rawFontSize) {
      if (typeof rawFontSize === 'object' && rawFontSize.value !== undefined) {
        fontSize = rawFontSize;
      } else if (typeof rawFontSize === 'number') {
        fontSize = { value: rawFontSize, unit: 'px' as const };
      } else if (typeof rawFontSize === 'string') {
        const match = rawFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          fontSize = { value: parseFloat(match[1]), unit: match[2] as any };
        }
      }
    }

    return {
      fontFamily: (widget as any).questionFontFamily || 'Inter',
      fontSize,
      fontWeight: (widget as any).questionFontWeightStr || String(widget.questionFontWeight || '600'),
      lineHeight: (widget as any).questionLineHeight || '1.5',
      textTransform: (widget as any).questionTextTransform || 'none' as const,
      letterSpacing: (widget as any).questionLetterSpacing || '0em',
      color: widget.questionColor || '#1f2937',
      useGlobalStyle: (widget as any).questionUseGlobalStyle,
      globalStyleId: (widget as any).questionGlobalStyleId,
    };
  };

  const getAnswerTypography = () => {
    let fontSize = { value: 16, unit: 'px' as const };
    const rawFontSize = (widget as any).answerFontSizeObj || widget.answerFontSize;
    
    if (rawFontSize) {
      if (typeof rawFontSize === 'object' && rawFontSize.value !== undefined) {
        fontSize = rawFontSize;
      } else if (typeof rawFontSize === 'number') {
        fontSize = { value: rawFontSize, unit: 'px' as const };
      } else if (typeof rawFontSize === 'string') {
        const match = rawFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          fontSize = { value: parseFloat(match[1]), unit: match[2] as any };
        }
      }
    }

    return {
      fontFamily: (widget as any).answerFontFamily || 'Inter',
      fontSize,
      fontWeight: (widget as any).answerFontWeightStr || String(widget.answerFontWeight || '400'),
      lineHeight: (widget as any).answerLineHeight || '1.6',
      textTransform: (widget as any).answerTextTransform || 'none' as const,
      letterSpacing: (widget as any).answerLetterSpacing || '0em',
      color: widget.answerColor || '#6b7280',
      useGlobalStyle: (widget as any).answerUseGlobalStyle,
      globalStyleId: (widget as any).answerGlobalStyleId,
    };
  };

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
      <CollapsibleSection showBreakpointIcon title="Spacing" open={spacingOpen} onToggle={() => setSpacingOpen(!spacingOpen)}>
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
      <CollapsibleSection showBreakpointIcon title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
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
      <CollapsibleSection showBreakpointIcon title="Section Width" open={sectionWidthOpen} onToggle={() => setSectionWidthOpen(!sectionWidthOpen)}>
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
      <CollapsibleSection showBreakpointIcon title="Padding" open={paddingOpen} onToggle={() => setPaddingOpen(!paddingOpen)}>
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
      {/* Section Header Typography */}
      <TypographyControl
        label="Section Header Typography"
        defaultOpen={true}
        value={getSectionHeaderTypography()}
        responsiveFontSize={(widget as any).headingFontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({ headingFontSizeResponsive: next } as any)}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.headingFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) {
            widgetUpdate.headingFontSize = updates.fontSize;
            widgetUpdate.headingSize = updates.fontSize; // Keep both for compatibility
          }
          if (updates.fontWeight !== undefined) {
            widgetUpdate.headingFontWeight = updates.fontWeight;
            widgetUpdate.headingWeight = updates.fontWeight; // Keep both for compatibility
          }
          if (updates.lineHeight !== undefined) widgetUpdate.headingLineHeight = updates.lineHeight;
          if (updates.textTransform !== undefined) widgetUpdate.headingTextTransform = updates.textTransform;
          if (updates.letterSpacing !== undefined) widgetUpdate.headingLetterSpacing = updates.letterSpacing;
          if (updates.color !== undefined) widgetUpdate.headingColor = updates.color;
          if (updates.useGlobalStyle !== undefined) widgetUpdate.headingUseGlobalStyle = updates.useGlobalStyle;
          if (updates.globalStyleId !== undefined) widgetUpdate.headingGlobalStyleId = updates.globalStyleId;
          onChange(widgetUpdate);
        }}
        showGlobalStyleSelector={true}
        globalStyles={globalStyles}
        availableGlobalStyles={['h2', 'h3', 'h4']}
      />

      {/* Section Header Alignment */}
      <div className="border rounded-lg p-3">
        <Label className="text-sm font-medium mb-2 block">Section Header Alignment</Label>
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

      {/* Question Typography */}
      <TypographyControl
        label="Question Typography"
        defaultOpen={false}
        value={getQuestionTypography()}
        responsiveFontSize={(widget as any).questionFontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({ questionFontSizeResponsive: next } as any)}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.questionFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) {
            widgetUpdate.questionFontSizeObj = updates.fontSize;
            widgetUpdate.questionFontSize = updates.fontSize; // Keep both for compatibility
          }
          if (updates.fontWeight !== undefined) {
            widgetUpdate.questionFontWeightStr = updates.fontWeight;
            widgetUpdate.questionFontWeight = parseInt(String(updates.fontWeight)); // Keep both for compatibility
          }
          if (updates.lineHeight !== undefined) widgetUpdate.questionLineHeight = updates.lineHeight;
          if (updates.textTransform !== undefined) widgetUpdate.questionTextTransform = updates.textTransform;
          if (updates.letterSpacing !== undefined) widgetUpdate.questionLetterSpacing = updates.letterSpacing;
          if (updates.color !== undefined) widgetUpdate.questionColor = updates.color;
          if (updates.useGlobalStyle !== undefined) widgetUpdate.questionUseGlobalStyle = updates.useGlobalStyle;
          if (updates.globalStyleId !== undefined) widgetUpdate.questionGlobalStyleId = updates.globalStyleId;
          onChange(widgetUpdate);
        }}
        showGlobalStyleSelector={true}
        globalStyles={globalStyles}
        availableGlobalStyles={['h3', 'h4', 'h5', 'body']}
      />

      {/* Answer Typography */}
      <TypographyControl
        label="Answer Typography"
        defaultOpen={false}
        value={getAnswerTypography()}
        responsiveFontSize={(widget as any).answerFontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({ answerFontSizeResponsive: next } as any)}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.answerFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) {
            widgetUpdate.answerFontSizeObj = updates.fontSize;
            widgetUpdate.answerFontSize = updates.fontSize; // Keep both for compatibility
          }
          if (updates.fontWeight !== undefined) {
            widgetUpdate.answerFontWeightStr = updates.fontWeight;
            widgetUpdate.answerFontWeight = parseInt(String(updates.fontWeight)); // Keep both for compatibility
          }
          if (updates.lineHeight !== undefined) widgetUpdate.answerLineHeight = updates.lineHeight;
          if (updates.textTransform !== undefined) widgetUpdate.answerTextTransform = updates.textTransform;
          if (updates.letterSpacing !== undefined) widgetUpdate.answerLetterSpacing = updates.letterSpacing;
          if (updates.color !== undefined) widgetUpdate.answerColor = updates.color;
          if (updates.useGlobalStyle !== undefined) widgetUpdate.answerUseGlobalStyle = updates.useGlobalStyle;
          if (updates.globalStyleId !== undefined) widgetUpdate.answerGlobalStyleId = updates.globalStyleId;
          onChange(widgetUpdate);
        }}
        showGlobalStyleSelector={true}
        globalStyles={globalStyles}
        availableGlobalStyles={['body']}
      />

      {/* Icon Style */}
      <CollapsibleSection showBreakpointIcon title="Icon Style" open={iconStyleOpen} onToggle={() => setIconStyleOpen(!iconStyleOpen)}>
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
            <GlobalColorInput
              value={widget.iconColor}
              onChange={(nextColor) => onChange({ iconColor: nextColor })}
              globalStyles={globalStyles}
              defaultColor="#10b981"
              placeholder="#10b981"
            />
          </div>
          <div className="space-y-2">
            <Label>Icon Background</Label>
            <GlobalColorInput
              value={widget.iconBackgroundColor}
              onChange={(nextColor) => onChange({ iconBackgroundColor: nextColor })}
              globalStyles={globalStyles}
              defaultColor="#d1fae5"
              placeholder="#d1fae5"
            />
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
      <CollapsibleSection showBreakpointIcon title="Item Style" open={itemStyleOpen} onToggle={() => setItemStyleOpen(!itemStyleOpen)}>
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
                <GlobalColorInput
                  value={widget.boxBackgroundColor}
                  onChange={(nextColor) => onChange({ boxBackgroundColor: nextColor })}
                  globalStyles={globalStyles}
                  defaultColor="#f9fafb"
                  placeholder="#f9fafb"
                />
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
                <GlobalColorInput
                  value={widget.dividerColor}
                  onChange={(nextColor) => onChange({ dividerColor: nextColor })}
                  globalStyles={globalStyles}
                  defaultColor="#e5e7eb"
                  placeholder="#e5e7eb"
                />
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
      <CollapsibleSection showBreakpointIcon title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
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
              <GlobalColorInput
                value={background.color}
                onChange={(nextColor) => onChange({ background: { ...background, color: nextColor } })}
                globalStyles={globalStyles}
                defaultColor="#ffffff"
                placeholder="transparent"
              />
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection showBreakpointIcon title="Animations" open={animationsOpen} onToggle={() => setAnimationsOpen(!animationsOpen)}>
        <SectionAnimationsControl
          sectionType="faq"
          widget={widget as any}
          onChange={(updates) => onChange(updates as any)}
          globalStyles={globalStyles}
        />
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
