'use client';

import React, { useState } from 'react';
import { ReviewsSliderWidget, Review, LayoutConfig, BackgroundConfig, ButtonStyleConfig } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown, Star } from 'lucide-react';
import { BackgroundControl } from '../BackgroundControl';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '../ImageUpload';

interface ReviewsSliderEditorProps {
  widget: ReviewsSliderWidget;
  onChange: (updates: Partial<ReviewsSliderWidget>) => void;
}

export function ReviewsSliderEditor({ widget, onChange }: ReviewsSliderEditorProps) {
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  const layoutConfig = widget.layout || {
    fullWidth: true,
    maxWidth: 1200,
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
  };

  const backgroundConfig = widget.background || {
    type: 'color',
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };

  const updateLayout = (updates: Partial<LayoutConfig>) => {
    onChange({ layout: { ...layoutConfig, ...updates } });
  };

  const updateBackground = (updates: Partial<BackgroundConfig>) => {
    onChange({ background: { ...backgroundConfig, ...updates } });
  };

  const updateButtonStyle = (updates: Partial<ButtonStyleConfig>) => {
    onChange({ buttonStyle: { ...widget.buttonStyle, ...updates } as ButtonStyleConfig });
  };

  // Review management
  const addReview = () => {
    const newReview: Review = {
      id: `review_${Date.now()}`,
      name: 'Customer Name',
      rating: 5,
      text: 'Great service! Highly recommend.',
      date: 'Just now',
      source: 'manual',
    };
    onChange({ reviews: [...(widget.reviews || []), newReview] });
  };

  const updateReview = (id: string, updates: Partial<Review>) => {
    onChange({
      reviews: (widget.reviews || []).map(review =>
        review.id === id ? { ...review, ...updates } : review
      ),
    });
  };

  const removeReview = (id: string) => {
    onChange({ reviews: (widget.reviews || []).filter(review => review.id !== id) });
    if (expandedReviewId === id) {
      setExpandedReviewId(null);
    }
  };

  const reorderReview = (id: string, direction: 'up' | 'down') => {
    const reviews = [...(widget.reviews || [])];
    const index = reviews.findIndex(r => r.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= reviews.length) return;

    const [removed] = reviews.splice(index, 1);
    reviews.splice(newIndex, 0, removed);
    onChange({ reviews });
  };

  const renderColorPicker = (value: string | undefined, onSelect: (color: string) => void, defaultValue: string = '#000000') => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <div className="w-4 h-4 rounded-full mr-2 border" style={{ backgroundColor: value || defaultValue }} />
          {value || defaultValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={value || defaultValue} onChange={onSelect} />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <Tabs defaultValue="source" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="source">Source</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
            <TabsTrigger value="button">Button</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="source" className="space-y-4 mt-4">
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Review Source</h3>
              <div className="space-y-2">
                <Label htmlFor="source">Source Type</Label>
                <Select
                  value={widget.source || 'google'}
                  onValueChange={(value: 'google' | 'manual') => onChange({ source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Reviews (Mock Data)</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {widget.source === 'google' && (
                <p className="text-sm text-muted-foreground">
                  Using mock Google review data. API integration will be added later.
                </p>
              )}
            </Card>

            {widget.source === 'manual' && (
              <Card className="p-4 space-y-4">
                <h3 className="text-lg font-semibold">Manual Reviews</h3>
                <div className="space-y-3">
                  {(widget.reviews || []).map((review, index) => (
                    <div key={review.id} className="border rounded-md p-3 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                          <span className="font-medium text-sm truncate">
                            {review.name} ({review.rating} ⭐)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => reorderReview(review.id, 'up')} disabled={index === 0}>
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => reorderReview(review.id, 'down')} disabled={index === (widget.reviews || []).length - 1}>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExpandedReviewId(expandedReviewId === review.id ? null : review.id)}
                          >
                            {expandedReviewId === review.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => removeReview(review.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      {expandedReviewId === review.id && (
                        <div className="mt-3 space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${review.id}`}>Name</Label>
                            <Input
                              id={`name-${review.id}`}
                              value={review.name}
                              onChange={(e) => updateReview(review.id, { name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`rating-${review.id}`}>Rating (1-5)</Label>
                            <Input
                              id={`rating-${review.id}`}
                              type="number"
                              min={1}
                              max={5}
                              value={review.rating}
                              onChange={(e) => updateReview(review.id, { rating: parseInt(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`text-${review.id}`}>Review Text</Label>
                            <Textarea
                              id={`text-${review.id}`}
                              value={review.text}
                              onChange={(e) => updateReview(review.id, { text: e.target.value })}
                              rows={4}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`date-${review.id}`}>Date</Label>
                            <Input
                              id={`date-${review.id}`}
                              value={review.date}
                              onChange={(e) => updateReview(review.id, { date: e.target.value })}
                              placeholder="e.g., 2 months ago"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`avatar-${review.id}`}>Avatar (optional)</Label>
                            <ImageUpload
                              value={review.avatar || ''}
                              onChange={(url) => updateReview(review.id, { avatar: url })}
                              folder="avatars"
                              maxSizeMB={0.5}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button onClick={addReview} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Review
                </Button>
              </Card>
            )}

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Section Header</h3>
              <div className="space-y-2">
                <Label htmlFor="sectionHeading">Heading</Label>
                <Input
                  id="sectionHeading"
                  value={widget.sectionHeading || ''}
                  onChange={(e) => onChange({ sectionHeading: e.target.value })}
                  placeholder="Optional section heading"
                />
              </div>
              {widget.sectionHeading && (
                <div className="space-y-2">
                  <Label>Heading Color</Label>
                  {renderColorPicker(widget.sectionHeadingColor, (color) => onChange({ sectionHeadingColor: color }), '#1f2937')}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="sectionSubheading">Subheading</Label>
                <Input
                  id="sectionSubheading"
                  value={widget.sectionSubheading || ''}
                  onChange={(e) => onChange({ sectionSubheading: e.target.value })}
                  placeholder="Optional section subheading"
                />
              </div>
              {widget.sectionSubheading && (
                <div className="space-y-2">
                  <Label>Subheading Color</Label>
                  {renderColorPicker(widget.sectionSubheadingColor, (color) => onChange({ sectionSubheadingColor: color }), '#6b7280')}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="display" className="space-y-4 mt-4">
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Filters & Display</h3>
              <div className="space-y-2">
                <Label htmlFor="filterStars">Show Only 4-5 Star Reviews</Label>
                <Switch
                  id="filterStars"
                  checked={widget.filterStars ?? false}
                  onCheckedChange={(checked) => onChange({ filterStars: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="showGoogleLogo">Show Google Logo</Label>
                <Switch
                  id="showGoogleLogo"
                  checked={widget.showGoogleLogo ?? true}
                  onCheckedChange={(checked) => onChange({ showGoogleLogo: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="showReviewDate">Show Review Date</Label>
                <Switch
                  id="showReviewDate"
                  checked={widget.showReviewDate ?? true}
                  onCheckedChange={(checked) => onChange({ showReviewDate: checked })}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Reviews Per Row</h3>
              <div className="space-y-2">
                <Label htmlFor="desktopCount">Desktop (1-4)</Label>
                <Input
                  id="desktopCount"
                  type="number"
                  min={1}
                  max={4}
                  value={widget.desktopCount || 3}
                  onChange={(e) => onChange({ desktopCount: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tabletCount">Tablet (1-3)</Label>
                <Input
                  id="tabletCount"
                  type="number"
                  min={1}
                  max={3}
                  value={widget.tabletCount || 2}
                  onChange={(e) => onChange({ tabletCount: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileCount">Mobile (1-2)</Label>
                <Input
                  id="mobileCount"
                  type="number"
                  min={1}
                  max={2}
                  value={widget.mobileCount || 1}
                  onChange={(e) => onChange({ mobileCount: parseInt(e.target.value) })}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Scroll Behavior</h3>
              <div className="space-y-2">
                <Label htmlFor="scrollStyle">Scroll Style</Label>
                <Select
                  value={widget.scrollStyle || 'timer'}
                  onValueChange={(value: 'timer' | 'marquee' | 'manual') => onChange({ scrollStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timer">Timer (Auto-scroll with interval)</SelectItem>
                    <SelectItem value="marquee">Marquee (Continuous scrolling)</SelectItem>
                    <SelectItem value="manual">Manual (Navigation buttons only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {widget.scrollStyle === 'timer' && (
                <div className="space-y-2">
                  <Label htmlFor="scrollInterval">Scroll Interval (seconds)</Label>
                  <Input
                    id="scrollInterval"
                    type="number"
                    min={2}
                    max={30}
                    value={widget.scrollInterval ?? 5}
                    onChange={(e) => onChange({ scrollInterval: parseInt(e.target.value) })}
                  />
                </div>
              )}
              {widget.scrollStyle === 'marquee' && (
                <p className="text-sm text-muted-foreground">
                  Reviews will scroll continuously in a loop. Hover to pause.
                </p>
              )}
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Read More</h3>
              <div className="space-y-2">
                <Label htmlFor="enableReadMore">Enable Read More</Label>
                <Switch
                  id="enableReadMore"
                  checked={widget.enableReadMore ?? true}
                  onCheckedChange={(checked) => onChange({ enableReadMore: checked })}
                />
              </div>
              {widget.enableReadMore && (
                <div className="space-y-2">
                  <Label htmlFor="readMoreLimit">Character Limit</Label>
                  <Input
                    id="readMoreLimit"
                    type="number"
                    min={50}
                    max={500}
                    value={widget.readMoreLimit ?? 150}
                    onChange={(e) => onChange({ readMoreLimit: parseInt(e.target.value) })}
                  />
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="styling" className="space-y-4 mt-4">
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Star Styling</h3>
              <div className="space-y-2">
                <Label htmlFor="starIconStyle">Icon Style</Label>
                <Select
                  value={widget.starIconStyle || 'filled'}
                  onValueChange={(value: 'filled' | 'outlined') => onChange({ starIconStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filled">Filled</SelectItem>
                    <SelectItem value="outlined">Outlined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Star Color</Label>
                {renderColorPicker(widget.starColor, (color) => onChange({ starColor: color }), '#f59e0b')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="starSize">Star Size (px)</Label>
                <Input
                  id="starSize"
                  type="number"
                  min={12}
                  max={36}
                  value={widget.starSize ?? 20}
                  onChange={(e) => onChange({ starSize: parseInt(e.target.value) })}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Review Box</h3>
              <div className="space-y-2">
                <Label>Background Color</Label>
                {renderColorPicker(widget.boxBackground, (color) => onChange({ boxBackground: color }), '#ffffff')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="boxBorderRadius">Border Radius (px)</Label>
                <Input
                  id="boxBorderRadius"
                  type="number"
                  min={0}
                  max={50}
                  value={widget.boxBorderRadius ?? 12}
                  onChange={(e) => onChange({ boxBorderRadius: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boxBorder">Show Border</Label>
                <Switch
                  id="boxBorder"
                  checked={widget.boxBorder ?? false}
                  onCheckedChange={(checked) => onChange({ boxBorder: checked })}
                />
              </div>
              {widget.boxBorder && (
                <>
                  <div className="space-y-2">
                    <Label>Border Color</Label>
                    {renderColorPicker(widget.boxBorderColor, (color) => onChange({ boxBorderColor: color }), '#e5e7eb')}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boxBorderWidth">Border Width (px)</Label>
                    <Input
                      id="boxBorderWidth"
                      type="number"
                      min={1}
                      max={5}
                      value={widget.boxBorderWidth ?? 1}
                      onChange={(e) => onChange({ boxBorderWidth: parseInt(e.target.value) })}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="boxShadow">Box Shadow</Label>
                <Switch
                  id="boxShadow"
                  checked={widget.boxShadow ?? true}
                  onCheckedChange={(checked) => onChange({ boxShadow: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boxPadding">Padding (px)</Label>
                <Input
                  id="boxPadding"
                  type="number"
                  min={0}
                  max={60}
                  value={widget.boxPadding ?? 24}
                  onChange={(e) => onChange({ boxPadding: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gap">Gap Between Reviews (px)</Label>
                <Input
                  id="gap"
                  type="number"
                  min={0}
                  max={60}
                  value={widget.gap ?? 24}
                  onChange={(e) => onChange({ gap: parseInt(e.target.value) })}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Typography</h3>
              <div className="space-y-2">
                <Label>Name Color</Label>
                {renderColorPicker(widget.nameColor, (color) => onChange({ nameColor: color }), '#1f2937')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameSize">Name Size (px)</Label>
                <Input
                  id="nameSize"
                  type="number"
                  min={12}
                  max={24}
                  value={widget.nameSize ?? 16}
                  onChange={(e) => onChange({ nameSize: parseInt(e.target.value) })}
                />
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
                <Label>Text Color</Label>
                {renderColorPicker(widget.textColor, (color) => onChange({ textColor: color }), '#6b7280')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="textSize">Text Size (px)</Label>
                <Input
                  id="textSize"
                  type="number"
                  min={12}
                  max={20}
                  value={widget.textSize ?? 14}
                  onChange={(e) => onChange({ textSize: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date Color</Label>
                {renderColorPicker(widget.dateColor, (color) => onChange({ dateColor: color }), '#9ca3af')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateSize">Date Size (px)</Label>
                <Input
                  id="dateSize"
                  type="number"
                  min={10}
                  max={16}
                  value={widget.dateSize ?? 12}
                  onChange={(e) => onChange({ dateSize: parseInt(e.target.value) })}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="button" className="space-y-4 mt-4">
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">CTA Button</h3>
              <div className="space-y-2">
                <Label htmlFor="showButton">Show Button</Label>
                <Switch
                  id="showButton"
                  checked={widget.showButton ?? false}
                  onCheckedChange={(checked) => onChange({ showButton: checked })}
                />
              </div>
              {widget.showButton && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="buttonText">Button Text</Label>
                    <Input
                      id="buttonText"
                      value={widget.buttonText || ''}
                      onChange={(e) => onChange({ buttonText: e.target.value })}
                      placeholder="View All Reviews"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buttonUrl">Button URL</Label>
                    <Input
                      id="buttonUrl"
                      value={widget.buttonUrl || ''}
                      onChange={(e) => onChange({ buttonUrl: e.target.value })}
                      placeholder="#reviews"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Background Color</Label>
                    {renderColorPicker(widget.buttonStyle?.bgColor, (color) => updateButtonStyle({ bgColor: color }), '#10b981')}
                  </div>
                  <div className="space-y-2">
                    <Label>Button Text Color</Label>
                    {renderColorPicker(widget.buttonStyle?.textColor, (color) => updateButtonStyle({ textColor: color }), '#ffffff')}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buttonRadius">Button Border Radius (px)</Label>
                    <Input
                      id="buttonRadius"
                      type="number"
                      min={0}
                      max={50}
                      value={widget.buttonStyle?.radius ?? 8}
                      onChange={(e) => updateButtonStyle({ radius: parseInt(e.target.value) })}
                    />
                  </div>
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 mt-4">
            <BackgroundControl value={backgroundConfig} onChange={updateBackground} />
            
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Section Layout</h3>
              <div className="space-y-2">
                <Label htmlFor="paddingTop">Padding Top (px)</Label>
                <Input
                  id="paddingTop"
                  type="number"
                  min={0}
                  max={200}
                  value={layoutConfig.paddingTop ?? 80}
                  onChange={(e) => updateLayout({ paddingTop: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paddingBottom">Padding Bottom (px)</Label>
                <Input
                  id="paddingBottom"
                  type="number"
                  min={0}
                  max={200}
                  value={layoutConfig.paddingBottom ?? 80}
                  onChange={(e) => updateLayout({ paddingBottom: parseInt(e.target.value) })}
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
