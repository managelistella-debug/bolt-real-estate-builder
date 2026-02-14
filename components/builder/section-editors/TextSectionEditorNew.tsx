'use client';

import React, { useState, useEffect } from 'react';
import { TextSectionWidget } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { TypographyControl } from '../controls/TypographyControl';
import { ButtonControl } from '../controls/ButtonControl';
import { GlobalColorInput } from '../controls/GlobalColorInput';
import { cn } from '@/lib/utils';
import { useDebouncedInput } from '../hooks/useDebouncedInput';
import { useWebsiteStore } from '@/lib/stores/website';

interface TextSectionEditorNewProps {
  widget: TextSectionWidget;
  onChange: (updates: Partial<TextSectionWidget>) => void;
}

export function TextSectionEditorNew({ widget, onChange }: TextSectionEditorNewProps) {
  const { currentWebsite } = useWebsiteStore();
  const globalStyles = currentWebsite?.globalStyles;

  // Debounced inputs for smooth typing
  const [headingValue, , headingChange, headingBlur] = useDebouncedInput(
    widget.heading,
    (value) => onChange({ heading: value })
  );
  
  const [bodyValue, , bodyChange, bodyBlur] = useDebouncedInput(
    widget.bodyText,
    (value) => onChange({ bodyText: value })
  );

  // Collapsible states
  const [buttonOpen, setButtonOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [layoutTypeOpen, setLayoutTypeOpen] = useState(false);
  const [alignmentOpen, setAlignmentOpen] = useState(false);

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

  // Get layout config with defaults
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

  // Migration: Convert old widget format to new format on first render
  useEffect(() => {
    let needsUpdate = false;
    const updates: any = {};

    // Migrate heading fontSize
    const headingFontSize = (widget as any).headingFontSize;
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

    // Migrate tagline fontSize
    const taglineFontSize = (widget as any).taglineFontSize;
    if (taglineFontSize && typeof taglineFontSize !== 'object') {
      if (typeof taglineFontSize === 'number') {
        updates.taglineFontSize = { value: taglineFontSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof taglineFontSize === 'string') {
        const match = taglineFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.taglineFontSize = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    // Migrate body fontSize
    const bodyFontSize = (widget as any).bodyFontSize;
    if (bodyFontSize && typeof bodyFontSize !== 'object') {
      if (typeof bodyFontSize === 'number') {
        updates.bodyFontSize = { value: bodyFontSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof bodyFontSize === 'string') {
        const match = bodyFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.bodyFontSize = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    // Migrate button fontSize
    const buttonFontSize = (widget as any).buttonFontSize;
    if (buttonFontSize && typeof buttonFontSize !== 'object') {
      if (typeof buttonFontSize === 'number') {
        updates.buttonFontSize = { value: buttonFontSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof buttonFontSize === 'string') {
        const match = buttonFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.buttonFontSize = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    // Migrate button properties to unified button object
    if (!(widget as any).button && widget.buttonText) {
      const buttonStyle = widget.buttonStyle || {};
      let buttonFontSize = { value: 16, unit: 'px' as const };
      const rawButtonFontSize = (widget as any).buttonFontSize;
      
      if (rawButtonFontSize) {
        if (typeof rawButtonFontSize === 'object' && rawButtonFontSize.value !== undefined) {
          buttonFontSize = rawButtonFontSize;
        } else if (typeof rawButtonFontSize === 'number') {
          buttonFontSize = { value: rawButtonFontSize, unit: 'px' as const };
        } else if (typeof rawButtonFontSize === 'string') {
          const match = rawButtonFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
          if (match) {
            buttonFontSize = { value: parseFloat(match[1]), unit: match[2] as any };
          }
        }
      }

      updates.button = {
        text: widget.buttonText || '',
        url: widget.buttonUrl || '',
        width: (widget as any).buttonWidth || 'auto',
        customWidth: (widget as any).buttonCustomWidth,
        backgroundColor: buttonStyle.backgroundColor || '#10b981',
        textColor: buttonStyle.textColor || '#ffffff',
        borderRadius: buttonStyle.borderRadius ?? 8,
        borderWidth: buttonStyle.borderWidth ?? 0,
        borderColor: buttonStyle.borderColor || '#000000',
        backgroundOpacity: buttonStyle.backgroundOpacity ?? 100,
        dropShadow: buttonStyle.shadow !== false,
        shadowAmount: (buttonStyle as any).shadowAmount || 4,
        blurEffect: buttonStyle.blur || 0,
        fontFamily: (widget as any).buttonFontFamily || 'Inter',
        fontSize: buttonFontSize,
        fontWeight: (widget as any).buttonFontWeight || '600',
        lineHeight: (widget as any).buttonLineHeight || '1.5',
        textTransform: (widget as any).buttonTextTransform || 'none',
        letterSpacing: (widget as any).buttonLetterSpacing || '0em',
        hover: (widget as any).buttonHover || {
          backgroundColor: undefined,
          textColor: undefined,
          borderColor: undefined,
          backgroundOpacity: undefined,
          scale: 1.05,
        },
        useGlobalStyle: (widget as any).buttonUseGlobalStyle ?? true,
        globalStyleId: (widget as any).buttonGlobalStyleId ?? 'button1',
      };
      needsUpdate = true;
    }

    if (needsUpdate) {
      onChange(updates);
    }
  }, []); // Only run once on mount

  // Get typography configs with proper format handling
  const getHeadingTypography = () => {
    let fontSize = { value: 48, unit: 'px' as const };
    const rawFontSize = (widget as any).headingFontSize;
    
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
      fontWeight: String((widget as any).headingFontWeight || (widget as any).headingWeight || '700'),
      lineHeight: (widget as any).headingLineHeight || '1.2',
      textTransform: (widget as any).headingTextTransform || 'none' as const,
      letterSpacing: (widget as any).headingLetterSpacing || '-0.02em',
      color: widget.headingColor || '#1f2937',
      useGlobalStyle: (widget as any).headingUseGlobalStyle,
      globalStyleId: (widget as any).headingGlobalStyleId,
    };
  };

  const getTaglineTypography = () => {
    let fontSize = { value: 14, unit: 'px' as const };
    const rawFontSize = (widget as any).taglineFontSize;
    
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
      fontFamily: (widget as any).taglineFontFamily || 'Inter',
      fontSize,
      fontWeight: String((widget as any).taglineFontWeight || (widget as any).taglineWeight || '600'),
      lineHeight: (widget as any).taglineLineHeight || '1.4',
      textTransform: (widget as any).taglineTextTransform || 'uppercase' as const,
      letterSpacing: (widget as any).taglineLetterSpacing || '0em',
      color: widget.taglineColor || '#10b981',
      useGlobalStyle: (widget as any).taglineUseGlobalStyle,
      globalStyleId: (widget as any).taglineGlobalStyleId,
    };
  };

  const getBodyTypography = () => {
    let fontSize = { value: 16, unit: 'px' as const };
    const rawFontSize = (widget as any).bodyFontSize;
    
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
      fontFamily: (widget as any).bodyFontFamily || 'Inter',
      fontSize,
      fontWeight: String((widget as any).bodyFontWeight || (widget as any).bodyWeight || '400'),
      lineHeight: (widget as any).bodyLineHeight || '1.6',
      textTransform: (widget as any).bodyTextTransform || 'none' as const,
      letterSpacing: (widget as any).bodyLetterSpacing || '0em',
      color: widget.bodyTextColor || '#6b7280',
      useGlobalStyle: (widget as any).bodyUseGlobalStyle,
      globalStyleId: (widget as any).bodyGlobalStyleId,
    };
  };

  // Get button config
  const getButtonConfig = () => {
    // Prioritize reading from widget.button if it exists
    if ((widget as any).button) {
      return (widget as any).button;
    }

    // Fallback: construct from old fragmented properties
    const buttonStyle = widget.buttonStyle || {};
    let buttonFontSize = { value: 16, unit: 'px' as const };
    const rawButtonFontSize = (widget as any).buttonFontSize;
    
    if (rawButtonFontSize) {
      if (typeof rawButtonFontSize === 'object' && rawButtonFontSize.value !== undefined) {
        buttonFontSize = rawButtonFontSize;
      } else if (typeof rawButtonFontSize === 'number') {
        buttonFontSize = { value: rawButtonFontSize, unit: 'px' as const };
      } else if (typeof rawButtonFontSize === 'string') {
        const match = rawButtonFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          buttonFontSize = { value: parseFloat(match[1]), unit: match[2] as any };
        }
      }
    }

    return {
      text: widget.buttonText || '',
      url: widget.buttonUrl || '',
      width: (widget as any).buttonWidth || 'auto',
      customWidth: (widget as any).buttonCustomWidth,
      backgroundColor: buttonStyle.backgroundColor || '#10b981',
      textColor: buttonStyle.textColor || '#ffffff',
      borderRadius: buttonStyle.borderRadius ?? 8,
      borderWidth: buttonStyle.borderWidth ?? 0,
      borderColor: buttonStyle.borderColor || '#000000',
      backgroundOpacity: buttonStyle.backgroundOpacity ?? 100,
      dropShadow: buttonStyle.shadow !== false,
      shadowAmount: (buttonStyle as any).shadowAmount || 4,
      blurEffect: buttonStyle.blur || 0,
      fontFamily: (widget as any).buttonFontFamily || 'Inter',
      fontSize: buttonFontSize,
      fontWeight: (widget as any).buttonFontWeight || '600',
      lineHeight: (widget as any).buttonLineHeight || '1.5',
      textTransform: (widget as any).buttonTextTransform || 'none',
      letterSpacing: (widget as any).buttonLetterSpacing || '0em',
      hover: (widget as any).buttonHover || {
        backgroundColor: undefined,
        textColor: undefined,
        borderColor: undefined,
        backgroundOpacity: undefined,
        scale: 1.05,
      },
      useGlobalStyle: (widget as any).buttonUseGlobalStyle ?? true,
      globalStyleId: (widget as any).buttonGlobalStyleId ?? 'button1',
    };
  };

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Heading */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Heading</Label>
          <Select
            value={(widget as any).headingHeaderTag || 'h2'}
            onValueChange={(value: any) => onChange({ headingHeaderTag: value } as any)}
          >
            <SelectTrigger className="w-20 h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h1">H1</SelectItem>
              <SelectItem value="h2">H2</SelectItem>
              <SelectItem value="h3">H3</SelectItem>
              <SelectItem value="h4">H4</SelectItem>
              <SelectItem value="p">P</SelectItem>
              <SelectItem value="div">Div</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          value={headingValue}
          onChange={headingChange}
          onBlur={headingBlur}
          placeholder="Enter your heading..."
          rows={2}
        />
      </div>

      {/* Subheader (Tagline) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Subheader (Optional)</Label>
          <Select
            value={(widget as any).taglineHeaderTag || 'p'}
            onValueChange={(value: any) => onChange({ taglineHeaderTag: value } as any)}
          >
            <SelectTrigger className="w-20 h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">P</SelectItem>
              <SelectItem value="h3">H3</SelectItem>
              <SelectItem value="h4">H4</SelectItem>
              <SelectItem value="div">Div</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          value={widget.tagline || ''}
          onChange={(e) => onChange({ tagline: e.target.value })}
          placeholder="e.g., LOCAL. RELIABLE. PROFESSIONAL."
        />
      </div>

      {/* Body Text */}
      <div className="space-y-2">
        <Label>Body Text</Label>
        <Textarea
          value={bodyValue}
          onChange={bodyChange}
          onBlur={bodyBlur}
          placeholder="Enter your body text..."
          rows={5}
        />
      </div>

      {/* Button Collapsible */}
      <CollapsibleSection title="Button" open={buttonOpen} onToggle={() => setButtonOpen(!buttonOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={widget.buttonText || ''}
              onChange={(e) => onChange({ buttonText: e.target.value })}
              placeholder="e.g., Get in Touch"
            />
            <p className="text-xs text-muted-foreground">Leave empty to hide the button</p>
          </div>
          {widget.buttonText && widget.buttonText.trim() !== '' && (
            <div className="space-y-2">
              <Label>Button URL</Label>
              <Input
                value={widget.buttonUrl || ''}
                onChange={(e) => onChange({ buttonUrl: e.target.value })}
                placeholder="/contact"
              />
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  // Layout Tab
  const layoutTab = (
    <div className="space-y-2">
      {/* Section Height */}
      <CollapsibleSection title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
        <div className="flex gap-2">
          <Select
            value={layoutCfg.height.type || 'auto'}
            onValueChange={(value: 'auto' | 'vh' | 'percentage' | 'pixels') => onChange({
              layout: {
                ...layoutCfg,
                height: { ...layoutCfg.height, type: value }
              } as any
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
          {layoutCfg.height.type !== 'auto' && (
            <Input
              type="number"
              value={layoutCfg.height.value || 100}
              onChange={(e) => onChange({
                layout: {
                  ...layoutCfg,
                  height: { ...layoutCfg.height, value: parseInt(e.target.value) }
                } as any
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
          onValueChange={(value: 'full' | 'container') => onChange({
            layout: { ...layoutCfg, width: value } as any
          })}
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
          <div className="space-y-1">
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              value={layoutCfg.padding.top || 80}
              onChange={(e) => onChange({
                layout: {
                  ...layoutCfg,
                  padding: { ...layoutCfg.padding, top: parseInt(e.target.value) }
                } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={layoutCfg.padding.right || 20}
              onChange={(e) => onChange({
                layout: {
                  ...layoutCfg,
                  padding: { ...layoutCfg.padding, right: parseInt(e.target.value) }
                } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={layoutCfg.padding.bottom || 80}
              onChange={(e) => onChange({
                layout: {
                  ...layoutCfg,
                  padding: { ...layoutCfg.padding, bottom: parseInt(e.target.value) }
                } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={layoutCfg.padding.left || 20}
              onChange={(e) => onChange({
                layout: {
                  ...layoutCfg,
                  padding: { ...layoutCfg.padding, left: parseInt(e.target.value) }
                } as any
              })}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Layout Type */}
      <CollapsibleSection title="Layout Type" open={layoutTypeOpen} onToggle={() => setLayoutTypeOpen(!layoutTypeOpen)}>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={widget.layout === 'side-by-side' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ layout: 'side-by-side' })}
            className="flex-col h-auto py-3"
          >
            <div className="font-medium text-xs">Side by Side</div>
            <div className="text-xs opacity-70 mt-1">Heading left, text right</div>
          </Button>
          <Button
            variant={widget.layout === 'stacked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ layout: 'stacked' })}
            className="flex-col h-auto py-3"
          >
            <div className="font-medium text-xs">Stacked</div>
            <div className="text-xs opacity-70 mt-1">Heading above text</div>
          </Button>
        </div>

        {widget.layout === 'side-by-side' && (
          <div className="space-y-3 mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reverse-order"
                checked={widget.reverseOrder || false}
                onCheckedChange={(checked) => onChange({ reverseOrder: !!checked })}
              />
              <Label htmlFor="reverse-order" className="text-sm font-normal">Reverse Order</Label>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Column Gap: {widget.columnGap ?? 60}px</Label>
              <input
                type="range"
                min="0"
                max="80"
                value={widget.columnGap ?? 60}
                onChange={(e) => onChange({ columnGap: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Heading Width: {widget.headingColumnWidth ?? 40}%</Label>
              <input
                type="range"
                min="30"
                max="70"
                value={widget.headingColumnWidth ?? 40}
                onChange={(e) => onChange({ headingColumnWidth: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {widget.layout === 'stacked' && (
          <div className="space-y-2 mt-3">
            <Label className="text-xs">Row Gap: {widget.rowGap ?? 24}px</Label>
            <input
              type="range"
              min="0"
              max="60"
              value={widget.rowGap ?? 24}
              onChange={(e) => onChange({ rowGap: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        )}
      </CollapsibleSection>

      {/* Alignment */}
      <CollapsibleSection title="Alignment" open={alignmentOpen} onToggle={() => setAlignmentOpen(!alignmentOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Heading Alignment</Label>
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
          <div className="space-y-2">
            <Label className="text-xs">Body Alignment</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={widget.bodyAlignment === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ bodyAlignment: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={widget.bodyAlignment === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ bodyAlignment: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={widget.bodyAlignment === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ bodyAlignment: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Style Tab
  const styleTab = (
    <div className="space-y-3">
      {/* Heading Typography */}
      <TypographyControl
        label="Heading Typography"
        value={getHeadingTypography()}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.headingFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) widgetUpdate.headingFontSize = updates.fontSize;
          if (updates.fontWeight !== undefined) widgetUpdate.headingFontWeight = updates.fontWeight;
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
        availableGlobalStyles={['h1', 'h2', 'h3', 'h4']}
      />

      {/* Subheader Typography */}
      {widget.tagline && (
        <TypographyControl
          label="Subheader Typography"
          value={getTaglineTypography()}
          onChange={(updates) => {
            const widgetUpdate: any = {};
            if (updates.fontFamily !== undefined) widgetUpdate.taglineFontFamily = updates.fontFamily;
            if (updates.fontSize !== undefined) widgetUpdate.taglineFontSize = updates.fontSize;
            if (updates.fontWeight !== undefined) widgetUpdate.taglineFontWeight = updates.fontWeight;
            if (updates.lineHeight !== undefined) widgetUpdate.taglineLineHeight = updates.lineHeight;
            if (updates.textTransform !== undefined) widgetUpdate.taglineTextTransform = updates.textTransform;
            if (updates.letterSpacing !== undefined) widgetUpdate.taglineLetterSpacing = updates.letterSpacing;
            if (updates.color !== undefined) widgetUpdate.taglineColor = updates.color;
            if (updates.useGlobalStyle !== undefined) widgetUpdate.taglineUseGlobalStyle = updates.useGlobalStyle;
            if (updates.globalStyleId !== undefined) widgetUpdate.taglineGlobalStyleId = updates.globalStyleId;
            onChange(widgetUpdate);
          }}
          showGlobalStyleSelector={true}
          globalStyles={globalStyles}
          availableGlobalStyles={['h3', 'h4', 'h5', 'h6', 'body']}
        />
      )}

      {/* Body Typography */}
      <TypographyControl
        label="Body Text Typography"
        value={getBodyTypography()}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.bodyFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) widgetUpdate.bodyFontSize = updates.fontSize;
          if (updates.fontWeight !== undefined) widgetUpdate.bodyFontWeight = updates.fontWeight;
          if (updates.lineHeight !== undefined) widgetUpdate.bodyLineHeight = updates.lineHeight;
          if (updates.textTransform !== undefined) widgetUpdate.bodyTextTransform = updates.textTransform;
          if (updates.letterSpacing !== undefined) widgetUpdate.bodyLetterSpacing = updates.letterSpacing;
          if (updates.color !== undefined) widgetUpdate.bodyTextColor = updates.color;
          if (updates.useGlobalStyle !== undefined) widgetUpdate.bodyUseGlobalStyle = updates.useGlobalStyle;
          if (updates.globalStyleId !== undefined) widgetUpdate.bodyGlobalStyleId = updates.globalStyleId;
          onChange(widgetUpdate);
        }}
        showGlobalStyleSelector={true}
        globalStyles={globalStyles}
        availableGlobalStyles={['body']}
      />

      {/* Background */}
      <CollapsibleSection title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={widget.background?.type || 'color'}
              onValueChange={(value: 'color' | 'image' | 'video' | 'gradient') => onChange({
                background: { ...widget.background, type: value } as any
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

          {widget.background?.type === 'color' && (
            <div className="space-y-2">
              <Label>Color</Label>
              <GlobalColorInput
                value={widget.background?.color}
                onChange={(nextColor) => onChange({
                  background: { ...widget.background, color: nextColor } as any
                })}
                globalStyles={globalStyles}
                defaultColor="#ffffff"
                placeholder="transparent"
              />
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Button Styling */}
      {widget.buttonText && widget.buttonText.trim() !== '' && (
        <div className="border rounded-lg p-3">
          <ButtonControl
            headerLabel="Button Styling"
            value={getButtonConfig()}
            onChange={(updates) => {
              // Save all button properties into the unified button object
              const currentButton = (widget as any).button || getButtonConfig();
              const updatedButton = { ...currentButton, ...updates };
              onChange({ button: updatedButton } as any);
            }}
            showGlobalStyleSelector={true}
            globalStyles={globalStyles}
          />
        </div>
      )}
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="text-section"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
