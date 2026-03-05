export interface BuilderBlueprint {
  siteName: string;
  market: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageNavigationHeading: string;
  aboutHeading: string;
  aboutBody: string;
  listingsHeading: string;
  featuredSalesHeading: string;
  blogsHeading: string;
  includeBlog: boolean;
  footerPhone: string;
  footerEmail: string;
  footerAddress: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  bodyTextColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  navStyle: 'uppercase-spaced' | 'normal';
  heroStyle: 'fullscreen-overlay' | 'split' | 'centered';
  selectedPages?: string[];
  selectedFeatures?: string[];
  agentName?: string;
  brokerageName?: string;
}

export const DEFAULT_REAL_ESTATE_BLUEPRINT: BuilderBlueprint = {
  siteName: 'Real Estate Website',
  market: 'Local Market',
  heroTitle: 'Find Your Next Home',
  heroSubtitle: 'Search local properties and connect with a trusted real estate team.',
  ctaText: 'View Exclusive Listings',
  ctaUrl: '/listings/active',
  imageNavigationHeading: 'Explore Services',
  aboutHeading: 'Why Clients Work With Us',
  aboutBody:
    'We combine local market expertise, modern marketing, and high-touch guidance to help buyers and sellers move confidently.',
  listingsHeading: 'Exclusive Listings',
  featuredSalesHeading: 'Recently Sold',
  blogsHeading: 'Real Estate Insights',
  includeBlog: true,
  footerPhone: '(555) 123-4567',
  footerEmail: 'hello@example.com',
  footerAddress: '123 Market St, Your City, ST',
  primaryColor: '#002349',
  accentColor: '#002349',
  backgroundColor: '#ffffff',
  bodyTextColor: '#666666',
  fontHeading: 'Playfair Display',
  fontBody: 'DM Sans',
  borderRadius: '0px',
  navStyle: 'uppercase-spaced',
  heroStyle: 'fullscreen-overlay',
};

function contains(text: string, patterns: string[]): boolean {
  return patterns.some((pattern) => text.includes(pattern));
}

