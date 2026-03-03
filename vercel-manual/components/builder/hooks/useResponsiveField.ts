'use client';

import { useBuilderStore, type DeviceView } from '@/lib/stores/builder';
import { resolveResponsiveValue, updateResponsiveValue } from '@/lib/responsive';
import { ResponsiveValue } from '@/lib/types';

interface UseResponsiveFieldParams<T> {
  value?: ResponsiveValue<T>;
  fallback: T;
  onChange: (next: ResponsiveValue<T>) => void;
}

export function useResponsiveField<T>({ value, fallback, onChange }: UseResponsiveFieldParams<T>) {
  const { deviceView } = useBuilderStore();

  const resolvedValue = resolveResponsiveValue<T>(value, deviceView as DeviceView, fallback);

  const setValueForActiveDevice = (next: T) => {
    onChange(updateResponsiveValue(value, deviceView as DeviceView, next));
  };

  return {
    deviceView,
    resolvedValue,
    setValueForActiveDevice,
  };
}

