'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TypographyConfig, GlobalStyles, FontSizeValue, ResponsiveValue } from '@/lib/types';
import { FontSizeInput } from '../FontSizeInput';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { GlobalColorInput } from './GlobalColorInput';
import { useResponsiveField } from '../hooks/useResponsiveField';
import { ResponsiveControlShell } from './ResponsiveControlShell';
import { ResponsiveDevicePicker } from './ResponsiveControlShell';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TypographyControlProps {
  value: Partial<TypographyConfig>;
  onChange: (value: Partial<TypographyConfig>) => void;
  label: string;  // e.g., "Header", "Subtitle", "Body"
  showGlobalStyleSelector?: boolean;
  globalStyles?: GlobalStyles;
  availableGlobalStyles?: ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body')[];
  showColorControl?: boolean;
  className?: string;
  responsiveFontSize?: ResponsiveValue<FontSizeValue | string | number>;
  onResponsiveFontSizeChange?: (value: ResponsiveValue<FontSizeValue | string | number>) => void;
  defaultOpen?: boolean;
  colorOpacity?: number;
  onColorOpacityChange?: (value: number) => void;
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
  value: rawValue,
  onChange: onChangeProp,
  label,
  showGlobalStyleSelector = false,
  globalStyles,
  availableGlobalStyles = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body'],
  showColorControl = true,
  className,
  responsiveFontSize,
  onResponsiveFontSizeChange,
  defaultOpen = true,
  colorOpacity = 100,
  onColorOpacityChange,
}: TypographyControlProps) {
  const [open, setOpen] = useState(defaultOpen);
  const allGlobalTypographyStyles: ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body')[] = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body',
  ];
  // Always expose all global typography styles in a fixed order.
  const styleOptions = allGlobalTypographyStyles;

  const isUsingGlobalStyle = !!(rawValue.useGlobalStyle && rawValue.globalStyleId);
  const selectedGlobalStyle = isUsingGlobalStyle
    ? (rawValue.globalStyleId === 'body'
        ? globalStyles?.body
        : globalStyles?.headings?.[rawValue.globalStyleId as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'])
    : undefined;
  // Color is now always section-specific and should never be inherited from global typography.
  const value: Partial<TypographyConfig> = isUsingGlobalStyle && selectedGlobalStyle
    ? {
        ...selectedGlobalStyle,
        color: rawValue.color ?? '#000000',
        useGlobalStyle: true,
        globalStyleId: rawValue.globalStyleId,
      }
    : rawValue;
  // Typography controls remain editable while linked; editing forks and unlinks.
  const controlsLockedByGlobal = false;

  const {
    deviceView,
    resolvedValue: resolvedResponsiveFontSize,
    setValueForActiveDevice: setResponsiveFontSizeForDevice,
  } = useResponsiveField<FontSizeValue | string | number>({
    value: responsiveFontSize,
    fallback: rawValue.fontSize || 16,
    onChange: (next) => onResponsiveFontSizeChange?.(next),
  });

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
    if (onResponsiveFontSizeChange) {
      setResponsiveFontSizeForDevice(newValue);
      if (deviceView === 'desktop') {
        onChange({ fontSize: newValue });
      }
      return;
    }
    onChange({ fontSize: newValue });
  };

  const styleLabelMap: Record<string, string> = {
    h1: 'H1',
    h2: 'H2',
    h3: 'H3',
    h4: 'H4',
    h5: 'H5',
    h6: 'H6',
    body: 'Body',
  };

  const onChange = (updates: Partial<TypographyConfig>, preserveGlobalLink: boolean = false) => {
    if (preserveGlobalLink) {
      onChangeProp(updates);
      return;
    }

    if (rawValue.useGlobalStyle && rawValue.globalStyleId) {
      if (selectedGlobalStyle) {
        onChangeProp({
          ...selectedGlobalStyle,
          // Keep color local to section while forking from global style.
          color: rawValue.color ?? '#000000',
          ...updates,
          useGlobalStyle: false,
          globalStyleId: undefined,
        });
        return;
      }

      onChangeProp({
        useGlobalStyle: false,
        globalStyleId: undefined,
        ...updates,
      });
      return;
    }

    onChangeProp(updates);
  };

  return (
    <div className={cn("space-y-3 p-3 border rounded-lg", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">{label}</Label>
          {onResponsiveFontSizeChange && <ResponsiveDevicePicker className="h-6 w-6" />}
        </div>
        <div className="flex items-center gap-2">
          {showGlobalStyleSelector && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center"
                  title={isUsingGlobalStyle && value.globalStyleId ? styleLabelMap[value.globalStyleId] : 'No global typography style'}
                >
                  <img
                    src={isUsingGlobalStyle ? '/icons/globe-active.svg' : '/icons/globe-inactive.svg'}
                    alt="Typography global style"
                    className="h-[13px] w-[13px]"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[240px] p-0">
                <div className="border-b px-3 py-2 text-sm font-medium">Global Typography</div>
                <div className="p-2 space-y-1">
                  {styleOptions.map((styleId) => {
                    const styleConfig = styleId === 'body'
                      ? globalStyles?.body
                      : globalStyles?.headings?.[styleId as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'];
                    const isActive = value.globalStyleId === styleId && value.useGlobalStyle;

                    return (
                      <button
                        key={styleId}
                        type="button"
                        className={cn(
                          "w-full text-left rounded px-2 py-1.5 hover:bg-muted",
                          isActive && "bg-muted"
                        )}
                        onClick={() => {
                          onChange({
                            ...(styleConfig || {}),
                            color: rawValue.color ?? '#000000',
                            useGlobalStyle: true,
                            globalStyleId: styleId,
                          }, true);
                        }}
                      >
                        <span
                          className="block"
                          style={{
                            fontFamily: styleConfig?.fontFamily || 'Inter',
                            fontWeight: styleConfig?.fontWeight || '400',
                            lineHeight: styleConfig?.lineHeight || '1.5',
                            textTransform: (styleConfig?.textTransform as any) || 'none',
                            fontSize: (() => {
                              const fs = styleConfig?.fontSize as FontSizeValue | string | undefined;
                              if (!fs) return '14px';
                              if (typeof fs === 'string') return fs;
                              if (typeof fs === 'object' && 'value' in fs) return `${fs.value}${fs.unit}`;
                              return '14px';
                            })(),
                          }}
                        >
                          {styleLabelMap[styleId]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
          <button type="button" onClick={() => setOpen((prev) => !prev)} className="inline-flex items-center">
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
      <div className="space-y-3">
        {/* Font Family */}
        <div className="space-y-2">
          <Label className="text-xs">Font Family</Label>
          <Select
            value={value.fontFamily || 'Inter'}
            onValueChange={(v) => onChange({ fontFamily: v })}
            disabled={controlsLockedByGlobal}
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
        {onResponsiveFontSizeChange ? (
          <ResponsiveControlShell
            label="Font Size"
            hasOverride={!!responsiveFontSize?.tablet || !!responsiveFontSize?.mobile}
          >
            <FontSizeInput
              value={parseFontSize(resolvedResponsiveFontSize)}
              onChange={handleFontSizeChange}
            />
          </ResponsiveControlShell>
        ) : (
          <div className="space-y-2">
            <Label className="text-xs">Font Size</Label>
            <FontSizeInput
              value={parseFontSize(value.fontSize)}
              onChange={handleFontSizeChange}
            />
          </div>
        )}

        {/* Font Weight */}
        <div className="space-y-2">
          <Label className="text-xs">Font Weight</Label>
          <Select
            value={value.fontWeight || '400'}
            onValueChange={(v) => onChange({ fontWeight: v })}
            disabled={controlsLockedByGlobal}
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
            disabled={controlsLockedByGlobal}
          />
        </div>

        {/* Text Transform */}
        <div className="space-y-2">
          <Label className="text-xs">Text Transform</Label>
          <Select
            value={value.textTransform || 'none'}
            onValueChange={(v: any) => onChange({ textTransform: v })}
            disabled={controlsLockedByGlobal}
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

        {showColorControl && (
          <div className="space-y-2">
            <Label className="text-xs">Color</Label>
            <GlobalColorInput
              value={value.color}
              onChange={(nextColor) => onChange({ color: nextColor })}
              globalStyles={globalStyles}
              defaultColor="#000000"
              placeholder="#000000"
              disabled={controlsLockedByGlobal}
            />
            {typeof onColorOpacityChange === 'function' && (
              <div className="space-y-2 pt-1">
                <Label className="text-xs">Color Opacity ({colorOpacity}%)</Label>
                <Input
                  type="range"
                  min={0}
                  max={100}
                  value={colorOpacity}
                  onChange={(event) => onColorOpacityChange(parseInt(event.target.value, 10) || 0)}
                  disabled={controlsLockedByGlobal}
                />
              </div>
            )}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
