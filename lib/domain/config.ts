const FALLBACK_BASE_DOMAIN = 'builder.localhost';

function sanitizeHost(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^\.+|\.+$/g, '');
}

export function getPlatformBaseDomain(): string {
  const configured = process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN;
  if (!configured) return FALLBACK_BASE_DOMAIN;

  const sanitized = sanitizeHost(configured);
  return sanitized || FALLBACK_BASE_DOMAIN;
}

export function getPlatformProtocol(): 'http' | 'https' {
  const baseDomain = getPlatformBaseDomain();
  return baseDomain.includes('localhost') ? 'http' : 'https';
}

export function normalizeSubdomainSlug(input: string): string {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!normalized) return 'site';
  if (normalized.length > 40) return normalized.slice(0, 40).replace(/-$/g, '');
  return normalized;
}

export function generateDefaultSubdomainSlug(seed: string): string {
  const normalizedSeed = normalizeSubdomainSlug(seed);
  if (normalizedSeed.startsWith('site-')) return normalizedSeed;
  return `site-${normalizedSeed}`;
}

export function buildPlatformUrl(subdomain: string): string {
  const host = `${normalizeSubdomainSlug(subdomain)}.${getPlatformBaseDomain()}`;
  return `${getPlatformProtocol()}://${host}`;
}
