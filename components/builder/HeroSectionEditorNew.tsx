'use client';

import { useState } from 'react';
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
  ChevronRight,
  Type
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { SectionEditorTabs } from './SectionEditorTabs';
import { FontSizeInput, fontSizeToCSS, type FontSizeValue } from './FontSizeInput';
import { cn } from '@/lib/utils';
import { useDebouncedInput } from './hooks/useDebouncedInput';

interface HeroSectionEditorNewProps {
  widget: HeroWidget;
  onChange: (updates: Partial<HeroWidget>) => void;
}

export function HeroSectionEditorNew({ widget, onChange }: HeroSectionEditorNewProps) {
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

  // Collapsible states for Layout tab
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [horizontalAlignOpen, setHorizontalAlignOpen] = useState(false);
  const [verticalAlignOpen, setVerticalAlignOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [bgOverlayOpen, setBgOverlayOpen] = useState(false);

  // Collapsible states for Content tab
  const [buttonOpen, setButtonOpen] = useState(false);

  // Collapsible states for Style tab
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [headerStyleOpen, setHeaderStyleOpen] = useState(false);
  const [subtitleStyleOpen, setSubtitleStyleOpen] = useState(false);
  const [buttonStyleOpen, setButtonStyleOpen] = useState(false);
  const [buttonStateTab, setButtonStateTab] = useState<'default' | 'hover'>('default');

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
            <Checkbox id="open-new-tab" />
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
    <div className="space-y-2">
      {/* Typography */}
      <CollapsibleSection title="Typography" open={typographyOpen} onToggle={() => setTypographyOpen(!typographyOpen)}>
        <div className="space-y-3">
          {/* Header Styles */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setHeaderStyleOpen(!headerStyleOpen)}
            >
              <span className="text-sm font-medium">Header</span>
              {headerStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {headerStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Family</Label>
                  <Select
                    value={widget.textStyles?.title?.fontFamily || 'Inter'}
                    onValueChange={(value) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        title: { ...widget.textStyles?.title, fontFamily: value } as any,
                      } as any
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={widget.textStyles?.title?.size || '3rem'}
                    onChange={(value: FontSizeValue) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        title: { ...widget.textStyles?.title, size: fontSizeToCSS(value) } as any,
                      } as any
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Weight</Label>
                  <Select
                    value={widget.textStyles?.title?.weight || '700'}
                    onValueChange={(value) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        title: { ...widget.textStyles?.title, weight: value } as any,
                      } as any
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                      <SelectItem value="800">Extra Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Line Height</Label>
                  <Input
                    value={widget.textStyles?.title?.lineHeight || '1.2'}
                    onChange={(e) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        title: { ...widget.textStyles?.title, lineHeight: e.target.value } as any,
                      } as any
                    })}
                    placeholder="1.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Text Transform</Label>
                  <Select
                    value={(widget.textStyles?.title as any)?.textTransform || 'none'}
                    onValueChange={(value) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        title: { ...widget.textStyles?.title, textTransform: value } as any,
                      } as any
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Normal</SelectItem>
                      <SelectItem value="uppercase">All Caps</SelectItem>
                      <SelectItem value="capitalize">Capitalize</SelectItem>
                      <SelectItem value="lowercase">Lowercase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Letter Spacing</Label>
                  <Input
                    value={widget.textStyles?.title?.letterSpacing || '-0.02em'}
                    onChange={(e) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        title: { ...widget.textStyles?.title, letterSpacing: e.target.value } as any,
                      } as any
                    })}
                    placeholder="-0.02em"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.textStyles?.title?.color || '#ffffff'}
                      onChange={(e) => onChange({
                        textColor: e.target.value,
                        textStyles: {
                          ...widget.textStyles,
                          title: { ...widget.textStyles?.title, color: e.target.value } as any,
                        } as any
                      })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.textStyles?.title?.color || '#ffffff'}
                      onChange={(e) => onChange({
                        textColor: e.target.value,
                        textStyles: {
                          ...widget.textStyles,
                          title: { ...widget.textStyles?.title, color: e.target.value } as any,
                        } as any
                      })}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subtitle Styles */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setSubtitleStyleOpen(!subtitleStyleOpen)}
            >
              <span className="text-sm font-medium">Subtitle</span>
              {subtitleStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {subtitleStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Family</Label>
                  <Select
                    value={widget.textStyles?.subtitle?.fontFamily || 'Inter'}
                    onValueChange={(value) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        subtitle: { ...widget.textStyles?.subtitle, fontFamily: value } as any,
                      } as any
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={widget.textStyles?.subtitle?.size || '1.25rem'}
                    onChange={(value: FontSizeValue) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        subtitle: { ...widget.textStyles?.subtitle, size: fontSizeToCSS(value) } as any,
                      } as any
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Weight</Label>
                  <Select
                    value={widget.textStyles?.subtitle?.weight || '400'}
                    onValueChange={(value) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        subtitle: { ...widget.textStyles?.subtitle, weight: value } as any,
                      } as any
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                      <SelectItem value="800">Extra Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Line Height</Label>
                  <Input
                    value={widget.textStyles?.subtitle?.lineHeight || '1.6'}
                    onChange={(e) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        subtitle: { ...widget.textStyles?.subtitle, lineHeight: e.target.value } as any,
                      } as any
                    })}
                    placeholder="1.6"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Text Transform</Label>
                  <Select
                    value={(widget.textStyles?.subtitle as any)?.textTransform || 'none'}
                    onValueChange={(value) => onChange({
                      textStyles: {
                        ...widget.textStyles,
                        subtitle: { ...widget.textStyles?.subtitle, textTransform: value } as any,
                      } as any
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Normal</SelectItem>
                      <SelectItem value="uppercase">All Caps</SelectItem>
                      <SelectItem value="capitalize">Capitalize</SelectItem>
                      <SelectItem value="lowercase">Lowercase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.textStyles?.subtitle?.color || '#ffffff'}
                      onChange={(e) => onChange({
                        textStyles: {
                          ...widget.textStyles,
                          subtitle: { ...widget.textStyles?.subtitle, color: e.target.value } as any,
                        } as any
                      })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.textStyles?.subtitle?.color || '#ffffff'}
                      onChange={(e) => onChange({
                        textStyles: {
                          ...widget.textStyles,
                          subtitle: { ...widget.textStyles?.subtitle, color: e.target.value } as any,
                        } as any
                      })}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Button */}
      <CollapsibleSection title="Button" open={buttonStyleOpen} onToggle={() => setButtonStyleOpen(!buttonStyleOpen)}>
        <div className="space-y-3">
          {/* State Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              type="button"
              className={cn(
                "flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors",
                buttonStateTab === 'default' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              )}
              onClick={() => setButtonStateTab('default')}
            >
              Default
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors",
                buttonStateTab === 'hover' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              )}
              onClick={() => setButtonStateTab('hover')}
            >
              Hover
            </button>
          </div>

          {buttonStateTab === 'default' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Width</Label>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                    <SelectItem value="custom">Custom (Pixels)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={widget.button?.bgColor || '#3b82f6'}
                    onChange={(e) => onChange({
                      button: { ...widget.button, bgColor: e.target.value } as any
                    })}
                    className="h-10 w-16 rounded border cursor-pointer"
                  />
                  <Input
                    value={widget.button?.bgColor || '#3b82f6'}
                    onChange={(e) => onChange({
                      button: { ...widget.button, bgColor: e.target.value } as any
                    })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Text Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={widget.button?.textColor || '#ffffff'}
                    onChange={(e) => onChange({
                      button: { ...widget.button, textColor: e.target.value } as any
                    })}
                    className="h-10 w-16 rounded border cursor-pointer"
                  />
                  <Input
                    value={widget.button?.textColor || '#ffffff'}
                    onChange={(e) => onChange({
                      button: { ...widget.button, textColor: e.target.value } as any
                    })}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Border Radius: {widget.button?.radius || 8}px</Label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={widget.button?.radius || 8}
                  onChange={(e) => onChange({
                    button: { ...widget.button, radius: parseInt(e.target.value) } as any
                  })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Border Width: {widget.button?.strokeWidth || 0}px</Label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={widget.button?.strokeWidth || 0}
                  onChange={(e) => onChange({
                    button: { ...widget.button, strokeWidth: parseInt(e.target.value) } as any
                  })}
                  className="w-full"
                />
              </div>

              {(widget.button?.strokeWidth || 0) > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs">Border Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.button?.strokeColor || '#000000'}
                      onChange={(e) => onChange({
                        button: { ...widget.button, strokeColor: e.target.value } as any
                      })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.button?.strokeColor || '#000000'}
                      onChange={(e) => onChange({
                        button: { ...widget.button, strokeColor: e.target.value } as any
                      })}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={widget.button?.hasShadow || false}
                    onCheckedChange={(checked) => onChange({
                      button: { ...widget.button, hasShadow: !!checked } as any
                    })}
                    id="button-shadow"
                  />
                  <Label htmlFor="button-shadow" className="text-sm">Drop Shadow</Label>
                </div>
                {widget.button?.hasShadow && (
                  <div className="space-y-2">
                    <Label className="text-xs">Shadow Amount: {widget.button?.shadowAmount || 4}px</Label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={widget.button?.shadowAmount || 4}
                      onChange={(e) => onChange({
                        button: { ...widget.button, shadowAmount: parseInt(e.target.value) } as any
                      })}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Background Opacity: {widget.button?.bgOpacity || 100}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={widget.button?.bgOpacity || 100}
                  onChange={(e) => onChange({
                    button: { ...widget.button, bgOpacity: parseInt(e.target.value) } as any
                  })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Blur Effect: {widget.button?.blurAmount || 0}px</Label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={widget.button?.blurAmount || 0}
                  onChange={(e) => onChange({
                    button: { ...widget.button, blurAmount: parseInt(e.target.value) } as any
                  })}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {buttonStateTab === 'hover' && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Hover state customization coming soon...
            </div>
          )}
        </div>
      </CollapsibleSection>
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
