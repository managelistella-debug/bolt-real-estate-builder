'use client';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GlobalStyles } from '@/lib/types';
import {
  extractGlobalColorId,
  getGlobalColorReference,
  getGlobalColorTokens,
  isHexColor,
  resolveGlobalColorValue,
} from '@/lib/global-colors';

interface GlobalColorInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  globalStyles?: GlobalStyles;
  defaultColor?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function GlobalColorInput({
  value,
  onChange,
  globalStyles,
  defaultColor = '#000000',
  placeholder = '#000000',
  disabled = false,
}: GlobalColorInputProps) {
  const tokens = getGlobalColorTokens(globalStyles);
  const linkedColorId = extractGlobalColorId(value);
  const linkedToken = linkedColorId ? tokens.find((t) => t.id === linkedColorId) : undefined;
  const resolved = resolveGlobalColorValue(value, globalStyles, defaultColor);
  const colorForInput = isHexColor(resolved) ? resolved : defaultColor;

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            title={linkedToken ? linkedToken.name : 'Global color'}
            className="h-9 w-10 rounded border inline-flex items-center justify-center"
            disabled={disabled}
          >
            <img
              src={linkedToken ? '/icons/globe-active.svg' : '/icons/globe-inactive.svg'}
              alt="Global color"
              className="h-[13px] w-[13px]"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[260px] p-0">
          <div className="border-b px-3 py-2 text-sm font-medium">Global Colors</div>
          <div className="p-2 space-y-1">
            {tokens.map((token) => (
              <button
                key={token.id}
                type="button"
                className="w-full flex items-center justify-between rounded px-2 py-1.5 hover:bg-muted"
                onClick={() => onChange(getGlobalColorReference(token.id))}
                disabled={disabled}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded border"
                    style={{ backgroundColor: token.value }}
                  />
                  <span className="text-sm">{token.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{token.value}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <input
        type="color"
        value={colorForInput}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-16 rounded border cursor-pointer"
        disabled={disabled}
      />
      <Input
        type="text"
        value={resolved}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9"
        disabled={disabled}
      />
    </div>
  );
}
