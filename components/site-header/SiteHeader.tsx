'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlobalStyles, HeaderConfig, NavItem } from '@/lib/types';
import { mapLegacyHeaderLayout, normalizeHeaderConfig } from '@/lib/header-config';
import { typographyToCSS } from '@/lib/typography-utils';
import { resolveGlobalColorValue } from '@/lib/global-colors';

type DeviceView = 'mobile' | 'tablet' | 'desktop';

interface SiteHeaderProps {
  websiteName: string;
  header: HeaderConfig;
  deviceView?: DeviceView;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  scrollContainerRef?: RefObject<HTMLElement>;
  globalStyles?: GlobalStyles;
  overlay?: boolean;
}

function applyOpacity(color: string, opacityPercent: number): string {
  if (!color) return `rgba(255, 255, 255, ${opacityPercent / 100})`;
  if (/^#([0-9a-fA-F]{6})$/.test(color)) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(100, opacityPercent)) / 100})`;
  }
  if (opacityPercent >= 100) return color;
  return `color-mix(in srgb, ${color} ${opacityPercent}%, transparent)`;
}

function getLogoSize(config: HeaderConfig, deviceView: DeviceView): number {
  if (deviceView === 'mobile') return config.logoConfig?.sizes?.mobile || 28;
  if (deviceView === 'tablet') return config.logoConfig?.sizes?.tablet || 34;
  return config.logoConfig?.sizes?.desktop || 40;
}

function getHeightStyle(config: HeaderConfig, minHeight: number): string | undefined {
  const type = config.height?.type || 'auto';
  const value = config.height?.value;
  if (type === 'auto') return undefined;
  if (typeof value !== 'number') return undefined;
  if (type === 'vh') return `${value}vh`;
  if (type === 'percentage') return `${value}%`;
  if (type === 'pixels') return `${Math.max(value, minHeight)}px`;
  return undefined;
}

function isSvgSource(src: string): boolean {
  if (!src) return false;
  return src.startsWith('data:image/svg+xml') || /\.svg(\?|$)/i.test(src);
}

function recolorSvgDataUrl(src: string, color: string): string {
  if (!src.startsWith('data:image/svg+xml')) return src;

  try {
    const utf8Prefix = 'data:image/svg+xml;utf8,';
    const base64Prefix = 'data:image/svg+xml;base64,';
    let svg = '';

    if (src.startsWith(utf8Prefix)) {
      svg = decodeURIComponent(src.slice(utf8Prefix.length));
    } else if (src.startsWith(base64Prefix)) {
      svg = atob(src.slice(base64Prefix.length));
    } else {
      return src;
    }

    const updated = svg.replace(/fill="(?!none)[^"]*"/gi, `fill="${color}"`);
    return `${utf8Prefix}${encodeURIComponent(updated)}`;
  } catch {
    return src;
  }
}