export function normalizeToRealEstateBlueprint(
  candidate: Partial<BuilderBlueprint>,
  fallbackPrompt: string,
): BuilderBlueprint {
  const prompt = fallbackPrompt.toLowerCase();
  const next: BuilderBlueprint = { ...DEFAULT_REAL_ESTATE_BLUEPRINT };

  const safeString = (value: unknown, defaultValue: string) =>
    typeof value === 'string' && value.trim() ? value.trim() : defaultValue;

  next.siteName = safeString(candidate.siteName, next.siteName);
  next.market = safeString(candidate.market, next.market);
  next.heroTitle = safeString(candidate.heroTitle, next.heroTitle);
  next.heroSubtitle = safeString(candidate.heroSubtitle, next.heroSubtitle);
  next.ctaText = safeString(candidate.ctaText, next.ctaText);
  next.ctaUrl = safeString(candidate.ctaUrl, next.ctaUrl);
  next.imageNavigationHeading = safeString(candidate.imageNavigationHeading, next.imageNavigationHeading);
  next.aboutHeading = safeString(candidate.aboutHeading, next.aboutHeading);
  next.aboutBody = safeString(candidate.aboutBody, next.aboutBody);
  next.listingsHeading = safeString(candidate.listingsHeading, next.listingsHeading);
  next.featuredSalesHeading = safeString(candidate.featuredSalesHeading, next.featuredSalesHeading);
  next.blogsHeading = safeString(candidate.blogsHeading, next.blogsHeading);
  next.includeBlog = typeof candidate.includeBlog === 'boolean' ? candidate.includeBlog : next.includeBlog;
  next.footerPhone = safeString(candidate.footerPhone, next.footerPhone);
  next.footerEmail = safeString(candidate.footerEmail, next.footerEmail);
  next.footerAddress = safeString(candidate.footerAddress, next.footerAddress);
  next.primaryColor = safeString(candidate.primaryColor, next.primaryColor);
  next.accentColor = safeString(candidate.accentColor, next.accentColor);
  next.backgroundColor = safeString(candidate.backgroundColor, next.backgroundColor);
  next.bodyTextColor = safeString(candidate.bodyTextColor, next.bodyTextColor);
  next.fontHeading = safeString(candidate.fontHeading, next.fontHeading);
  next.fontBody = safeString(candidate.fontBody, next.fontBody);
  next.borderRadius = safeString(candidate.borderRadius, next.borderRadius);

  const validNavStyles = ['uppercase-spaced', 'normal'] as const;
  next.navStyle = validNavStyles.includes(candidate.navStyle as typeof validNavStyles[number])
    ? (candidate.navStyle as typeof validNavStyles[number])
    : next.navStyle;

  const validHeroStyles = ['fullscreen-overlay', 'split', 'centered'] as const;
  next.heroStyle = validHeroStyles.includes(candidate.heroStyle as typeof validHeroStyles[number])
    ? (candidate.heroStyle as typeof validHeroStyles[number])
    : next.heroStyle;

  if (!/listing|home|property|real estate|real-estate|exclusive/i.test(next.listingsHeading)) {
    next.listingsHeading = DEFAULT_REAL_ESTATE_BLUEPRINT.listingsHeading;
  }
  if (!/blog|market|real estate|real-estate|insight/i.test(next.blogsHeading)) {
    next.blogsHeading = DEFAULT_REAL_ESTATE_BLUEPRINT.blogsHeading;
  }
  if (!/sale|sold|closed|recent/i.test(next.featuredSalesHeading)) {
    next.featuredSalesHeading = DEFAULT_REAL_ESTATE_BLUEPRINT.featuredSalesHeading;
  }
  const allowedCtaRoutes = new Set([
    '/buying',
    '/selling',
    '/about',
    '/contact',
    '/blog',
    '/listings',
    '/listings/active',
    '/listings/sold',
    '/active-listings',
  ]);
  if (!allowedCtaRoutes.has(next.ctaUrl)) {
    next.ctaUrl = DEFAULT_REAL_ESTATE_BLUEPRINT.ctaUrl;
  }

  if (contains(prompt, ['luxury', 'premium', 'high end', 'high-end'])) {
    next.siteName = safeString(candidate.siteName, 'Luxury Real Estate Group');
    next.heroTitle = safeString(candidate.heroTitle, 'Luxury Properties, Expert Representation');
    next.heroSubtitle = safeString(
      candidate.heroSubtitle,
      'Showcasing exceptional homes with concierge-level client service.',
    );
    next.primaryColor = safeString(candidate.primaryColor, '#0B0F19');
    next.accentColor = safeString(candidate.accentColor, '#C9A96E');
  }
  if (contains(prompt, ['modern', 'minimal', 'clean'])) {
    next.primaryColor = safeString(candidate.primaryColor, '#111827');
    next.accentColor = safeString(candidate.accentColor, '#111827');
    next.fontHeading = safeString(candidate.fontHeading, 'DM Sans');
    next.fontBody = safeString(candidate.fontBody, 'Inter');
    next.borderRadius = safeString(candidate.borderRadius, '8px');
  }
  if (contains(prompt, ['warm', 'traditional', 'classic'])) {
    next.primaryColor = safeString(candidate.primaryColor, '#141414');
    next.accentColor = safeString(candidate.accentColor, '#c28563');
    next.fontHeading = safeString(candidate.fontHeading, 'Cormorant Garamond');
  }
  if (contains(prompt, ['no blog', 'without blog', 'exclude blog'])) {
    next.includeBlog = false;
  }

  if (Array.isArray(candidate.selectedPages) && candidate.selectedPages.length) {
    next.selectedPages = candidate.selectedPages;
  }
  if (Array.isArray(candidate.selectedFeatures) && candidate.selectedFeatures.length) {
    next.selectedFeatures = candidate.selectedFeatures;
  }
  if (typeof candidate.agentName === 'string' && candidate.agentName.trim()) {
    next.agentName = candidate.agentName.trim();
  }
  if (typeof candidate.brokerageName === 'string' && candidate.brokerageName.trim()) {
    next.brokerageName = candidate.brokerageName.trim();
  }

  return next;
}

