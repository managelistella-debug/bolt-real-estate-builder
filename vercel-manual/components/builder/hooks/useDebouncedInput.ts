import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDebouncedInputOptions {
  delay?: number;
  onBlur?: () => void;
}

/**
 * Hook to debounce input updates to prevent keyboard lag
 * 
 * Usage:
 * const [value, setValue, handleChange, handleBlur] = useDebouncedInput(
 *   widget.title,
 *   (newValue) => onChange({ title: newValue }),
 *   { delay: 300 }
 * );
 * 
 * <Input value={value} onChange={handleChange} onBlur={handleBlur} />
 */
export function useDebouncedInput(
  initialValue: string | undefined,
  onUpdate: (value: string) => void,
  options: UseDebouncedInputOptions = {}
): [string, (value: string) => void, (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, () => void] {
  const { delay = 300, onBlur } = options;
  const [localValue, setLocalValue] = useState(initialValue || '');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Update local value when prop changes (e.g., undo/redo)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setLocalValue(initialValue || '');
  }, [initialValue]);

  // Debounced update to store
  useEffect(() => {
    if (isFirstRender.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (localValue !== initialValue) {
        onUpdate(localValue);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localValue, delay]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    // Immediately update on blur
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (localValue !== initialValue) {
      onUpdate(localValue);
    }
    if (onBlur) {
      onBlur();
    }
  }, [localValue, initialValue, onUpdate, onBlur]);

  const setValue = useCallback((value: string) => {
    setLocalValue(value);
  }, []);

  return [localValue, setValue, handleChange, handleBlur];
}