function HeaderNav({
  items,
  className,
  onItemClick,
  itemStyle,
  navStyle,
}: {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
  itemStyle?: CSSProperties;
  navStyle?: CSSProperties;
}) {
  const sortedItems = [...items].sort((a, b) => a.order - b.order);
  return (
    <nav className={className} style={navStyle}>
      {sortedItems.map((item) => (
        <a
          key={item.id}
          href={item.url || '#'}
          target={item.openInNewTab ? '_blank' : undefined}
          rel={item.openInNewTab ? 'noreferrer' : undefined}
          className="text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
          onClick={onItemClick}
          style={itemStyle}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function SiteHeader({
  websiteName,
  header,
  deviceView = 'desktop',
  clickable = false,
  onClick,
  className,
  scrollContainerRef,
  globalStyles,
  overlay = false,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const config = useMemo(() => normalizeHeaderConfig(header), [header]);
  const layout = mapLegacyHeaderLayout(config.layout);
  const logoSize = getLogoSize(config, deviceView);
  const padding = config.padding || { top: 16, right: 24, bottom: 16, left: 24 };
  const minHeight = logoSize + padding.top + padding.bottom;

  useEffect(() => {
    const container = scrollContainerRef?.current;
    const onScroll = () => {
      const triggerY = config.scroll?.triggerY ?? 20;
      const scrollTop = container ? container.scrollTop : window.scrollY;
      setIsScrolled(scrollTop > triggerY);
    };
    onScroll();
    if (container) {
      container.addEventListener('scroll', onScroll, { passive: true });
      return () => container.removeEventListener('scroll', onScroll);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [config.scroll?.triggerY, scrollContainerRef]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener('keydown', onEscape);
      return () => window.removeEventListener('keydown', onEscape);
    }
    return undefined;
  }, [menuOpen]);

  const usingTransparentToSolid = config.scroll?.mode === 'transparent-to-solid';
  const usingSolidToTransparent = config.scroll?.mode === 'solid-to-transparent';
  const usingColorShift = config.scroll?.mode === 'color-shift' || usingTransparentToSolid || usingSolidToTransparent;
  const bg = config.background;

  const finalBgColor = usingColorShift
    ? (isScrolled
      ? applyOpacity(bg?.scrolledColor || '#ffffff', bg?.scrolledOpacity ?? 100)
      : applyOpacity(bg?.initialColor || '#ffffff', bg?.initialOpacity ?? 100))
    : applyOpacity(bg?.initialColor || '#ffffff', bg?.initialOpacity ?? 100);

  const textColor = config.presetTheme === 'dark' ? '#ffffff' : '#111827';
  const initialMenuColor = resolveGlobalColorValue(config.menuItemTypography?.color || textColor, globalStyles, textColor);
  const scrolledMenuColor = resolveGlobalColorValue(config.menuItemScrolledColor || config.menuItemTypography?.color || textColor, globalStyles, textColor);
  const menuColor = usingColorShift && isScrolled ? scrolledMenuColor : initialMenuColor;
  const initialBurgerColor = resolveGlobalColorValue(config.burgerIcon?.initialColor || menuColor, globalStyles, menuColor);
  const scrolledBurgerColor = resolveGlobalColorValue(config.burgerIcon?.scrolledColor || config.burgerIcon?.initialColor || menuColor, globalStyles, menuColor);
  const burgerColor = usingColorShift && isScrolled ? scrolledBurgerColor : initialBurgerColor;
  const menuTypographyStyles = typographyToCSS({
    fontFamily: config.menuItemTypography?.fontFamily || 'Inter',
    fontSize: config.menuItemTypography?.fontSize || { value: 14, unit: 'px' },
    fontWeight: config.menuItemTypography?.fontWeight || '500',
    lineHeight: config.menuItemTypography?.lineHeight || '1.4',
    textTransform: config.menuItemTypography?.textTransform || 'uppercase',
    letterSpacing: config.menuItemTypography?.letterSpacing || '0.08em',
    color: menuColor,
  } as any);
  const logoSrc = config.logoConfig?.src || config.logo || '';
  const logoIsSvg = isSvgSource(logoSrc);
  const logoScrollMode = config.logoScroll?.mode || 'none';
  const displayedLogoSrc = useMemo(() => {
    if (logoScrollMode === 'swap-image' && isScrolled && config.logoScroll?.scrolledSrc) {
      return config.logoScroll.scrolledSrc;
    }

    if (logoScrollMode === 'svg-color' && logoIsSvg) {
      const initialLogoColor = resolveGlobalColorValue(config.logoScroll?.initialColor || '#ffffff', globalStyles, '#ffffff');
      const scrolledLogoColor = resolveGlobalColorValue(config.logoScroll?.scrolledColor || config.logoScroll?.initialColor || '#ffffff', globalStyles, initialLogoColor);
      const nextColor = isScrolled ? scrolledLogoColor : initialLogoColor;
      return recolorSvgDataUrl(logoSrc, nextColor);
    }

    return logoSrc;
  }, [logoScrollMode, isScrolled, config.logoScroll?.scrolledSrc, config.logoScroll?.initialColor, config.logoScroll?.scrolledColor, logoIsSvg, logoSrc]);
  const computedHeight = getHeightStyle(config, minHeight);
  const isSticky = config.sticky?.enabled;
  const menuGap = Math.max(0, config.menuItemGap ?? 32);
  const burgerIconSize = Math.max(14, config.burgerIcon?.size || 24);
  const burgerIconSrc = config.burgerIcon?.src || '';
  const burgerIconIsSvg = isSvgSource(burgerIconSrc);
  const displayedBurgerIconSrc = useMemo(() => {
    if (!burgerIconSrc) return '';
    if (!burgerIconIsSvg) return burgerIconSrc;
    return recolorSvgDataUrl(
      burgerIconSrc,
      usingColorShift && isScrolled
        ? scrolledBurgerColor
        : initialBurgerColor
    );
  }, [
    burgerIconSrc,
    burgerIconIsSvg,
    usingColorShift,
    isScrolled,
    initialBurgerColor,
    scrolledBurgerColor,
  ]);
  const borderEnabled = config.border?.enabled ?? true;
  const borderWidth = Math.max(0, config.border?.width ?? 1);
  const borderColor = config.border?.color || '#e5e7eb';
  const showDesktopNav = deviceView === 'desktop' && layout !== 'centeredLogoBurger';
  const showBurgerTrigger = layout === 'centeredLogoBurger' || deviceView !== 'desktop';
  const computedPosition = overlay
    ? (isSticky ? 'fixed' : 'absolute')
    : (isSticky ? 'sticky' : undefined);

  return (
    <>
      <header
        className={cn(
          'z-40 w-full transition-colors duration-300',
          isSticky && 'sticky',
          clickable && 'cursor-pointer hover:ring-2 hover:ring-primary/70',
          className
        )}
        style={{
          position: computedPosition,
          top: isSticky ? `${config.sticky?.offset || 0}px` : undefined,
          left: overlay ? '0' : undefined,
          right: overlay ? '0' : undefined,
          minHeight: `${minHeight}px`,
          height: computedHeight,
          marginTop: `${config.margin?.top || 0}px`,
          marginRight: `${config.margin?.right || 0}px`,
          marginBottom: `${config.margin?.bottom || 0}px`,
          marginLeft: `${config.margin?.left || 0}px`,
          paddingTop: `${padding.top}px`,
          paddingRight: `${padding.right}px`,
          paddingBottom: `${padding.bottom}px`,
          paddingLeft: `${padding.left}px`,
          backgroundColor: finalBgColor,
          color: textColor,
          borderBottomStyle: borderEnabled ? 'solid' : 'none',
          borderBottomWidth: borderEnabled ? `${borderWidth}px` : '0px',
          borderBottomColor: borderColor,
        }}
        onClick={onClick}
      >
        <div className="mx-auto max-w-7xl">
          {layout === 'leftLogoRightMenu' && (
            <div className="flex items-center justify-between gap-4">
              <div className="font-bold leading-none" style={{ fontSize: `${logoSize}px` }}>
                {displayedLogoSrc ? (
                  <img src={displayedLogoSrc} alt={config.logoConfig?.alt || 'Logo'} style={{ height: `${logoSize}px` }} className="w-auto object-contain" />
                ) : (
                  websiteName
                )}
              </div>
              {showDesktopNav ? (
                <HeaderNav
                  items={config.navigation}
                  className="flex items-center"
                  itemStyle={menuTypographyStyles}
                  navStyle={{ gap: `${menuGap}px` }}
                />
              ) : (
                showBurgerTrigger && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(true);
                    }}
                    className="inline-flex items-center justify-center hover:opacity-70 transition-opacity"
                    aria-label="Open navigation menu"
                    style={{ color: burgerColor }}
                  >
                    {displayedBurgerIconSrc ? (
                      <img src={displayedBurgerIconSrc} alt="Menu icon" style={{ width: `${burgerIconSize}px`, height: `${burgerIconSize}px` }} className="object-contain" />
                    ) : (
                      <Menu style={{ width: `${burgerIconSize}px`, height: `${burgerIconSize}px` }} />
                    )}
                  </button>
                )
              )}
            </div>
          )}

          {layout === 'centeredLogoSplitMenu' && (
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              {showDesktopNav ? (
                <HeaderNav
                  items={config.navigation.filter((_, index) => index % 2 === 0)}
                  className="flex items-center justify-end"
                  itemStyle={menuTypographyStyles}
                  navStyle={{ gap: `${menuGap}px` }}
                />
              ) : (
                <div />
              )}
              <div className="font-bold text-center leading-none" style={{ fontSize: `${logoSize}px` }}>
                {displayedLogoSrc ? (
                  <img src={displayedLogoSrc} alt={config.logoConfig?.alt || 'Logo'} style={{ height: `${logoSize}px` }} className="w-auto object-contain" />
                ) : (
                  websiteName
                )}
              </div>
              {showDesktopNav ? (
                <HeaderNav
                  items={config.navigation.filter((_, index) => index % 2 !== 0)}
                  className="flex items-center justify-start"
                  itemStyle={menuTypographyStyles}
                  navStyle={{ gap: `${menuGap}px` }}
                />
              ) : (
                <div className="flex justify-end">
                  {showBurgerTrigger && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(true);
                      }}
                      className="inline-flex items-center justify-center hover:opacity-70 transition-opacity"
                      aria-label="Open navigation menu"
                      style={{ color: burgerColor }}
                    >
                      {displayedBurgerIconSrc ? (
                        <img src={displayedBurgerIconSrc} alt="Menu icon" style={{ width: `${burgerIconSize}px`, height: `${burgerIconSize}px` }} className="object-contain" />
                      ) : (
                        <Menu style={{ width: `${burgerIconSize}px`, height: `${burgerIconSize}px` }} />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {layout === 'centeredLogoBurger' && (
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div />
              <div className="font-bold text-center leading-none" style={{ fontSize: `${logoSize}px` }}>
                {displayedLogoSrc ? (
                  <img src={displayedLogoSrc} alt={config.logoConfig?.alt || 'Logo'} style={{ height: `${logoSize}px` }} className="w-auto object-contain" />
                ) : (
                  websiteName
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(true);
                  }}
                  className="inline-flex items-center justify-center hover:opacity-70 transition-opacity"
                  aria-label="Open navigation menu"
                  style={{ color: burgerColor }}
                >
                  {displayedBurgerIconSrc ? (
                    <img src={displayedBurgerIconSrc} alt="Menu icon" style={{ width: `${burgerIconSize}px`, height: `${burgerIconSize}px` }} className="object-contain" />
                  ) : (
                    <Menu style={{ width: `${burgerIconSize}px`, height: `${burgerIconSize}px` }} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: Math.max(0, Math.min(100, config.burgerMenu?.overlayOpacity || 60)) / 100 }}
          />
          <aside
            className={cn(
              'absolute top-0 h-full bg-background p-6 shadow-xl',
              config.burgerMenu?.panelSide === 'left' ? 'left-0' : 'right-0'
            )}
            style={{ width: `${config.burgerMenu?.panelWidth || 340}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <HeaderNav
              items={config.navigation}
              className="flex flex-col items-start"
              onItemClick={config.burgerMenu?.closeOnItemClick ? () => setMenuOpen(false) : undefined}
              itemStyle={menuTypographyStyles}
              navStyle={{ gap: `${Math.max(12, Math.round(menuGap * 0.6))}px` }}
            />
          </aside>
        </div>
      )}
    </>
  );
}
