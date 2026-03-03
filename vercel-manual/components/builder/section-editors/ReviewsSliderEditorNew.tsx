'use client';

import React, { useState, useEffect } from 'react';
import { ReviewsSliderWidget, Review, TypographyConfig } from '@/lib/types';
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
import { useWebsiteStore } from '@/lib/stores/website';
import { GlobalColorInput } from '../controls/GlobalColorInput';
import { SectionAnimationsControl } from '../controls/SectionAnimationsControl';
import { ResponsiveDevicePicker } from '../controls/ResponsiveControlShell';

interface ReviewsSliderEditorNewProps {
  widget: ReviewsSliderWidget;
  onChange: (updates: Partial<ReviewsSliderWidget>) => void;
}

export function ReviewsSliderEditorNew({ widget, onChange }: ReviewsSliderEditorNewProps) {
  const { website } = useWebsiteStore();
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);
  
  // Collapsible states
  const [sectionHeaderOpen, setSectionHeaderOpen] = useState(true);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [sliderSettingsOpen, setSliderSettingsOpen] = useState(true);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [sectionHeaderStyleOpen, setSectionHeaderStyleOpen] = useState(false);
  const [nameStyleOpen, setNameStyleOpen] = useState(false);
  const [textStyleOpen, setTextStyleOpen] = useState(false);
  const [dateStyleOpen, setDateStyleOpen] = useState(false);
  const [cardStyleOpen, setCardStyleOpen] = useState(true);
  const [starStyleOpen, setStarStyleOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [animationsOpen, setAnimationsOpen] = useState(false);

  // Helper functions to get typography configs
  const getSectionHeaderTypography = (): TypographyConfig => {
    return (widget as any).sectionHeaderTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 2, unit: 'rem' },
      fontWeight: '700',
      lineHeight: '1.2',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#1f2937',
    };
  };

  const getNameTypography = (): TypographyConfig => {
    return (widget as any).nameTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 1, unit: 'rem' },
      fontWeight: '600',
      lineHeight: '1.2',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#1f2937',
    };
  };

  const getReviewTextTypography = (): TypographyConfig => {
    return (widget as any).reviewTextTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 0.875, unit: 'rem' },
      fontWeight: '400',
      lineHeight: '1.6',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#6b7280',
    };
  };

  const getDateTypography = (): TypographyConfig => {
    return (widget as any).dateTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 0.75, unit: 'rem' },
      fontWeight: '400',
      lineHeight: '1.2',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#9ca3af',
    };
  };

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
      reviews: (widget.reviews || []).map(review => review.id === id ? { ...review, ...updates } : review),
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

      {/* Reviews */}
      <CollapsibleSection title={`Reviews (${(widget.reviews || []).length})`} open={reviewsOpen} onToggle={() => setReviewsOpen(!reviewsOpen)}>
        <div className="space-y-2">
          {(widget.reviews || []).map((review, index) => (
            <div key={review.id} className="border rounded-lg p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-medium text-sm">{review.name}</span>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => reorderReview(review.id, 'up')}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => reorderReview(review.id, 'down')}
                    disabled={index === (widget.reviews || []).length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setExpandedReviewId(expandedReviewId === review.id ? null : review.id)}
                  >
                    {expandedReviewId === review.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => removeReview(review.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedReviewId === review.id && (
                <div className="mt-3 space-y-3 pt-3 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={review.name}
                      onChange={(e) => updateReview(review.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Review Text</Label>
                    <Textarea
                      value={review.text}
                      onChange={(e) => updateReview(review.id, { text: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Rating: {review.rating}</Label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={review.rating}
                      onChange={(e) => updateReview(review.id, { rating: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Date</Label>
                    <Input
                      value={review.date}
                      onChange={(e) => updateReview(review.id, { date: e.target.value })}
                      placeholder="e.g., 2 weeks ago"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Avatar (Optional)</Label>
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
          <Button onClick={addReview} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Review
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
          <div className="space-y-2">
            <Label>Reviews Per Slide: {widget.reviewsPerSlide || 3}</Label>
            <input
              type="range"
              min="1"
              max="4"
              value={widget.reviewsPerSlide || 3}
              onChange={(e) => onChange({ reviewsPerSlide: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
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
          value={layoutConfig.fullWidth ? 'full' : 'container'}
          onValueChange={(value) => onChange({
            layout: { ...layoutConfig, fullWidth: value === 'full' }
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
          {[
            { key: 'paddingTop', label: 'Top' },
            { key: 'paddingRight', label: 'Right' },
            { key: 'paddingBottom', label: 'Bottom' },
            { key: 'paddingLeft', label: 'Left' }
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input
                type="number"
                value={(layoutConfig as any)[key] || 0}
                onChange={(e) => onChange({
                  layout: { ...layoutConfig, [key]: parseInt(e.target.value) || 0 }
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
      {widget.sectionHeading && (
        <TypographyControl
          label="Section Header Typography"
          defaultOpen={true}
          value={getSectionHeaderTypography()}
          responsiveFontSize={(getSectionHeaderTypography() as any).fontSizeResponsive}
          onResponsiveFontSizeChange={(next) => onChange({
            sectionHeaderTypography: {
              ...getSectionHeaderTypography(),
              fontSizeResponsive: next,
            } as any,
          })}
          onChange={(updates) => {
            onChange({
              sectionHeaderTypography: {
                ...getSectionHeaderTypography(),
                ...updates,
              } as any,
            });
          }}
          showGlobalStyleSelector={true}
          globalStyles={website?.globalStyles}
          availableGlobalStyles={['h2', 'h3']}
        />
      )}

      {/* Name Typography */}
      <TypographyControl
        label="Name Typography"
        defaultOpen={false}
        value={getNameTypography()}
        responsiveFontSize={(getNameTypography() as any).fontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({
          nameTypography: {
            ...getNameTypography(),
            fontSizeResponsive: next,
          } as any,
        })}
        onChange={(updates) => {
          onChange({
            nameTypography: {
              ...getNameTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['h4', 'body']}
      />

      {/* Review Text Typography */}
      <TypographyControl
        label="Review Text Typography"
        defaultOpen={false}
        value={getReviewTextTypography()}
        responsiveFontSize={(getReviewTextTypography() as any).fontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({
          reviewTextTypography: {
            ...getReviewTextTypography(),
            fontSizeResponsive: next,
          } as any,
        })}
        onChange={(updates) => {
          onChange({
            reviewTextTypography: {
              ...getReviewTextTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['body']}
      />

      {/* Date Typography */}
      <TypographyControl
        label="Date Typography"
        defaultOpen={false}
        value={getDateTypography()}
        responsiveFontSize={(getDateTypography() as any).fontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({
          dateTypography: {
            ...getDateTypography(),
            fontSizeResponsive: next,
          } as any,
        })}
        onChange={(updates) => {
          onChange({
            dateTypography: {
              ...getDateTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
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
              globalStyles={website?.globalStyles}
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
            globalStyles={website?.globalStyles}
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
              value={backgroundConfig.type || 'color'}
              onValueChange={(value: 'color' | 'image' | 'video' | 'gradient') => onChange({
                background: { ...backgroundConfig, type: value }
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
          {backgroundConfig.type === 'color' && (
            <div className="space-y-2">
              <Label>Color</Label>
              <GlobalColorInput
                value={backgroundConfig.color}
                onChange={(nextColor) => onChange({ background: { ...backgroundConfig, color: nextColor } })}
                globalStyles={website?.globalStyles}
                defaultColor="#ffffff"
                placeholder="transparent"
              />
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection showBreakpointIcon title="Animations" open={animationsOpen} onToggle={() => setAnimationsOpen(!animationsOpen)}>
        <SectionAnimationsControl
          sectionType="reviews-slider"
          widget={widget as any}
          onChange={(updates) => onChange(updates as any)}
          globalStyles={website?.globalStyles}
        />
      </CollapsibleSection>
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="reviews-slider"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
