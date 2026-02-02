'use client';

import React, { useState } from 'react';
import { TestimonialWidget, Testimonial, TestimonialArrowStyle, TextAlignment, LayoutConfig, BackgroundConfig } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { GripVertical, Plus, Trash2, Star, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { BackgroundControl } from '../BackgroundControl';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ImageUpload } from '../ImageUpload';

interface TestimonialsEditorProps {
  widget: TestimonialWidget;
  onChange: (updates: Partial<TestimonialWidget>) => void;
}

export function TestimonialsEditor({ widget, onChange }: TestimonialsEditorProps) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const updateLayout = (updates: Partial<LayoutConfig>) => {
    onChange({ layout: { ...widget.layout, ...updates } });
  };

  const updateBackground = (updates: Partial<BackgroundConfig>) => {
    onChange({ background: { ...widget.background, ...updates } });
  };

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
      testimonials: (widget.testimonials || []).map(t =>
        t.id === id ? { ...t, ...updates } : t
      ),
    });
  };

  const removeTestimonial = (id: string) => {
    onChange({
      testimonials: (widget.testimonials || []).filter(t => t.id !== id),
    });
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

  const renderColorPicker = (value: string | undefined, onSelect: (color: string) => void) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <div className="w-4 h-4 rounded-full mr-2 border" style={{ backgroundColor: value || '#000000' }} />
          {value || 'Select Color'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={value} onChange={onSelect} />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Section Header */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Section Header</h3>
          <div className="space-y-2">
            <Label htmlFor="sectionHeading">Heading</Label>
            <Input
              id="sectionHeading"
              value={widget.sectionHeading || ''}
              onChange={(e) => onChange({ sectionHeading: e.target.value })}
              placeholder="What Our Clients Say"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectionHeadingColor">Heading Color</Label>
            {renderColorPicker(widget.sectionHeadingColor, (color) => onChange({ sectionHeadingColor: color }))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectionSubheading">Subheading</Label>
            <Input
              id="sectionSubheading"
              value={widget.sectionSubheading || ''}
              onChange={(e) => onChange({ sectionSubheading: e.target.value })}
              placeholder="Hear from our happy customers"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectionSubheadingColor">Subheading Color</Label>
            {renderColorPicker(widget.sectionSubheadingColor, (color) => onChange({ sectionSubheadingColor: color }))}
          </div>
        </Card>

        {/* Testimonials */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Testimonials</h3>
          <div className="space-y-3">
            {(widget.testimonials || []).map((testimonial, index) => (
              <div key={testimonial.id} className="border rounded-md p-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                    <span className="font-medium text-sm truncate">
                      {testimonial.name || `Testimonial ${index + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => reorderTestimonial(testimonial.id, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => reorderTestimonial(testimonial.id, 'down')}
                      disabled={index === (widget.testimonials || []).length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpandedItemId(expandedItemId === testimonial.id ? null : testimonial.id)}
                    >
                      {expandedItemId === testimonial.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTestimonial(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {expandedItemId === testimonial.id && (
                  <div className="mt-3 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${testimonial.id}`}>Name</Label>
                      <Input
                        id={`name-${testimonial.id}`}
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`title-${testimonial.id}`}>Title / Company</Label>
                      <Input
                        id={`title-${testimonial.id}`}
                        value={testimonial.title || ''}
                        onChange={(e) => updateTestimonial(testimonial.id, { title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`quote-${testimonial.id}`}>Quote</Label>
                      <Textarea
                        id={`quote-${testimonial.id}`}
                        value={testimonial.quote}
                        onChange={(e) => updateTestimonial(testimonial.id, { quote: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`rating-${testimonial.id}`}>Rating (1-5 Stars)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`rating-${testimonial.id}`}
                          type="range"
                          min={1}
                          max={5}
                          step={1}
                          value={testimonial.rating}
                          onChange={(e) => updateTestimonial(testimonial.id, { rating: parseInt(e.target.value) })}
                          className="w-[60%]"
                        />
                        <span className="ml-2 text-sm text-muted-foreground">{testimonial.rating} Stars</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`avatar-${testimonial.id}`}>Avatar (Optional)</Label>
                      <ImageUpload
                        value={testimonial.avatar}
                        onChange={(url) => updateTestimonial(testimonial.id, { avatar: url })}
                        folder="testimonials"
                        maxSizeMB={1}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button onClick={addTestimonial} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Testimonial
          </Button>
        </Card>

        {/* Display Options */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Display Options</h3>
          <div className="space-y-2">
            <Label htmlFor="autoplay">Autoplay Carousel</Label>
            <Switch
              id="autoplay"
              checked={widget.autoplay ?? true}
              onCheckedChange={(checked) => onChange({ autoplay: checked })}
            />
          </div>
          {widget.autoplay && (
            <div className="space-y-2">
              <Label htmlFor="autoplayInterval">Autoplay Interval (seconds)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="autoplayInterval"
                  type="range"
                  min={3}
                  max={10}
                  step={1}
                  value={widget.autoplayInterval ?? 5}
                  onChange={(e) => onChange({ autoplayInterval: parseInt(e.target.value) })}
                  className="w-[60%]"
                />
                <span className="ml-2 text-sm text-muted-foreground">{widget.autoplayInterval ?? 5}s</span>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="namePosition">Name Position</Label>
            <Select
              value={widget.namePosition || 'above-quote'}
              onValueChange={(value: 'above-quote' | 'below-quote') => onChange({ namePosition: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above-quote">Above Quote</SelectItem>
                <SelectItem value="below-quote">Below Quote</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="textAlign">Text Alignment</Label>
            <Select
              value={widget.textAlign || 'center'}
              onValueChange={(value: TextAlignment) => onChange({ textAlign: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="showAvatar">Show Avatar</Label>
            <Switch
              id="showAvatar"
              checked={widget.showAvatar ?? true}
              onCheckedChange={(checked) => onChange({ showAvatar: checked })}
            />
          </div>
          {widget.showAvatar && (
            <>
              <div className="space-y-2">
                <Label htmlFor="avatarShape">Avatar Shape</Label>
                <Select
                  value={widget.avatarShape || 'circle'}
                  onValueChange={(value: 'circle' | 'square') => onChange({ avatarShape: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarSize">Avatar Size (px)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="avatarSize"
                    type="range"
                    min={40}
                    max={120}
                    step={4}
                    value={widget.avatarSize ?? 80}
                    onChange={(e) => onChange({ avatarSize: parseInt(e.target.value) })}
                    className="w-[60%]"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">{widget.avatarSize ?? 80}px</span>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Star Settings */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Star Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="showStars">Show Stars</Label>
            <Switch
              id="showStars"
              checked={widget.showStars ?? true}
              onCheckedChange={(checked) => onChange({ showStars: checked })}
            />
          </div>
          {widget.showStars && (
            <>
              <div className="space-y-2">
                <Label htmlFor="starColor">Star Color</Label>
                {renderColorPicker(widget.starColor, (color) => onChange({ starColor: color }))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="starSize">Star Size (px)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="starSize"
                    type="range"
                    min={12}
                    max={48}
                    step={2}
                    value={widget.starSize ?? 24}
                    onChange={(e) => onChange({ starSize: parseInt(e.target.value) })}
                    className="w-[60%]"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">{widget.starSize ?? 24}px</span>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Typography */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Typography</h3>
          <div className="space-y-2">
            <Label htmlFor="nameFontSize">Name Font Size (px)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="nameFontSize"
                type="range"
                min={14}
                max={32}
                step={1}
                value={widget.nameFontSize ?? 20}
                onChange={(e) => onChange({ nameFontSize: parseInt(e.target.value) })}
                className="w-[60%]"
              />
              <span className="ml-2 text-sm text-muted-foreground">{widget.nameFontSize ?? 20}px</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameColor">Name Color</Label>
            {renderColorPicker(widget.nameColor, (color) => onChange({ nameColor: color }))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameFontWeight">Name Font Weight</Label>
            <Select
              value={String(widget.nameFontWeight ?? 600)}
              onValueChange={(value) => onChange({ nameFontWeight: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="400">Normal</SelectItem>
                <SelectItem value="500">Medium</SelectItem>
                <SelectItem value="600">Semibold</SelectItem>
                <SelectItem value="700">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titleFontSize">Title/Company Font Size (px)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="titleFontSize"
                type="range"
                min={12}
                max={24}
                step={1}
                value={widget.titleFontSize ?? 16}
                onChange={(e) => onChange({ titleFontSize: parseInt(e.target.value) })}
                className="w-[60%]"
              />
              <span className="ml-2 text-sm text-muted-foreground">{widget.titleFontSize ?? 16}px</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleColor">Title/Company Color</Label>
            {renderColorPicker(widget.titleColor, (color) => onChange({ titleColor: color }))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quoteFontSize">Quote Font Size (px)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="quoteFontSize"
                type="range"
                min={16}
                max={36}
                step={1}
                value={widget.quoteFontSize ?? 24}
                onChange={(e) => onChange({ quoteFontSize: parseInt(e.target.value) })}
                className="w-[60%]"
              />
              <span className="ml-2 text-sm text-muted-foreground">{widget.quoteFontSize ?? 24}px</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quoteColor">Quote Color</Label>
            {renderColorPicker(widget.quoteColor, (color) => onChange({ quoteColor: color }))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="quoteLineHeight">Quote Line Height</Label>
            <div className="flex items-center gap-2">
              <Input
                id="quoteLineHeight"
                type="range"
                min={1}
                max={2}
                step={0.1}
                value={widget.quoteLineHeight ?? 1.5}
                onChange={(e) => onChange({ quoteLineHeight: parseFloat(e.target.value) })}
                className="w-[60%]"
              />
              <span className="ml-2 text-sm text-muted-foreground">{widget.quoteLineHeight ?? 1.5}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quoteMaxWidth">Quote Max Width (px)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="quoteMaxWidth"
                type="range"
                min={400}
                max={1000}
                step={50}
                value={widget.quoteMaxWidth ?? 700}
                onChange={(e) => onChange({ quoteMaxWidth: parseInt(e.target.value) })}
                className="w-[60%]"
              />
              <span className="ml-2 text-sm text-muted-foreground">{widget.quoteMaxWidth ?? 700}px</span>
            </div>
          </div>
        </Card>

        {/* Navigation Arrows */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Navigation Arrows</h3>
          <div className="space-y-2">
            <Label htmlFor="arrowStyle">Arrow Style</Label>
            <Select
              value={widget.arrowStyle || 'circle'}
              onValueChange={(value: TestimonialArrowStyle) => onChange({ arrowStyle: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {widget.arrowStyle !== 'minimal' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="arrowBackgroundColor">Arrow Background Color</Label>
                {renderColorPicker(widget.arrowBackgroundColor, (color) => onChange({ arrowBackgroundColor: color }))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrowSize">Arrow Size (px)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="arrowSize"
                    type="range"
                    min={40}
                    max={80}
                    step={4}
                    value={widget.arrowSize ?? 60}
                    onChange={(e) => onChange({ arrowSize: parseInt(e.target.value) })}
                    className="w-[60%]"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">{widget.arrowSize ?? 60}px</span>
                </div>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="arrowColor">Arrow Color</Label>
            {renderColorPicker(widget.arrowColor, (color) => onChange({ arrowColor: color }))}
          </div>
        </Card>

        {/* Navigation Dots */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Navigation Dots</h3>
          <div className="space-y-2">
            <Label htmlFor="dotColor">Dot Color (Inactive)</Label>
            {renderColorPicker(widget.dotColor, (color) => onChange({ dotColor: color }))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="activeDotColor">Active Dot Color</Label>
            {renderColorPicker(widget.activeDotColor, (color) => onChange({ activeDotColor: color }))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dotSize">Dot Size (px)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="dotSize"
                type="range"
                min={6}
                max={20}
                step={2}
                value={widget.dotSize ?? 10}
                onChange={(e) => onChange({ dotSize: parseInt(e.target.value) })}
                className="w-[60%]"
              />
              <span className="ml-2 text-sm text-muted-foreground">{widget.dotSize ?? 10}px</span>
            </div>
          </div>
        </Card>

        {/* Background & Layout */}
        <BackgroundControl value={widget.background} onChange={updateBackground} />
        
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Section Layout</h3>
          <div className="space-y-2">
            <Label htmlFor="fullWidth">Full Width</Label>
            <Switch
              id="fullWidth"
              checked={widget.layout?.fullWidth ?? true}
              onCheckedChange={(checked) => updateLayout({ fullWidth: checked })}
            />
          </div>
          {!widget.layout?.fullWidth && (
            <div className="space-y-2">
              <Label htmlFor="maxWidth">Max Width (px)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="maxWidth"
                  type="range"
                  min={600}
                  max={1400}
                  step={50}
                  value={widget.layout?.maxWidth ?? 1200}
                  onChange={(e) => updateLayout({ maxWidth: parseInt(e.target.value) })}
                  className="w-[60%]"
                />
                <span className="ml-2 text-sm text-muted-foreground">{widget.layout?.maxWidth ?? 1200}px</span>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="paddingTop">Padding Top (px)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="paddingTop"
                type="range"
                min={0}
                max={200}
                step={4}
                value={widget.layout?.paddingTop ?? 80}
                onChange={(e) => updateLayout({ paddingTop: parseInt(e.target.value) })}
                className="w-[60%]"
              />
              <span className="ml-2 text-sm text-muted-foreground">{widget.layout?.paddingTop ?? 80}px</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paddingBottom">Padding Bottom (px)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="paddingBottom"
                type="range"
                min={0}
                max={200}
                step={4}
                value={widget.layout?.paddingBottom ?? 80}
                onChange={(e) => updateLayout({ paddingBottom: parseInt(e.target.value) })}
                className="w-[60%]"
              />
              <span className="ml-2 text-sm text-muted-foreground">{widget.layout?.paddingBottom ?? 80}px</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paddingLeft">Padding Left (px)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="paddingLeft"
                type="range"
                min={0}
                max={100}
                step={4}
                value={widget.layout?.paddingLeft ?? 24}
                onChange={(e) => updateLayout({ paddingLeft: parseInt(e.target.value) })}
                className="w-[60%]"
              />
              <span className="ml-2 text-sm text-muted-foreground">{widget.layout?.paddingLeft ?? 24}px</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paddingRight">Padding Right (px)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="paddingRight"
                type="range"
                min={0}
                max={100}
                step={4}
                value={widget.layout?.paddingRight ?? 24}
                onChange={(e) => updateLayout({ paddingRight: parseInt(e.target.value) })}
                className="w-[60%]"
              />
              <span className="ml-2 text-sm text-muted-foreground">{widget.layout?.paddingRight ?? 24}px</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
