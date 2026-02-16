'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageTextWidget } from '@/lib/types';
import { AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';
import { useBuilderStore } from '@/lib/stores/builder';
import { resolveResponsiveValue, updateResponsiveValue } from '@/lib/responsive';
import { ResponsiveControlShell } from '../controls/ResponsiveControlShell';

interface ImageTextEditorProps {
  widget: ImageTextWidget;
  onChange: (updates: Partial<ImageTextWidget>) => void;
}

export function ImageTextEditor({ widget, onChange }: ImageTextEditorProps) {
  const { deviceView } = useBuilderStore();
  const activeTextAlign = resolveResponsiveValue<'left' | 'center' | 'right'>(
    widget.textAlignResponsive,
    deviceView,
    widget.textAlign || 'left',
  );
  const activeMobileLayout = resolveResponsiveValue<'stacked-image-top' | 'stacked-image-bottom' | 'horizontal'>(
    widget.mobileLayoutResponsive,
    deviceView,
    widget.mobileLayout || 'stacked-image-top',
  );

  return (
    <div className="space-y-4">
      {/* Image Upload */}
      <ImageUpload
        label="Section Image"
        value={widget.image}
        onChange={(url) => onChange({ image: url })}
        maxSizeMB={1}
      />

      {/* Image Height */}
      <div className="space-y-2">
        <Label>Image Frame Height</Label>
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
        <p className="text-xs text-muted-foreground">
          Sets the container height. Image will fill the frame based on fit settings.
        </p>
      </div>

      {/* Image Border Radius */}
      <div className="space-y-2">
        <Label>Image Border Radius: {widget.imageBorderRadius || 0}px</Label>
        <input
          type="range"
          min="0"
          max="50"
          value={widget.imageBorderRadius || 0}
          onChange={(e) => onChange({ imageBorderRadius: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Image Object Fit */}
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

      {/* Image Object Position */}
      <div className="space-y-2">
        <Label>Image Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={widget.imageObjectPosition?.x || 'center'}
            onValueChange={(value) => onChange({
              imageObjectPosition: { ...widget.imageObjectPosition, x: value, y: widget.imageObjectPosition?.y || 'center' }
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Horizontal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={widget.imageObjectPosition?.y || 'center'}
            onValueChange={(value) => onChange({
              imageObjectPosition: { ...widget.imageObjectPosition, y: value, x: widget.imageObjectPosition?.x || 'center' }
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vertical" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Layout */}
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

      {/* Mobile Layout */}
      <div className="space-y-2">
        <ResponsiveControlShell
          label="Mobile Layout"
          hasOverride={!!widget.mobileLayoutResponsive?.mobile}
        >
        <Select
          value={activeMobileLayout}
          onValueChange={(value: 'stacked-image-top' | 'stacked-image-bottom' | 'horizontal') => onChange({
            mobileLayout: value,
            mobileLayoutResponsive: updateResponsiveValue(widget.mobileLayoutResponsive, deviceView, value),
          })}
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
        </ResponsiveControlShell>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={widget.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Section title"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea
          value={widget.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Add your content here..."
          rows={4}
        />
      </div>

      {/* Text Horizontal Alignment */}
      <div className="space-y-2">
        <ResponsiveControlShell
          label="Text Alignment"
          hasOverride={!!widget.textAlignResponsive?.tablet || !!widget.textAlignResponsive?.mobile}
        >
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={activeTextAlign === 'left' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({
              textAlign: deviceView === 'desktop' ? 'left' : widget.textAlign,
              textAlignResponsive: updateResponsiveValue(widget.textAlignResponsive, deviceView, 'left'),
            })}
            className="w-full"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTextAlign === 'center' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({
              textAlign: deviceView === 'desktop' ? 'center' : widget.textAlign,
              textAlignResponsive: updateResponsiveValue(widget.textAlignResponsive, deviceView, 'center'),
            })}
            className="w-full"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTextAlign === 'right' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({
              textAlign: deviceView === 'desktop' ? 'right' : widget.textAlign,
              textAlignResponsive: updateResponsiveValue(widget.textAlignResponsive, deviceView, 'right'),
            })}
            className="w-full"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
        </ResponsiveControlShell>
      </div>

      {/* Text Vertical Alignment */}
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

      {/* CTA Button */}
      <div className="space-y-2">
        <Label>Button Text (Optional)</Label>
        <Input
          value={widget.cta?.text || ''}
          onChange={(e) => onChange({ cta: { ...widget.cta, text: e.target.value, url: widget.cta?.url || '' } })}
          placeholder="Learn More"
        />
      </div>

      {widget.cta?.text && (
        <>
          <div className="space-y-2">
            <Label>Button URL</Label>
            <Input
              value={widget.cta?.url || ''}
              onChange={(e) => onChange({ cta: { ...widget.cta, url: e.target.value } })}
              placeholder="https://..."
            />
          </div>

          {/* Button Styling */}
          <div className="pt-4 border-t">
            <Label className="text-sm font-semibold mb-3 block">Button Style</Label>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Border Radius: {widget.buttonStyles?.radius || 8}px</Label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={widget.buttonStyles?.radius || 8}
                  onChange={(e) => onChange({
                    buttonStyles: { 
                      ...widget.buttonStyles, 
                      radius: parseInt(e.target.value),
                      bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                      textColor: widget.buttonStyles?.textColor || '#ffffff',
                      hasShadow: widget.buttonStyles?.hasShadow ?? true,
                      shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                      strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                      strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                    }
                  })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={widget.buttonStyles?.bgColor || '#3b82f6'}
                    onChange={(e) => onChange({
                      buttonStyles: { 
                        ...widget.buttonStyles, 
                        bgColor: e.target.value,
                        radius: widget.buttonStyles?.radius || 8,
                        textColor: widget.buttonStyles?.textColor || '#ffffff',
                        hasShadow: widget.buttonStyles?.hasShadow ?? true,
                        shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                        strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                        strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                      }
                    })}
                    className="h-10 w-16 rounded border cursor-pointer"
                  />
                  <Input
                    value={widget.buttonStyles?.bgColor || '#3b82f6'}
                    onChange={(e) => onChange({
                      buttonStyles: { 
                        ...widget.buttonStyles, 
                        bgColor: e.target.value,
                        radius: widget.buttonStyles?.radius || 8,
                        textColor: widget.buttonStyles?.textColor || '#ffffff',
                        hasShadow: widget.buttonStyles?.hasShadow ?? true,
                        shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                        strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                        strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                      }
                    })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background Opacity: {widget.buttonStyles?.bgOpacity !== undefined ? widget.buttonStyles.bgOpacity : 100}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={widget.buttonStyles?.bgOpacity !== undefined ? widget.buttonStyles.bgOpacity : 100}
                  onChange={(e) => onChange({
                    buttonStyles: { 
                      ...widget.buttonStyles, 
                      bgOpacity: parseInt(e.target.value),
                      radius: widget.buttonStyles?.radius || 8,
                      bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                      textColor: widget.buttonStyles?.textColor || '#ffffff',
                      hasShadow: widget.buttonStyles?.hasShadow ?? true,
                      shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                      strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                      strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                    }
                  })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Blur Effect: {widget.buttonStyles?.blurAmount || 0}px</Label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={widget.buttonStyles?.blurAmount || 0}
                  onChange={(e) => onChange({
                    buttonStyles: { 
                      ...widget.buttonStyles, 
                      blurAmount: parseInt(e.target.value),
                      radius: widget.buttonStyles?.radius || 8,
                      bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                      textColor: widget.buttonStyles?.textColor || '#ffffff',
                      hasShadow: widget.buttonStyles?.hasShadow ?? true,
                      shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                      strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                      strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                    }
                  })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={widget.buttonStyles?.textColor || '#ffffff'}
                    onChange={(e) => onChange({
                      buttonStyles: { 
                        ...widget.buttonStyles, 
                        textColor: e.target.value,
                        radius: widget.buttonStyles?.radius || 8,
                        bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                        hasShadow: widget.buttonStyles?.hasShadow ?? true,
                        shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                        strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                        strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                      }
                    })}
                    className="h-10 w-16 rounded border cursor-pointer"
                  />
                  <Input
                    value={widget.buttonStyles?.textColor || '#ffffff'}
                    onChange={(e) => onChange({
                      buttonStyles: { 
                        ...widget.buttonStyles, 
                        textColor: e.target.value,
                        radius: widget.buttonStyles?.radius || 8,
                        bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                        hasShadow: widget.buttonStyles?.hasShadow ?? true,
                        shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                        strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                        strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                      }
                    })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={widget.buttonStyles?.hasShadow ?? true}
                  onChange={(e) => onChange({
                    buttonStyles: { 
                      ...widget.buttonStyles, 
                      hasShadow: e.target.checked,
                      radius: widget.buttonStyles?.radius || 8,
                      bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                      textColor: widget.buttonStyles?.textColor || '#ffffff',
                      shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                      strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                      strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                    }
                  })}
                  id="button-shadow"
                  className="rounded"
                />
                <Label htmlFor="button-shadow">Shadow Effect</Label>
              </div>

              {widget.buttonStyles?.hasShadow && (
                <div className="space-y-2">
                  <Label>Shadow Amount: {widget.buttonStyles?.shadowAmount || 4}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={widget.buttonStyles?.shadowAmount || 4}
                    onChange={(e) => onChange({
                      buttonStyles: { 
                        ...widget.buttonStyles, 
                        shadowAmount: parseInt(e.target.value),
                        radius: widget.buttonStyles?.radius || 8,
                        bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                        textColor: widget.buttonStyles?.textColor || '#ffffff',
                        hasShadow: widget.buttonStyles?.hasShadow ?? true,
                        strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                        strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                      }
                    })}
                    className="w-full"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Stroke Width: {widget.buttonStyles?.strokeWidth || 0}px</Label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={widget.buttonStyles?.strokeWidth || 0}
                  onChange={(e) => onChange({
                    buttonStyles: { 
                      ...widget.buttonStyles, 
                      strokeWidth: parseInt(e.target.value),
                      radius: widget.buttonStyles?.radius || 8,
                      bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                      textColor: widget.buttonStyles?.textColor || '#ffffff',
                      hasShadow: widget.buttonStyles?.hasShadow ?? true,
                      shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                      strokeColor: widget.buttonStyles?.strokeColor || '#000000',
                    }
                  })}
                  className="w-full"
                />
              </div>

              {(widget.buttonStyles?.strokeWidth || 0) > 0 && (
                <div className="space-y-2">
                  <Label>Stroke Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.buttonStyles?.strokeColor || '#000000'}
                      onChange={(e) => onChange({
                        buttonStyles: { 
                          ...widget.buttonStyles, 
                          strokeColor: e.target.value,
                          radius: widget.buttonStyles?.radius || 8,
                          bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                          textColor: widget.buttonStyles?.textColor || '#ffffff',
                          hasShadow: widget.buttonStyles?.hasShadow ?? true,
                          shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                          strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                        }
                      })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.buttonStyles?.strokeColor || '#000000'}
                      onChange={(e) => onChange({
                        buttonStyles: { 
                          ...widget.buttonStyles, 
                          strokeColor: e.target.value,
                          radius: widget.buttonStyles?.radius || 8,
                          bgColor: widget.buttonStyles?.bgColor || '#3b82f6',
                          textColor: widget.buttonStyles?.textColor || '#ffffff',
                          hasShadow: widget.buttonStyles?.hasShadow ?? true,
                          shadowAmount: widget.buttonStyles?.shadowAmount || 4,
                          strokeWidth: widget.buttonStyles?.strokeWidth || 0,
                        }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Background */}
      <div className="space-y-2">
        <Label>Section Background</Label>
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
        <>
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

          <div className="space-y-2">
            <Label>Background Opacity: {widget.background?.opacity || 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={widget.background?.opacity || 100}
              onChange={(e) => onChange({
                background: { ...widget.background, opacity: parseInt(e.target.value) }
              })}
              className="w-full"
            />
          </div>
        </>
      )}

      {widget.background?.type === 'image' && (
        <>
          <ImageUpload
            label="Background Image"
            value={widget.background?.url || ''}
            onChange={(url) => onChange({
              background: { ...widget.background, url }
            })}
            maxSizeMB={1}
          />

          <div className="space-y-2">
            <Label>Background Opacity: {widget.background?.opacity || 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={widget.background?.opacity || 100}
              onChange={(e) => onChange({
                background: { ...widget.background, opacity: parseInt(e.target.value) }
              })}
              className="w-full"
            />
          </div>
        </>
      )}

      {widget.background?.type === 'video' && (
        <>
          <div className="space-y-2">
            <Label>Background Video URL</Label>
            <Input
              value={widget.background?.url || ''}
              onChange={(e) => onChange({
                background: { ...widget.background, url: e.target.value }
              })}
              placeholder="https://youtube.com/... or https://cdn.com/video.mp4"
            />
            <p className="text-xs text-muted-foreground">
              Videos must be hosted externally (YouTube, CDN like bunny.net, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Background Opacity: {widget.background?.opacity || 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={widget.background?.opacity || 100}
              onChange={(e) => onChange({
                background: { ...widget.background, opacity: parseInt(e.target.value) }
              })}
              className="w-full"
            />
          </div>
        </>
      )}

      {/* Padding */}
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

      {/* Margin */}
      <div className="space-y-2">
        <Label>Margin (px)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Top"
            value={widget.margin?.top || 0}
            onChange={(e) => onChange({
              margin: { ...widget.margin, top: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Right"
            value={widget.margin?.right || 0}
            onChange={(e) => onChange({
              margin: { ...widget.margin, right: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Bottom"
            value={widget.margin?.bottom || 0}
            onChange={(e) => onChange({
              margin: { ...widget.margin, bottom: parseInt(e.target.value) }
            })}
          />
          <Input
            type="number"
            placeholder="Left"
            value={widget.margin?.left || 0}
            onChange={(e) => onChange({
              margin: { ...widget.margin, left: parseInt(e.target.value) }
            })}
          />
        </div>
      </div>
    </div>
  );
}
