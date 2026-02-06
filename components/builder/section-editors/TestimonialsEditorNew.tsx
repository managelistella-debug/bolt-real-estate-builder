'use client';

import { useState } from 'react';
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

interface TestimonialsEditorNewProps {
  widget: TestimonialWidget;
  onChange: (updates: Partial<TestimonialWidget>) => void;
}

export function TestimonialsEditorNew({ widget, onChange }: TestimonialsEditorNewProps) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  
  // Collapsible states
  const [sectionHeaderOpen, setSectionHeaderOpen] = useState(false);
  const [testimonialsOpen, setTestimonialsOpen] = useState(true);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [sliderSettingsOpen, setSliderSettingsOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [sectionHeaderStyleOpen, setSectionHeaderStyleOpen] = useState(false);
  const [nameStyleOpen, setNameStyleOpen] = useState(false);
  const [titleStyleOpen, setTitleStyleOpen] = useState(false);
  const [quoteStyleOpen, setQuoteStyleOpen] = useState(false);
  const [cardStyleOpen, setCardStyleOpen] = useState(false);
  const [starStyleOpen, setStarStyleOpen] = useState(false);
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
      <CollapsibleSection title="Slider Settings" open={sliderSettingsOpen} onToggle={() => setSliderSettingsOpen(!sliderSettingsOpen)}>
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
      <CollapsibleSection title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
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
      <CollapsibleSection title="Section Width" open={sectionWidthOpen} onToggle={() => setSectionWidthOpen(!sectionWidthOpen)}>
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
      <CollapsibleSection title="Padding" open={paddingOpen} onToggle={() => setPaddingOpen(!paddingOpen)}>
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
      <CollapsibleSection title="Typography" open={typographyOpen} onToggle={() => setTypographyOpen(!typographyOpen)}>
        <div className="space-y-3">
          {/* Section Header Style */}
          {widget.sectionHeading && (
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
                    <Label className="text-xs">Font Size</Label>
                    <FontSizeInput
                      value={(widget as any).sectionHeadingSize || 32}
                      onChange={(value: FontSizeValue) => onChange({ sectionHeadingSize: value.value } as any)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={widget.sectionHeadingColor || '#1f2937'}
                        onChange={(e) => onChange({ sectionHeadingColor: e.target.value })}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <Input
                        value={widget.sectionHeadingColor || '#1f2937'}
                        onChange={(e) => onChange({ sectionHeadingColor: e.target.value })}
                        placeholder="#1f2937"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Name Style */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setNameStyleOpen(!nameStyleOpen)}
            >
              <span className="text-sm font-medium">Name</span>
              {nameStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {nameStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={(widget as any).nameSize || 18}
                    onChange={(value: FontSizeValue) => onChange({ nameSize: value.value } as any)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.nameColor || '#1f2937'}
                      onChange={(e) => onChange({ nameColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.nameColor || '#1f2937'}
                      onChange={(e) => onChange({ nameColor: e.target.value })}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Title Style */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setTitleStyleOpen(!titleStyleOpen)}
            >
              <span className="text-sm font-medium">Title/Position</span>
              {titleStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {titleStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={(widget as any).titleSize || 14}
                    onChange={(value: FontSizeValue) => onChange({ titleSize: value.value } as any)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.titleColor || '#6b7280'}
                      onChange={(e) => onChange({ titleColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.titleColor || '#6b7280'}
                      onChange={(e) => onChange({ titleColor: e.target.value })}
                      placeholder="#6b7280"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quote Style */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setQuoteStyleOpen(!quoteStyleOpen)}
            >
              <span className="text-sm font-medium">Quote</span>
              {quoteStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {quoteStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={(widget as any).quoteSize || 16}
                    onChange={(value: FontSizeValue) => onChange({ quoteSize: value.value } as any)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.quoteColor || '#374151'}
                      onChange={(e) => onChange({ quoteColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.quoteColor || '#374151'}
                      onChange={(e) => onChange({ quoteColor: e.target.value })}
                      placeholder="#374151"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Card Style */}
      <CollapsibleSection title="Card Style" open={cardStyleOpen} onToggle={() => setCardStyleOpen(!cardStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={widget.cardBackgroundColor || '#ffffff'}
                onChange={(e) => onChange({ cardBackgroundColor: e.target.value })}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <Input
                value={widget.cardBackgroundColor || '#ffffff'}
                onChange={(e) => onChange({ cardBackgroundColor: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
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
      <CollapsibleSection title="Star Style" open={starStyleOpen} onToggle={() => setStarStyleOpen(!starStyleOpen)}>
        <div className="space-y-2">
          <Label>Star Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={widget.starColor || '#fbbf24'}
              onChange={(e) => onChange({ starColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <Input
              value={widget.starColor || '#fbbf24'}
              onChange={(e) => onChange({ starColor: e.target.value })}
              placeholder="#fbbf24"
            />
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
                  value={widget.background?.color || 'transparent'}
                  onChange={(e) => onChange({ background: { ...widget.background, color: e.target.value } as any })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={widget.background?.color || 'transparent'}
                  onChange={(e) => onChange({ background: { ...widget.background, color: e.target.value } as any })}
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
      sectionType="testimonials"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
