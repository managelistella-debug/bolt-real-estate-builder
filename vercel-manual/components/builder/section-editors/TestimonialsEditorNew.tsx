'use client';

import React, { useState, useEffect } from 'react';
import { TestimonialWidget, Testimonial } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, ChevronDown, ChevronRight, ChevronUp, Star } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, type FontSizeValue } from '../FontSizeInput';
import { ImageUpload } from '../ImageUpload';
import { TypographyControl } from '../controls/TypographyControl';
import { GlobalColorInput } from '../controls/GlobalColorInput';
import { SectionAnimationsControl } from '../controls/SectionAnimationsControl';
import { useWebsiteStore } from '@/lib/stores/website';
import { ResponsiveDevicePicker } from '../controls/ResponsiveControlShell';

interface TestimonialsEditorNewProps {
  widget: TestimonialWidget;
  onChange: (updates: Partial<TestimonialWidget>) => void;
}

export function TestimonialsEditorNew({ widget, onChange }: TestimonialsEditorNewProps) {
  const { currentWebsite } = useWebsiteStore();
  const globalStyles = currentWebsite?.globalStyles;

  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  
  // Collapsible states
  const [sectionHeaderOpen, setSectionHeaderOpen] = useState(true);
  const [testimonialsOpen, setTestimonialsOpen] = useState(false);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [sliderSettingsOpen, setSliderSettingsOpen] = useState(true);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [sectionHeaderStyleOpen, setSectionHeaderStyleOpen] = useState(false);
  const [nameStyleOpen, setNameStyleOpen] = useState(false);
  const [titleStyleOpen, setTitleStyleOpen] = useState(false);
  const [quoteStyleOpen, setQuoteStyleOpen] = useState(false);
  const [cardStyleOpen, setCardStyleOpen] = useState(true);
  const [starStyleOpen, setStarStyleOpen] = useState(false);
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
            <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
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

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: `testimonial_${Date.now()}`,
      name: 'New Client',
      quote: 'This is a new testimonial. Share your amazing experience!',
      rating: 5,
      title: 'Satisfied Customer',
      avatar: '',
    };
    onChange({ testimonials: [...(widget.testimonials || []), newTestimonial] });
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    onChange({
      testimonials: (widget.testimonials || []).map(t => t.id === id ? { ...t, ...updates } : t),
    });
  };

  const removeTestimonial = (id: string) => {
    onChange({ testimonials: (widget.testimonials || []).filter(t => t.id !== id) });
    if (expandedItemId === id) {
      setExpandedItemId(null);
    }
  };

  const reorderTestimonial = (id: string, direction: 'up' | 'down') => {
    const items = [...(widget.testimonials || [])];
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const [removed] = items.splice(index, 1);
    items.splice(newIndex, 0, removed);
    onChange({ testimonials: items });
  };

  // Migration: Convert old widget format to new format on first render
  useEffect(() => {
    let needsUpdate = false;
    const updates: any = {};

    // Helper to migrate font size
    const migrateFontSize = (rawValue: any) => {
      if (!rawValue || typeof rawValue === 'object') return null;
      if (typeof rawValue === 'number') {
        return { value: rawValue, unit: 'px' as const };
      } else if (typeof rawValue === 'string') {
        const match = rawValue.match(/^([\d.]+)(rem|px|em|%)$/);
        if (match) {
          return { value: parseFloat(match[1]), unit: match[2] as any };
        }
      }
      return null;
    };

    const headerMigrated = migrateFontSize((widget as any).headerFontSize || widget.headerSize);
    if (headerMigrated) {
      updates.headerFontSize = headerMigrated;
      needsUpdate = true;
    }

    const nameMigrated = migrateFontSize(widget.nameFontSize);
    if (nameMigrated) {
      updates.nameFontSizeObj = nameMigrated;
      needsUpdate = true;
    }

    const titleMigrated = migrateFontSize(widget.titleFontSize);
    if (titleMigrated) {
      updates.titleFontSizeObj = titleMigrated;
      needsUpdate = true;
    }

    const quoteMigrated = migrateFontSize(widget.quoteFontSize);
    if (quoteMigrated) {
      updates.quoteFontSizeObj = quoteMigrated;
      needsUpdate = true;
    }

    // MIGRATE OLD DARK COLORS TO LIGHT COLORS (for dark background compatibility)
    // Old defaults: #1f2937 (name), #6b7280 (title), #4b5563 (quote)
    // New defaults: #ffffff (name), #cbd5e1 (title), #ffffff (quote)
    const OLD_DARK_COLORS = ['#1f2937', '#6b7280', '#4b5563'];
    
    if (widget.nameColor && OLD_DARK_COLORS.includes(widget.nameColor.toLowerCase())) {
      updates.nameColor = '#ffffff';
      needsUpdate = true;
    }
    
    if (widget.titleColor && OLD_DARK_COLORS.includes(widget.titleColor.toLowerCase())) {
      updates.titleColor = '#cbd5e1';
      needsUpdate = true;
    }
    
    if (widget.quoteColor && OLD_DARK_COLORS.includes(widget.quoteColor.toLowerCase())) {
      updates.quoteColor = '#ffffff';
      needsUpdate = true;
    }

    if (needsUpdate) {
      onChange(updates);
    }
  }, []); // Only run once on mount

  // Get typography configs with proper format handling
  const getSectionHeaderTypography = () => {
    let fontSize = { value: 36, unit: 'px' as const };
    const rawFontSize = (widget as any).headerFontSize || widget.headerSize;
    
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
      fontFamily: (widget as any).headerFontFamily || 'Inter',
      fontSize,
      fontWeight: (widget as any).headerFontWeight || widget.headerWeight || '700',
      lineHeight: (widget as any).headerLineHeight || '1.2',
      textTransform: (widget as any).headerTextTransform || 'none' as const,
      letterSpacing: (widget as any).headerLetterSpacing || '-0.02em',
      color: widget.headerColor || '#1f2937',
      useGlobalStyle: (widget as any).headerUseGlobalStyle,
      globalStyleId: (widget as any).headerGlobalStyleId,
    };
  };

  const getNameTypography = () => {
    let fontSize = { value: 18, unit: 'px' as const };
    const rawFontSize = (widget as any).nameFontSizeObj || widget.nameFontSize;
    
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
      fontFamily: (widget as any).nameFontFamily || 'Inter',
      fontSize,
      fontWeight: (widget as any).nameFontWeightStr || String(widget.nameFontWeight || '600'),
      lineHeight: (widget as any).nameLineHeight || '1.4',
      textTransform: (widget as any).nameTextTransform || 'none' as const,
      letterSpacing: (widget as any).nameLetterSpacing || '0em',
      color: widget.nameColor || '#ffffff',
      useGlobalStyle: (widget as any).nameUseGlobalStyle,
      globalStyleId: (widget as any).nameGlobalStyleId,
    };
  };

  const getTitleTypography = () => {
    let fontSize = { value: 14, unit: 'px' as const };
    const rawFontSize = (widget as any).titleFontSizeObj || widget.titleFontSize;
    
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
      fontWeight: (widget as any).titleFontWeightStr || String(widget.titleFontWeight || '400'),
      lineHeight: (widget as any).titleLineHeight || '1.4',
      textTransform: (widget as any).titleTextTransform || 'none' as const,
      letterSpacing: (widget as any).titleLetterSpacing || '0em',
      color: widget.titleColor || '#cbd5e1',
      useGlobalStyle: (widget as any).titleUseGlobalStyle,
      globalStyleId: (widget as any).titleGlobalStyleId,
    };
  };

  const getQuoteTypography = () => {
    let fontSize = { value: 16, unit: 'px' as const };
    const rawFontSize = (widget as any).quoteFontSizeObj || widget.quoteFontSize;
    
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
      fontFamily: (widget as any).quoteFontFamily || 'Inter',
      fontSize,
      fontWeight: (widget as any).quoteFontWeightStr || String(widget.quoteFontWeight || '400'),
      lineHeight: (widget as any).quoteLineHeight || '1.6',
      textTransform: (widget as any).quoteTextTransform || 'none' as const,
      letterSpacing: (widget as any).quoteLetterSpacing || '0em',
      color: widget.quoteColor || '#ffffff',
      useGlobalStyle: (widget as any).quoteUseGlobalStyle,
      globalStyleId: (widget as any).quoteGlobalStyleId,
    };
  };

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Section Header */}
      <CollapsibleSection title="Section Header (Optional)" open={sectionHeaderOpen} onToggle={() => setSectionHeaderOpen(!sectionHeaderOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Heading</Label>
              <Select
                value={(widget as any).sectionHeadingTag || 'h2'}
                onValueChange={(value: any) => onChange({ sectionHeadingTag: value } as any)}
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
              value={widget.sectionHeading || ''}
              onChange={(e) => onChange({ sectionHeading: e.target.value })}
              placeholder="Optional section heading"
            />
          </div>
          <div className="space-y-2">
            <Label>Subheading</Label>
            <Input
              value={widget.sectionSubheading || ''}
              onChange={(e) => onChange({ sectionSubheading: e.target.value })}
              placeholder="Optional subheading"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Testimonials */}
      <CollapsibleSection title={`Testimonials (${(widget.testimonials || []).length})`} open={testimonialsOpen} onToggle={() => setTestimonialsOpen(!testimonialsOpen)}>
        <div className="space-y-2">
          {(widget.testimonials || []).map((testimonial, index) => (
            <div key={testimonial.id} className="border rounded-lg p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-medium text-sm">{testimonial.name}</span>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => reorderTestimonial(testimonial.id, 'up')}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => reorderTestimonial(testimonial.id, 'down')}
                    disabled={index === (widget.testimonials || []).length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setExpandedItemId(expandedItemId === testimonial.id ? null : testimonial.id)}
                  >
                    {expandedItemId === testimonial.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => removeTestimonial(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedItemId === testimonial.id && (
                <div className="mt-3 space-y-3 pt-3 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Title/Position</Label>
                    <Input
                      value={testimonial.title}
                      onChange={(e) => updateTestimonial(testimonial.id, { title: e.target.value })}
                      placeholder="e.g., CEO, Happy Customer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Quote</Label>
                    <Textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(testimonial.id, { quote: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Rating: {testimonial.rating}</Label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) => updateTestimonial(testimonial.id, { rating: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Avatar (Optional)</Label>
                    <ImageUpload
                      value={testimonial.avatar || ''}
                      onChange={(url) => updateTestimonial(testimonial.id, { avatar: url })}
                      folder="avatars"
                      maxSizeMB={0.5}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button onClick={addTestimonial} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Testimonial
          </Button>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Layout Tab
  const layoutTab = (
    <div className="space-y-2">
      {/* Slider Settings */}
      <CollapsibleSection showBreakpointIcon title="Slider Settings" open={sliderSettingsOpen} onToggle={() => setSliderSettingsOpen(!sliderSettingsOpen)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoplay"
              checked={widget.autoplay || false}
              onCheckedChange={(checked) => onChange({ autoplay: !!checked })}
            />
            <Label htmlFor="autoplay" className="text-sm font-normal">Autoplay</Label>
          </div>
          {widget.autoplay && (
            <div className="space-y-2">
              <Label>Autoplay Delay: {widget.autoplayDelay || 5000}ms</Label>
              <input
                type="range"
                min="2000"
                max="10000"
                step="500"
                value={widget.autoplayDelay || 5000}
                onChange={(e) => onChange({ autoplayDelay: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-arrows"
              checked={widget.showArrows !== false}
              onCheckedChange={(checked) => onChange({ showArrows: !!checked })}
            />
            <Label htmlFor="show-arrows" className="text-sm font-normal">Show Navigation Arrows</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-dots"
              checked={widget.showDots !== false}
              onCheckedChange={(checked) => onChange({ showDots: !!checked })}
            />
            <Label htmlFor="show-dots" className="text-sm font-normal">Show Dots</Label>
          </div>
        </div>
      </CollapsibleSection>

      {/* Section Height */}
      <CollapsibleSection showBreakpointIcon title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
        <Select defaultValue="auto">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="vh">View Height</SelectItem>
            <SelectItem value="pixels">Pixels</SelectItem>
          </SelectContent>
        </Select>
      </CollapsibleSection>

      {/* Section Width */}
      <CollapsibleSection showBreakpointIcon title="Section Width" open={sectionWidthOpen} onToggle={() => setSectionWidthOpen(!sectionWidthOpen)}>
        <Select
          value={(widget.layout as any)?.fullWidth ? 'full' : 'container'}
          onValueChange={(value) => onChange({
            layout: { ...(widget.layout || {}), fullWidth: value === 'full' } as any
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
      <CollapsibleSection showBreakpointIcon title="Padding" open={paddingOpen} onToggle={() => setPaddingOpen(!paddingOpen)}>
        <div className="grid grid-cols-4 gap-2">
          {['top', 'right', 'bottom', 'left'].map((side) => (
            <div key={side} className="space-y-1">
              <Label className="text-xs capitalize">{side}</Label>
              <Input
                type="number"
                value={((widget.layout as any)?.[`padding${side.charAt(0).toUpperCase() + side.slice(1)}`]) || 80}
                onChange={(e) => onChange({
                  layout: {
                    ...(widget.layout || {}),
                    [`padding${side.charAt(0).toUpperCase() + side.slice(1)}`]: parseInt(e.target.value) || 0
                  } as any
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
      {/* Section Header Typography */}
      {widget.sectionHeading && (
        <TypographyControl
          label="Section Header Typography"
          defaultOpen={true}
          value={getSectionHeaderTypography()}
          responsiveFontSize={(widget as any).headerFontSizeResponsive}
          onResponsiveFontSizeChange={(next) => onChange({ headerFontSizeResponsive: next } as any)}
          onChange={(updates) => {
            const widgetUpdate: any = {};
            if (updates.fontFamily !== undefined) widgetUpdate.headerFontFamily = updates.fontFamily;
            if (updates.fontSize !== undefined) {
              widgetUpdate.headerFontSize = updates.fontSize;
              widgetUpdate.headerSize = updates.fontSize; // Keep both for compatibility
              widgetUpdate.sectionHeadingSize = updates.fontSize; // Legacy compatibility
            }
            if (updates.fontWeight !== undefined) {
              widgetUpdate.headerFontWeight = updates.fontWeight;
              widgetUpdate.headerWeight = updates.fontWeight; // Keep both for compatibility
            }
            if (updates.lineHeight !== undefined) widgetUpdate.headerLineHeight = updates.lineHeight;
            if (updates.textTransform !== undefined) widgetUpdate.headerTextTransform = updates.textTransform;
            if (updates.letterSpacing !== undefined) widgetUpdate.headerLetterSpacing = updates.letterSpacing;
            if (updates.color !== undefined) {
              widgetUpdate.headerColor = updates.color;
              widgetUpdate.sectionHeadingColor = updates.color; // Legacy compatibility
            }
            if (updates.useGlobalStyle !== undefined) widgetUpdate.headerUseGlobalStyle = updates.useGlobalStyle;
            if (updates.globalStyleId !== undefined) widgetUpdate.headerGlobalStyleId = updates.globalStyleId;
            onChange(widgetUpdate);
          }}
          showGlobalStyleSelector={true}
          globalStyles={globalStyles}
          availableGlobalStyles={['h2', 'h3', 'h4']}
        />
      )}

      {/* Name Typography */}
      <TypographyControl
        label="Name Typography"
        defaultOpen={false}
        value={getNameTypography()}
        responsiveFontSize={(widget as any).nameFontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({ nameFontSizeResponsive: next } as any)}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.nameFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) {
            widgetUpdate.nameFontSizeObj = updates.fontSize;
            widgetUpdate.nameFontSize = updates.fontSize; // Keep both for compatibility
          }
          if (updates.fontWeight !== undefined) {
            widgetUpdate.nameFontWeightStr = updates.fontWeight;
            widgetUpdate.nameFontWeight = parseInt(String(updates.fontWeight)); // Keep both for compatibility
          }
          if (updates.lineHeight !== undefined) widgetUpdate.nameLineHeight = updates.lineHeight;
          if (updates.textTransform !== undefined) widgetUpdate.nameTextTransform = updates.textTransform;
          if (updates.letterSpacing !== undefined) widgetUpdate.nameLetterSpacing = updates.letterSpacing;
          if (updates.color !== undefined) widgetUpdate.nameColor = updates.color;
          if (updates.useGlobalStyle !== undefined) widgetUpdate.nameUseGlobalStyle = updates.useGlobalStyle;
          if (updates.globalStyleId !== undefined) widgetUpdate.nameGlobalStyleId = updates.globalStyleId;
          onChange(widgetUpdate);
        }}
        showGlobalStyleSelector={true}
        globalStyles={globalStyles}
        availableGlobalStyles={['h4', 'h5', 'body']}
      />

      {/* Title/Position Typography */}
      <TypographyControl
        label="Title/Position Typography"
        defaultOpen={false}
        value={getTitleTypography()}
        responsiveFontSize={(widget as any).titleFontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({ titleFontSizeResponsive: next } as any)}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.titleFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) {
            widgetUpdate.titleFontSizeObj = updates.fontSize;
            widgetUpdate.titleFontSize = updates.fontSize; // Keep both for compatibility
          }
          if (updates.fontWeight !== undefined) {
            widgetUpdate.titleFontWeightStr = updates.fontWeight;
            widgetUpdate.titleFontWeight = parseInt(String(updates.fontWeight)); // Keep both for compatibility
          }
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
        availableGlobalStyles={['h5', 'h6', 'body']}
      />

      {/* Quote Typography */}
      <TypographyControl
        label="Quote Typography"
        defaultOpen={false}
        value={getQuoteTypography()}
        responsiveFontSize={(widget as any).quoteFontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({ quoteFontSizeResponsive: next } as any)}
        onChange={(updates) => {
          const widgetUpdate: any = {};
          if (updates.fontFamily !== undefined) widgetUpdate.quoteFontFamily = updates.fontFamily;
          if (updates.fontSize !== undefined) {
            widgetUpdate.quoteFontSizeObj = updates.fontSize;
            widgetUpdate.quoteFontSize = updates.fontSize; // Keep both for compatibility
          }
          if (updates.fontWeight !== undefined) {
            widgetUpdate.quoteFontWeightStr = updates.fontWeight;
            widgetUpdate.quoteFontWeight = parseInt(String(updates.fontWeight)); // Keep both for compatibility
          }
          if (updates.lineHeight !== undefined) widgetUpdate.quoteLineHeight = updates.lineHeight;
          if (updates.textTransform !== undefined) widgetUpdate.quoteTextTransform = updates.textTransform;
          if (updates.letterSpacing !== undefined) widgetUpdate.quoteLetterSpacing = updates.letterSpacing;
          if (updates.color !== undefined) widgetUpdate.quoteColor = updates.color;
          if (updates.useGlobalStyle !== undefined) widgetUpdate.quoteUseGlobalStyle = updates.useGlobalStyle;
          if (updates.globalStyleId !== undefined) widgetUpdate.quoteGlobalStyleId = updates.globalStyleId;
          onChange(widgetUpdate);
        }}
        showGlobalStyleSelector={true}
        globalStyles={globalStyles}
        availableGlobalStyles={['body']}
      />

      {/* Card Style */}
      <CollapsibleSection showBreakpointIcon title="Card Style" open={cardStyleOpen} onToggle={() => setCardStyleOpen(!cardStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <GlobalColorInput
              value={widget.cardBackgroundColor}
              onChange={(nextColor) => onChange({ cardBackgroundColor: nextColor })}
              globalStyles={globalStyles}
              defaultColor="#ffffff"
              placeholder="#ffffff"
            />
          </div>
          <div className="space-y-2">
            <Label>Border Radius: {widget.cardBorderRadius || 12}px</Label>
            <input
              type="range"
              min="0"
              max="30"
              value={widget.cardBorderRadius || 12}
              onChange={(e) => onChange({ cardBorderRadius: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="card-shadow"
              checked={widget.cardShadow !== false}
              onCheckedChange={(checked) => onChange({ cardShadow: !!checked })}
            />
            <Label htmlFor="card-shadow" className="text-sm font-normal">Drop Shadow</Label>
          </div>
        </div>
      </CollapsibleSection>

      {/* Star Style */}
      <CollapsibleSection showBreakpointIcon title="Star Style" open={starStyleOpen} onToggle={() => setStarStyleOpen(!starStyleOpen)}>
        <div className="space-y-2">
          <Label>Star Color</Label>
          <GlobalColorInput
            value={widget.starColor}
            onChange={(nextColor) => onChange({ starColor: nextColor })}
            globalStyles={globalStyles}
            defaultColor="#fbbf24"
            placeholder="#fbbf24"
          />
        </div>
      </CollapsibleSection>

      {/* Background */}
      <CollapsibleSection showBreakpointIcon title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
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
                onChange={(nextColor) => onChange({ background: { ...widget.background, color: nextColor } as any })}
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
          sectionType="testimonials"
          widget={widget as any}
          onChange={(updates) => onChange(updates as any)}
          globalStyles={globalStyles}
        />
      </CollapsibleSection>
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="testimonials"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
