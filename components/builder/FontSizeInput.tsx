'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FontSizeInputProps {
  value: string; // e.g., "3rem", "16px", "1.5em"
  onChange: (value: string) => void;
  label?: string;
}

export function FontSizeInput({ value, onChange, label }: FontSizeInputProps) {
  // Parse the current value to extract number and unit
  const parseValue = (val: string): { number: string; unit: string } => {
    const match = val.match(/^([\d.]+)(.*)$/);
    if (match) {
      return { number: match[1], unit: match[2] || 'px' };
    }
    return { number: '16', unit: 'px' };
  };

  const { number, unit } = parseValue(value);

  const handleNumberChange = (newNumber: string) => {
    onChange(`${newNumber}${unit}`);
  };

  const handleUnitChange = (newUnit: string) => {
    onChange(`${number}${newUnit}`);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex gap-2">
        <Input
          type="number"
          value={number}
          onChange={(e) => handleNumberChange(e.target.value)}
          className="flex-1"
          step="0.1"
          min="0"
        />
        <Select value={unit} onValueChange={handleUnitChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="px">px</SelectItem>
            <SelectItem value="rem">rem</SelectItem>
            <SelectItem value="em">em</SelectItem>
            <SelectItem value="%">%</SelectItem>
            <SelectItem value="vw">vw</SelectItem>
            <SelectItem value="vh">vh</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
