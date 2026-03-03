'use client';

import type { CSSProperties } from 'react';
import { Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FooterConfig, GlobalStyles, NavItem, SocialLink } from '@/lib/types';
import { normalizeFooterConfig } from '@/lib/footer-config';
import { typographyToCSS } from '@/lib/typography-utils';
import { resolveGlobalColorValue } from '@/lib/global-colors';

type DeviceView = 'mobile' | 'tablet' | 'desktop';

const DEFAULT_SOCIAL_SVGS: Record<'instagram' | 'facebook' | 'twitter' | 'linkedin', string> = {
  twitter:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>',
  linkedin:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
  facebook:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
  instagram:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
};

function toSvgDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getDefaultSocialIconSrc(platform: SocialLink['platform'], color: string): string | null {
  if (platform !== 'instagram' && platform !== 'facebook' && platform !== 'twitter' && platform !== 'linkedin') {
    return null;
  }
  const raw = DEFAULT_SOCIAL_SVGS[platform];
  return toSvgDataUrl(raw.replaceAll('currentColor', color));
}

interface SiteFooterProps {
  websiteName: string;
  footer: FooterConfig;
  headerNavigation?: NavItem[];
  globalStyles?: GlobalStyles;
  deviceView?: DeviceView;
  className?: string;
}

function getLogoSize(config: FooterConfig, deviceView: DeviceView): number {
  if (deviceView === 'mobile') return config.logoConfig?.sizes.mobile || 32;
  if (deviceView === 'tablet') return config.logoConfig?.sizes.tablet || 40;
  return config.logoConfig?.sizes.desktop || 48;
}

function renderSocialIcon(link: SocialLink, color: string, size: number) {
  if (link.platform === 'custom' && link.iconSrc) {
    return <img src={link.iconSrc} alt={link.label || 'Social icon'} style={{ width: size, height: size }} className="object-contain" />;
  }

  const defaultIconSrc = getDefaultSocialIconSrc(link.platform, color);
  if (defaultIconSrc) {
    return <img src={defaultIconSrc} alt={link.label || link.platform} style={{ width: size, height: size }} className="object-contain" />;
  }
  if (link.platform === 'youtube') return <Youtube style={{ width: size, height: size, color }} />;
  return null;
}

function renderAddress(address: string | undefined) {
  if (!address) return null;
  return address.split('\n').map((line, index) => (
    <span key={`${line}-${index}`} className="block">
      {line}
    </span>
  ));
}

