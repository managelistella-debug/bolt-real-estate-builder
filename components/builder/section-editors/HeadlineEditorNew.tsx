'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { HeadlineWidget } from '@/lib/types';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
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
import { ResponsiveDevicePicker } from '../controls/ResponsiveControlShell';

interface HeadlineEditorNewProps {
  widget: HeadlineWidget;
  onChange: (updates: Partial<HeadlineWidget>) => void;
}

export function HeadlineEditorNew({ widget, onChange }: HeadlineEditorNewProps) {
  const { currentWebsite } = useWebsiteStore();
  const globalStyles = currentWebsite?.globalStyles;

  // Debounced inputs for smooth typing
  const [titleValue, , titleChange, titleBlur] = useDebouncedInput(
    widget.title,
    (value) => onChange({ title: value })
  );
  
  const [subtitleValue, , subtitleChange, subtitleBlur] = useDebouncedInput(
    widget.subtitle || '',
    (value) => onChange({ subtitle: value })
  );
  
  const [buttonTextValue, , buttonTextChange, buttonTextBlur] = useDebouncedInput(
    widget.button?.text || '',
    (value) => onChange({ button: { ...widget.button, text: value } as any })
  );
  
  const [buttonUrlValue, , buttonUrlChange, buttonUrlBlur] = useDebouncedInput(
    widget.button?.url || '',
    (value) => onChange({ button: { ...widget.button, url: value } as any })
  );

  // Collapsible states
  const [backgroundOpen, setBackgroundOpen] = useState(true);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(true);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [horizontalAlignOpen, setHorizontalAlignOpen] = useState(false);
  const [verticalAlignOpen, setVerticalAlignOpen] = useState(false);

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

  // Migration: Convert old widget format to new format on first render
  useEffect(() => {
    let needsUpdate = false;
    const updates: any = {};

    // Migrate title fontSize if in old format
    if (widget.titleSize && typeof widget.titleSize !== 'object') {
      if (typeof widget.titleSize === 'number') {
        updates.titleSize = { value: widget.titleSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof widget.titleSize === 'string') {
        const match = widget.titleSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.titleSize = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    // Migrate subtitle fontSize if in old format
    if (widget.subtitleSize && typeof widget.subtitleSize !== 'object') {
      if (typeof widget.subtitleSize === 'number') {
        updates.subtitleSize = { value: widget.subtitleSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof widget.subtitleSize === 'string') {
        const match = widget.subtitleSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.subtitleSize = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    // Migrate button fontSize if in old format
    if (widget.buttonFontSize && typeof widget.buttonFontSize !== 'object') {
      if (typeof widget.buttonFontSize === 'number') {
        updates.buttonFontSize = { value: widget.buttonFontSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof widget.buttonFontSize === 'string') {
        const match = widget.buttonFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.buttonFontSize = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      onChange(updates);
    }
  }, []); // Only run once on mount

  // Get title typography config
  const getTitleTypography = () => {
    let fontSize = { value: 48, unit: 'px' as const };
    const rawFontSize = widget.titleSize;
    
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
      fontFamily: widget.titleFontFamily || 'Inter',
      fontSize,
      fontWeight: widget.titleFontWeight || '700',
      lineHeight: widget.titleLineHeight || '1.2',
      textTransform: widget.titleTextTransform || 'none' as const,
      letterSpacing: widget.titleLetterSpacing || '-0.02em',
      color: widget.titleColor || '#1f2937',
      useGlobalStyle: (widget as any).titleUseGlobalStyle,
      globalStyleId: (widget as any).titleGlobalStyleId,
    };
  };

  // Get subtitle typography config
  const getSubtitleTypography = () => {
    let fontSize = { value: 20, unit: 'px' as const };
    const rawFontSize = widget.subtitleSize;
    
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
      fontFamily: widget.subtitleFontFamily || 'Inter',
      fontSize,
      fontWeight: widget.subtitleFontWeight || '400',
      lineHeight: widget.subtitleLineHeight || '1.5',
      textTransform: widget.subtitleTextTransform || 'none' as const,
      letterSpacing: widget.subtitleLetterSpacing || '0em',
      color: widget.subtitleColor || '#6b7280',
      useGlobalStyle: (widget as any).subtitleUseGlobalStyle,
      globalStyleId: (widget as any).subtitleGlobalStyleId,
    };
  };

  // Get button config
  const getButtonConfig = () => {
    let buttonFontSize = { value: 16, unit: 'px' as const };
    const rawButtonFontSize = widget.buttonFontSize;
    
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
      text: widget.button?.text || '',
      url: widget.button?.url || '',
      openNewTab: widget.button?.openNewTab,
      width: widget.buttonWidth || 'standard' as const,
      backgroundColor: widget.buttonBgColor || '#3b82f6',
      textColor: widget.buttonTextColor || '#ffffff',
      borderRadius: widget.buttonBorderRadius || 42,
      borderWidth: widget.buttonBorderWidth || 0,
      borderColor: widget.buttonBorderColor,
      backgroundOpacity: widget.buttonBgOpacity || 100,
      dropShadow: widget.buttonDropShadow !== false,
      shadowAmount: widget.buttonShadowAmount || 4,
      blurEffect: widget.buttonBlurEffect || 0,
      fontFamily: widget.buttonFontFamily || 'Inter',
      fontSize: buttonFontSize,
      fontWeight: widget.buttonFontWeight || '600',
      lineHeight: widget.buttonLineHeight || '1.5',
      textTransform: widget.buttonTextTransform || 'none' as const,
      letterSpacing: widget.buttonLetterSpacing || '0em',
      hover: widget.buttonHover || {},
      useGlobalStyle: widget.buttonUseGlobalStyle,
      globalStyleId: widget.buttonGlobalStyleId,
    };
  };

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Title with tag selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Title</Label>
          <Select
            value={widget.titleHeaderTag || 'h2'}
            onValueChange={(value: any) => onChange({ titleHeaderTag: value })}
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
        <Input
          value={titleValue}
          onChange={titleChange}
          onBlur={titleBlur}
          placeholder="Section Headline"
        />
      </div>

      {/* Subtitle with tag selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Subtitle</Label>
          <Select
            value={widget.subtitleHeaderTag || 'p'}
            onValueChange={(value: any) => onChange({ subtitleHeaderTag: value })}
          >
            <SelectTrigger className="w-20 h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">P</SelectItem>
              <SelectItem value="h2">H2</SelectItem>
              <SelectItem value="h3">H3</SelectItem>
              <SelectItem value="h4">H4</SelectItem>
              <SelectItem value="div">Div</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          value={subtitleValue}
          onChange={subtitleChange}
          onBlur={subtitleBlur}
          placeholder="Optional subtitle"
        />
      </div>

      {/* Button */}
      {widget.button && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Button</Label>
          <div className="space-y-2">
            <Label className="text-xs">Button Text</Label>
            <Input
              value={buttonTextValue}
              onChange={buttonTextChange}
              onBlur={buttonTextBlur}
              placeholder="Click Here"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">URL</Label>
            <Input
              value={buttonUrlValue}
              onChange={buttonUrlChange}
              onBlur={buttonUrlBlur}
              placeholder="https://"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="openNewTab"
              checked={widget.button?.openNewTab || false}
              onCheckedChange={(checked) => onChange({
                button: { ...widget.button, openNewTab: !!checked }
              })}
            />
            <Label htmlFor="openNewTab" className="text-xs">Open in new tab</Label>
          </div>
        </div>
      )}

      {/* Background */}
      <CollapsibleSection title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Background Color</Label>
            <GlobalColorInput
              value={widget.background?.color}
              onChange={(nextColor) => onChange({ background: { ...widget.background, color: nextColor } })}
              globalStyles={globalStyles}
              defaultColor="#ffffff"
              placeholder="#ffffff"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasLink"
              checked={widget.background?.hasLink || false}
              onCheckedChange={(checked) => onChange({
                background: { ...widget.background, hasLink: !!checked }
              })}
            />
            <Label htmlFor="hasLink" className="text-xs">Link to URL</Label>
          </div>
          {widget.background?.hasLink && (
            <div className="space-y-2">
              <Label className="text-xs">Link URL</Label>
              <Input
                value={widget.background?.linkUrl || ''}
                onChange={(e) => onChange({
                  background: { ...widget.background, linkUrl: e.target.value }
                })}
                placeholder="https://"
                className="h-9"
              />
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  // Layout Tab
  const layoutTab = (
    <div className="space-y-3">
      {/* Section Height */}
      <CollapsibleSection showBreakpointIcon title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
        <div className="space-y-2">
          <Label className="text-xs">Height Type</Label>
          <Select
            value={widget.height?.type || 'auto'}
            onValueChange={(value: any) => onChange({
              height: { ...widget.height, type: value }
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="vh">Viewport Height (vh)</SelectItem>
              <SelectItem value="pixels">Pixels</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {widget.height?.type !== 'auto' && (
          <div className="space-y-2">
            <Label className="text-xs">Height Value</Label>
            <Input
              type="number"
              value={widget.height?.value || 500}
              onChange={(e) => onChange({
                height: { ...widget.height, value: parseInt(e.target.value) }
              })}
              className="h-9"
            />
          </div>
        )}
      </CollapsibleSection>

      {/* Padding */}
      <CollapsibleSection showBreakpointIcon title="Padding" open={paddingOpen} onToggle={() => setPaddingOpen(!paddingOpen)}>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              value={widget.padding?.top || 80}
              onChange={(e) => onChange({
                padding: { ...widget.padding, top: parseInt(e.target.value), right: widget.padding?.right || 20, bottom: widget.padding?.bottom || 80, left: widget.padding?.left || 20 }
              })}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={widget.padding?.bottom || 80}
              onChange={(e) => onChange({
                padding: { top: widget.padding?.top || 80, right: widget.padding?.right || 20, bottom: parseInt(e.target.value), left: widget.padding?.left || 20 }
              })}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={widget.padding?.left || 20}
              onChange={(e) => onChange({
                padding: { top: widget.padding?.top || 80, right: widget.padding?.right || 20, bottom: widget.padding?.bottom || 80, left: parseInt(e.target.value) }
              })}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={widget.padding?.right || 20}
              onChange={(e) => onChange({
                padding: { top: widget.padding?.top || 80, right: parseInt(e.target.value), bottom: widget.padding?.bottom || 80, left: widget.padding?.left || 20 }
              })}
              className="h-9"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Text Alignment */}
      <CollapsibleSection showBreakpointIcon title="Text Alignment" open={horizontalAlignOpen} onToggle={() => setHorizontalAlignOpen(!horizontalAlignOpen)}>
        <div className="flex gap-2">
          <button
            type="button"
            className={cn(
              "flex-1 p-2 border rounded hover:bg-muted",
              widget.textAlign === 'left' && "bg-primary text-primary-foreground"
            )}
            onClick={() => onChange({ textAlign: 'left' })}
          >
            <AlignLeft className="h-4 w-4 mx-auto" />
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 p-2 border rounded hover:bg-muted",
              widget.textAlign === 'center' && "bg-primary text-primary-foreground"
            )}
            onClick={() => onChange({ textAlign: 'center' })}
          >
            <AlignCenter className="h-4 w-4 mx-auto" />
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 p-2 border rounded hover:bg-muted",
              widget.textAlign === 'right' && "bg-primary text-primary-foreground"
            )}
            onClick={() => onChange({ textAlign: 'right' })}
          >
            <AlignRight className="h-4 w-4 mx-auto" />
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Style Tab
  const styleTab = (
    <div className="space-y-3">
      {/* Title Typography */}
      <TypographyControl
        label="Title Typography"
        defaultOpen={true}
        value={getTitleTypography()}
        responsiveFontSize={(widget as any).titleSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({ titleSizeResponsive: next } as any)}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.titleFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) widgetUpdate.titleSize = updates.fontSize;
          if (updates.fontWeight !== undefined) widgetUpdate.titleFontWeight = updates.fontWeight;
          if (updates.lineHeight !== undefined) widgetUpdate.titleLineHeight = updates.lineHeight;
          if (updates.textTransform !== undefined) widgetUpdate.titleTextTransform = updates.textTransform;
          if (updates.letterSpacing !== undefined) widgetUpdate.titleLetterSpacing = updates.letterSpacing;
          if (updates.color !== undefined) widgetUpdate.titleColor = updates.color;
          if (updates.useGlobalStyle !== undefined) widgetUpdate.titleUseGlobalStyle = updates.useGlobalStyle;
          if (updates.globalStyleId !== undefined) widgetUpdate.titleGlobalStyleId = updates.globalStyleId;
          onChange(widgetUpdate);
        }}
        showGlobalStyleSelector={true}
        globalStyles={globalStyles}
        availableGlobalStyles={['h1', 'h2', 'h3', 'h4']}
      />

      {/* Subtitle Typography */}
      <TypographyControl
        label="Subtitle Typography"
        defaultOpen={false}
        value={getSubtitleTypography()}
        responsiveFontSize={(widget as any).subtitleSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({ subtitleSizeResponsive: next } as any)}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.subtitleFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) widgetUpdate.subtitleSize = updates.fontSize;
          if (updates.fontWeight !== undefined) widgetUpdate.subtitleFontWeight = updates.fontWeight;
          if (updates.lineHeight !== undefined) widgetUpdate.subtitleLineHeight = updates.lineHeight;
          if (updates.textTransform !== undefined) widgetUpdate.subtitleTextTransform = updates.textTransform;
          if (updates.letterSpacing !== undefined) widgetUpdate.subtitleLetterSpacing = updates.letterSpacing;
          if (updates.color !== undefined) widgetUpdate.subtitleColor = updates.color;
          if (updates.useGlobalStyle !== undefined) widgetUpdate.subtitleUseGlobalStyle = updates.useGlobalStyle;
          if (updates.globalStyleId !== undefined) widgetUpdate.subtitleGlobalStyleId = updates.globalStyleId;
          onChange(widgetUpdate);
        }}
        showGlobalStyleSelector={true}
        globalStyles={globalStyles}
        availableGlobalStyles={['h3', 'h4', 'h5', 'h6', 'body']}
      />

      {/* Button Styling */}
      {widget.button && (
        <div className="border rounded-lg p-3">
          <ButtonControl
            headerLabel="Button Styling"
            value={getButtonConfig()}
            onChange={(updates) => {
              const widgetUpdate: any = {};
              
              if (updates.text !== undefined || updates.url !== undefined || updates.openNewTab !== undefined) {
                widgetUpdate.button = {
                  text: updates.text ?? widget.button?.text ?? '',
                  url: updates.url ?? widget.button?.url ?? '',
                  openNewTab: updates.openNewTab ?? widget.button?.openNewTab,
                };
              }
              
              if (updates.width !== undefined) widgetUpdate.buttonWidth = updates.width;
              if (updates.backgroundColor !== undefined) widgetUpdate.buttonBgColor = updates.backgroundColor;
              if (updates.textColor !== undefined) widgetUpdate.buttonTextColor = updates.textColor;
              if (updates.borderRadius !== undefined) widgetUpdate.buttonBorderRadius = updates.borderRadius;
              if (updates.borderWidth !== undefined) widgetUpdate.buttonBorderWidth = updates.borderWidth;
              if (updates.borderColor !== undefined) widgetUpdate.buttonBorderColor = updates.borderColor;
              if (updates.backgroundOpacity !== undefined) widgetUpdate.buttonBgOpacity = updates.backgroundOpacity;
              if (updates.dropShadow !== undefined) widgetUpdate.buttonDropShadow = updates.dropShadow;
              if (updates.shadowAmount !== undefined) widgetUpdate.buttonShadowAmount = updates.shadowAmount;
              if (updates.blurEffect !== undefined) widgetUpdate.buttonBlurEffect = updates.blurEffect;
              if (updates.fontFamily !== undefined) widgetUpdate.buttonFontFamily = updates.fontFamily;
              if (updates.fontSize !== undefined) widgetUpdate.buttonFontSize = updates.fontSize;
              if (updates.fontWeight !== undefined) widgetUpdate.buttonFontWeight = updates.fontWeight;
              if (updates.lineHeight !== undefined) widgetUpdate.buttonLineHeight = updates.lineHeight;
              if (updates.textTransform !== undefined) widgetUpdate.buttonTextTransform = updates.textTransform;
              if (updates.letterSpacing !== undefined) widgetUpdate.buttonLetterSpacing = updates.letterSpacing;
              if (updates.hover !== undefined) widgetUpdate.buttonHover = updates.hover;
              if (updates.useGlobalStyle !== undefined) widgetUpdate.buttonUseGlobalStyle = updates.useGlobalStyle;
              if (updates.globalStyleId !== undefined) widgetUpdate.buttonGlobalStyleId = updates.globalStyleId;
              
              onChange(widgetUpdate);
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
      sectionType="headline"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
