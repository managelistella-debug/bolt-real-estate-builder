'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalStyleSelectorProps {
  type: 'typography' | 'button';
  value?: string;  // current global style ID
  availableStyles: { id: string; label: string }[];
  onChange: (styleId: string | null) => void;
  useGlobal: boolean;
  className?: string;
}

export function GlobalStyleSelector({
  type,
  value,
  availableStyles,
  onChange,
  useGlobal,
  className,
}: GlobalStyleSelectorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select value={value || 'custom'} onValueChange={(v) => onChange(v === 'custom' ? null : v)}>
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="custom">Custom</SelectItem>
          {availableStyles.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              {style.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {useGlobal && value && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link2 className="h-3 w-3 text-primary" />
          <span className="hidden sm:inline">Global</span>
        </div>
      )}
    </div>
  );
}