export function SiteFooter({
  websiteName,
  footer,
  headerNavigation = [],
  globalStyles,
  deviceView = 'desktop',
  className,
}: SiteFooterProps) {
  const config = normalizeFooterConfig(footer);
  const logoSize = getLogoSize(config, deviceView);
  const resolvedNavigation = (config.menuSource === 'headerNavigation' ? headerNavigation : config.navigation)
    .slice()
    .sort((a, b) => a.order - b.order);
  const iconSize = Math.max(12, config.socialIconSize || 18);
  const iconGap = Math.max(4, config.socialIconGap || 12);
  const socialColor = resolveGlobalColorValue(config.socialIconColor || '#f9fafb', globalStyles, '#f9fafb');
  const customSocialColor = resolveGlobalColorValue(config.customSocialIconColor || socialColor, globalStyles, socialColor);
  const menuTypographyStyles = typographyToCSS({
    fontFamily: config.menuItemTypography?.fontFamily || 'Inter',
    fontSize: config.menuItemTypography?.fontSize || { value: 13, unit: 'px' },
    fontWeight: config.menuItemTypography?.fontWeight || '500',
    lineHeight: config.menuItemTypography?.lineHeight || '1.4',
    textTransform: config.menuItemTypography?.textTransform || 'uppercase',
    letterSpacing: config.menuItemTypography?.letterSpacing || '0.08em',
    color: resolveGlobalColorValue(config.menuItemTypography?.color || '#e5e7eb', globalStyles, '#e5e7eb'),
  } as any);
  const contactTypographyStyles = typographyToCSS({
    fontFamily: config.contactTypography?.fontFamily || 'Inter',
    fontSize: config.contactTypography?.fontSize || { value: 15, unit: 'px' },
    fontWeight: config.contactTypography?.fontWeight || '500',
    lineHeight: config.contactTypography?.lineHeight || '1.5',
    textTransform: config.contactTypography?.textTransform || 'none',
    letterSpacing: config.contactTypography?.letterSpacing || '0em',
    color: resolveGlobalColorValue(config.contactTypography?.color || '#f9fafb', globalStyles, '#f9fafb'),
  } as any);
  const disclaimerStyles = typographyToCSS({
    fontFamily: config.disclaimerTypography?.fontFamily || 'Inter',
    fontSize: config.disclaimerTypography?.fontSize || { value: 12, unit: 'px' },
    fontWeight: config.disclaimerTypography?.fontWeight || '400',
    lineHeight: config.disclaimerTypography?.lineHeight || '1.6',
    textTransform: config.disclaimerTypography?.textTransform || 'none',
    letterSpacing: config.disclaimerTypography?.letterSpacing || '0em',
    color: resolveGlobalColorValue(config.disclaimerTypography?.color || '#d1d5db', globalStyles, '#d1d5db'),
  } as any);
  const legalStyles = typographyToCSS({
    fontFamily: config.legalTypography?.fontFamily || 'Inter',
    fontSize: config.legalTypography?.fontSize || { value: 10, unit: 'px' },
    fontWeight: config.legalTypography?.fontWeight || '400',
    lineHeight: config.legalTypography?.lineHeight || '1.4',
    textTransform: config.legalTypography?.textTransform || 'uppercase',
    letterSpacing: config.legalTypography?.letterSpacing || '0.08em',
    color: resolveGlobalColorValue(config.legalTypography?.color || '#9ca3af', globalStyles, '#9ca3af'),
  } as any);

  const backgroundTop = resolveGlobalColorValue(config.background?.topColor || '#111827', globalStyles, '#111827');
  const backgroundBottom = resolveGlobalColorValue(config.background?.bottomColor || '#030712', globalStyles, '#030712');

  const containerStyle: CSSProperties = {
    marginTop: `${config.margin?.top || 0}px`,
    marginRight: `${config.margin?.right || 0}px`,
    marginBottom: `${config.margin?.bottom || 0}px`,
    marginLeft: `${config.margin?.left || 0}px`,
    paddingTop: `${config.padding?.top || 56}px`,
    paddingRight: `${config.padding?.right || 24}px`,
    paddingBottom: `${config.padding?.bottom || 24}px`,
    paddingLeft: `${config.padding?.left || 24}px`,
  };

  return (
    <footer className={cn('relative w-full overflow-hidden', className)}>
      {config.layout === 'footer-b' ? (
        <div className="relative w-full" style={{ ...containerStyle, backgroundColor: backgroundTop }}>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24" style={{ backgroundColor: backgroundBottom }} />
          {config.background?.watermarkSvg && (
            <img
              src={config.background.watermarkSvg}
              alt=""
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
              style={{
                width: `${config.background?.watermarkSize || 72}%`,
                opacity: Math.max(0, Math.min(100, config.background?.watermarkOpacity || 8)) / 100,
              }}
            />
          )}
          <div className="relative w-full space-y-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <nav className="flex flex-wrap items-center gap-4" style={{ gap: `${config.menuItemGap || 24}px` }}>
                {resolvedNavigation.map((item) => (
                  <a
                    key={item.id}
                    href={item.url || '#'}
                    target={item.openInNewTab ? '_blank' : undefined}
                    rel={item.openInNewTab ? 'noreferrer' : undefined}
                    className="hover:opacity-80 transition-opacity"
                    style={menuTypographyStyles}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col gap-3 md:items-end">
                <div className="flex items-center" style={{ gap: `${iconGap}px` }}>
                  {config.socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url || '#'}
                      target={link.openInNewTab === false ? undefined : '_blank'}
                      rel={link.openInNewTab === false ? undefined : 'noreferrer'}
                      className="inline-flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ color: link.platform === 'custom' ? customSocialColor : socialColor }}
                      aria-label={link.label || link.platform}
                    >
                      {renderSocialIcon(
                        link,
                        link.platform === 'custom' ? customSocialColor : socialColor,
                        iconSize
                      )}
                    </a>
                  ))}
                </div>
                <div className="text-left md:text-right" style={legalStyles}>
                  <a href={config.legalLinks?.privacyUrl || '/privacy'} className="hover:opacity-80 transition-opacity">
                    {config.legalLinks?.privacyLabel || 'Privacy Policy'}
                  </a>
                  <span className="mx-2">|</span>
                  <a href={config.legalLinks?.termsUrl || '/terms'} className="hover:opacity-80 transition-opacity">
                    {config.legalLinks?.termsLabel || 'Terms of Service'}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-2" style={contactTypographyStyles}>
                {config.logoConfig?.src || config.logo ? (
                  <img
                    src={config.logoConfig?.src || config.logo}
                    alt={config.logoConfig?.alt || 'Footer logo'}
                    className="w-auto object-contain"
                    style={{ height: `${logoSize}px` }}
                  />
                ) : null}
                <div className="grid gap-1 sm:grid-cols-2 sm:gap-10">
                  <div className="space-y-1">
                    <div className="font-semibold">{websiteName}</div>
                    {config.phone ? <div>{config.phone}</div> : null}
                    {config.email ? <div>{config.email}</div> : null}
                  </div>
                  <div className="space-y-1">{config.address ? <div>{renderAddress(config.address)}</div> : null}</div>
                </div>
              </div>
            </div>
            {config.disclaimer ? <p className="relative z-10" style={disclaimerStyles}>{config.disclaimer}</p> : null}
          </div>
        </div>
      ) : (
        <div
          style={{ ...containerStyle, backgroundColor: backgroundTop }}
          className={cn(config.layout === 'footer-c' && 'border-t border-white/10')}
        >
          <div className="w-full space-y-8">
            <div
              className={cn(
                'grid gap-8',
                config.layout === 'footer-a' ? 'md:grid-cols-[1.2fr_1fr_auto]' : 'md:grid-cols-[1fr_auto_1fr]'
              )}
            >
              <div className="space-y-3" style={contactTypographyStyles}>
                {config.logoConfig?.src || config.logo ? (
                  <img
                    src={config.logoConfig?.src || config.logo}
                    alt={config.logoConfig?.alt || 'Footer logo'}
                    className="w-auto object-contain"
                    style={{ height: `${logoSize}px` }}
                  />
                ) : (
                  <div className="font-semibold">{websiteName}</div>
                )}
                {config.phone ? <div>{config.phone}</div> : null}
                {config.email ? <div>{config.email}</div> : null}
                {config.address ? <div>{renderAddress(config.address)}</div> : null}
              </div>

              <nav
                className={cn(
                  'flex flex-wrap items-center',
                  config.layout === 'footer-c' ? 'justify-start md:justify-center' : 'justify-start'
                )}
                style={{ gap: `${config.menuItemGap || 24}px` }}
              >
                {resolvedNavigation.map((item) => (
                  <a
                    key={item.id}
                    href={item.url || '#'}
                    target={item.openInNewTab ? '_blank' : undefined}
                    rel={item.openInNewTab ? 'noreferrer' : undefined}
                    className="hover:opacity-80 transition-opacity"
                    style={menuTypographyStyles}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-start md:justify-end">
                <div className="flex items-center" style={{ gap: `${iconGap}px` }}>
                  {config.socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url || '#'}
                      target={link.openInNewTab === false ? undefined : '_blank'}
                      rel={link.openInNewTab === false ? undefined : 'noreferrer'}
                      className="inline-flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ color: link.platform === 'custom' ? customSocialColor : socialColor }}
                      aria-label={link.label || link.platform}
                    >
                      {renderSocialIcon(
                        link,
                        link.platform === 'custom' ? customSocialColor : socialColor,
                        iconSize
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {config.disclaimer ? <p style={disclaimerStyles}>{config.disclaimer}</p> : null}

            <div className="flex flex-col gap-2 border-t border-white/10 pt-3 md:flex-row md:items-center md:justify-between">
              <p style={disclaimerStyles}>© {new Date().getFullYear()} {websiteName}. All rights reserved.</p>
              <div style={legalStyles}>
                <a href={config.legalLinks?.privacyUrl || '/privacy'} className="hover:opacity-80 transition-opacity">
                  {config.legalLinks?.privacyLabel || 'Privacy Policy'}
                </a>
                <span className="mx-2">|</span>
                <a href={config.legalLinks?.termsUrl || '/terms'} className="hover:opacity-80 transition-opacity">
                  {config.legalLinks?.termsLabel || 'Terms of Service'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
