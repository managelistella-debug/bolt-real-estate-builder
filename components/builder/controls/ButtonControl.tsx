'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ButtonStyleConfig, GlobalStyles, FontSizeValue } from '@/lib/types';
import { FontSizeInput } from '../FontSizeInput';
import { GlobalStyleSelector } from './GlobalStyleSelector';
import { cn } from '@/lib/utils';

interface ButtonControlProps {
  value: Partial<ButtonStyleConfig>;
  onChange: (value: Partial<ButtonStyleConfig>) => void;
  showGlobalStyleSelector?: boolean;
  globalStyles?: GlobalStyles;
  className?: string;
}

const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
];

const FONT_WEIGHTS = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
];

const TEXT_TRANSFORMS = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'All Caps' },
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'capitalize', label: 'Capitalize' },
];

export function ButtonControl({
  value,
  onChange,
  showGlobalStyleSelector = false,
  globalStyles,
  className,
}: ButtonControlProps) {
  const [activeTab, setActiveTab] = useState<'default' | 'hover'>('default');
  const isUsingGlobalStyle = value.useGlobalStyle && value.globalStyleId;

  // Parse font size
  const parseFontSize = (fontSize: FontSizeValue | string | number | undefined): FontSizeValue => {
    if (!fontSize) return { value: 16, unit: 'px' };
    if (typeof fontSize === 'object' && 'value' in fontSize) return fontSize;
    if (typeof fontSize === 'number') return { value: fontSize, unit: 'px' };
    const match = String(fontSize).match(/^([\d.]+)(rem|px|em|%)?$/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: (match[2] as 'rem' | 'px' | 'em' | '%') || 'px',
      };
    }
    return { value: 16, unit: 'px' };
  };

  const globalStyleOptions = [
    { id: 'button1', label: 'Button Style 1' },
    { id: 'button2', label: 'Button Style 2' },
  ];

  const updateHover = (hoverUpdates: Partial<NonNullable<ButtonStyleConfig['hover']>>) => {
    onChange({
      hover: {
        ...value.hover,
        ...hoverUpdates,
      },
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Global Style Selector */}
      {showGlobalStyleSelector && globalStyles && (
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <Label className="text-sm">Button Style</Label>
          <GlobalStyleSelector
            type="button"
            value={value.globalStyleId}
            availableStyles={globalStyleOptions}
            onChange={(styleId) => {
              onChange({
                useGlobalStyle: !!styleId,
                globalStyleId: styleId || undefined,
              });
            }}
            useGlobal={!!isUsingGlobalStyle}
            className="w-[160px]"
          />
        </div>
      )}

      {/* Default/Hover Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        <button
          type="button"
          className={cn(
            "flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors",
            activeTab === 'default' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
          )}
          onClick={() => setActiveTab('default')}
        >
          Default
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors",
            activeTab === 'hover' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
          )}
          onClick={() => setActiveTab('hover')}
        >
          Hover
        </button>
      </div>

      {/* Default State Controls */}
      {activeTab === 'default' && (
        <div className="space-y-3 p-3 border rounded-lg">
          {/* Width */}
          <div className="space-y-2">
            <Label className="text-xs">Width</Label>
            <Select
              value={value.width || 'standard'}
              onValueChange={(v: any) => onChange({ width: v })}
              disabled={isUsingGlobalStyle}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="custom">Custom (Pixels)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {value.width === 'custom' && (
            <div className="space-y-2">
              <Label className="text-xs">Custom Width (px)</Label>
              <Input
                type="number"
                value={value.customWidth || 200}
                onChange={(e) => onChange({ customWidth: parseInt(e.target.value) })}
                className="h-9"
                disabled={isUsingGlobalStyle}
              />
            </div>
          )}

          {/* Background Color */}
          <div className="space-y-2">
            <Label className="text-xs">Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.backgroundColor || '#3b82f6'}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="h-9 w-16 rounded border cursor-pointer"
                disabled={isUsingGlobalStyle}
              />
              <Input
                type="text"
                value={value.backgroundColor || '#3b82f6'}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                placeholder="#3b82f6"
                className="h-9"
                disabled={isUsingGlobalStyle}
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <Label className="text-xs">Text Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.textColor || '#ffffff'}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="h-9 w-16 rounded border cursor-pointer"
                disabled={isUsingGlobalStyle}
              />
              <Input
                type="text"
                value={value.textColor || '#ffffff'}
                onChange={(e) => onChange({ textColor: e.target.value })}
                placeholder="#ffffff"
                className="h-9"
                disabled={isUsingGlobalStyle}
              />
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <Label className="text-xs">Border Radius: {value.borderRadius || 42}px</Label>
            <input
              type="range"
              min="0"
              max="50"
              value={value.borderRadius || 42}
              onChange={(e) => onChange({ borderRadius: parseInt(e.target.value) })}
              className="w-full"
              disabled={isUsingGlobalStyle}
            />
          </div>

          {/* Border Width */}
          <div className="space-y-2">
            <Label className="text-xs">Border Width: {value.borderWidth || 0}px</Label>
            <input
              type="range"
              min="0"
              max="10"
              value={value.borderWidth || 0}
              onChange={(e) => onChange({ borderWidth: parseInt(e.target.value) })}
              className="w-full"
              disabled={isUsingGlobalStyle}
            />
          </div>

          {value.borderWidth && value.borderWidth > 0 && (
            <div className="space-y-2">
              <Label className="text-xs">Border Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={value.borderColor || '#000000'}
                  onChange={(e) => onChange({ borderColor: e.target.value })}
                  className="h-9 w-16 rounded border cursor-pointer"
                  disabled={isUsingGlobalStyle}
                />
                <Input
                  type="text"
                  value={value.borderColor || '#000000'}
                  onChange={(e) => onChange({ borderColor: e.target.value })}
                  placeholder="#000000"
                  className="h-9"
                  disabled={isUsingGlobalStyle}
                />
              </div>
            </div>
          )}

          {/* Drop Shadow */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dropShadow"
              checked={value.dropShadow !== false}
              onCheckedChange={(checked) => onChange({ dropShadow: !!checked })}
              disabled={isUsingGlobalStyle}
            />
            <Label htmlFor="dropShadow" className="text-xs">Drop Shadow</Label>
          </div>

          {value.dropShadow !== false && (
            <div className="space-y-2">
              <Label className="text-xs">Shadow Amount: {value.shadowAmount || 4}px</Label>
              <input
                type="range"
                min="0"
                max="20"
                value={value.shadowAmount || 4}
                onChange={(e) => onChange({ shadowAmount: parseInt(e.target.value) })}
                className="w-full"
                disabled={isUsingGlobalStyle}
              />
            </div>
          )}

          {/* Background Opacity */}
          <div className="space-y-2">
            <Label className="text-xs">Background Opacity: {value.backgroundOpacity || 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={value.backgroundOpacity || 100}
              onChange={(e) => onChange({ backgroundOpacity: parseInt(e.target.value) })}
              className="w-full"
              disabled={isUsingGlobalStyle}
            />
          </div>

          {/* Blur Effect */}
          <div className="space-y-2">
            <Label className="text-xs">Blur Effect: {value.blurEffect || 0}px</Label>
            <input
              type="range"
              min="0"
              max="20"
              value={value.blurEffect || 0}
              onChange={(e) => onChange({ blurEffect: parseInt(e.target.value) })}
              className="w-full"
              disabled={isUsingGlobalStyle}
            />
          </div>

          {/* Typography Section */}
          <div className="pt-3 border-t">
            <Label className="text-xs font-semibold mb-3 block">Button Text Typography</Label>
            
            <div className="space-y-3">
              {/* Font Family */}
              <div className="space-y-2">
                <Label className="text-xs">Font Family</Label>
                <Select
                  value={value.fontFamily || 'Inter'}
                  onValueChange={(v) => onChange({ fontFamily: v })}
                  disabled={isUsingGlobalStyle}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label className="text-xs">Font Size</Label>
                <FontSizeInput
                  value={parseFontSize(value.fontSize)}
                  onChange={(v) => onChange({ fontSize: v })}
                />
              </div>

              {/* Font Weight */}
              <div className="space-y-2">
                <Label className="text-xs">Font Weight</Label>
                <Select
                  value={value.fontWeight || '600'}
                  onValueChange={(v) => onChange({ fontWeight: v })}
                  disabled={isUsingGlobalStyle}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_WEIGHTS.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Line Height */}
              <div className="space-y-2">
                <Label className="text-xs">Line Height</Label>
                <Input
                  type="text"
                  value={value.lineHeight || '1.5'}
                  onChange={(e) => onChange({ lineHeight: e.target.value })}
                  placeholder="1.5"
                  className="h-9"
                  disabled={isUsingGlobalStyle}
                />
              </div>

              {/* Text Transform */}
              <div className="space-y-2">
                <Label className="text-xs">Text Transform</Label>
                <Select
                  value={value.textTransform || 'none'}
                  onValueChange={(v: any) => onChange({ textTransform: v })}
                  disabled={isUsingGlobalStyle}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEXT_TRANSFORMS.map((transform) => (
                      <SelectItem key={transform.value} value={transform.value}>
                        {transform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hover State Controls */}
      {activeTab === 'hover' && (
        <div className="space-y-3 p-3 border rounded-lg">
          <p className="text-xs text-muted-foreground mb-3">
            Customize how the button looks when users hover over it. Leave blank to use default state.
          </p>

          {/* Hover Background Color */}
          <div className="space-y-2">
            <Label className="text-xs">Background Color (Hover)</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.hover?.backgroundColor || value.backgroundColor || '#3b82f6'}
                onChange={(e) => updateHover({ backgroundColor: e.target.value })}
                className="h-9 w-16 rounded border cursor-pointer"
                disabled={isUsingGlobalStyle}
              />
              <Input
                type="text"
                value={value.hover?.backgroundColor || value.backgroundColor || '#3b82f6'}
                onChange={(e) => updateHover({ backgroundColor: e.target.value })}
                placeholder="Inherits from default"
                className="h-9"
                disabled={isUsingGlobalStyle}
              />
            </div>
          </div>

          {/* Hover Text Color */}
          <div className="space-y-2">
            <Label className="text-xs">Text Color (Hover)</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.hover?.textColor || value.textColor || '#ffffff'}
                onChange={(e) => updateHover({ textColor: e.target.value })}
                className="h-9 w-16 rounded border cursor-pointer"
                disabled={isUsingGlobalStyle}
              />
              <Input
                type="text"
                value={value.hover?.textColor || value.textColor || '#ffffff'}
                onChange={(e) => updateHover({ textColor: e.target.value })}
                placeholder="Inherits from default"
                className="h-9"
                disabled={isUsingGlobalStyle}
              />
            </div>
          </div>

          {/* Hover Border Color */}
          {value.borderWidth && value.borderWidth > 0 && (
            <div className="space-y-2">
              <Label className="text-xs">Border Color (Hover)</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={value.hover?.borderColor || value.borderColor || '#000000'}
                  onChange={(e) => updateHover({ borderColor: e.target.value })}
                  className="h-9 w-16 rounded border cursor-pointer"
                  disabled={isUsingGlobalStyle}
                />
                <Input
                  type="text"
                  value={value.hover?.borderColor || value.borderColor || '#000000'}
                  onChange={(e) => updateHover({ borderColor: e.target.value })}
                  placeholder="Inherits from default"
                  className="h-9"
                  disabled={isUsingGlobalStyle}
                />
              </div>
            </div>
          )}

          {/* Hover Background Opacity */}
          <div className="space-y-2">
            <Label className="text-xs">
              Background Opacity (Hover): {value.hover?.backgroundOpacity ?? value.backgroundOpacity ?? 100}%
            </Label>
            <input
              type="range"
              min="0"
              max="100"
              value={value.hover?.backgroundOpacity ?? value.backgroundOpacity ?? 100}
              onChange={(e) => updateHover({ backgroundOpacity: parseInt(e.target.value) })}
              className="w-full"
              disabled={isUsingGlobalStyle}
            />
          </div>

          {/* Hover Drop Shadow */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hoverDropShadow"
              checked={value.hover?.dropShadow ?? value.dropShadow !== false}
              onCheckedChange={(checked) => updateHover({ dropShadow: !!checked })}
              disabled={isUsingGlobalStyle}
            />
            <Label htmlFor="hoverDropShadow" className="text-xs">Drop Shadow (Hover)</Label>
          </div>

          {(value.hover?.dropShadow ?? value.dropShadow !== false) && (
            <div className="space-y-2">
              <Label className="text-xs">
                Shadow Amount (Hover): {value.hover?.shadowAmount ?? value.shadowAmount ?? 4}px
              </Label>
              <input
                type="range"
                min="0"
                max="20"
                value={value.hover?.shadowAmount ?? value.shadowAmount ?? 4}
                onChange={(e) => updateHover({ shadowAmount: parseInt(e.target.value) })}
                className="w-full"
                disabled={isUsingGlobalStyle}
              />
            </div>
          )}

          {/* Hover Blur Effect */}
          <div className="space-y-2">
            <Label className="text-xs">
              Blur Effect (Hover): {value.hover?.blurEffect ?? value.blurEffect ?? 0}px
            </Label>
            <input
              type="range"
              min="0"
              max="20"
              value={value.hover?.blurEffect ?? value.blurEffect ?? 0}
              onChange={(e) => updateHover({ blurEffect: parseInt(e.target.value) })}
              className="w-full"
              disabled={isUsingGlobalStyle}
            />
          </div>
        </div>
      )}
    </div>
  );
}
