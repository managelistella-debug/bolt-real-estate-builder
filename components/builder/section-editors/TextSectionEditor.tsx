'use client';

import { useState } from 'react';
import { TextSectionWidget, TextSectionLayout, TextAlignment } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BackgroundControl } from '@/components/builder/BackgroundControl';
import { ChevronDown, ChevronRight, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextSectionEditorProps {
  widget: TextSectionWidget;
  onChange: (updates: Partial<TextSectionWidget>) => void;
}

export function TextSectionEditor({ widget, onChange }: TextSectionEditorProps) {
  const [contentExpanded, setContentExpanded] = useState(true);
  const [layoutStyleExpanded, setLayoutStyleExpanded] = useState(false);
  const [typographyExpanded, setTypographyExpanded] = useState(false);
  const [buttonExpanded, setButtonExpanded] = useState(false);
  const [backgroundExpanded, setBackgroundExpanded] = useState(false);
  const [sectionLayoutExpanded, setSectionLayoutExpanded] = useState(false);

  // Ensure defaults
  const layout = widget.layout || 'side-by-side';
  const headingAlignment = widget.headingAlignment || 'left';
  const bodyAlignment = widget.bodyAlignment || 'left';
  const background = widget.background || { type: 'color', color: 'transparent', opacity: 100, blur: 0 };
  
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

  const buttonStyle = widget.buttonStyle || {
    backgroundColor: '#10b981',
    backgroundOpacity: 100,
    textColor: '#ffffff',
    borderRadius: 8,
    blur: 0,
    shadow: true,
    borderWidth: 0,
    borderColor: '#000000',
  };

  return (
    <div className="space-y-4 p-4">
      {/* Content (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setContentExpanded(!contentExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Content</h4>
          {contentExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {contentExpanded && (
          <div className="p-4 pt-0 space-y-4">
            <div className="space-y-2">
              <Label>Tagline (Optional)</Label>
              <Input
                value={widget.tagline || ''}
                onChange={(e) => onChange({ tagline: e.target.value })}
                placeholder="e.g., LOCAL. RELIABLE. PROFESSIONAL."
              />
            </div>

            {widget.tagline && (
              <div className="space-y-2">
                <Label>Tagline Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={widget.taglineColor || '#10b981'}
                    onChange={(e) => onChange({ taglineColor: e.target.value })}
                    className="h-10 w-16 rounded border cursor-pointer"
                  />
                  <Input
                    value={widget.taglineColor || '#10b981'}
                    onChange={(e) => onChange({ taglineColor: e.target.value })}
                    placeholder="#10b981"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Heading</Label>
              <Textarea
                value={widget.heading}
                onChange={(e) => onChange({ heading: e.target.value })}
                placeholder="Enter your heading..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Heading Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={widget.headingColor || '#1f2937'}
                  onChange={(e) => onChange({ headingColor: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={widget.headingColor || '#1f2937'}
                  onChange={(e) => onChange({ headingColor: e.target.value })}
                  placeholder="#1f2937"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Body Text</Label>
              <Textarea
                value={widget.bodyText}
                onChange={(e) => onChange({ bodyText: e.target.value })}
                placeholder="Enter your body text..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Body Text Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={widget.bodyTextColor || '#6b7280'}
                  onChange={(e) => onChange({ bodyTextColor: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={widget.bodyTextColor || '#6b7280'}
                  onChange={(e) => onChange({ bodyTextColor: e.target.value })}
                  placeholder="#6b7280"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layout & Style (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setLayoutStyleExpanded(!layoutStyleExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Layout & Style</h4>
          {layoutStyleExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {layoutStyleExpanded && (
          <div className="p-4 pt-0 space-y-4">
            <div className="space-y-2">
              <Label>Layout Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onChange({ layout: 'side-by-side' })}
                  className={`p-3 border-2 rounded-lg text-sm transition-all ${
                    layout === 'side-by-side' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">Side by Side</div>
                  <div className="text-xs text-muted-foreground mt-1">Heading left, text right</div>
                </button>
                <button
                  onClick={() => onChange({ layout: 'stacked' })}
                  className={`p-3 border-2 rounded-lg text-sm transition-all ${
                    layout === 'stacked' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">Stacked</div>
                  <div className="text-xs text-muted-foreground mt-1">Heading above text</div>
                </button>
              </div>
            </div>

            {layout === 'side-by-side' && (
              <>
                <div className="flex items-center justify-between">
                  <Label>Reverse Order</Label>
                  <button
                    onClick={() => onChange({ reverseOrder: !widget.reverseOrder })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      widget.reverseOrder ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        widget.reverseOrder ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <Label>Column Gap</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={80}
                      value={widget.columnGap ?? 60}
                      onChange={(e) => onChange({ columnGap: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{widget.columnGap ?? 60}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Heading Column Width</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={30}
                      max={70}
                      value={widget.headingColumnWidth ?? 40}
                      onChange={(e) => onChange({ headingColumnWidth: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{widget.headingColumnWidth ?? 40}%</span>
                  </div>
                </div>
              </>
            )}

            {layout === 'stacked' && (
              <div className="space-y-2">
                <Label>Row Gap</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={widget.rowGap ?? 24}
                    onChange={(e) => onChange({ rowGap: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-right">{widget.rowGap ?? 24}px</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Heading Alignment</Label>
              <div className="flex gap-2">
                <button
                  onClick={() => onChange({ headingAlignment: 'left' })}
                  className={`flex-1 p-2 border-2 rounded transition-all ${
                    headingAlignment === 'left' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <AlignLeft className="h-5 w-5 mx-auto" />
                </button>
                <button
                  onClick={() => onChange({ headingAlignment: 'center' })}
                  className={`flex-1 p-2 border-2 rounded transition-all ${
                    headingAlignment === 'center' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <AlignCenter className="h-5 w-5 mx-auto" />
                </button>
                <button
                  onClick={() => onChange({ headingAlignment: 'right' })}
                  className={`flex-1 p-2 border-2 rounded transition-all ${
                    headingAlignment === 'right' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <AlignRight className="h-5 w-5 mx-auto" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Body Alignment</Label>
              <div className="flex gap-2">
                <button
                  onClick={() => onChange({ bodyAlignment: 'left' })}
                  className={`flex-1 p-2 border-2 rounded transition-all ${
                    bodyAlignment === 'left' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <AlignLeft className="h-5 w-5 mx-auto" />
                </button>
                <button
                  onClick={() => onChange({ bodyAlignment: 'center' })}
                  className={`flex-1 p-2 border-2 rounded transition-all ${
                    bodyAlignment === 'center' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <AlignCenter className="h-5 w-5 mx-auto" />
                </button>
                <button
                  onClick={() => onChange({ bodyAlignment: 'right' })}
                  className={`flex-1 p-2 border-2 rounded transition-all ${
                    bodyAlignment === 'right' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <AlignRight className="h-5 w-5 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Typography (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setTypographyExpanded(!typographyExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Typography</h4>
          {typographyExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {typographyExpanded && (
          <div className="p-4 pt-0 space-y-4">
            {widget.tagline && (
              <div className="space-y-2">
                <Label>Tagline Font Size (px)</Label>
                <Input
                  type="number"
                  min={10}
                  max={24}
                  value={widget.taglineSize ?? 14}
                  onChange={(e) => onChange({ taglineSize: parseInt(e.target.value) || 14 })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Heading Font Size (px)</Label>
              <Input
                type="number"
                min={20}
                max={80}
                value={widget.headingSize ?? 48}
                onChange={(e) => onChange({ headingSize: parseInt(e.target.value) || 48 })}
              />
            </div>

            <div className="space-y-2">
              <Label>Body Font Size (px)</Label>
              <Input
                type="number"
                min={12}
                max={24}
                value={widget.bodySize ?? 16}
                onChange={(e) => onChange({ bodySize: parseInt(e.target.value) || 16 })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Button (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setButtonExpanded(!buttonExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Button (Optional)</h4>
          {buttonExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {buttonExpanded && (
          <div className="p-4 pt-0 space-y-4">
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
              <>
                <div className="space-y-2">
                  <Label>Button URL</Label>
                  <Input
                    value={widget.buttonUrl || ''}
                    onChange={(e) => onChange({ buttonUrl: e.target.value })}
                    placeholder="/contact"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={buttonStyle.backgroundColor}
                      onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, backgroundColor: e.target.value } })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={buttonStyle.backgroundColor}
                      onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, backgroundColor: e.target.value } })}
                      placeholder="#10b981"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Background Opacity</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={buttonStyle.backgroundOpacity}
                      onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, backgroundOpacity: parseInt(e.target.value) } })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{buttonStyle.backgroundOpacity}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={buttonStyle.textColor}
                      onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, textColor: e.target.value } })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={buttonStyle.textColor}
                      onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, textColor: e.target.value } })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={buttonStyle.borderRadius}
                      onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, borderRadius: parseInt(e.target.value) } })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{buttonStyle.borderRadius}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Blur Level</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={buttonStyle.blur}
                      onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, blur: parseInt(e.target.value) } })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{buttonStyle.blur}px</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable Shadow</Label>
                  <button
                    onClick={() => onChange({ buttonStyle: { ...buttonStyle, shadow: !buttonStyle.shadow } })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      buttonStyle.shadow ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        buttonStyle.shadow ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <Label>Border Width</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={8}
                      value={buttonStyle.borderWidth}
                      onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, borderWidth: parseInt(e.target.value) } })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{buttonStyle.borderWidth}px</span>
                  </div>
                </div>

                {buttonStyle.borderWidth > 0 && (
                  <div className="space-y-2">
                    <Label>Border Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={buttonStyle.borderColor}
                        onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, borderColor: e.target.value } })}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <Input
                        value={buttonStyle.borderColor}
                        onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, borderColor: e.target.value } })}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Background (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setBackgroundExpanded(!backgroundExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Background</h4>
          {backgroundExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {backgroundExpanded && (
          <div className="p-4 pt-0">
            <BackgroundControl value={background} onChange={(bg) => onChange({ background: bg })} />
          </div>
        )}
      </div>

      {/* Section Layout (Collapsible) */}
      <div className="border rounded-lg">
        <button
          onClick={() => setSectionLayoutExpanded(!sectionLayoutExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium text-sm">Section Layout</h4>
          {sectionLayoutExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {sectionLayoutExpanded && (
          <div className="p-4 pt-0 space-y-4">
            {/* Height */}
            <div className="space-y-2">
              <Label>Height</Label>
              <div className="flex gap-2">
                <Select
                  value={layoutCfg.height.type || 'auto'}
                  onValueChange={(value) =>
                    onChange({
                      layout: {
                        ...layoutCfg,
                        height: {
                          type: value as any,
                          value: layoutCfg.height.value,
                        },
                      },
                    })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="vh">VH</SelectItem>
                    <SelectItem value="pixels">Pixels</SelectItem>
                  </SelectContent>
                </Select>
                {layoutCfg.height.type !== 'auto' && (
                  <Input
                    type="number"
                    value={layoutCfg.height.value || 100}
                    onChange={(e) =>
                      onChange({
                        layout: {
                          ...layoutCfg,
                          height: {
                            ...layoutCfg.height,
                            value: parseInt(e.target.value) || 100,
                          },
                        },
                      })
                    }
                  />
                )}
              </div>
            </div>

            {/* Width */}
            <div className="space-y-2">
              <Label>Width</Label>
              <Select
                value={layoutCfg.width || 'container'}
                onValueChange={(value) =>
                  onChange({
                    layout: {
                      ...layoutCfg,
                      width: value as 'full' | 'container',
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Width</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Padding */}
            <div className="space-y-2">
              <Label>Padding (px)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Top"
                  value={layoutCfg.padding.top || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layoutCfg,
                        padding: {
                          ...layoutCfg.padding,
                          top: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Right"
                  value={layoutCfg.padding.right || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layoutCfg,
                        padding: {
                          ...layoutCfg.padding,
                          right: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Bottom"
                  value={layoutCfg.padding.bottom || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layoutCfg,
                        padding: {
                          ...layoutCfg.padding,
                          bottom: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Left"
                  value={layoutCfg.padding.left || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layoutCfg,
                        padding: {
                          ...layoutCfg.padding,
                          left: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Margin */}
            <div className="space-y-2">
              <Label>Margin (px)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Top"
                  value={layoutCfg.margin.top || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layoutCfg,
                        margin: {
                          ...layoutCfg.margin,
                          top: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Right"
                  value={layoutCfg.margin.right || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layoutCfg,
                        margin: {
                          ...layoutCfg.margin,
                          right: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Bottom"
                  value={layoutCfg.margin.bottom || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layoutCfg,
                        margin: {
                          ...layoutCfg.margin,
                          bottom: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Left"
                  value={layoutCfg.margin.left || 0}
                  onChange={(e) =>
                    onChange({
                      layout: {
                        ...layoutCfg,
                        margin: {
                          ...layoutCfg.margin,
                          left: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
