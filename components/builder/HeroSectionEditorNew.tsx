'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { HeroWidget } from '@/lib/types';
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
import { ImageUpload } from './ImageUpload';
import { SectionEditorTabs } from './SectionEditorTabs';
import { TypographyControl } from './controls/TypographyControl';
import { ButtonControl } from './controls/ButtonControl';
import { useDebouncedInput } from './hooks/useDebouncedInput';
import { useWebsiteStore } from '@/lib/stores/website';

interface HeroSectionEditorNewProps {
  widget: HeroWidget;
  onChange: (updates: Partial<HeroWidget>) => void;
}

export function HeroSectionEditorNew({ widget, onChange }: HeroSectionEditorNewProps) {
  const { currentWebsite } = useWebsiteStore();
  const globalStyles = currentWebsite?.globalStyles;

  // Migration: Convert old widget format to new format on first render
  React.useEffect(() => {
    let needsUpdate = false;
    const updates: any = {};

    // Migrate title fontSize if it's in old format
    if (widget.textStyles?.title && !widget.textStyles.title.fontSize && widget.textStyles.title.size) {
      if (!updates.textStyles) updates.textStyles = { ...widget.textStyles };
      updates.textStyles.title = {
        ...widget.textStyles.title,
        fontSize: typeof widget.textStyles.title.size === 'number'
          ? { value: widget.textStyles.title.size, unit: 'px' as const }
          : { value: 48, unit: 'px' as const },
      };
      needsUpdate = true;
    }

    // Migrate title color if it's using old textColor fallback
    if (widget.textStyles?.title && !widget.textStyles.title.color && widget.textColor) {
      if (!updates.textStyles) updates.textStyles = { ...widget.textStyles };
      if (!updates.textStyles.title) updates.textStyles.title = { ...widget.textStyles.title };
      updates.textStyles.title = {
        ...updates.textStyles.title,
        color: widget.textColor,
      };
      needsUpdate = true;
    }

    // Migrate subtitle fontSize if it's in old format
    if (widget.textStyles?.subtitle && !widget.textStyles.subtitle.fontSize && widget.textStyles.subtitle.size) {
      if (!updates.textStyles) updates.textStyles = { ...widget.textStyles };
      updates.textStyles.subtitle = {
        ...widget.textStyles.subtitle,
        fontSize: typeof widget.textStyles.subtitle.size === 'number'
          ? { value: widget.textStyles.subtitle.size, unit: 'px' as const }
          : { value: 20, unit: 'px' as const },
      };
      needsUpdate = true;
    }

    // Migrate subtitle color if it's using old textColor fallback
    if (widget.textStyles?.subtitle && !widget.textStyles.subtitle.color && widget.textColor) {
      if (!updates.textStyles) updates.textStyles = { ...widget.textStyles };
      if (!updates.textStyles.subtitle) updates.textStyles.subtitle = { ...widget.textStyles.subtitle };
      updates.textStyles.subtitle = {
        ...updates.textStyles.subtitle,
        color: widget.textColor,
      };
      needsUpdate = true;
    }

    // Migrate button fontSize if needed
    if (widget.button && !(widget as any).button.fontSize) {
      needsUpdate = true;
      updates.button = {
        ...widget.button,
        fontSize: { value: 16, unit: 'px' as const },
        fontFamily: 'Inter',
        fontWeight: '600',
        lineHeight: '1.5',
        textTransform: 'none' as const,
      };
    }

    if (needsUpdate) {
      onChange(updates);
    }
  }, []); // Only run once on mount

  // Debounced inputs for smooth typing
  const [titleValue, , titleChange, titleBlur] = useDebouncedInput(
    widget.title || widget.headline || '',
    (value) => onChange({ title: value, headline: value })
  );
  
  const [subtitleValue, , subtitleChange, subtitleBlur] = useDebouncedInput(
    widget.subtitle || widget.subheadline || '',
    (value) => onChange({ subtitle: value, subheadline: value })
  );
  
  const [buttonTextValue, , buttonTextChange, buttonTextBlur] = useDebouncedInput(
    widget.button?.text || widget.cta?.text || '',
    (value) => onChange({ 
      button: { ...widget.button, text: value } as any,
      cta: { ...widget.cta, text: value } as any
    })
  );
  
  const [buttonUrlValue, , buttonUrlChange, buttonUrlBlur] = useDebouncedInput(
    widget.button?.url || widget.cta?.url || '',
    (value) => onChange({ 
      button: { ...widget.button, url: value } as any,
      cta: { ...widget.cta, url: value } as any
    })
  );

  // Collapsible states
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [horizontalAlignOpen, setHorizontalAlignOpen] = useState(false);
  const [verticalAlignOpen, setVerticalAlignOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [bgOverlayOpen, setBgOverlayOpen] = useState(false);
  const [buttonOpen, setButtonOpen] = useState(false);

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

  // Get typography configs - ensuring proper FontSizeValue format
  const getTitleTypography = () => {
    let fontSize = { value: 48, unit: 'px' as const };
    if (widget.textStyles?.title?.fontSize) {
      // New format: FontSizeValue object
      fontSize = typeof widget.textStyles.title.fontSize === 'object' 
        ? widget.textStyles.title.fontSize 
        : { value: widget.textStyles.title.fontSize as number, unit: 'px' as const };
    } else if (widget.textStyles?.title?.size) {
      // Old format: plain number or CSS string
      const size = widget.textStyles.title.size;
      if (typeof size === 'number') {
        fontSize = { value: size, unit: 'px' as const };
      } else if (typeof size === 'string') {
        // Parse CSS strings like '3rem' or '48px'
        const match = size.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          fontSize = { value: parseFloat(match[1]), unit: match[2] as any };
        }
      }
    }
    
    return {
      fontFamily: widget.textStyles?.title?.fontFamily || 'Inter',
      fontSize,
      fontWeight: widget.textStyles?.title?.fontWeight || (widget.textStyles?.title as any)?.weight || '700',
      lineHeight: widget.textStyles?.title?.lineHeight || '1.2',
      textTransform: (widget.textStyles?.title as any)?.textTransform || 'none' as const,
      letterSpacing: (widget.textStyles?.title as any)?.letterSpacing || '-0.02em',
      color: widget.textStyles?.title?.color || widget.textColor || '#ffffff',
    };
  };

  const getSubtitleTypography = () => {
    let fontSize = { value: 20, unit: 'px' as const };
    if (widget.textStyles?.subtitle?.fontSize) {
      // New format: FontSizeValue object
      fontSize = typeof widget.textStyles.subtitle.fontSize === 'object' 
        ? widget.textStyles.subtitle.fontSize 
        : { value: widget.textStyles.subtitle.fontSize as number, unit: 'px' as const };
    } else if (widget.textStyles?.subtitle?.size) {
      // Old format: plain number or CSS string
      const size = widget.textStyles.subtitle.size;
      if (typeof size === 'number') {
        fontSize = { value: size, unit: 'px' as const };
      } else if (typeof size === 'string') {
        // Parse CSS strings like '1.25rem' or '20px'
        const match = size.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          fontSize = { value: parseFloat(match[1]), unit: match[2] as any };
        }
      }
    }
    
    return {
      fontFamily: widget.textStyles?.subtitle?.fontFamily || 'Inter',
      fontSize,
      fontWeight: widget.textStyles?.subtitle?.fontWeight || (widget.textStyles?.subtitle as any)?.weight || '400',
      lineHeight: widget.textStyles?.subtitle?.lineHeight || '1.6',
      textTransform: (widget.textStyles?.subtitle as any)?.textTransform || 'none' as const,
      letterSpacing: (widget.textStyles?.subtitle as any)?.letterSpacing || '0em',
      color: widget.textStyles?.subtitle?.color || widget.textColor || '#ffffff',
    };
  };

  // Get button config
  const getButtonConfig = () => ({
    text: widget.button?.text || widget.cta?.text || '',
    url: widget.button?.url || widget.cta?.url || '',
    openNewTab: widget.button?.openNewTab,
    width: (widget as any).buttonWidth || 'standard' as const,
    backgroundColor: widget.button?.backgroundColor || widget.button?.bgColor || '#3b82f6',
    textColor: widget.button?.textColor || '#ffffff',
    borderRadius: widget.button?.borderRadius || widget.button?.radius || 8,
    borderWidth: widget.button?.borderWidth || widget.button?.strokeWidth || 0,
    borderColor: widget.button?.borderColor || widget.button?.strokeColor,
    backgroundOpacity: widget.button?.backgroundOpacity || widget.button?.bgOpacity || 100,
    dropShadow: widget.button?.dropShadow ?? widget.button?.hasShadow !== false,
    shadowAmount: widget.button?.shadowAmount || 4,
    blurEffect: widget.button?.blurEffect || widget.button?.blurAmount || 0,
    fontFamily: (widget as any).buttonFontFamily || 'Inter',
    fontSize: (widget as any).buttonFontSize || { value: 16, unit: 'px' as const },
    fontWeight: (widget as any).buttonFontWeight || '600',
    lineHeight: (widget as any).buttonLineHeight || '1.5',
    textTransform: (widget as any).buttonTextTransform || 'none' as const,
    hover: (widget as any).buttonHover || {},
    useGlobalStyle: (widget as any).buttonUseGlobalStyle,
    globalStyleId: (widget as any).buttonGlobalStyleId,
  });

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Title with tag selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Title</Label>
          <Select
            value={widget.titleHeaderTag || 'h1'}
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
          placeholder="Welcome to Our Website"
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
        <Textarea
          value={subtitleValue}
          onChange={subtitleChange}
          onBlur={subtitleBlur}
          placeholder="We help you build amazing experiences"
          rows={3}
        />
      </div>

      {/* Button Collapsible */}
      <CollapsibleSection title="Button" open={buttonOpen} onToggle={() => setButtonOpen(!buttonOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={buttonTextValue}
              onChange={buttonTextChange}
              onBlur={buttonTextBlur}
              placeholder="Get Started"
            />
          </div>
          <div className="space-y-2">
            <Label>Button URL</Label>
            <Input
              value={buttonUrlValue}
              onChange={buttonUrlChange}
              onBlur={buttonUrlBlur}
              placeholder="https://"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="open-new-tab"
              checked={widget.button?.openNewTab || false}
              onCheckedChange={(checked) => onChange({ 
                button: { ...widget.button, openNewTab: !!checked } as any
              })}
            />
            <Label htmlFor="open-new-tab" className="text-sm font-normal">Open in new tab</Label>
          </div>
        </div>
      </CollapsibleSection>

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
              <div className="flex gap-2">
                <input
                  type="color"
                  value={widget.background?.color || '#3b82f6'}
                  onChange={(e) => onChange({
                    background: { ...widget.background, color: e.target.value } as any
                  })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={widget.background?.color || '#3b82f6'}
                  onChange={(e) => onChange({
                    background: { ...widget.background, color: e.target.value } as any
                  })}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          )}

          {widget.background?.type === 'gradient' && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={widget.background?.gradient?.enabled || false}
                  onCheckedChange={(checked) => onChange({
                    background: { 
                      ...widget.background, 
                      gradient: { ...widget.background?.gradient, enabled: !!checked } 
                    } as any
                  })}
                  id="gradient-enabled"
                />
                <Label htmlFor="gradient-enabled" className="text-sm">Enable Gradient</Label>
              </div>
              {widget.background?.gradient?.enabled && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Start Color</Label>
                      <input
                        type="color"
                        value={widget.background?.gradient?.colorStart || '#3b82f6'}
                        onChange={(e) => onChange({
                          background: { 
                            ...widget.background, 
                            gradient: { ...widget.background?.gradient, colorStart: e.target.value } 
                          } as any
                        })}
                        className="h-10 w-full rounded border cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">End Color</Label>
                      <input
                        type="color"
                        value={widget.background?.gradient?.colorEnd || '#8b5cf6'}
                        onChange={(e) => onChange({
                          background: { 
                            ...widget.background, 
                            gradient: { ...widget.background?.gradient, colorEnd: e.target.value } 
                          } as any
                        })}
                        className="h-10 w-full rounded border cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Angle: {widget.background?.gradient?.angle || 45}°</Label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={widget.background?.gradient?.angle || 45}
                      onChange={(e) => onChange({
                        background: { 
                          ...widget.background, 
                          gradient: { ...widget.background?.gradient, angle: parseInt(e.target.value) } 
                        } as any
                      })}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {widget.background?.type === 'image' && (
            <>
              <ImageUpload
                label="Image"
                value={widget.background?.url || ''}
                onChange={(url) => onChange({
                  background: { 
                    type: 'image',
                    opacity: widget.background?.opacity || 100,
                    blur: widget.background?.blur || 0,
                    ...widget.background, 
                    url 
                  } as any
                })}
                maxSizeMB={2}
              />
              <div className="space-y-2">
                <Label>Opacity: {widget.background?.opacity || 100}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={widget.background?.opacity || 100}
                  onChange={(e) => onChange({
                    background: { ...widget.background, opacity: parseInt(e.target.value) } as any
                  })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Blur: {widget.background?.blur || 0}px</Label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={widget.background?.blur || 0}
                  onChange={(e) => onChange({
                    background: { ...widget.background, blur: parseInt(e.target.value) } as any
                  })}
                  className="w-full"
                />
              </div>
            </>
          )}

          {widget.background?.type === 'video' && (
            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input
                value={widget.background?.url || ''}
                onChange={(e) => onChange({
                  background: { ...widget.background, url: e.target.value } as any
                })}
                placeholder="https://example.com/video.mp4"
              />
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Background Overlay */}
      <CollapsibleSection title="Background Overlay" open={bgOverlayOpen} onToggle={() => setBgOverlayOpen(!bgOverlayOpen)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={widget.background?.overlay?.enabled || false}
              onCheckedChange={(checked) => onChange({
                background: { 
                  ...widget.background, 
                  overlay: { ...widget.background?.overlay, enabled: !!checked, color: '#000000', opacity: 50 } 
                } as any
              })}
              id="overlay-enabled"
            />
            <Label htmlFor="overlay-enabled" className="text-sm">Enable Overlay</Label>
          </div>
          {widget.background?.overlay?.enabled && (
            <>
              <div className="space-y-2">
                <Label>Overlay Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={widget.background?.overlay?.color || '#000000'}
                    onChange={(e) => onChange({
                      background: { 
                        ...widget.background, 
                        overlay: { ...widget.background?.overlay, color: e.target.value } 
                      } as any
                    })}
                    className="h-10 w-16 rounded border cursor-pointer"
                  />
                  <Input
                    value={widget.background?.overlay?.color || '#000000'}
                    onChange={(e) => onChange({
                      background: { 
                        ...widget.background, 
                        overlay: { ...widget.background?.overlay, color: e.target.value } 
                      } as any
                    })}
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Opacity: {widget.background?.overlay?.opacity || 50}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={widget.background?.overlay?.opacity || 50}
                  onChange={(e) => onChange({
                    background: { 
                      ...widget.background, 
                      overlay: { ...widget.background?.overlay, opacity: parseInt(e.target.value) } 
                    } as any
                  })}
                  className="w-full"
                />
              </div>
            </>
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
            value={widget.layout?.height?.type || 'vh'}
            onValueChange={(value: 'auto' | 'vh' | 'percentage' | 'pixels') => onChange({
              layout: { 
                ...widget.layout, 
                height: { ...widget.layout?.height, type: value } 
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
          {widget.layout?.height?.type !== 'auto' && (
            <Input
              type="number"
              value={widget.layout?.height?.value || 60}
              onChange={(e) => onChange({
                layout: { 
                  ...widget.layout, 
                  height: { ...widget.layout?.height, value: parseInt(e.target.value) } 
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
          value={widget.layout?.width || 'full'}
          onValueChange={(value: 'full' | 'container') => onChange({
            layout: { ...widget.layout, width: value } as any
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
              value={widget.layout?.padding?.top || 80}
              onChange={(e) => onChange({
                layout: { 
                  ...widget.layout, 
                  padding: { ...widget.layout?.padding, top: parseInt(e.target.value) } 
                } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={widget.layout?.padding?.right || 20}
              onChange={(e) => onChange({
                layout: { 
                  ...widget.layout, 
                  padding: { ...widget.layout?.padding, right: parseInt(e.target.value) } 
                } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={widget.layout?.padding?.bottom || 80}
              onChange={(e) => onChange({
                layout: { 
                  ...widget.layout, 
                  padding: { ...widget.layout?.padding, bottom: parseInt(e.target.value) } 
                } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={widget.layout?.padding?.left || 20}
              onChange={(e) => onChange({
                layout: { 
                  ...widget.layout, 
                  padding: { ...widget.layout?.padding, left: parseInt(e.target.value) } 
                } as any
              })}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Horizontal Alignment */}
      <CollapsibleSection title="Horizontal Alignment" open={horizontalAlignOpen} onToggle={() => setHorizontalAlignOpen(!horizontalAlignOpen)}>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={widget.textPosition?.horizontal === 'left' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ 
              textPosition: { ...widget.textPosition, horizontal: 'left' } as any,
              alignment: 'left'
            })}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={widget.textPosition?.horizontal === 'center' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ 
              textPosition: { ...widget.textPosition, horizontal: 'center' } as any,
              alignment: 'center'
            })}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={widget.textPosition?.horizontal === 'right' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ 
              textPosition: { ...widget.textPosition, horizontal: 'right' } as any,
              alignment: 'right'
            })}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </CollapsibleSection>

      {/* Vertical Alignment */}
      <CollapsibleSection title="Vertical Alignment" open={verticalAlignOpen} onToggle={() => setVerticalAlignOpen(!verticalAlignOpen)}>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={widget.textPosition?.vertical === 'top' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ 
              textPosition: { ...widget.textPosition, vertical: 'top' } as any
            })}
          >
            <AlignVerticalJustifyStart className="h-4 w-4" />
          </Button>
          <Button
            variant={widget.textPosition?.vertical === 'middle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ 
              textPosition: { ...widget.textPosition, vertical: 'middle' } as any
            })}
          >
            <AlignVerticalJustifyCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={widget.textPosition?.vertical === 'bottom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ 
              textPosition: { ...widget.textPosition, vertical: 'bottom' } as any
            })}
          >
            <AlignVerticalJustifyEnd className="h-4 w-4" />
          </Button>
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
        value={getTitleTypography()}
        onChange={(updates) => {
          const currentTitle = widget.textStyles?.title || {};
          onChange({
            textStyles: {
              ...widget.textStyles,
              title: {
                ...currentTitle,
                ...updates,
                // Keep old format properties for backward compatibility
                size: updates.fontSize || currentTitle.fontSize,
                weight: updates.fontWeight || currentTitle.fontWeight,
              } as any,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        availableGlobalStyles={['h1']}
      />

      {/* Subtitle Typography */}
      <TypographyControl
        label="Subtitle Typography"
        value={getSubtitleTypography()}
        onChange={(updates) => {
          const currentSubtitle = widget.textStyles?.subtitle || {};
          onChange({
            textStyles: {
              ...widget.textStyles,
              subtitle: {
                ...currentSubtitle,
                ...updates,
                // Keep old format properties for backward compatibility
                size: updates.fontSize || currentSubtitle.fontSize,
                weight: updates.fontWeight || currentSubtitle.fontWeight,
              } as any,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        availableGlobalStyles={['h2', 'h3', 'body']}
      />

      {/* Button Styling */}
      <div className="border rounded-lg p-3">
        <Label className="text-sm font-semibold mb-3 block">Button Styling</Label>
        <ButtonControl
          value={getButtonConfig()}
          onChange={(updates) => {
            const widgetUpdate: any = {};
            
            // Update button object
            const buttonUpdate: any = { ...widget.button };
            if (updates.text !== undefined) buttonUpdate.text = updates.text;
            if (updates.url !== undefined) buttonUpdate.url = updates.url;
            if (updates.openNewTab !== undefined) buttonUpdate.openNewTab = updates.openNewTab;
            if (updates.backgroundColor !== undefined) {
              buttonUpdate.backgroundColor = updates.backgroundColor;
              buttonUpdate.bgColor = updates.backgroundColor; // Keep both
            }
            if (updates.textColor !== undefined) buttonUpdate.textColor = updates.textColor;
            if (updates.borderRadius !== undefined) {
              buttonUpdate.borderRadius = updates.borderRadius;
              buttonUpdate.radius = updates.borderRadius; // Keep both
            }
            if (updates.borderWidth !== undefined) {
              buttonUpdate.borderWidth = updates.borderWidth;
              buttonUpdate.strokeWidth = updates.borderWidth; // Keep both
            }
            if (updates.borderColor !== undefined) {
              buttonUpdate.borderColor = updates.borderColor;
              buttonUpdate.strokeColor = updates.borderColor; // Keep both
            }
            if (updates.backgroundOpacity !== undefined) {
              buttonUpdate.backgroundOpacity = updates.backgroundOpacity;
              buttonUpdate.bgOpacity = updates.backgroundOpacity; // Keep both
            }
            if (updates.dropShadow !== undefined) {
              buttonUpdate.dropShadow = updates.dropShadow;
              buttonUpdate.hasShadow = updates.dropShadow; // Keep both
            }
            if (updates.shadowAmount !== undefined) buttonUpdate.shadowAmount = updates.shadowAmount;
            if (updates.blurEffect !== undefined) {
              buttonUpdate.blurEffect = updates.blurEffect;
              buttonUpdate.blurAmount = updates.blurEffect; // Keep both
            }
            
            widgetUpdate.button = buttonUpdate;
            
            // Update typography properties
            if (updates.fontFamily !== undefined) widgetUpdate.buttonFontFamily = updates.fontFamily;
            if (updates.fontSize !== undefined) widgetUpdate.buttonFontSize = updates.fontSize;
            if (updates.fontWeight !== undefined) widgetUpdate.buttonFontWeight = updates.fontWeight;
            if (updates.lineHeight !== undefined) widgetUpdate.buttonLineHeight = updates.lineHeight;
            if (updates.textTransform !== undefined) widgetUpdate.buttonTextTransform = updates.textTransform;
            if (updates.hover !== undefined) widgetUpdate.buttonHover = updates.hover;
            if (updates.useGlobalStyle !== undefined) widgetUpdate.buttonUseGlobalStyle = updates.useGlobalStyle;
            if (updates.globalStyleId !== undefined) widgetUpdate.buttonGlobalStyleId = updates.globalStyleId;
            if (updates.width !== undefined) widgetUpdate.buttonWidth = updates.width;
            
            // Also update cta for compatibility
            if (updates.text !== undefined || updates.url !== undefined) {
              widgetUpdate.cta = {
                ...widget.cta,
                text: updates.text ?? widget.cta?.text,
                url: updates.url ?? widget.cta?.url,
              };
            }
            
            onChange(widgetUpdate);
          }}
          showGlobalStyleSelector={true}
        />
      </div>
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="hero"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
