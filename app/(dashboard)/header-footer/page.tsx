'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useWebsiteStore } from '@/lib/stores/website';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';
import { FooterConfig, FooterLayout, HeaderConfig, HeaderLayout, NavItem, Page, SocialLink, SpacingValues } from '@/lib/types';
import { getDefaultHeaderConfig, normalizeHeaderConfig, resolvePageHeaderConfig } from '@/lib/header-config';
import { SiteHeader } from '@/components/site-header/SiteHeader';
import { SiteFooter } from '@/components/site-footer/SiteFooter';
import { ImageUpload } from '@/components/builder/ImageUpload';
import { GlobalColorInput } from '@/components/builder/controls/GlobalColorInput';
import { TypographyControl } from '@/components/builder/controls/TypographyControl';
import { ArrowLeft, Monitor, Plus, Smartphone, Tablet, Trash2 } from 'lucide-react';
import { getGlobalColorCssVars } from '@/lib/global-colors';
import { getDefaultFooterConfig, normalizeFooterConfig } from '@/lib/footer-config';

const LAYOUT_OPTIONS: Array<{ id: HeaderLayout; title: string; description: string }> = [
  { id: 'leftLogoRightMenu', title: 'Logo Left / Menu Right', description: 'Dark visual reference' },
  { id: 'centeredLogoSplitMenu', title: 'Centered Logo / Split Menu', description: 'Light visual reference' },
  { id: 'centeredLogoBurger', title: 'Centered Logo / Burger Right', description: 'Overlay menu visual reference' },
];

const FOOTER_LAYOUT_OPTIONS: Array<{ id: FooterLayout; title: string; description: string }> = [
  { id: 'footer-a', title: 'Brand + Contact + Links', description: 'Dark editorial footer with links and socials' },
  { id: 'footer-b', title: 'Split Color + Watermark', description: 'Two-tone footer with optional SVG watermark' },
  { id: 'footer-c', title: 'Minimal Navigation Footer', description: 'Compact footer with contact and legal links' },
];

function withSafeLogoSizes(config: HeaderConfig): HeaderConfig {
  return normalizeHeaderConfig({
    ...config,
    logoConfig: {
      ...config.logoConfig,
      sizes: {
        mobile: config.logoConfig?.sizes?.mobile || 28,
        tablet: config.logoConfig?.sizes?.tablet || 34,
        desktop: config.logoConfig?.sizes?.desktop || 40,
      },
    },
  });
}

function SpacingEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: SpacingValues;
  onChange: (next: SpacingValues) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <Input type="number" value={value.top} onChange={(e) => onChange({ ...value, top: Number(e.target.value) })} placeholder="Top" />
        <Input type="number" value={value.right} onChange={(e) => onChange({ ...value, right: Number(e.target.value) })} placeholder="Right" />
        <Input type="number" value={value.bottom} onChange={(e) => onChange({ ...value, bottom: Number(e.target.value) })} placeholder="Bottom" />
        <Input type="number" value={value.left} onChange={(e) => onChange({ ...value, left: Number(e.target.value) })} placeholder="Left" />
      </div>
    </div>
  );
}

function NativeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function HeaderFooterPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { getCurrentUserWebsite, initializeUserWebsite, updateWebsite, updatePage } = useWebsiteStore();
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const [editorMode, setEditorMode] = useState<'header' | 'footer'>('header');
  const [target, setTarget] = useState<'global' | string>('global');
  const [draft, setDraft] = useState<HeaderConfig>(getDefaultHeaderConfig());
  const [footerDraft, setFooterDraft] = useState<FooterConfig>(getDefaultFooterConfig());
  const [logoSizeDevice, setLogoSizeDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [footerLogoSizeDevice, setFooterLogoSizeDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    if (user) initializeUserWebsite(user.id);
  }, [user, initializeUserWebsite]);

  useEffect(() => {
    const targetParam = searchParams.get('target');
    if (targetParam) setTarget(targetParam);
  }, [searchParams]);

  const website = getCurrentUserWebsite();
  const pageTarget = useMemo(() => website?.pages.find((p) => p.id === target), [website?.pages, target]);

  useEffect(() => {
    if (!website) return;
    if (target !== 'global' && !website.pages.some((p) => p.id === target)) {
      setTarget('global');
    }
  }, [target, website]);

  useEffect(() => {
    if (!website) return;
    if (target === 'global') {
      setDraft(withSafeLogoSizes(normalizeHeaderConfig(website.header)));
      setFooterDraft(normalizeFooterConfig(website.footer));
      return;
    }
    const page = website.pages.find((p) => p.id === target);
    if (!page) return;
    setDraft(withSafeLogoSizes(resolvePageHeaderConfig(page, website.header)));
    setFooterDraft(normalizeFooterConfig(website.footer));
  }, [target, website]);

  if (!website) {
    return <div className="p-6">Loading header settings...</div>;
  }

  const safeDraft = withSafeLogoSizes(normalizeHeaderConfig(draft));
  const safeFooterDraft = normalizeFooterConfig(footerDraft);
  const uiScrollMode = safeDraft.scroll?.mode === 'none' ? 'none' : 'color-shift';
  const logoSource = safeDraft.logoConfig?.src || safeDraft.logo || '';
  const logoIsSvg = logoSource.startsWith('data:image/svg+xml') || /\.svg(\?|$)/i.test(logoSource);
  const globalColorVars = getGlobalColorCssVars(website.globalStyles);

  const updateDraft = (updates: Partial<HeaderConfig>) => {
    setDraft((prev) => withSafeLogoSizes(normalizeHeaderConfig({ ...prev, ...updates })));
  };

  const updateFooterDraft = (updates: Partial<FooterConfig>) => {
    setFooterDraft((prev) => normalizeFooterConfig({ ...prev, ...updates }));
  };

  const saveChanges = () => {
    try {
      if (editorMode === 'footer') {
        const footerToSave: FooterConfig = {
          ...safeFooterDraft,
          logo: undefined,
        };
        updateWebsite(website.id, { footer: footerToSave });
        toast({ title: 'Footer saved', description: 'Your global footer settings were updated.' });
        return;
      }

      if (target === 'global') {
        const headerToSave: HeaderConfig = {
          ...safeDraft,
          logo: undefined,
        };
        updateWebsite(website.id, { header: headerToSave });
        toast({ title: 'Global header saved', description: 'Your header settings were updated.' });
        return;
      }

      const page = website.pages.find((p) => p.id === target);
      if (!page) return;

      updatePage(page.id, {
        headerSettings: {
          useCustomHeader: true,
          headerOverride: {
            ...safeDraft,
            logo: undefined,
          },
        },
      });
      toast({ title: 'Page header saved', description: `${page.name} now uses a custom header.` });
    } catch (error) {
      console.error('Failed to save header settings:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save header settings. Try refreshing and reducing very large image assets.',
        variant: 'destructive',
      });
    }
  };

  const clearPageOverride = (page: Page) => {
    updatePage(page.id, {
      headerSettings: {
        useCustomHeader: false,
        headerOverride: undefined,
      },
    });
    setTarget('global');
    toast({ title: 'Page override removed', description: `${page.name} now uses the global header.` });
  };

  const footerNavigationSource = safeFooterDraft.menuSource === 'headerNavigation'
    ? normalizeHeaderConfig(website.header).navigation
    : safeFooterDraft.navigation;

  const addFooterCustomLink = () => {
    updateFooterDraft({
      navigation: [
        ...safeFooterDraft.navigation,
        {
          id: `footer-nav-${Date.now()}`,
          label: 'New Footer Link',
          url: '/',
          order: safeFooterDraft.navigation.length,
          source: 'custom',
        },
      ],
    });
  };

  const updateFooterNavItem = (id: string, updates: Partial<NavItem>) => {
    updateFooterDraft({
      navigation: safeFooterDraft.navigation.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  const removeFooterNavItem = (id: string) => {
    updateFooterDraft({
      navigation: safeFooterDraft.navigation
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, order: index })),
    });
  };

  const addSocialLink = (platform: SocialLink['platform']) => {
    updateFooterDraft({
      socialLinks: [
        ...safeFooterDraft.socialLinks,
        {
          id: `social-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          platform,
          url: '',
          label: platform === 'custom' ? 'Custom' : platform,
          openInNewTab: true,
        },
      ],
    });
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    updateFooterDraft({
      socialLinks: safeFooterDraft.socialLinks.map((link) => (link.id === id ? { ...link, ...updates } : link)),
    });
  };

  const removeSocialLink = (id: string) => {
    updateFooterDraft({ socialLinks: safeFooterDraft.socialLinks.filter((link) => link.id !== id) });
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3 bg-background">
        <div className="flex items-center gap-3">
          <Link href="/pages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-semibold text-sm">Header & Footer Editor</h1>
            <p className="text-xs text-muted-foreground">
              {editorMode === 'header' ? 'Configure global and page-level headers' : 'Configure global footer styles and content'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={editorMode === 'header' ? 'default' : 'outline'} size="sm" onClick={() => setEditorMode('header')}>
            Header
          </Button>
          <Button variant={editorMode === 'footer' ? 'default' : 'outline'} size="sm" onClick={() => setEditorMode('footer')}>
            Footer
          </Button>
          <Button onClick={saveChanges}>{editorMode === 'header' ? 'Save Header' : 'Save Footer'}</Button>
        </div>
      </div>

      <div className="grid flex-1 overflow-hidden gap-6 p-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-6 overflow-y-auto pr-1">
          {editorMode === 'header' && (
            <>
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Edit Target</Label>
              <NativeSelect
                value={target}
                onChange={setTarget}
                options={[
                  { value: 'global', label: 'Global Header (default)' },
                  ...website.pages.map((page) => ({ value: page.id, label: page.name })),
                ]}
              />
              {pageTarget && (
                <p className="text-xs text-muted-foreground">
                  Editing custom header for <span className="font-medium">{pageTarget.name}</span>.
                </p>
              )}
            </div>
            {pageTarget && (
              <Button variant="outline" className="w-full" onClick={() => clearPageOverride(pageTarget)}>
                Use Global Header For This Page
              </Button>
            )}
          </Card>

          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Header Layout</Label>
              <div className="space-y-2">
                {LAYOUT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`w-full rounded-md border p-3 text-left transition-colors ${
                      safeDraft.layout === option.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                    }`}
                    onClick={() => updateDraft({ layout: option.id })}
                  >
                    <p className="text-sm font-semibold">{option.title}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <ImageUpload
              label="Logo"
              value={safeDraft.logoConfig?.src || safeDraft.logo || ''}
              preserveOriginal
              onChange={(url) =>
                updateDraft({
                  logoConfig: {
                    ...safeDraft.logoConfig,
                    src: url,
                    sizes: {
                      mobile: safeDraft.logoConfig?.sizes?.mobile || 28,
                      tablet: safeDraft.logoConfig?.sizes?.tablet || 34,
                      desktop: safeDraft.logoConfig?.sizes?.desktop || 40,
                    },
                  },
                })
              }
            />

            <div className="space-y-2">
              <Label>Logo Size by Breakpoint</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={logoSizeDevice === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setLogoSizeDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={logoSizeDevice === 'tablet' ? 'default' : 'outline'}
                  onClick={() => setLogoSizeDevice('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={logoSizeDevice === 'desktop' ? 'default' : 'outline'}
                  onClick={() => setLogoSizeDevice('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-xs capitalize">{logoSizeDevice} Size (px)</Label>
                <Input
                  type="number"
                  value={safeDraft.logoConfig?.sizes?.[logoSizeDevice] || 40}
                  onChange={(e) =>
                    updateDraft({
                      logoConfig: {
                        ...safeDraft.logoConfig,
                        sizes: {
                          mobile: safeDraft.logoConfig?.sizes?.mobile || 28,
                          tablet: safeDraft.logoConfig?.sizes?.tablet || 34,
                          desktop: safeDraft.logoConfig?.sizes?.desktop || 40,
                          [logoSizeDevice]: Number(e.target.value) || (logoSizeDevice === 'mobile' ? 28 : logoSizeDevice === 'tablet' ? 34 : 40),
                        },
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Logo On Scroll</Label>
              <NativeSelect
                value={safeDraft.logoScroll?.mode || 'none'}
                onChange={(value) =>
                  updateDraft({
                    logoScroll: {
                      ...safeDraft.logoScroll,
                      mode: value as any,
                      initialColor: safeDraft.logoScroll?.initialColor || '#ffffff',
                      scrolledColor: safeDraft.logoScroll?.scrolledColor || '#ffffff',
                    },
                  })
                }
                options={
                  logoIsSvg
                    ? [
                        { value: 'none', label: 'No Change' },
                        { value: 'svg-color', label: 'Change SVG Color On Scroll' },
                        { value: 'swap-image', label: 'Swap Logo Image On Scroll' },
                      ]
                    : [
                        { value: 'none', label: 'No Change' },
                        { value: 'swap-image', label: 'Swap Logo Image On Scroll' },
                      ]
                }
              />
            </div>

            {safeDraft.logoScroll?.mode === 'svg-color' && logoIsSvg && (
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Initial SVG Color</Label>
                  <GlobalColorInput
                    value={safeDraft.logoScroll?.initialColor || '#ffffff'}
                    onChange={(color) =>
                      updateDraft({
                        logoScroll: {
                          ...safeDraft.logoScroll,
                          mode: 'svg-color',
                          initialColor: color,
                          scrolledColor: safeDraft.logoScroll?.scrolledColor || '#ffffff',
                        },
                      })
                    }
                    globalStyles={website.globalStyles}
                    defaultColor="#ffffff"
                    placeholder="#ffffff"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scrolled SVG Color</Label>
                  <GlobalColorInput
                    value={safeDraft.logoScroll?.scrolledColor || '#ffffff'}
                    onChange={(color) =>
                      updateDraft({
                        logoScroll: {
                          ...safeDraft.logoScroll,
                          mode: 'svg-color',
                          initialColor: safeDraft.logoScroll?.initialColor || '#ffffff',
                          scrolledColor: color,
                        },
                      })
                    }
                    globalStyles={website.globalStyles}
                    defaultColor="#ffffff"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}

            {safeDraft.logoScroll?.mode === 'swap-image' && (
              <div className="space-y-2">
                <ImageUpload
                  label="Scrolled Logo Image"
                  value={safeDraft.logoScroll?.scrolledSrc || ''}
                  preserveOriginal
                  onChange={(url) =>
                    updateDraft({
                      logoScroll: {
                        ...safeDraft.logoScroll,
                        mode: 'swap-image',
                        scrolledSrc: url,
                        initialColor: safeDraft.logoScroll?.initialColor || '#ffffff',
                        scrolledColor: safeDraft.logoScroll?.scrolledColor || '#ffffff',
                      },
                    })
                  }
                />
              </div>
            )}
          </Card>

          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Header Height</Label>
              <div className="grid grid-cols-2 gap-2">
                <NativeSelect
                  value={safeDraft.height?.type || 'auto'}
                  onChange={(value) => updateDraft({ height: { ...safeDraft.height, type: value as any } })}
                  options={[
                    { value: 'auto', label: 'Auto' },
                    { value: 'pixels', label: 'Pixels' },
                    { value: 'vh', label: 'VH' },
                    { value: 'percentage', label: '%' },
                  ]}
                />
                <Input
                  type="number"
                  value={safeDraft.height?.value || 72}
                  onChange={(e) => updateDraft({ height: { ...safeDraft.height, value: Number(e.target.value) } })}
                />
              </div>
            </div>

            <SpacingEditor
              label="Padding"
              value={safeDraft.padding || { top: 16, right: 24, bottom: 16, left: 24 }}
              onChange={(next) => updateDraft({ padding: next })}
            />
            <SpacingEditor
              label="Margin"
              value={safeDraft.margin || { top: 0, right: 0, bottom: 0, left: 0 }}
              onChange={(next) => updateDraft({ margin: next })}
            />
          </Card>

          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Positioning</Label>
              <NativeSelect
                value={safeDraft.positioning || 'aboveFirstSection'}
                onChange={(value) => updateDraft({ positioning: value as any })}
                options={[
                  { value: 'aboveFirstSection', label: 'Above First Section' },
                  { value: 'overlayFirstSection', label: 'Overlay First Section' },
                ]}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Sticky Header</p>
                <p className="text-xs text-muted-foreground">Pin header to top while scrolling</p>
              </div>
              <Switch
                checked={safeDraft.sticky?.enabled || false}
                onCheckedChange={(checked) => updateDraft({ sticky: { ...safeDraft.sticky, enabled: checked, offset: safeDraft.sticky?.offset || 0 } })}
              />
            </div>
            <div className="space-y-2">
              <Label>Sticky Offset (px)</Label>
              <Input
                type="number"
                value={safeDraft.sticky?.offset || 0}
                onChange={(e) => updateDraft({ sticky: { ...safeDraft.sticky, enabled: safeDraft.sticky?.enabled || false, offset: Number(e.target.value) || 0 } })}
              />
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <TypographyControl
              label="Menu Typography"
              value={safeDraft.menuItemTypography || {}}
              onChange={(next) => updateDraft({ menuItemTypography: { ...safeDraft.menuItemTypography, ...next } })}
              showGlobalStyleSelector
              globalStyles={website.globalStyles}
              showColorControl
            />
            {uiScrollMode !== 'none' && (
              <div className="space-y-2">
                <Label>Menu Color on Scroll</Label>
                <GlobalColorInput
                  value={safeDraft.menuItemScrolledColor || safeDraft.menuItemTypography?.color || '#111827'}
                  onChange={(color) => updateDraft({ menuItemScrolledColor: color })}
                  globalStyles={website.globalStyles}
                  defaultColor="#111827"
                  placeholder="#111827"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Menu Item Spacing: {safeDraft.menuItemGap ?? 32}px</Label>
              <input
                type="range"
                min="0"
                max="80"
                value={safeDraft.menuItemGap ?? 32}
                onChange={(e) => updateDraft({ menuItemGap: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Scroll Behavior</Label>
              <NativeSelect
                value={uiScrollMode}
                onChange={(value) => updateDraft({ scroll: { ...safeDraft.scroll, mode: value as any, triggerY: safeDraft.scroll?.triggerY || 20 } })}
                options={[
                  { value: 'none', label: 'No Change' },
                  { value: 'color-shift', label: 'Change on Scroll' },
                ]}
              />
            </div>
            {uiScrollMode !== 'none' && (
              <div className="space-y-2">
                <Label>Scroll Trigger (px)</Label>
                <Input
                  type="number"
                  value={safeDraft.scroll?.triggerY || 20}
                  onChange={(e) => updateDraft({ scroll: { ...safeDraft.scroll, mode: safeDraft.scroll?.mode || 'none', triggerY: Number(e.target.value) || 20 } })}
                />
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Initial Color</Label>
                <GlobalColorInput
                  value={safeDraft.background?.initialColor || '#ffffff'}
                  onChange={(color) =>
                    updateDraft({
                      background: {
                        ...safeDraft.background,
                        initialColor: color,
                        scrolledColor: safeDraft.background?.scrolledColor || '#ffffff',
                        initialOpacity: safeDraft.background?.initialOpacity ?? 100,
                        scrolledOpacity: safeDraft.background?.scrolledOpacity ?? 100,
                      },
                    })
                  }
                  globalStyles={website.globalStyles}
                  defaultColor="#ffffff"
                  placeholder="#ffffff"
                />
                <Label>Initial Opacity: {safeDraft.background?.initialOpacity ?? 100}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={safeDraft.background?.initialOpacity ?? 100}
                  onChange={(e) =>
                    updateDraft({
                      background: {
                        ...safeDraft.background,
                        initialColor: safeDraft.background?.initialColor || '#ffffff',
                        scrolledColor: safeDraft.background?.scrolledColor || '#ffffff',
                        initialOpacity: Number(e.target.value),
                        scrolledOpacity: safeDraft.background?.scrolledOpacity ?? 100,
                      },
                    })
                  }
                  className="w-full"
                />
              </div>
              {uiScrollMode !== 'none' && (
                <div className="space-y-2">
                  <Label>Scrolled Color</Label>
                  <GlobalColorInput
                    value={safeDraft.background?.scrolledColor || '#ffffff'}
                    onChange={(color) =>
                      updateDraft({
                        background: {
                          ...safeDraft.background,
                          scrolledColor: color,
                          initialColor: safeDraft.background?.initialColor || '#ffffff',
                          initialOpacity: safeDraft.background?.initialOpacity ?? 100,
                          scrolledOpacity: safeDraft.background?.scrolledOpacity ?? 100,
                        },
                      })
                    }
                    globalStyles={website.globalStyles}
                    defaultColor="#ffffff"
                    placeholder="#ffffff"
                  />
                  <Label>Scrolled Opacity: {safeDraft.background?.scrolledOpacity ?? 100}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={safeDraft.background?.scrolledOpacity ?? 100}
                    onChange={(e) =>
                      updateDraft({
                        background: {
                          ...safeDraft.background,
                          initialColor: safeDraft.background?.initialColor || '#ffffff',
                          scrolledColor: safeDraft.background?.scrolledColor || '#ffffff',
                          initialOpacity: safeDraft.background?.initialOpacity ?? 100,
                          scrolledOpacity: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <p className="text-sm font-semibold">Burger Icon & Menu Options</p>
            <ImageUpload
              label="Burger Icon (desktop/tablet/mobile)"
              value={safeDraft.burgerIcon?.src || ''}
              preserveOriginal
              onChange={(url) =>
                updateDraft({
                  burgerIcon: {
                    ...safeDraft.burgerIcon,
                    src: url,
                    size: safeDraft.burgerIcon?.size || 24,
                  },
                })
              }
            />
            <div className="space-y-2">
              <Label>Burger Icon Size: {safeDraft.burgerIcon?.size || 24}px</Label>
              <input
                type="range"
                min="12"
                max="48"
                value={safeDraft.burgerIcon?.size || 24}
                onChange={(e) =>
                  updateDraft({
                    burgerIcon: {
                      ...safeDraft.burgerIcon,
                      src: safeDraft.burgerIcon?.src,
                      size: Number(e.target.value),
                    },
                  })
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Burger Icon Initial Color</Label>
              <GlobalColorInput
                value={safeDraft.burgerIcon?.initialColor || '#111827'}
                onChange={(color) =>
                  updateDraft({
                    burgerIcon: {
                      ...safeDraft.burgerIcon,
                      src: safeDraft.burgerIcon?.src,
                      size: safeDraft.burgerIcon?.size || 24,
                      initialColor: color,
                      scrolledColor: safeDraft.burgerIcon?.scrolledColor || '#111827',
                    },
                  })
                }
                globalStyles={website.globalStyles}
                defaultColor="#111827"
                placeholder="#111827"
              />
            </div>
            <div className="space-y-2">
              <Label>Burger Icon Scrolled Color</Label>
              <GlobalColorInput
                value={safeDraft.burgerIcon?.scrolledColor || safeDraft.burgerIcon?.initialColor || '#111827'}
                onChange={(color) =>
                  updateDraft({
                    burgerIcon: {
                      ...safeDraft.burgerIcon,
                      src: safeDraft.burgerIcon?.src,
                      size: safeDraft.burgerIcon?.size || 24,
                      initialColor: safeDraft.burgerIcon?.initialColor || '#111827',
                      scrolledColor: color,
                    },
                  })
                }
                globalStyles={website.globalStyles}
                defaultColor="#111827"
                placeholder="#111827"
              />
            </div>

            <div className="space-y-2">
              <Label>Panel Side</Label>
              <NativeSelect
                value={safeDraft.burgerMenu?.panelSide || 'right'}
                onChange={(value) =>
                  updateDraft({
                    burgerMenu: {
                      ...safeDraft.burgerMenu,
                      panelSide: value as any,
                      panelWidth: safeDraft.burgerMenu?.panelWidth || 340,
                      overlayOpacity: safeDraft.burgerMenu?.overlayOpacity || 60,
                      closeOnItemClick: safeDraft.burgerMenu?.closeOnItemClick ?? true,
                    },
                  })
                }
                options={[
                  { value: 'right', label: 'Right' },
                  { value: 'left', label: 'Left' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Panel Width</Label>
                <Input
                  type="number"
                  value={safeDraft.burgerMenu?.panelWidth || 340}
                  onChange={(e) => updateDraft({ burgerMenu: { ...safeDraft.burgerMenu, panelWidth: Number(e.target.value) || 340, panelSide: safeDraft.burgerMenu?.panelSide || 'right', overlayOpacity: safeDraft.burgerMenu?.overlayOpacity || 60, closeOnItemClick: safeDraft.burgerMenu?.closeOnItemClick ?? true } })}
                />
              </div>
              <div className="space-y-2">
                <Label>Overlay Opacity</Label>
                <Input
                  type="number"
                  value={safeDraft.burgerMenu?.overlayOpacity || 60}
                  onChange={(e) => updateDraft({ burgerMenu: { ...safeDraft.burgerMenu, overlayOpacity: Number(e.target.value) || 60, panelSide: safeDraft.burgerMenu?.panelSide || 'right', panelWidth: safeDraft.burgerMenu?.panelWidth || 340, closeOnItemClick: safeDraft.burgerMenu?.closeOnItemClick ?? true } })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Close on Menu Click</p>
                <p className="text-xs text-muted-foreground">Auto-close panel after a link is clicked</p>
              </div>
              <Switch
                checked={safeDraft.burgerMenu?.closeOnItemClick ?? true}
                onCheckedChange={(checked) => updateDraft({ burgerMenu: { ...safeDraft.burgerMenu, closeOnItemClick: checked, panelSide: safeDraft.burgerMenu?.panelSide || 'right', panelWidth: safeDraft.burgerMenu?.panelWidth || 340, overlayOpacity: safeDraft.burgerMenu?.overlayOpacity || 60 } })}
              />
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <p className="text-sm font-semibold">Header Bottom Border</p>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Show Bottom Border</p>
                <p className="text-xs text-muted-foreground">Display a line under the header</p>
              </div>
              <Switch
                checked={safeDraft.border?.enabled ?? true}
                onCheckedChange={(checked) =>
                  updateDraft({
                    border: {
                      enabled: checked,
                      width: safeDraft.border?.width ?? 1,
                      color: safeDraft.border?.color || '#e5e7eb',
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Border Thickness: {safeDraft.border?.width ?? 1}px</Label>
              <input
                type="range"
                min="0"
                max="12"
                value={safeDraft.border?.width ?? 1}
                onChange={(e) =>
                  updateDraft({
                    border: {
                      enabled: safeDraft.border?.enabled ?? true,
                      width: Number(e.target.value),
                      color: safeDraft.border?.color || '#e5e7eb',
                    },
                  })
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Border Color</Label>
              <GlobalColorInput
                value={safeDraft.border?.color || '#e5e7eb'}
                onChange={(color) =>
                  updateDraft({
                    border: {
                      enabled: safeDraft.border?.enabled ?? true,
                      width: safeDraft.border?.width ?? 1,
                      color,
                    },
                  })
                }
                globalStyles={website.globalStyles}
                defaultColor="#e5e7eb"
                placeholder="#e5e7eb"
              />
            </div>
          </Card>

            </>
          )}
          {editorMode === 'footer' && (
            <>
              <Card className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Footer Layout</Label>
                  <div className="space-y-2">
                    {FOOTER_LAYOUT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`w-full rounded-md border p-3 text-left transition-colors ${
                          safeFooterDraft.layout === option.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                        }`}
                        onClick={() => updateFooterDraft({ layout: option.id })}
                      >
                        <p className="text-sm font-semibold">{option.title}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Footer settings apply globally for now and will be used across all pages.
                </p>
              </Card>

              <Card className="p-4 space-y-4">
                <ImageUpload
                  label="Footer Logo"
                  value={safeFooterDraft.logoConfig?.src || safeFooterDraft.logo || ''}
                  preserveOriginal
                  onChange={(url) =>
                    updateFooterDraft({
                      logoConfig: {
                        ...safeFooterDraft.logoConfig,
                        src: url,
                        sizes: {
                          mobile: safeFooterDraft.logoConfig?.sizes?.mobile || 32,
                          tablet: safeFooterDraft.logoConfig?.sizes?.tablet || 40,
                          desktop: safeFooterDraft.logoConfig?.sizes?.desktop || 48,
                        },
                      },
                    })
                  }
                />
                <div className="space-y-2">
                  <Label>Logo Size by Breakpoint</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={footerLogoSizeDevice === 'mobile' ? 'default' : 'outline'}
                      onClick={() => setFooterLogoSizeDevice('mobile')}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={footerLogoSizeDevice === 'tablet' ? 'default' : 'outline'}
                      onClick={() => setFooterLogoSizeDevice('tablet')}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={footerLogoSizeDevice === 'desktop' ? 'default' : 'outline'}
                      onClick={() => setFooterLogoSizeDevice('desktop')}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    type="number"
                    value={safeFooterDraft.logoConfig?.sizes?.[footerLogoSizeDevice] || 48}
                    onChange={(e) =>
                      updateFooterDraft({
                        logoConfig: {
                          ...safeFooterDraft.logoConfig,
                          sizes: {
                            mobile: safeFooterDraft.logoConfig?.sizes?.mobile || 32,
                            tablet: safeFooterDraft.logoConfig?.sizes?.tablet || 40,
                            desktop: safeFooterDraft.logoConfig?.sizes?.desktop || 48,
                            [footerLogoSizeDevice]: Number(e.target.value) || 48,
                          },
                        },
                      })
                    }
                  />
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Footer Menu Source</Label>
                  <NativeSelect
                    value={safeFooterDraft.menuSource}
                    onChange={(value) => updateFooterDraft({ menuSource: value as FooterConfig['menuSource'] })}
                    options={[
                      { value: 'headerNavigation', label: 'Sync from Header Navigation' },
                      { value: 'customNavigation', label: 'Custom Footer Navigation' },
                    ]}
                  />
                </div>
                {safeFooterDraft.menuSource === 'customNavigation' && (
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" onClick={addFooterCustomLink}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Footer Link
                    </Button>
                    {safeFooterDraft.navigation.map((item) => (
                      <div key={item.id} className="space-y-2 rounded-md border p-3">
                        <Input
                          value={item.label}
                          onChange={(e) => updateFooterNavItem(item.id, { label: e.target.value })}
                          placeholder="Link Label"
                        />
                        <Input
                          value={item.url}
                          onChange={(e) => updateFooterNavItem(item.id, { url: e.target.value })}
                          placeholder="/about or https://..."
                        />
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Open in new tab</Label>
                          <Switch
                            checked={item.openInNewTab || false}
                            onCheckedChange={(checked) => updateFooterNavItem(item.id, { openInNewTab: checked })}
                          />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFooterNavItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive mr-2" />
                          Remove Link
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-4 space-y-4">
                <TypographyControl
                  label="Footer Menu Typography"
                  value={safeFooterDraft.menuItemTypography || {}}
                  onChange={(next) => updateFooterDraft({ menuItemTypography: { ...safeFooterDraft.menuItemTypography, ...next } })}
                  showGlobalStyleSelector
                  globalStyles={website.globalStyles}
                  showColorControl
                />
                <TypographyControl
                  label="Contact Typography"
                  value={safeFooterDraft.contactTypography || {}}
                  onChange={(next) => updateFooterDraft({ contactTypography: { ...safeFooterDraft.contactTypography, ...next } })}
                  showGlobalStyleSelector
                  globalStyles={website.globalStyles}
                  showColorControl
                />
                <TypographyControl
                  label="Disclaimer Typography"
                  value={safeFooterDraft.disclaimerTypography || {}}
                  onChange={(next) => updateFooterDraft({ disclaimerTypography: { ...safeFooterDraft.disclaimerTypography, ...next } })}
                  showGlobalStyleSelector
                  globalStyles={website.globalStyles}
                  showColorControl
                />
                <div className="space-y-2">
                  <Label>Menu Item Spacing: {safeFooterDraft.menuItemGap ?? 24}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={safeFooterDraft.menuItemGap ?? 24}
                    onChange={(e) => updateFooterDraft({ menuItemGap: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={safeFooterDraft.phone || ''} onChange={(e) => updateFooterDraft({ phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={safeFooterDraft.email || ''} onChange={(e) => updateFooterDraft({ email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <textarea
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    rows={3}
                    value={safeFooterDraft.address || ''}
                    onChange={(e) => updateFooterDraft({ address: e.target.value })}
                    placeholder="Street, City, State"
                  />
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Social Links</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => addSocialLink('instagram')}>Instagram</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => addSocialLink('facebook')}>Facebook</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => addSocialLink('twitter')}>X</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => addSocialLink('linkedin')}>LinkedIn</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => addSocialLink('custom')}>Custom</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {safeFooterDraft.socialLinks.map((link) => (
                    <div key={link.id} className="space-y-2 rounded-md border p-3">
                      <NativeSelect
                        value={link.platform}
                        onChange={(value) => updateSocialLink(link.id, { platform: value as SocialLink['platform'] })}
                        options={[
                          { value: 'instagram', label: 'Instagram' },
                          { value: 'facebook', label: 'Facebook' },
                          { value: 'twitter', label: 'X (Twitter)' },
                          { value: 'linkedin', label: 'LinkedIn' },
                          { value: 'youtube', label: 'YouTube' },
                          { value: 'custom', label: 'Custom' },
                        ]}
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                      />
                      {link.platform === 'custom' && (
                        <>
                          <Input
                            value={link.label || ''}
                            onChange={(e) => updateSocialLink(link.id, { label: e.target.value })}
                            placeholder="Icon label"
                          />
                          <ImageUpload
                            label="Custom Social Icon"
                            value={link.iconSrc || ''}
                            preserveOriginal
                            onChange={(url) => updateSocialLink(link.id, { iconSrc: url })}
                          />
                        </>
                      )}
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Open in new tab</Label>
                        <Switch
                          checked={link.openInNewTab !== false}
                          onCheckedChange={(checked) => updateSocialLink(link.id, { openInNewTab: checked })}
                        />
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeSocialLink(link.id)}>
                        <Trash2 className="h-4 w-4 text-destructive mr-2" />
                        Remove Social Link
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Social Icon Color</Label>
                  <GlobalColorInput
                    value={safeFooterDraft.socialIconColor || '#f9fafb'}
                    onChange={(color) => updateFooterDraft({ socialIconColor: color })}
                    globalStyles={website.globalStyles}
                    defaultColor="#f9fafb"
                    placeholder="#f9fafb"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Custom Icon Color</Label>
                  <GlobalColorInput
                    value={safeFooterDraft.customSocialIconColor || safeFooterDraft.socialIconColor || '#f9fafb'}
                    onChange={(color) => updateFooterDraft({ customSocialIconColor: color })}
                    globalStyles={website.globalStyles}
                    defaultColor="#f9fafb"
                    placeholder="#f9fafb"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon Size: {safeFooterDraft.socialIconSize ?? 18}px</Label>
                  <input
                    type="range"
                    min="10"
                    max="48"
                    value={safeFooterDraft.socialIconSize ?? 18}
                    onChange={(e) => updateFooterDraft({ socialIconSize: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon Spacing: {safeFooterDraft.socialIconGap ?? 12}px</Label>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    value={safeFooterDraft.socialIconGap ?? 12}
                    onChange={(e) => updateFooterDraft({ socialIconGap: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Disclaimer</Label>
                  <textarea
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    rows={4}
                    value={safeFooterDraft.disclaimer || ''}
                    onChange={(e) => updateFooterDraft({ disclaimer: e.target.value })}
                    placeholder="Add your legal disclaimer text"
                  />
                </div>
                <TypographyControl
                  label="Legal Link Typography"
                  value={safeFooterDraft.legalTypography || {}}
                  onChange={(next) => updateFooterDraft({ legalTypography: { ...safeFooterDraft.legalTypography, ...next } })}
                  showGlobalStyleSelector
                  globalStyles={website.globalStyles}
                  showColorControl
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={safeFooterDraft.legalLinks?.privacyLabel || 'Privacy Policy'}
                    onChange={(e) =>
                      updateFooterDraft({
                        legalLinks: {
                          ...safeFooterDraft.legalLinks,
                          privacyLabel: e.target.value,
                          privacyUrl: safeFooterDraft.legalLinks?.privacyUrl || '/privacy',
                          termsLabel: safeFooterDraft.legalLinks?.termsLabel || 'Terms of Service',
                          termsUrl: safeFooterDraft.legalLinks?.termsUrl || '/terms',
                        },
                      })
                    }
                    placeholder="Privacy Label"
                  />
                  <Input
                    value={safeFooterDraft.legalLinks?.privacyUrl || '/privacy'}
                    onChange={(e) =>
                      updateFooterDraft({
                        legalLinks: {
                          ...safeFooterDraft.legalLinks,
                          privacyLabel: safeFooterDraft.legalLinks?.privacyLabel || 'Privacy Policy',
                          privacyUrl: e.target.value,
                          termsLabel: safeFooterDraft.legalLinks?.termsLabel || 'Terms of Service',
                          termsUrl: safeFooterDraft.legalLinks?.termsUrl || '/terms',
                        },
                      })
                    }
                    placeholder="/privacy"
                  />
                  <Input
                    value={safeFooterDraft.legalLinks?.termsLabel || 'Terms of Service'}
                    onChange={(e) =>
                      updateFooterDraft({
                        legalLinks: {
                          ...safeFooterDraft.legalLinks,
                          privacyLabel: safeFooterDraft.legalLinks?.privacyLabel || 'Privacy Policy',
                          privacyUrl: safeFooterDraft.legalLinks?.privacyUrl || '/privacy',
                          termsLabel: e.target.value,
                          termsUrl: safeFooterDraft.legalLinks?.termsUrl || '/terms',
                        },
                      })
                    }
                    placeholder="Terms Label"
                  />
                  <Input
                    value={safeFooterDraft.legalLinks?.termsUrl || '/terms'}
                    onChange={(e) =>
                      updateFooterDraft({
                        legalLinks: {
                          ...safeFooterDraft.legalLinks,
                          privacyLabel: safeFooterDraft.legalLinks?.privacyLabel || 'Privacy Policy',
                          privacyUrl: safeFooterDraft.legalLinks?.privacyUrl || '/privacy',
                          termsLabel: safeFooterDraft.legalLinks?.termsLabel || 'Terms of Service',
                          termsUrl: e.target.value,
                        },
                      })
                    }
                    placeholder="/terms"
                  />
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Top Background Color</Label>
                  <GlobalColorInput
                    value={safeFooterDraft.background?.topColor || '#111827'}
                    onChange={(color) =>
                      updateFooterDraft({
                        background: {
                          ...safeFooterDraft.background,
                          topColor: color,
                          bottomColor: safeFooterDraft.background?.bottomColor || '#030712',
                          watermarkOpacity: safeFooterDraft.background?.watermarkOpacity ?? 8,
                          watermarkSize: safeFooterDraft.background?.watermarkSize ?? 60,
                        },
                      })
                    }
                    globalStyles={website.globalStyles}
                    defaultColor="#111827"
                    placeholder="#111827"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bottom Background Color</Label>
                  <GlobalColorInput
                    value={safeFooterDraft.background?.bottomColor || '#030712'}
                    onChange={(color) =>
                      updateFooterDraft({
                        background: {
                          ...safeFooterDraft.background,
                          topColor: safeFooterDraft.background?.topColor || '#111827',
                          bottomColor: color,
                          watermarkOpacity: safeFooterDraft.background?.watermarkOpacity ?? 8,
                          watermarkSize: safeFooterDraft.background?.watermarkSize ?? 60,
                        },
                      })
                    }
                    globalStyles={website.globalStyles}
                    defaultColor="#030712"
                    placeholder="#030712"
                  />
                </div>
                <ImageUpload
                  label="Background Watermark SVG"
                  value={safeFooterDraft.background?.watermarkSvg || ''}
                  preserveOriginal
                  onChange={(url) =>
                    updateFooterDraft({
                      background: {
                        ...safeFooterDraft.background,
                        topColor: safeFooterDraft.background?.topColor || '#111827',
                        bottomColor: safeFooterDraft.background?.bottomColor || '#030712',
                        watermarkSvg: url,
                        watermarkOpacity: safeFooterDraft.background?.watermarkOpacity ?? 8,
                        watermarkSize: safeFooterDraft.background?.watermarkSize ?? 60,
                      },
                    })
                  }
                />
                <div className="space-y-2">
                  <Label>Watermark Opacity: {safeFooterDraft.background?.watermarkOpacity ?? 8}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={safeFooterDraft.background?.watermarkOpacity ?? 8}
                    onChange={(e) =>
                      updateFooterDraft({
                        background: {
                          ...safeFooterDraft.background,
                          topColor: safeFooterDraft.background?.topColor || '#111827',
                          bottomColor: safeFooterDraft.background?.bottomColor || '#030712',
                          watermarkOpacity: Number(e.target.value),
                          watermarkSize: safeFooterDraft.background?.watermarkSize ?? 60,
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Watermark Size: {safeFooterDraft.background?.watermarkSize ?? 60}%</Label>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    value={safeFooterDraft.background?.watermarkSize ?? 60}
                    onChange={(e) =>
                      updateFooterDraft({
                        background: {
                          ...safeFooterDraft.background,
                          topColor: safeFooterDraft.background?.topColor || '#111827',
                          bottomColor: safeFooterDraft.background?.bottomColor || '#030712',
                          watermarkOpacity: safeFooterDraft.background?.watermarkOpacity ?? 8,
                          watermarkSize: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>
                <SpacingEditor
                  label="Padding"
                  value={safeFooterDraft.padding || { top: 56, right: 24, bottom: 24, left: 24 }}
                  onChange={(next) => updateFooterDraft({ padding: next })}
                />
                <SpacingEditor
                  label="Margin"
                  value={safeFooterDraft.margin || { top: 0, right: 0, bottom: 0, left: 0 }}
                  onChange={(next) => updateFooterDraft({ margin: next })}
                />
              </Card>
            </>
          )}
        </div>

        <Card className="overflow-hidden h-full">
          <div className="border-b p-4">
            <p className="font-semibold">{editorMode === 'header' ? 'Live Header Preview' : 'Live Footer Preview'}</p>
            <p className="text-sm text-muted-foreground">
              {editorMode === 'header'
                ? 'Scroll the preview area to validate sticky and scroll transitions.'
                : 'Preview footer layout, typography, spacing, and mobile stacking behavior.'}
            </p>
          </div>
          <div ref={previewScrollRef} className="h-[calc(100vh-150px)] overflow-auto bg-white">
            <div
              className={`relative ${editorMode === 'header' ? 'h-[130vh] bg-gray-200' : 'min-h-[130vh] bg-gray-100'}`}
              style={globalColorVars}
            >
              {editorMode === 'header' ? (
                <SiteHeader
                  websiteName={website.name}
                  header={safeDraft}
                  globalStyles={website.globalStyles}
                  deviceView="desktop"
                  scrollContainerRef={previewScrollRef}
                  overlay={safeDraft.positioning === 'overlayFirstSection'}
                  className={safeDraft.positioning === 'overlayFirstSection' ? 'left-0 top-0 right-0 border-b-0' : undefined}
                />
              ) : (
                <div className="absolute inset-x-0 bottom-0 w-full">
                  <SiteFooter
                    websiteName={website.name}
                    footer={safeFooterDraft}
                    headerNavigation={footerNavigationSource}
                    globalStyles={website.globalStyles}
                    deviceView="desktop"
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