export function createFallbackBlueprint(prompt: string): BuilderBlueprint {
  const normalized = prompt.toLowerCase();
  const next: BuilderBlueprint = { ...DEFAULT_REAL_ESTATE_BLUEPRINT };

  if (contains(normalized, ['luxury', 'premium', 'high end', 'high-end'])) {
    next.siteName = 'Luxury Real Estate Group';
    next.market = 'Luxury Market';
    next.heroTitle = 'Luxury Properties, Expert Representation';
    next.heroSubtitle = 'Showcasing exceptional homes with concierge-level client service.';
    next.primaryColor = '#0B0F19';
    next.accentColor = '#C9A96E';
  }

  if (contains(normalized, ['modern', 'minimal', 'clean'])) {
    next.siteName = 'Modern Realty';
    next.market = 'Modern Home Buyers';
    next.heroTitle = 'Modern Real Estate For Today';
    next.heroSubtitle = 'A clean, fast way to discover listings and schedule showings.';
    next.primaryColor = '#111827';
    next.accentColor = '#111827';
    next.fontHeading = 'DM Sans';
    next.fontBody = 'Inter';
    next.borderRadius = '8px';
  }

  if (contains(normalized, ['investor', 'investment'])) {
    next.siteName = 'Investment Property Advisors';
    next.market = 'Investment Properties';
    next.heroTitle = 'Investment Properties With Strong Potential';
    next.heroSubtitle = 'Data-driven acquisition support for investors and portfolio builders.';
    next.ctaText = 'Explore Investment Listings';
  }

  return next;
}

export function parseBlueprintCandidate(candidate: unknown): BuilderBlueprint | null {
  if (!candidate || typeof candidate !== 'object') return null;
  const c = candidate as Partial<BuilderBlueprint>;
  const stringsAreValid =
    typeof c.siteName === 'string' &&
    typeof c.heroTitle === 'string' &&
    typeof c.heroSubtitle === 'string' &&
    typeof c.ctaText === 'string' &&
    typeof c.ctaUrl === 'string' &&
    typeof c.imageNavigationHeading === 'string' &&
    typeof c.aboutHeading === 'string' &&
    typeof c.aboutBody === 'string' &&
    typeof c.listingsHeading === 'string' &&
    typeof c.featuredSalesHeading === 'string' &&
    typeof c.blogsHeading === 'string' &&
    typeof c.footerPhone === 'string' &&
    typeof c.footerEmail === 'string' &&
    typeof c.footerAddress === 'string' &&
    typeof c.primaryColor === 'string' &&
    typeof c.accentColor === 'string';

  if (!stringsAreValid) return null;
  if (typeof c.market !== 'string') return null;
  if (typeof c.includeBlog !== 'boolean') return null;

  return {
    siteName: c.siteName,
    market: c.market,
    heroTitle: c.heroTitle,
    heroSubtitle: c.heroSubtitle,
    ctaText: c.ctaText,
    ctaUrl: c.ctaUrl,
    imageNavigationHeading: c.imageNavigationHeading,
    aboutHeading: c.aboutHeading,
    aboutBody: c.aboutBody,
    listingsHeading: c.listingsHeading,
    featuredSalesHeading: c.featuredSalesHeading,
    blogsHeading: c.blogsHeading,
    includeBlog: c.includeBlog,
    footerPhone: c.footerPhone,
    footerEmail: c.footerEmail,
    footerAddress: c.footerAddress,
    primaryColor: c.primaryColor,
    accentColor: c.accentColor,
    backgroundColor: typeof c.backgroundColor === 'string' ? c.backgroundColor : DEFAULT_REAL_ESTATE_BLUEPRINT.backgroundColor,
    bodyTextColor: typeof c.bodyTextColor === 'string' ? c.bodyTextColor : DEFAULT_REAL_ESTATE_BLUEPRINT.bodyTextColor,
    fontHeading: typeof c.fontHeading === 'string' ? c.fontHeading : DEFAULT_REAL_ESTATE_BLUEPRINT.fontHeading,
    fontBody: typeof c.fontBody === 'string' ? c.fontBody : DEFAULT_REAL_ESTATE_BLUEPRINT.fontBody,
    borderRadius: typeof c.borderRadius === 'string' ? c.borderRadius : DEFAULT_REAL_ESTATE_BLUEPRINT.borderRadius,
    navStyle: c.navStyle === 'uppercase-spaced' || c.navStyle === 'normal' ? c.navStyle : DEFAULT_REAL_ESTATE_BLUEPRINT.navStyle,
    heroStyle: c.heroStyle === 'fullscreen-overlay' || c.heroStyle === 'split' || c.heroStyle === 'centered' ? c.heroStyle : DEFAULT_REAL_ESTATE_BLUEPRINT.heroStyle,
  };
}
