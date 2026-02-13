'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageTextWidget } from '@/lib/types';
import { AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, ChevronDown, ChevronRight } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { SectionEditorTabs } from './SectionEditorTabs';
import { TypographyControl } from './controls/TypographyControl';
import { ButtonControl } from './controls/ButtonControl';
import { useDebouncedInput } from './hooks/useDebouncedInput';
import { useWebsiteStore } from '@/lib/stores/website';

interface ImageTextEditorNewProps {
  widget: ImageTextWidget;
  onChange: (updates: Partial<ImageTextWidget>) => void;
}

export function ImageTextEditorNew({ widget, onChange }: ImageTextEditorNewProps) {
  const { currentWebsite } = useWebsiteStore();
  const globalStyles = currentWebsite?.globalStyles;

  // Debounced inputs
  const [titleValue, , titleChange, titleBlur] = useDebouncedInput(
    widget.title || '',
    (value) => onChange({ title: value })
  );

  const [contentValue, , contentChange, contentBlur] = useDebouncedInput(
    widget.content,
    (value) => onChange({ content: value })
  );

  const [buttonTextValue, , buttonTextChange, buttonTextBlur] = useDebouncedInput(
    widget.cta?.text || '',
    (value) => onChange({ cta: { ...widget.cta, text: value, url: widget.cta?.url || '' } })
  );

  const [buttonUrlValue, , buttonUrlChange, buttonUrlBlur] = useDebouncedInput(
    widget.cta?.url || '',
    (value) => onChange({ cta: { ...widget.cta, url: value } })
  );

  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [imageStyleOpen, setImageStyleOpen] = useState(false);

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

  // Migration: Convert old widget format to new format on first render
  useEffect(() => {
    let needsUpdate = false;
    const updates: any = {};

    // Migrate title fontSize if in old format (number or CSS string)
    const titleFontSize = (widget as any).titleFontSize;
    if (titleFontSize && typeof titleFontSize !== 'object') {
      if (typeof titleFontSize === 'number') {
        updates.titleFontSize = { value: titleFontSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof titleFontSize === 'string') {
        const match = titleFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.titleFontSize = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    // Migrate content fontSize if in old format
    const contentFontSize = (widget as any).contentFontSize;
    if (contentFontSize && typeof contentFontSize !== 'object') {
      if (typeof contentFontSize === 'number') {
        updates.contentFontSize = { value: contentFontSize, unit: 'px' as const };
        needsUpdate = true;
      } else if (typeof contentFontSize === 'string') {
        const match = contentFontSize.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          updates.contentFontSize = { value: parseFloat(match[1]), unit: match[2] as any };
          needsUpdate = true;
        }
      }
    }

    // Migrate button fontSize if in old format
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

    if (needsUpdate) {
      onChange(updates);
    }
  }, []); // Only run once on mount

  // Get typography configs
  const getTitleTypography = () => {
    let fontSize = { value: 36, unit: 'px' as const };
    const rawFontSize = (widget as any).titleFontSize;
    
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
      fontFamily: (widget as any).titleFontFamily || 'Inter',
      fontSize,
      fontWeight: (widget as any).titleFontWeight || '700',
      lineHeight: (widget as any).titleLineHeight || '1.2',
      textTransform: (widget as any).titleTextTransform || 'none' as const,
      letterSpacing: (widget as any).titleLetterSpacing || '-0.02em',
      color: (widget as any).titleColor || '#1f2937',
    };
  };

  const getContentTypography = () => {
    let fontSize = { value: 16, unit: 'px' as const };
    const rawFontSize = (widget as any).contentFontSize;
    
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
      fontFamily: (widget as any).contentFontFamily || 'Inter',
      fontSize,
      fontWeight: (widget as any).contentFontWeight || '400',
      lineHeight: (widget as any).contentLineHeight || '1.6',
      textTransform: (widget as any).contentTextTransform || 'none' as const,
      letterSpacing: (widget as any).contentLetterSpacing || '0em',
      color: (widget as any).contentColor || '#6b7280',
    };
  };

  // Get button config
  const getButtonConfig = () => {
    const buttonStyles = widget.buttonStyles || {};
    let buttonFontSize = { value: 16, unit: 'px' as const };
    const rawButtonFontSize = widget.button?.fontSize || (widget as any).buttonFontSize;
    
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
      text: widget.cta?.text || widget.button?.text || '',
      url: widget.cta?.url || widget.button?.url || '',
      openNewTab: widget.cta?.openNewTab || widget.button?.openNewTab,
      width: widget.button?.width || (widget as any).buttonWidth || 'standard' as const,
      customWidth: widget.button?.customWidth,
      backgroundColor: widget.button?.backgroundColor || buttonStyles.bgColor || '#3b82f6',
      textColor: widget.button?.textColor || buttonStyles.textColor || '#ffffff',
      borderRadius: widget.button?.borderRadius || buttonStyles.radius || 8,
      borderWidth: widget.button?.borderWidth || buttonStyles.strokeWidth || 0,
      borderColor: widget.button?.borderColor || buttonStyles.strokeColor || '#000000',
      backgroundOpacity: widget.button?.backgroundOpacity || buttonStyles.bgOpacity || 100,
      dropShadow: widget.button?.dropShadow ?? buttonStyles.hasShadow ?? true,
      shadowAmount: widget.button?.shadowAmount || buttonStyles.shadowAmount || 4,
      blurEffect: widget.button?.blurEffect || buttonStyles.blurAmount || 0,
      fontFamily: widget.button?.fontFamily || (widget as any).buttonFontFamily || 'Inter',
      fontSize: buttonFontSize,
      fontWeight: widget.button?.fontWeight || (widget as any).buttonFontWeight || '600',
      lineHeight: widget.button?.lineHeight || (widget as any).buttonLineHeight || '1.5',
      textTransform: widget.button?.textTransform || (widget as any).buttonTextTransform || 'none' as const,
      letterSpacing: widget.button?.letterSpacing || (widget as any).buttonLetterSpacing || '0em',
      hover: widget.button?.hover || (widget as any).buttonHover || {},
      useGlobalStyle: widget.button?.useGlobalStyle || (widget as any).buttonUseGlobalStyle,
      globalStyleId: widget.button?.globalStyleId || (widget as any).buttonGlobalStyleId,
    };
  };
  
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
          value={titleValue}
          onChange={titleChange}
          onBlur={titleBlur}
          placeholder="Section title"
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea
          value={contentValue}
          onChange={contentChange}
          onBlur={contentBlur}
          placeholder="Add your content here..."
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label>Button Text (Optional)</Label>
        <Input
          value={buttonTextValue}
          onChange={buttonTextChange}
          onBlur={buttonTextBlur}
          placeholder="Learn More"
        />
      </div>

      {widget.cta?.text && (
        <div className="space-y-2">
          <Label>Button URL</Label>
          <Input
            value={buttonUrlValue}
            onChange={buttonUrlChange}
            onBlur={buttonUrlBlur}
            placeholder="https://..."
          />
        </div>
      )}
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
    <div className="space-y-3">
      {/* Title Typography */}
      {widget.title && (
        <TypographyControl
          label="Title Typography"
          value={getTitleTypography()}
          onChange={(updates) => {
            const widgetUpdate: any = {};
            if (updates.fontFamily !== undefined) widgetUpdate.titleFontFamily = updates.fontFamily;
            if (updates.fontSize !== undefined) widgetUpdate.titleFontSize = updates.fontSize;
            if (updates.fontWeight !== undefined) widgetUpdate.titleFontWeight = updates.fontWeight;
            if (updates.lineHeight !== undefined) widgetUpdate.titleLineHeight = updates.lineHeight;
            if (updates.textTransform !== undefined) widgetUpdate.titleTextTransform = updates.textTransform;
            if (updates.letterSpacing !== undefined) widgetUpdate.titleLetterSpacing = updates.letterSpacing;
            if (updates.color !== undefined) widgetUpdate.titleColor = updates.color;
            onChange(widgetUpdate);
          }}
          showGlobalStyleSelector={true}
          globalStyles={globalStyles}
          availableGlobalStyles={['h2', 'h3', 'h4']}
        />
      )}

      {/* Content Typography */}
      <TypographyControl
        label="Content Typography"
        value={getContentTypography()}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.contentFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) widgetUpdate.contentFontSize = updates.fontSize;
          if (updates.fontWeight !== undefined) widgetUpdate.contentFontWeight = updates.fontWeight;
          if (updates.lineHeight !== undefined) widgetUpdate.contentLineHeight = updates.lineHeight;
          if (updates.textTransform !== undefined) widgetUpdate.contentTextTransform = updates.textTransform;
          if (updates.letterSpacing !== undefined) widgetUpdate.contentLetterSpacing = updates.letterSpacing;
          if (updates.color !== undefined) widgetUpdate.contentColor = updates.color;
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
      </CollapsibleSection>

      {/* Image Styling */}
      <CollapsibleSection title="Image Styling" open={imageStyleOpen} onToggle={() => setImageStyleOpen(!imageStyleOpen)}>
        <div className="space-y-3">
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
      </CollapsibleSection>

      {/* Button Styling */}
      {widget.cta?.text && (
        <div className="border rounded-lg p-3">
          <Label className="text-sm font-semibold mb-3 block">Button Styling</Label>
          <ButtonControl
            value={getButtonConfig()}
            onChange={(updates) => {
              if (Object.keys(updates).length === 0) return;
              
              const widgetUpdate: any = {};
              
              // Update button object with ALL properties
              const buttonUpdate: any = { ...widget.button };
              
              // Basic properties
              if (updates.text !== undefined) buttonUpdate.text = updates.text;
              if (updates.url !== undefined) buttonUpdate.url = updates.url;
              if (updates.openNewTab !== undefined) buttonUpdate.openNewTab = updates.openNewTab;
              
              // Style properties
              if (updates.backgroundColor !== undefined) buttonUpdate.backgroundColor = updates.backgroundColor;
              if (updates.textColor !== undefined) buttonUpdate.textColor = updates.textColor;
              if (updates.borderRadius !== undefined) buttonUpdate.borderRadius = updates.borderRadius;
              if (updates.borderWidth !== undefined) buttonUpdate.borderWidth = updates.borderWidth;
              if (updates.borderColor !== undefined) buttonUpdate.borderColor = updates.borderColor;
              if (updates.backgroundOpacity !== undefined) buttonUpdate.backgroundOpacity = updates.backgroundOpacity;
              if (updates.dropShadow !== undefined) buttonUpdate.dropShadow = updates.dropShadow;
              if (updates.shadowAmount !== undefined) buttonUpdate.shadowAmount = updates.shadowAmount;
              if (updates.blurEffect !== undefined) buttonUpdate.blurEffect = updates.blurEffect;
              
              // Typography properties - SAVE TO widget.button
              if (updates.fontFamily !== undefined) buttonUpdate.fontFamily = updates.fontFamily;
              if (updates.fontSize !== undefined) buttonUpdate.fontSize = updates.fontSize;
              if (updates.fontWeight !== undefined) buttonUpdate.fontWeight = updates.fontWeight;
              if (updates.lineHeight !== undefined) buttonUpdate.lineHeight = updates.lineHeight;
              if (updates.textTransform !== undefined) buttonUpdate.textTransform = updates.textTransform;
              if (updates.letterSpacing !== undefined) buttonUpdate.letterSpacing = updates.letterSpacing;
              if (updates.width !== undefined) buttonUpdate.width = updates.width;
              if (updates.customWidth !== undefined) buttonUpdate.customWidth = updates.customWidth;
              
              // Hover state
              if (updates.hover !== undefined) buttonUpdate.hover = updates.hover;
              
              // Global style linking
              if (updates.useGlobalStyle !== undefined) buttonUpdate.useGlobalStyle = updates.useGlobalStyle;
              if (updates.globalStyleId !== undefined) buttonUpdate.globalStyleId = updates.globalStyleId;
              
              widgetUpdate.button = buttonUpdate;
              
              // Also update cta for compatibility
              if (updates.text !== undefined || updates.url !== undefined) {
                widgetUpdate.cta = {
                  ...widget.cta,
                  text: updates.text ?? widget.cta?.text,
                  url: updates.url ?? widget.cta?.url,
                  openNewTab: updates.openNewTab ?? widget.cta?.openNewTab,
                };
              }
              
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
      sectionType="image-text"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
