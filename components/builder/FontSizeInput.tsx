'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FontSizeValue {
  value: number;
  unit: 'rem' | 'px' | 'em' | '%';
}

interface FontSizeInputProps {
  value: FontSizeValue | string | number;
  onChange: (value: FontSizeValue) => void;
  className?: string;
}

export function FontSizeInput({ value, onChange, className }: FontSizeInputProps) {
  // Parse the value - handle legacy string/number formats
  const parsedValue: FontSizeValue = typeof value === 'object' && value !== null && 'value' in value
    ? value
    : typeof value === 'string'
    ? parseStringValue(value)
    : { value: value || 16, unit: 'px' };

  function parseStringValue(str: string): FontSizeValue {
    // Parse strings like "3rem", "16px", "1.5em", "100%"
    const match = str.match(/^([\d.]+)(rem|px|em|%)?$/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: (match[2] as FontSizeValue['unit']) || 'px',
      };
    }
    return { value: 16, unit: 'px' };
  }

  const handleValueChange = (newValue: string) => {
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      onChange({ ...parsedValue, value: numValue });
    }
  };

  const handleUnitChange = (newUnit: FontSizeValue['unit']) => {
    onChange({ ...parsedValue, unit: newUnit });
  };

  return (
    <div className={`flex gap-2 ${className || ''}`}>
      <Input
        type="number"
        value={parsedValue.value}
        onChange={(e) => handleValueChange(e.target.value)}
        className="flex-1"
        step="0.1"
        min="0"
      />
      <Select value={parsedValue.unit} onValueChange={handleUnitChange}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="px">px</SelectItem>
          <SelectItem value="rem">rem</SelectItem>
          <SelectItem value="em">em</SelectItem>
          <SelectItem value="%">%</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// Helper function to convert FontSizeValue to CSS string
export function fontSizeToCSS(value: FontSizeValue | string | number): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return `${value.value}${value.unit}`;
}
