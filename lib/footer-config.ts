import { FooterConfig, FooterLayout, SocialLink, SpacingValues } from '@/lib/types';

const DEFAULT_SPACING: SpacingValues = { top: 56, right: 24, bottom: 24, left: 24 };
const ZERO_SPACING: SpacingValues = { top: 0, right: 0, bottom: 0, left: 0 };

function normalizeSocialLinks(links: SocialLink[] | undefined): SocialLink[] {
  if (!Array.isArray(links)) return [];
  return links.map((link) => ({
    ...link,
    platform: link.platform || 'facebook',
    openInNewTab: link.openInNewTab ?? true,
  }));
}

export function getDefaultFooterConfig(): FooterConfig {
  return {
    layout: 'footer-a',
    menuSource: 'headerNavigation',
    logoConfig: {
      sizes: {
        mobile: 32,
        tablet: 40,
        desktop: 48,
      },
    },
    navigation: [],
    menuItemTypography: {
      fontFamily: 'Inter',
      fontSize: { value: 13, unit: 'px' },
      fontWeight: '500',
      lineHeight: '1.4',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#e5e7eb',
    },
    menuItemGap: 24,
    contactTypography: {
      fontFamily: 'Inter',
      fontSize: { value: 15, unit: 'px' },
      fontWeight: '500',
      lineHeight: '1.5',
      textTransform: 'none',
      color: '#f9fafb',
    },
    disclaimerTypography: {
      fontFamily: 'Inter',
      fontSize: { value: 12, unit: 'px' },
      fontWeight: '400',
      lineHeight: '1.6',
      textTransform: 'none',
      color: '#d1d5db',
    },
    legalTypography: {
      fontFamily: 'Inter',
      fontSize: { value: 10, unit: 'px' },
      fontWeight: '400',
      lineHeight: '1.4',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#9ca3af',
    },
    phone: '',
    email: '',
    address: '',
    socialLinks: [],
    socialIconSize: 18,
    socialIconGap: 12,
    socialIconColor: '#f9fafb',
    customSocialIconColor: '#f9fafb',
    disclaimer: '',
    legalLinks: {
      privacyLabel: 'Privacy Policy',
      privacyUrl: '/privacy',
      termsLabel: 'Terms of Service',
      termsUrl: '/terms',
    },
    background: {
      topColor: '#111827',
      bottomColor: '#030712',
      watermarkOpacity: 8,
      watermarkSize: 60,
    },
    padding: { ...DEFAULT_SPACING },
    margin: { ...ZERO_SPACING },
  };
}

export function normalizeFooterConfig(config?: Partial<FooterConfig> | null): FooterConfig {
  const defaults = getDefaultFooterConfig();
  return {
    ...defaults,
    ...config,
    // Prefer logoConfig.src and avoid persisting duplicated legacy logo values.
    logo: config?.logoConfig?.src ? undefined : config?.logo,
    menuSource: config?.menuSource || defaults.menuSource,
    logoConfig: {
      ...defaults.logoConfig,
      ...config?.logoConfig,
      sizes: {
        ...defaults.logoConfig?.sizes,
        ...config?.logoConfig?.sizes,
      },
    },
    menuItemTypography: {
      ...defaults.menuItemTypography,
      ...config?.menuItemTypography,
    },
    contactTypography: {
      ...defaults.contactTypography,
      ...config?.contactTypography,
    },
    disclaimerTypography: {
      ...defaults.disclaimerTypography,
      ...config?.disclaimerTypography,
    },
    legalTypography: {
      ...defaults.legalTypography,
      ...config?.legalTypography,
    },
    menuItemGap: config?.menuItemGap ?? defaults.menuItemGap,
    navigation: config?.navigation || defaults.navigation,
    socialLinks: normalizeSocialLinks(config?.socialLinks),
    socialIconSize: config?.socialIconSize ?? defaults.socialIconSize,
    socialIconGap: config?.socialIconGap ?? defaults.socialIconGap,
    socialIconColor: config?.socialIconColor ?? defaults.socialIconColor,
    customSocialIconColor: config?.customSocialIconColor ?? defaults.customSocialIconColor,
    legalLinks: {
      ...defaults.legalLinks,
      ...config?.legalLinks,
    },
    background: {
      ...defaults.background,
      ...config?.background,
    },
    padding: {
      ...defaults.padding,
      ...config?.padding,
    },
    margin: {
      ...defaults.margin,
      ...config?.margin,
    },
  };
}

export function getFooterLayoutTheme(layout: FooterLayout): 'light' | 'dark' {
  if (layout === 'footer-b') return 'light';
  return 'dark';
}
