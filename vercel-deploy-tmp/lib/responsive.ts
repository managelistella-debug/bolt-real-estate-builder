import { Breakpoint, ResponsiveValue, SpacingValues } from '@/lib/types';

const BREAKPOINT_ORDER: Breakpoint[] = ['desktop', 'tablet', 'mobile'];

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isResponsiveValue<T>(value: unknown): value is ResponsiveValue<T> {
  if (!isObjectRecord(value)) return false;
  return BREAKPOINT_ORDER.some((key) => key in value);
}

export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T> | T | undefined,
  breakpoint: Breakpoint,
  fallback: T,
): T {
  if (!isResponsiveValue<T>(value)) {
    return (value as T | undefined) ?? fallback;
  }

  if (breakpoint === 'desktop') {
    return value.desktop ?? fallback;
  }

  if (breakpoint === 'tablet') {
    return value.tablet ?? value.desktop ?? fallback;
  }

  return value.mobile ?? value.tablet ?? value.desktop ?? fallback;
}

export function resolveTabletValue<T>(value: ResponsiveValue<T> | undefined, fallback: T): T {
  return resolveResponsiveValue(value, 'tablet', fallback);
}

export function resolveMobileValue<T>(value: ResponsiveValue<T> | undefined, fallback: T): T {
  return resolveResponsiveValue(value, 'mobile', fallback);
}

export function resolveResponsiveColumns(
  options: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
    responsive?: ResponsiveValue<number>;
    min?: number;
    max?: number;
  },
  breakpoint: Breakpoint,
): number {
  const min = options.min ?? 1;
  const max = options.max ?? 12;
  const desktopBase = options.responsive?.desktop ?? options.desktop ?? 1;
  const tabletBase = options.responsive?.tablet ?? options.tablet ?? desktopBase;
  const mobileBase = options.responsive?.mobile ?? options.mobile ?? 1;

  const raw =
    breakpoint === 'desktop'
      ? desktopBase
      : breakpoint === 'tablet'
        ? tabletBase
        : mobileBase;

  return Math.max(min, Math.min(max, raw));
}

export function resolveResponsiveSpacing(
  responsive: ResponsiveValue<SpacingValues> | undefined,
  breakpoint: Breakpoint,
  fallback: SpacingValues,
): SpacingValues {
  return resolveResponsiveValue<SpacingValues>(responsive, breakpoint, fallback);
}

export function updateResponsiveValue<T>(
  current: ResponsiveValue<T> | undefined,
  breakpoint: Breakpoint,
  next: T,
): ResponsiveValue<T> {
  return {
    ...(current ?? {}),
    [breakpoint]: next,
  };
}

