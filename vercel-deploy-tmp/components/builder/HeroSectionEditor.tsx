'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HeroWidget } from '@/lib/types';
import { 
  ChevronDown, 
  ChevronUp, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd
} from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FontSizeInput } from './FontSizeInput';
import { ImageUpload } from './ImageUpload';

interface HeroSectionEditorProps {
  widget: HeroWidget;
  onChange: (updates: Partial<HeroWidget>) => void;
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-sm">{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

export function HeroSectionEditor({ widget, onChange }: HeroSectionEditorProps) {
  return (
    <div className="space-y-4">
      {/* Content Fields - Always Visible */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={widget.title || widget.headline || ''}
            onChange={(e) => onChange({ title: e.target.value, headline: e.target.value })}
            placeholder="Welcome to Our Website"
          />
        </div>

        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea
            value={widget.subtitle || widget.subheadline || ''}
            onChange={(e) => onChange({ subtitle: e.target.value, subheadline: e.target.value })}
            placeholder="We help you build amazing experiences"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={widget.button?.text || widget.cta?.text || ''}
              onChange={(e) => onChange({ 
                button: { ...widget.button, text: e.target.value } as any,
                cta: { ...widget.cta, text: e.target.value } as any
              })}
              placeholder="Get Started"
            />
          </div>
          <div className="space-y-2">
            <Label>Button URL</Label>
            <Input
              value={widget.button?.url || widget.cta?.url || ''}
              onChange={(e) => onChange({ 
                button: { ...widget.button, url: e.target.value } as any,
                cta: { ...widget.cta, url: e.target.value } as any
              })}
              placeholder="#"
            />
          </div>
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <Label>Text Color</Label>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="color"
              value={widget.textColor || widget.textStyles?.title?.color || '#ffffff'}
              onChange={(e) => onChange({ 
                textColor: e.target.value,
                textStyles: {
                  ...widget.textStyles,
                  title: { ...widget.textStyles?.title, color: e.target.value } as any,
                  subtitle: { ...widget.textStyles?.subtitle, color: e.target.value } as any,
                } as any
              })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
          </div>
          <Input
            value={widget.textColor || widget.textStyles?.title?.color || '#ffffff'}
            onChange={(e) => onChange({ 
              textColor: e.target.value,
              textStyles: {
                ...widget.textStyles,
                title: { ...widget.textStyles?.title, color: e.target.value } as any,
                subtitle: { ...widget.textStyles?.subtitle, color: e.target.value } as any,
              } as any
            })}
            placeholder="#FFFFFF"
            className="flex-1"
          />
        </div>
      </div>

      {/* Background Section */}
      <CollapsibleSection title="Background" defaultOpen={true}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Background Type</Label>
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
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {widget.background?.type === 'color' && (
            <div className="space-y-2">
              <Label>Background Color</Label>
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
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {widget.background?.type === 'image' && (
            <>
              <ImageUpload
                label="Background Image"
                value={widget.background?.url || ''}
                onChange={(url) => {
                  console.log('Image URL received in HeroSectionEditor:', url.substring(0, 50) + '...');
                  try {
                    onChange({
                      background: { 
                        type: 'image',
                        opacity: widget.background?.opacity || 100,
                        blur: widget.background?.blur || 0,
                        ...widget.background, 
                        url 
                      } as any
                    });
                  } catch (error: any) {
                    console.error('Failed to save image:', error);
                    if (error.name === 'QuotaExceededError' || error.message?.includes('quota')) {
                      alert('Storage limit exceeded. Please use a smaller image or delete some existing images first.');
                    } else {
                      alert('Failed to save image: ' + error.message);
                    }
                  }
                }}
                maxSizeMB={1}
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
            <>
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  value={widget.background?.url || ''}
                  onChange={(e) => onChange({
                    background: { ...widget.background, url: e.target.value } as any
                  })}
                  placeholder="https://youtube.com/... or https://cdn.com/video.mp4"
                />
                <p className="text-xs text-muted-foreground">
                  Videos must be hosted externally (YouTube, CDN like bunny.net, etc.)
                </p>
              </div>

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

          {widget.background?.type === 'gradient' && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={widget.background?.gradient?.enabled || false}
                  onCheckedChange={(checked) => onChange({
                    background: { 
                      ...widget.background, 
                      gradient: { ...widget.background.gradient, enabled: !!checked } 
                    } as any
                  })}
                  id="gradient-enabled"
                />
                <Label htmlFor="gradient-enabled">Enable Gradient</Label>
              </div>

              {widget.background?.gradient?.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Start Color</Label>
                      <input
                        type="color"
                        value={widget.background?.gradient?.colorStart || '#3b82f6'}
                        onChange={(e) => onChange({
                          background: { 
                            ...widget.background, 
                            gradient: { ...widget.background.gradient, colorStart: e.target.value } 
                          } as any
                        })}
                        className="h-10 w-full rounded border cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Color</Label>
                      <input
                        type="color"
                        value={widget.background?.gradient?.colorEnd || '#8b5cf6'}
                        onChange={(e) => onChange({
                          background: { 
                            ...widget.background, 
                            gradient: { ...widget.background.gradient, colorEnd: e.target.value } 
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
                          gradient: { ...widget.background.gradient, angle: parseInt(e.target.value) } 
                        } as any
                      })}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Background Overlay */}
      <CollapsibleSection title="Background Overlay">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={widget.background?.overlay?.enabled || false}
              onCheckedChange={(checked) => onChange({
                background: { 
                  ...widget.background, 
                  overlay: { ...widget.background?.overlay, enabled: !!checked, color: widget.background?.overlay?.color || '#000000', opacity: widget.background?.overlay?.opacity || 50 } 
                } as any
              })}
              id="overlay-enabled"
            />
            <Label htmlFor="overlay-enabled">Enable Overlay</Label>
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
                        overlay: { ...widget.background.overlay, color: e.target.value } 
                      } as any
                    })}
                    className="h-10 w-16 rounded border cursor-pointer"
                  />
                  <Input
                    value={widget.background?.overlay?.color || '#000000'}
                    onChange={(e) => onChange({
                      background: { 
                        ...widget.background, 
                        overlay: { ...widget.background.overlay, color: e.target.value } 
                      } as any
                    })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Overlay Opacity: {widget.background?.overlay?.opacity || 50}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={widget.background?.overlay?.opacity || 50}
                  onChange={(e) => onChange({
                    background: { 
                      ...widget.background, 
                      overlay: { ...widget.background.overlay, opacity: parseInt(e.target.value) } 
                    } as any
                  })}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={widget.background?.overlay?.gradient?.enabled || false}
                  onCheckedChange={(checked) => onChange({
                    background: { 
                      ...widget.background, 
                      overlay: { 
                        ...widget.background.overlay, 
                        gradient: { ...widget.background.overlay?.gradient, enabled: !!checked, colorStart: '#000000', colorEnd: '#ffffff', angle: 45 } 
                      } 
                    } as any
                  })}
                  id="overlay-gradient-enabled"
                />
                <Label htmlFor="overlay-gradient-enabled">Gradient Overlay</Label>
              </div>

              {widget.background?.overlay?.gradient?.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Start Color</Label>
                      <input
                        type="color"
                        value={widget.background?.overlay?.gradient?.colorStart || '#000000'}
                        onChange={(e) => onChange({
                          background: { 
                            ...widget.background, 
                            overlay: { 
                              ...widget.background.overlay, 
                              gradient: { ...widget.background.overlay.gradient, colorStart: e.target.value } 
                            } 
                          } as any
                        })}
                        className="h-10 w-full rounded border cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Color</Label>
                      <input
                        type="color"
                        value={widget.background?.overlay?.gradient?.colorEnd || '#ffffff'}
                        onChange={(e) => onChange({
                          background: { 
                            ...widget.background, 
                            overlay: { 
                              ...widget.background.overlay, 
                              gradient: { ...widget.background.overlay.gradient, colorEnd: e.target.value } 
                            } 
                          } as any
                        })}
                        className="h-10 w-full rounded border cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Gradient Angle: {widget.background?.overlay?.gradient?.angle || 45}°</Label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={widget.background?.overlay?.gradient?.angle || 45}
                      onChange={(e) => onChange({
                        background: { 
                          ...widget.background, 
                          overlay: { 
                            ...widget.background.overlay, 
                            gradient: { ...widget.background.overlay.gradient, angle: parseInt(e.target.value) } 
                          } 
                        } as any
                      })}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Section Layout */}
      <CollapsibleSection title="Section Layout">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Height</Label>
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
                  className="w-20"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Width</Label>
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
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="container">Container</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Padding</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Top"
                value={widget.layout?.padding?.top || 80}
                onChange={(e) => onChange({
                  layout: { 
                    ...widget.layout, 
                    padding: { ...widget.layout?.padding, top: parseInt(e.target.value) } 
                  } as any
                })}
              />
              <Input
                type="number"
                placeholder="Right"
                value={widget.layout?.padding?.right || 40}
                onChange={(e) => onChange({
                  layout: { 
                    ...widget.layout, 
                    padding: { ...widget.layout?.padding, right: parseInt(e.target.value) } 
                  } as any
                })}
              />
              <Input
                type="number"
                placeholder="Bottom"
                value={widget.layout?.padding?.bottom || 80}
                onChange={(e) => onChange({
                  layout: { 
                    ...widget.layout, 
                    padding: { ...widget.layout?.padding, bottom: parseInt(e.target.value) } 
                  } as any
                })}
              />
              <Input
                type="number"
                placeholder="Left"
                value={widget.layout?.padding?.left || 40}
                onChange={(e) => onChange({
                  layout: { 
                    ...widget.layout, 
                    padding: { ...widget.layout?.padding, left: parseInt(e.target.value) } 
                  } as any
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Margin</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Top"
                value={widget.layout?.margin?.top || 0}
                onChange={(e) => onChange({
                  layout: { 
                    ...widget.layout, 
                    margin: { ...widget.layout?.margin, top: parseInt(e.target.value) } 
                  } as any
                })}
              />
              <Input
                type="number"
                placeholder="Right"
                value={widget.layout?.margin?.right || 0}
                onChange={(e) => onChange({
                  layout: { 
                    ...widget.layout, 
                    margin: { ...widget.layout?.margin, right: parseInt(e.target.value) } 
                  } as any
                })}
              />
              <Input
                type="number"
                placeholder="Bottom"
                value={widget.layout?.margin?.bottom || 0}
                onChange={(e) => onChange({
                  layout: { 
                    ...widget.layout, 
                    margin: { ...widget.layout?.margin, bottom: parseInt(e.target.value) } 
                  } as any
                })}
              />
              <Input
                type="number"
                placeholder="Left"
                value={widget.layout?.margin?.left || 0}
                onChange={(e) => onChange({
                  layout: { 
                    ...widget.layout, 
                    margin: { ...widget.layout?.margin, left: parseInt(e.target.value) } 
                  } as any
                })}
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Text Styles */}
      <CollapsibleSection title="Text Styles">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select
              value={widget.textStyles?.title?.fontFamily || 'Inter'}
              onValueChange={(value) => onChange({
                textStyles: {
                  title: { ...widget.textStyles?.title, fontFamily: value } as any,
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
                <SelectItem value="Courier New">Courier New</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FontSizeInput
            label="Title Size"
            value={widget.textStyles?.title?.size || '3rem'}
            onChange={(value) => onChange({
              textStyles: {
                ...widget.textStyles,
                title: { ...widget.textStyles?.title, size: value } as any,
              } as any
            })}
          />

          <div className="space-y-2">
            <Label>Title Weight</Label>
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
                <SelectItem value="300">Light (300)</SelectItem>
                <SelectItem value="400">Regular (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semi Bold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
                <SelectItem value="800">Extra Bold (800)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FontSizeInput
            label="Subtitle Size"
            value={widget.textStyles?.subtitle?.size || '1.25rem'}
            onChange={(value) => onChange({
              textStyles: {
                ...widget.textStyles,
                subtitle: { ...widget.textStyles?.subtitle, size: value } as any,
              } as any
            })}
          />
        </div>
      </CollapsibleSection>

      {/* Text Position */}
      <CollapsibleSection title="Text Position">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Horizontal Alignment</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={widget.textPosition?.horizontal === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ 
                  textPosition: { ...widget.textPosition, horizontal: 'left' } as any,
                  alignment: 'left'
                })}
                className="w-full"
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
                className="w-full"
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
                className="w-full"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vertical Alignment</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={widget.textPosition?.vertical === 'top' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ 
                  textPosition: { ...widget.textPosition, vertical: 'top' } as any
                })}
                className="w-full"
              >
                <AlignVerticalJustifyStart className="h-4 w-4" />
              </Button>
              <Button
                variant={widget.textPosition?.vertical === 'middle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ 
                  textPosition: { ...widget.textPosition, vertical: 'middle' } as any
                })}
                className="w-full"
              >
                <AlignVerticalJustifyCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={widget.textPosition?.vertical === 'bottom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ 
                  textPosition: { ...widget.textPosition, vertical: 'bottom' } as any
                })}
                className="w-full"
              >
                <AlignVerticalJustifyEnd className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Button Style */}
      <CollapsibleSection title="Button Style">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Border Radius: {widget.button?.radius || 8}px</Label>
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
            <Label>Background Color</Label>
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
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Text Color</Label>
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
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Opacity: {widget.button?.bgOpacity !== undefined ? widget.button.bgOpacity : 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={widget.button?.bgOpacity !== undefined ? widget.button.bgOpacity : 100}
              onChange={(e) => onChange({
                button: { ...widget.button, bgOpacity: parseInt(e.target.value) } as any
              })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Blur Effect: {widget.button?.blurAmount || 0}px</Label>
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

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={widget.button?.hasShadow || false}
              onCheckedChange={(checked) => onChange({
                button: { ...widget.button, hasShadow: !!checked } as any
              })}
              id="button-shadow"
            />
            <Label htmlFor="button-shadow">Shadow Effect</Label>
          </div>

          {widget.button?.hasShadow && (
            <div className="space-y-2">
              <Label>Shadow Amount: {widget.button?.shadowAmount || 4}px</Label>
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

          <div className="space-y-2">
            <Label>Stroke Width: {widget.button?.strokeWidth || 0}px</Label>
            <input
              type="range"
              min="0"
              max="5"
              value={widget.button?.strokeWidth || 0}
              onChange={(e) => onChange({
                button: { ...widget.button, strokeWidth: parseInt(e.target.value) } as any
              })}
              className="w-full"
            />
          </div>

          {(widget.button?.strokeWidth || 0) > 0 && (
            <div className="space-y-2">
              <Label>Stroke Color</Label>
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
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Spacing & Border */}
      <CollapsibleSection title="Spacing & Border">
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Additional spacing and border controls are available in the Section Layout section.
          </p>
          
          {widget.border && (
            <>
              <div className="space-y-2">
                <Label>Border Width: {widget.border?.width || 0}px</Label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={widget.border?.width || 0}
                  onChange={(e) => onChange({
                    border: { ...widget.border, width: parseInt(e.target.value) } as any
                  })}
                  className="w-full"
                />
              </div>

              {(widget.border?.width || 0) > 0 && (
                <>
                  <div className="space-y-2">
                    <Label>Border Style</Label>
                    <Select
                      value={widget.border?.style || 'solid'}
                      onValueChange={(value: 'solid' | 'dashed' | 'dotted') => onChange({
                        border: { ...widget.border, style: value } as any
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                        <SelectItem value="dotted">Dotted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Border Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={widget.border?.color || '#000000'}
                        onChange={(e) => onChange({
                          border: { ...widget.border, color: e.target.value } as any
                        })}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <Input
                        value={widget.border?.color || '#000000'}
                        onChange={(e) => onChange({
                          border: { ...widget.border, color: e.target.value } as any
                        })}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}
