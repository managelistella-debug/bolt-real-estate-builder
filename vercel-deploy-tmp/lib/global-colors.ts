import { GlobalStyles } from './types';

export interface GlobalColorToken {
  id: string;
  name: string;
  value: string;
}

export const BUILT_IN_COLOR_IDS = ['primary', 'secondary', 'accent'] as const;
type BuiltInColorId = (typeof BUILT_IN_COLOR_IDS)[number];

function sanitizeId(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
}

export function getGlobalColorVarName(colorId: string): string {
  return `--global-color-${sanitizeId(colorId)}`;
}

export function getGlobalColorReference(colorId: string): string {
  return `var(${getGlobalColorVarName(colorId)})`;
}

export function extractGlobalColorId(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const match = value.match(/^var\(--global-color-([a-z0-9-_]+)\)$/i);
  return match?.[1];
}

export function getGlobalColorTokens(globalStyles?: GlobalStyles): GlobalColorToken[] {
  if (!globalStyles) return [];
  const labels = globalStyles.colorLabels || {};

  const builtIn: GlobalColorToken[] = [
    {
      id: 'primary',
      name: labels.primary || 'Primary',
      value: globalStyles.colors.primary,
    },
    {
      id: 'secondary',
      name: labels.secondary || 'Secondary',
      value: globalStyles.colors.secondary,
    },
    {
      id: 'accent',
      name: labels.accent || 'Accent',
      value: globalStyles.colors.accent,
    },
  ];

  const custom = (globalStyles.customColors || []).map((c) => ({
    id: sanitizeId(c.id),
    name: c.name,
    value: c.value,
  }));

  return [...builtIn, ...custom];
}

export function resolveGlobalColorValue(
  value: string | undefined,
  globalStyles?: GlobalStyles,
  fallback = '#000000'
): string {
  if (!value) return fallback;
  const colorId = extractGlobalColorId(value);
  if (!colorId) return value;
  const token = getGlobalColorTokens(globalStyles).find((t) => t.id === colorId);
  return token?.value || fallback;
}

export function getGlobalColorCssVars(globalStyles?: GlobalStyles): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const token of getGlobalColorTokens(globalStyles)) {
    vars[getGlobalColorVarName(token.id)] = token.value;
  }
  return vars;
}

export function isHexColor(value: string | undefined): boolean {
  if (!value) return false;
  return /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(value.trim());
}
