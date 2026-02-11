'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TypographyConfig, GlobalStyles, FontSizeValue } from '@/lib/types';
import { FontSizeInput } from '../FontSizeInput';
import { GlobalStyleSelector } from './GlobalStyleSelector';
import { cn } from '@/lib/utils';

interface TypographyControlProps {
  value: Partial<TypographyConfig>;
  onChange: (value: Partial<TypographyConfig>) => void;
  label: string;  // e.g., "Header", "Subtitle", "Body"
  showGlobalStyleSelector?: boolean;
  globalStyles?: GlobalStyles;
  availableGlobalStyles?: ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body')[];
  className?: string;
}

const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Palatino', label: 'Palatino' },
  { value: 'Garamond', label: 'Garamond' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
];

const FONT_WEIGHTS = [
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semibold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extra Bold (800)' },
  { value: '900', label: 'Black (900)' },
];

const TEXT_TRANSFORMS = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'All Caps' },
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'capitalize', label: 'Capitalize' },
];

export function TypographyControl({
  value,
  onChange,
  label,
  showGlobalStyleSelector = false,
  globalStyles,
  availableGlobalStyles = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body'],
  className,
}: TypographyControlProps) {
  const isUsingGlobalStyle = value.useGlobalStyle && value.globalStyleId;

  // Parse font size to FontSizeValue
  const parseFontSize = (fontSize: FontSizeValue | string | number | undefined): FontSizeValue => {
    if (!fontSize) return { value: 16, unit: 'px' };
    if (typeof fontSize === 'object' && 'value' in fontSize) return fontSize;
    if (typeof fontSize === 'number') return { value: fontSize, unit: 'px' };
    // Parse string like "3rem" or "16px"
    const match = String(fontSize).match(/^([\d.]+)(rem|px|em|%)?$/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: (match[2] as 'rem' | 'px' | 'em' | '%') || 'px',
      };
    }
    return { value: 16, unit: 'px' };
  };

  const handleFontSizeChange = (newValue: FontSizeValue) => {
    onChange({ fontSize: newValue });
  };

  // Convert global style IDs to dropdown options
  const globalStyleOptions = availableGlobalStyles.map((id) => ({
    id,
    label: id.toUpperCase(),
  }));

  return (
    <div className={cn("space-y-3 p-3 border rounded-lg", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{label}</Label>
        {showGlobalStyleSelector && globalStyles && (
          <GlobalStyleSelector
            type="typography"
            value={value.globalStyleId}
            availableStyles={globalStyleOptions}
            onChange={(styleId) => {
              onChange({
                useGlobalStyle: !!styleId,
                globalStyleId: styleId || undefined,
              });
            }}
            useGlobal={!!isUsingGlobalStyle}
            className="w-[140px]"
          />
        )}
      </div>

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
            onChange={handleFontSizeChange}
          />
        </div>

        {/* Font Weight */}
        <div className="space-y-2">
          <Label className="text-xs">Font Weight</Label>
          <Select
            value={value.fontWeight || '400'}
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

        {/* Color */}
        <div className="space-y-2">
          <Label className="text-xs">Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={value.color || '#000000'}
              onChange={(e) => onChange({ color: e.target.value })}
              className="h-9 w-16 rounded border cursor-pointer"
              disabled={isUsingGlobalStyle}
            />
            <Input
              type="text"
              value={value.color || '#000000'}
              onChange={(e) => onChange({ color: e.target.value })}
              placeholder="#000000"
              className="h-9"
              disabled={isUsingGlobalStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
