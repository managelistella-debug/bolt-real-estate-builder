'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useBlogsStore } from '@/lib/stores/blogs';
import { useBlogTemplatesStore } from '@/lib/stores/blogTemplates';
import { useWebsiteStore } from '@/lib/stores/website';
import { BlogDynamicField, Breakpoint } from '@/lib/types';
import { resolveResponsiveValue } from '@/lib/responsive';
import { SiteHeader } from '@/components/site-header/SiteHeader';
import { SiteFooter } from '@/components/site-footer/SiteFooter';
import { formatBlogDate, getBlogDisplayDate, getBlogPreviewText } from '@/lib/blogs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface BlogPostTemplateProps {
  slug: string;
}

const colorWithOpacity = (color: string | undefined, opacityPercent: number): string => {
  if (!color) return 'transparent';
  if (color === 'transparent') return 'transparent';
  if (/^#([0-9a-f]{6})$/i.test(color)) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacityPercent / 100})`;
  }
  if (opacityPercent >= 100) return color;
  return `color-mix(in srgb, ${color} ${opacityPercent}%, transparent)`;
};

export function BlogPostTemplate({ slug }: BlogPostTemplateProps) {
  const post = useBlogsStore((state) => state.blogs.find((item) => item.slug === slug));
  const blogs = useBlogsStore((state) => state.blogs);
  const { getActiveTemplate } = useBlogTemplatesStore();
  const { currentWebsite, websites } = useWebsiteStore();
  const website = currentWebsite ?? websites[0] ?? null;
  const template = getActiveTemplate();
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const apply = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  const recentPosts = useMemo(() => {
    if (!post) return [];
    const published = blogs
      .filter((item) => item.id !== post.id && item.status === 'published');

    const filtered =
      template?.relatedPostsFilter === 'same_category'
        ? published.filter((item) =>
            (template.relatedPostsFilterCategory || '').trim()
              ? item.category?.toLowerCase() === template.relatedPostsFilterCategory!.trim().toLowerCase()
              : item.category && post.category && item.category === post.category
          )
        : template?.relatedPostsFilter === 'same_tag'
          ? published.filter((item) =>
              item.tags.some((tag) =>
                (template.relatedPostsFilterTag || '').trim()
                  ? tag.toLowerCase() === template.relatedPostsFilterTag!.trim().toLowerCase()
                  : post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
              )
            )
          : published;

    return filtered
      .sort((a, b) => new Date(getBlogDisplayDate(b)).getTime() - new Date(getBlogDisplayDate(a)).getTime())
      .slice(0, template?.bottomBlogCardsCount || 3);
  }, [
    blogs,
    post,
    template?.bottomBlogCardsCount,
    template?.relatedPostsFilter,
    template?.relatedPostsFilterCategory,
    template?.relatedPostsFilterTag,
  ]);

  if (!post) {
    return (
      <div className="bg-background min-h-screen">
        {website && (
          <SiteHeader
            websiteName={website.name}
            header={website.header}
            globalStyles={website.globalStyles}
            deviceView="desktop"
          />
        )}
        <main className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-3xl font-semibold">Blog post not found</h1>
          <p className="mt-2 text-muted-foreground">This post may have been removed or the URL is incorrect.</p>
        </main>
        {website && (
          <SiteFooter
            websiteName={website.name}
            footer={website.footer}
            headerNavigation={website.header.navigation}
            globalStyles={website.globalStyles}
            deviceView="desktop"
          />
        )}
      </div>
    );
  }

  const activeTemplate = template;
  if (!activeTemplate) return null;
  const bindings = activeTemplate.dynamicBindings || {
    heroImageField: 'featuredImage',
    titleField: 'title',
    dateField: 'publishedAt',
    contentField: 'contentHtml',
  };

  const pageTitle = `${post.title} | Blog`;
  const metaDescription = post.metaDescription || post.excerpt || getBlogPreviewText(post);
  const containerClass =
    activeTemplate.layoutVariant === 'newsletter'
      ? 'max-w-6xl'
      : activeTemplate.style.containerWidth === 'wide'
        ? 'max-w-6xl'
        : 'max-w-3xl';
  const heroContainerClass = activeTemplate.heroImageFullWidth ? 'max-w-none' : containerClass;
  const showSidebar = activeTemplate.layoutVariant === 'newsletter' && activeTemplate.showSidebarContact;
  const boundFeaturedImage = getBoundString(post, bindings.heroImageField) || post.featuredImage || '';
  const boundTitle = getBoundString(post, bindings.titleField) || post.title;
  const boundContent = getBoundContent(post, bindings.contentField);
  const boundDate = getBoundDate(post, bindings.dateField);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: metaDescription,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    author: post.authorName ? { '@type': 'Person', name: post.authorName } : undefined,
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        {boundFeaturedImage && <meta property="og:image" content={boundFeaturedImage} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <div className="min-h-screen bg-background">
        {website && (
          <SiteHeader
            websiteName={website.name}
            header={website.header}
            globalStyles={website.globalStyles}
            deviceView="desktop"
          />
        )}

        <article>
          {activeTemplate.layoutVariant === 'newsletter' ? (
            <header
              className=""
              style={{
                backgroundColor: colorWithOpacity(
                  activeTemplate.style.headerBackgroundColor,
                  activeTemplate.style.headerBackgroundOpacity
                ),
                borderColor: colorWithOpacity(activeTemplate.style.borderColor, activeTemplate.style.borderColorOpacity),
              }}
            >
              <div className={`mx-auto ${heroContainerClass} px-4 py-8`}>
                <div
                  className="relative overflow-hidden"
                  style={{ borderRadius: `${activeTemplate.style.heroImageBorderRadius}px` }}
                >
                  {boundFeaturedImage ? (
                    <img src={boundFeaturedImage} alt={boundTitle} className="h-[300px] w-full object-cover sm:h-[380px]" />
                  ) : (
                    <div className="grid h-[300px] place-items-center bg-muted text-sm text-muted-foreground sm:h-[380px]">
                      No featured image
                    </div>
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: colorWithOpacity(
                        activeTemplate.style.headerOverlayColor,
                        activeTemplate.style.headerOverlayOpacity
                      ),
                    }}
                  />
                  <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                    <div>
                      <p style={typographyToStyle(activeTemplate.style.typography.date, breakpoint)}>
                        {post.category ? `${post.category} · ` : ''}
                        {formatBlogDate(boundDate)}
                        {post.authorName ? ` · ${post.authorName}` : ''}
                      </p>
                      <h1 className="mt-2 leading-tight" style={typographyToStyle(activeTemplate.style.typography.title, breakpoint)}>
                        {boundTitle}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          ) : (
            <header
              className=""
              style={{
                backgroundColor: colorWithOpacity(
                  activeTemplate.style.headerBackgroundColor,
                  activeTemplate.style.headerBackgroundOpacity
                ),
                borderColor: colorWithOpacity(activeTemplate.style.borderColor, activeTemplate.style.borderColorOpacity),
              }}
            >
              <div className={`mx-auto ${containerClass} px-4 py-12`}>
                <h1 className="leading-tight" style={typographyToStyle(activeTemplate.style.typography.title, breakpoint)}>
                  {boundTitle}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span style={typographyToStyle(activeTemplate.style.typography.date, breakpoint)}>
                    {formatBlogDate(boundDate)}
                    {post.authorName ? ` · ${post.authorName}` : ''}
                  </span>
                  {post.category && (
                    <span style={typographyToStyle(activeTemplate.style.typography.date, breakpoint)}>
                      {post.category}
                    </span>
                  )}
                  {activeTemplate.showTags && post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5"
                      style={{
                        ...typographyToStyle(activeTemplate.style.typography.tags, breakpoint),
                        borderRadius: `${activeTemplate.style.tagBorderRadius}px`,
                        borderWidth: `${activeTemplate.style.tagBorderWidth}px`,
                        borderStyle: 'solid',
                        borderColor: colorWithOpacity(activeTemplate.style.tagBorderColor, activeTemplate.style.tagBorderOpacity),
                        backgroundColor: colorWithOpacity(activeTemplate.style.tagBackgroundColor, activeTemplate.style.tagBackgroundOpacity),
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {boundFeaturedImage && (
                  <img
                    src={boundFeaturedImage}
                    alt={boundTitle}
                    className="mt-6 w-full object-cover"
                    style={{ borderRadius: `${activeTemplate.style.heroImageBorderRadius}px` }}
                  />
                )}
              </div>
            </header>
          )}

          <div
            className={`mx-auto ${containerClass} px-4 py-10`}
            style={{
              backgroundColor: colorWithOpacity(
                activeTemplate.style.bodyBackgroundColor,
                activeTemplate.style.bodyBackgroundOpacity
              ),
            }}
          >
            <div className={showSidebar ? 'flex flex-col gap-10 md:grid md:grid-cols-[minmax(0,1fr)_340px]' : ''}>
              <div
                className="prose prose-slate max-w-none"
                style={typographyToStyle(activeTemplate.style.typography.body, breakpoint)}
                dangerouslySetInnerHTML={{ __html: boundContent }}
              />

              {showSidebar && (
                <aside
                  className="space-y-6 md:sticky"
                  style={{ top: `${activeTemplate.sidebarStickyOffset}px`, height: 'fit-content' }}
                >
                  <div
                    className="rounded-lg border p-4"
                    style={{
                      backgroundColor: colorWithOpacity(
                        activeTemplate.style.sidebarBackgroundColor,
                        activeTemplate.style.sidebarBackgroundOpacity
                      ),
                      borderColor: colorWithOpacity(
                        activeTemplate.style.sidebarBorderColor,
                        activeTemplate.style.sidebarBorderOpacity
                      ),
                      borderWidth: `${activeTemplate.style.sidebarBorderWidth}px`,
                      borderRadius: `${activeTemplate.style.sidebarBorderRadius}px`,
                    }}
                  >
                    <h3 style={typographyToStyle(activeTemplate.style.typography.formHeading, breakpoint)}>
                      {activeTemplate.sidebarForm.heading}
                    </h3>
                    {activeTemplate.sidebarForm.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{activeTemplate.sidebarForm.description}</p>
                    )}
                    <form className="mt-4 space-y-3" onSubmit={(event) => event.preventDefault()}>
                      {activeTemplate.sidebarForm.fields.map((field) => (
                        <div key={field.id} className="space-y-1.5">
                          <label style={typographyToStyle(activeTemplate.style.typography.formLabel, breakpoint)}>
                            {field.label}
                          </label>
                          {field.type === 'textarea' ? (
                            <Textarea
                              placeholder={field.placeholder}
                              required={field.required}
                              style={inputStyle(activeTemplate)}
                            />
                          ) : (
                            <Input
                              type={field.type === 'phone' ? 'tel' : field.type}
                              placeholder={field.placeholder}
                              required={field.required}
                              style={inputStyle(activeTemplate)}
                            />
                          )}
                        </div>
                      ))}
                      <HoverButton template={activeTemplate}>
                        {activeTemplate.sidebarForm.buttonText}
                      </HoverButton>
                    </form>
                  </div>
                </aside>
              )}
            </div>
          </div>

          {activeTemplate.showBottomBlogCards && recentPosts.length > 0 && (
            <section className={`mx-auto ${containerClass} px-4 pb-14`}>
              <h3 style={typographyToStyle(activeTemplate.style.typography.relatedHeading, breakpoint)} className="mb-4">
                {activeTemplate.relatedPostsHeading}
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {recentPosts.slice(0, activeTemplate.bottomBlogCardsCount).map((item) => (
                  <Link
                    key={item.id}
                    href={`/blog/${item.slug}`}
                    className="border"
                    style={{
                      borderRadius: `${activeTemplate.style.relatedCardBorderRadius}px`,
                      borderColor: colorWithOpacity(activeTemplate.style.relatedCardBorderColor, activeTemplate.style.relatedCardBorderOpacity),
                      borderWidth: `${activeTemplate.style.relatedCardBorderWidth}px`,
                      borderStyle: 'solid',
                      backgroundColor: colorWithOpacity(
                        activeTemplate.style.relatedCardBackgroundColor,
                        activeTemplate.style.relatedCardBackgroundOpacity
                      ),
                    }}
                  >
                    {item.featuredImage && (
                      <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="h-[160px] w-full object-cover"
                        style={{ borderRadius: `${activeTemplate.style.relatedImageBorderRadius}px` }}
                      />
                    )}
                    <div style={{ padding: `${activeTemplate.relatedCardContentPadding}px` }}>
                      {activeTemplate.showRelatedPostDate && (
                        <p className="text-sm text-muted-foreground">{formatBlogDate(getBlogDisplayDate(item))}</p>
                      )}
                      <p className="mt-1 font-semibold">
                        {item.title}
                      </p>
                      {activeTemplate.showRelatedPostExcerpt && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{getBlogPreviewText(item)}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {website && (
          <SiteFooter
            websiteName={website.name}
            footer={website.footer}
            headerNavigation={website.header.navigation}
            globalStyles={website.globalStyles}
            deviceView="desktop"
          />
        )}
      </div>
    </>
  );
}

function typographyToStyle(config: {
  fontFamily: string;
  fontSize: number;
  fontSizeResponsive?: { desktop?: number; tablet?: number; mobile?: number };
  fontWeight: string;
  lineHeight?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: string;
  color: string;
  colorOpacity: number;
}, breakpoint: Breakpoint) {
  const fontSize = resolveResponsiveValue<number>(
    config.fontSizeResponsive,
    breakpoint,
    config.fontSize,
  );
  return {
    fontFamily: config.fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight: config.fontWeight as any,
    lineHeight: config.lineHeight,
    textTransform: config.textTransform,
    letterSpacing: config.letterSpacing,
    color: colorWithOpacity(config.color, config.colorOpacity),
  };
}

function buttonTextStyle(template: {
  style: {
    typography: {
      formButton: {
        fontFamily: string;
        fontSize: number;
        fontWeight: string;
        color: string;
        colorOpacity: number;
      };
    };
  };
}) {
  return {
    fontFamily: template.style.typography.formButton.fontFamily,
    fontSize: `${template.style.typography.formButton.fontSize}px`,
    fontWeight: template.style.typography.formButton.fontWeight as any,
    color: colorWithOpacity(
      template.style.typography.formButton.color,
      template.style.typography.formButton.colorOpacity
    ),
  };
}

function inputStyle(template: any) {
  return {
    backgroundColor: colorWithOpacity(
      template.style.formFieldBackgroundColor,
      template.style.formFieldBackgroundOpacity
    ),
    borderColor: colorWithOpacity(template.style.formFieldBorderColor, template.style.formFieldBorderOpacity),
    borderWidth: `${template.style.formFieldBorderWidth}px`,
    borderRadius: `${template.style.formFieldBorderRadius}px`,
  };
}

function HoverButton({ template, children }: { template: any; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Button
      type="submit"
      className="w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...buttonTextStyle(template),
        backgroundColor: hovered
          ? colorWithOpacity(template.style.formButtonHoverBackgroundColor, template.style.formButtonHoverBackgroundOpacity)
          : colorWithOpacity(template.style.formButtonBackgroundColor, template.style.formButtonBackgroundOpacity),
        color: hovered
          ? colorWithOpacity(template.style.formButtonHoverTextColor, template.style.formButtonHoverTextOpacity)
          : buttonTextStyle(template).color,
        borderRadius: `${template.style.formButtonBorderRadius}px`,
      }}
    >
      {children}
    </Button>
  );
}

function getBoundString(post: any, field: BlogDynamicField): string {
  const value = post?.[field];
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function getBoundContent(post: any, field: BlogDynamicField): string {
  const raw = post?.[field];
  if (field === 'contentHtml' && typeof raw === 'string') return raw;
  const text = getBoundString(post, field);
  return text ? `<p>${text}</p>` : '<p></p>';
}

function getBoundDate(post: any, field: 'publishedAt' | 'createdAt' | 'updatedAt'): Date {
  const value = post?.[field];
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}
