import { HeaderConfig, HeaderLayout, LegacyHeaderLayout, Page, SpacingValues } from '@/lib/types';

const DEFAULT_SPACING: SpacingValues = { top: 16, right: 24, bottom: 16, left: 24 };
const ZERO_SPACING: SpacingValues = { top: 0, right: 0, bottom: 0, left: 0 };

export function mapLegacyHeaderLayout(layout: HeaderConfig['layout']): HeaderLayout {
  if (layout === 'header-a') return 'leftLogoRightMenu';
  if (layout === 'header-b') return 'centeredLogoSplitMenu';
  if (layout === 'header-c') return 'centeredLogoBurger';
  return layout as HeaderLayout;
}

export function getDefaultHeaderConfig(): HeaderConfig {
  return {
    layout: 'leftLogoRightMenu',
    navigation: [],
    logoConfig: {
      sizes: {
        mobile: 28,
        tablet: 34,
        desktop: 40,
      },
    },
    logoScroll: {
      mode: 'none',
      initialColor: '#ffffff',
      scrolledColor: '#ffffff',
    },
    menuItemTypography: {
      fontFamily: 'Inter',
      fontSize: { value: 14, unit: 'px' },
      fontWeight: '500',
      lineHeight: '1.4',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#111827',
    },
    menuItemScrolledColor: '#111827',
    menuItemGap: 32,
    height: {
      type: 'auto',
    },
    padding: { ...DEFAULT_SPACING },
    margin: { ...ZERO_SPACING },
    positioning: 'aboveFirstSection',
    sticky: {
      enabled: true,
      offset: 0,
    },
    scroll: {
      mode: 'none',
      triggerY: 20,
    },
    background: {
      initialColor: '#ffffff',
      scrolledColor: '#ffffff',
      initialOpacity: 100,
      scrolledOpacity: 100,
    },
    burgerMenu: {
      panelSide: 'right',
      panelWidth: 340,
      overlayOpacity: 60,
      closeOnItemClick: true,
    },
    burgerIcon: {
      size: 24,
      initialColor: '#111827',
      scrolledColor: '#111827',
    },
    border: {
      enabled: true,
      width: 1,
      color: '#e5e7eb',
    },
    presetTheme: 'light',
  };
}

export function normalizeHeaderConfig(config?: Partial<HeaderConfig> | null): HeaderConfig {
  const defaults = getDefaultHeaderConfig();

  return {
    ...defaults,
    ...config,
    // Prefer logoConfig.src and avoid persisting duplicated legacy logo values.
    logo: config?.logoConfig?.src ? undefined : config?.logo,
    layout: mapLegacyHeaderLayout(config?.layout || defaults.layout),
    logoConfig: {
      ...defaults.logoConfig,
      ...config?.logoConfig,
      sizes: {
        ...defaults.logoConfig?.sizes,
        ...config?.logoConfig?.sizes,
      },
    },
    logoScroll: {
      ...defaults.logoScroll,
      ...config?.logoScroll,
    },
    menuItemTypography: {
      ...defaults.menuItemTypography,
      ...config?.menuItemTypography,
    },
    menuItemScrolledColor: config?.menuItemScrolledColor ?? defaults.menuItemScrolledColor,
    menuItemGap: config?.menuItemGap ?? defaults.menuItemGap,
    height: {
      ...defaults.height,
      ...config?.height,
    },
    padding: {
      ...defaults.padding,
      ...config?.padding,
    },
    margin: {
      ...defaults.margin,
      ...config?.margin,
    },
    sticky: {
      ...defaults.sticky,
      ...config?.sticky,
    },
    scroll: {
      ...defaults.scroll,
      ...config?.scroll,
    },
    background: {
      ...defaults.background,
      ...config?.background,
    },
    burgerMenu: {
      ...defaults.burgerMenu,
      ...config?.burgerMenu,
    },
    burgerIcon: {
      ...defaults.burgerIcon,
      ...config?.burgerIcon,
    },
    border: {
      ...defaults.border,
      ...config?.border,
    },
    navigation: config?.navigation || defaults.navigation,
  };
}

export function resolvePageHeaderConfig(page: Page, websiteHeader: HeaderConfig): HeaderConfig {
  const normalizedWebsiteHeader = normalizeHeaderConfig(websiteHeader);
  if (!page.headerSettings?.useCustomHeader || !page.headerSettings?.headerOverride) {
    return normalizedWebsiteHeader;
  }

  return normalizeHeaderConfig({
    ...normalizedWebsiteHeader,
    ...page.headerSettings.headerOverride,
    logoConfig: {
      ...normalizedWebsiteHeader.logoConfig,
      ...page.headerSettings.headerOverride.logoConfig,
      sizes: {
        ...normalizedWebsiteHeader.logoConfig?.sizes,
        ...page.headerSettings.headerOverride.logoConfig?.sizes,
      },
    },
    logoScroll: {
      ...normalizedWebsiteHeader.logoScroll,
      ...page.headerSettings.headerOverride.logoScroll,
    },
    menuItemTypography: {
      ...normalizedWebsiteHeader.menuItemTypography,
      ...page.headerSettings.headerOverride.menuItemTypography,
    },
    menuItemScrolledColor: page.headerSettings.headerOverride.menuItemScrolledColor ?? normalizedWebsiteHeader.menuItemScrolledColor,
    menuItemGap: page.headerSettings.headerOverride.menuItemGap ?? normalizedWebsiteHeader.menuItemGap,
    height: {
      ...normalizedWebsiteHeader.height,
      ...page.headerSettings.headerOverride.height,
    },
    padding: {
      ...normalizedWebsiteHeader.padding,
      ...page.headerSettings.headerOverride.padding,
    },
    margin: {
      ...normalizedWebsiteHeader.margin,
      ...page.headerSettings.headerOverride.margin,
    },
    sticky: {
      ...normalizedWebsiteHeader.sticky,
      ...page.headerSettings.headerOverride.sticky,
    },
    scroll: {
      ...normalizedWebsiteHeader.scroll,
      ...page.headerSettings.headerOverride.scroll,
    },
    background: {
      ...normalizedWebsiteHeader.background,
      ...page.headerSettings.headerOverride.background,
    },
    burgerMenu: {
      ...normalizedWebsiteHeader.burgerMenu,
      ...page.headerSettings.headerOverride.burgerMenu,
    },
    burgerIcon: {
      ...normalizedWebsiteHeader.burgerIcon,
      ...page.headerSettings.headerOverride.burgerIcon,
    },
    border: {
      ...normalizedWebsiteHeader.border,
      ...page.headerSettings.headerOverride.border,
    },
  });
}

export function getHeaderLayoutTheme(layout: HeaderLayout): 'light' | 'dark' {
  if (layout === 'leftLogoRightMenu') return 'dark';
  if (layout === 'centeredLogoSplitMenu') return 'light';
  return 'dark';
}

export function isLegacyHeaderLayout(layout: HeaderConfig['layout']): layout is LegacyHeaderLayout {
  return layout === 'header-a' || layout === 'header-b' || layout === 'header-c';
}
