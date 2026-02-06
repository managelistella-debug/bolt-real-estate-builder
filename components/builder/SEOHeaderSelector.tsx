'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type HeaderTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';

interface SEOHeaderSelectorProps {
  label?: string;
  value: HeaderTag;
  onChange: (value: HeaderTag) => void;
  description?: string;
  recommendedTag?: HeaderTag;
}

export function SEOHeaderSelector({ 
  label = "Tag", 
  value, 
  onChange
}: SEOHeaderSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="h1">H1</SelectItem>
          <SelectItem value="h2">H2</SelectItem>
          <SelectItem value="h3">H3</SelectItem>
          <SelectItem value="h4">H4</SelectItem>
          <SelectItem value="h5">H5</SelectItem>
          <SelectItem value="h6">H6</SelectItem>
          <SelectItem value="p">P</SelectItem>
          <SelectItem value="div">Div</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
