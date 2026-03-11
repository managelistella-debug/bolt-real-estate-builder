'use client';

import { useEffect, useMemo, useState } from 'react';
import { BlogFeedWidget } from '@/lib/types';

export type BlogFeedDevice = 'desktop' | 'tablet' | 'mobile';

export interface BlogFeedRenderPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  authorName?: string;
  category?: string;
  status?: string;
  tags?: string[];
  customOrder?: number;
  publishedAt?: string | Date;
  createdAt?: string | Date;
}

interface BlogFeedRendererProps {
  posts: BlogFeedRenderPost[];
  widget: BlogFeedWidget;
  deviceView: BlogFeedDevice;
  linkBasePath?: string;
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

function normalizeWidget(widget: BlogFeedWidget): BlogFeedWidget {
  const oldWidget = widget as any;
  const styleDefaults = {
    cardBackgroundColor: '#ffffff',
    cardBackgroundOpacity: 100,
    cardBorderColor: '#e5e7eb',
    cardBorderOpacity: 100,
    cardBorderWidth: 1,
    cardBorderRadius: 12,
    cardShadow: true,
    imageBorderRadius: 8,
    imageBorderColor: '#e5e7eb',
    imageBorderOpacity: 100,
    imageBorderWidth: 0,
    imageShadow: false,
    featuredCardBackgroundColor: '#0f172a',
    featuredCardBackgroundOpacity: 100,
    featuredCardBorderColor: '#0f172a',
    featuredCardBorderOpacity: 100,
    featuredCardBorderWidth: 0,
    featuredCardBorderRadius: 14,
    featuredCardShadow: true,
    typography: {
      category: { fontFamily: 'Inter', fontSize: 12, fontWeight: '600', color: '#f59e0b', colorOpacity: 100 },
      title: { fontFamily: 'Inter', fontSize: 22, fontWeight: '700', color: '#111827', colorOpacity: 100 },
      date: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', color: '#6b7280', colorOpacity: 100 },
      meta: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', color: '#6b7280', colorOpacity: 100 },
      excerpt: { fontFamily: 'Inter', fontSize: 15, fontWeight: '400', color: '#374151', colorOpacity: 100 },
      action: { fontFamily: 'Inter', fontSize: 13, fontWeight: '600', color: '#111827', colorOpacity: 100 },
      featuredAction: { fontFamily: 'Inter', fontSize: 14, fontWeight: '600', color: '#111827', colorOpacity: 100 },
    },
    gridButton: {
      textColor: '#111827',
      textColorOpacity: 100,
      backgroundColor: '#ffffff',
      backgroundColorOpacity: 100,
      borderColor: '#d1d5db',
      borderColorOpacity: 100,
      borderRadius: 8,
    },
    featuredButton: {
      textColor: '#111827',
      textColorOpacity: 100,
      backgroundColor: '#fbbf24',
      backgroundColorOpacity: 100,
      borderColor: '#fbbf24',
      borderColorOpacity: 100,
      borderRadius: 8,
    },
    paginationButton: {
      textColor: '#111827',
      textColorOpacity: 100,
      backgroundColor: '#ffffff',
      backgroundColorOpacity: 100,
      borderColor: '#d1d5db',
      borderColorOpacity: 100,
      borderRadius: 8,
    },
  };

  return {
    ...widget,
    layoutVariant: 'modern-grid',
    query: oldWidget.query || {
      mode: 'filters',
      manualBlogIds: [],
      filters: {
        statuses: ['published'],
        category: '',
        tags: [],
        search: '',
      },
    },
    sortBy: oldWidget.sortBy || 'date_desc',
    columns: oldWidget.columns || { desktop: 2, tablet: 2, mobile: 1 },
    perPage: oldWidget.perPage || { desktop: 9, tablet: 6, mobile: 3 },
    thumbnailHeight: oldWidget.thumbnailHeight || { desktop: 300, tablet: 280, mobile: 220 },
    thumbnailHeightUnit: oldWidget.thumbnailHeightUnit === 'vh' ? 'vh' : 'px',
    spacing: typeof oldWidget.spacing === 'number' ? oldWidget.spacing : 20,
    pagination: oldWidget.pagination || {
      mode: 'paged',
      loadMoreLabel: 'Load More',
      previousLabel: 'Previous',
      nextLabel: 'Next',
      infiniteBatchSize: 3,
      showPageIndicator: true,
    },
    showDate: typeof oldWidget.showDate === 'boolean' ? oldWidget.showDate : true,
    showAuthor: typeof oldWidget.showAuthor === 'boolean' ? oldWidget.showAuthor : true,
    showCategory: typeof oldWidget.showCategory === 'boolean' ? oldWidget.showCategory : true,
    showExcerpt: typeof oldWidget.showExcerpt === 'boolean' ? oldWidget.showExcerpt : true,
    showReadMore: typeof oldWidget.showReadMore === 'boolean' ? oldWidget.showReadMore : true,
    showFeaturedReadMore:
      typeof oldWidget.showFeaturedReadMore === 'boolean' ? oldWidget.showFeaturedReadMore : true,
    readMoreLabel: oldWidget.readMoreLabel || 'Read More',
    featuredReadMoreLabel: oldWidget.featuredReadMoreLabel || 'Read Article',
    equalHeightCards: typeof oldWidget.equalHeightCards === 'boolean' ? oldWidget.equalHeightCards : true,
    cardClickable: typeof oldWidget.cardClickable === 'boolean' ? oldWidget.cardClickable : true,
    featuredPost: {
      enabled: typeof oldWidget.featuredPost?.enabled === 'boolean' ? oldWidget.featuredPost.enabled : true,
      showOnTablet:
        typeof oldWidget.featuredPost?.showOnTablet === 'boolean' ? oldWidget.featuredPost.showOnTablet : true,
    },
    style: {
      ...styleDefaults,
      ...(oldWidget.style || {}),
      typography: {
        ...styleDefaults.typography,
        ...(oldWidget.style?.typography || {}),
      },
      gridButton: {
        ...styleDefaults.gridButton,
        ...(oldWidget.style?.gridButton || {}),
      },
      featuredButton: {
        ...styleDefaults.featuredButton,
        ...(oldWidget.style?.featuredButton || {}),
      },
      paginationButton: {
        ...styleDefaults.paginationButton,
        ...(oldWidget.style?.paginationButton || {}),
      },
    },
    background: oldWidget.background || {
      type: 'color',
      color: 'transparent',
      opacity: 100,
      blur: 0,
    },
    layout: oldWidget.layout || {
      height: { type: 'auto' },
      width: 'container',
      padding: { top: 60, right: 20, bottom: 60, left: 20 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  };
}

function responsiveValue(config: { desktop: number; tablet: number; mobile: number }, device: BlogFeedDevice): number {
  if (device === 'mobile') return config.mobile ?? config.tablet ?? config.desktop;
  if (device === 'tablet') return config.tablet ?? config.desktop;
  return config.desktop;
}

function dateValue(post: BlogFeedRenderPost): Date {
  const source = post.publishedAt || post.createdAt;
  const parsed = source ? new Date(source) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function formatDate(post: BlogFeedRenderPost): string {
  return dateValue(post).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function previewText(post: BlogFeedRenderPost): string {
  return (post.excerpt || '').trim();
}

function typographyStyle(config: BlogFeedWidget['style']['typography']['title']): React.CSSProperties {
  return {
    fontFamily: config.fontFamily,
    fontSize: `${config.fontSize}px`,
    fontWeight: config.fontWeight as any,
    color: colorWithOpacity(config.color, config.colorOpacity ?? 100),
  };
}

function buttonStyle(config: BlogFeedWidget['style']['gridButton']): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content',
    color: colorWithOpacity(config.textColor, config.textColorOpacity ?? 100),
    backgroundColor: colorWithOpacity(config.backgroundColor, config.backgroundColorOpacity ?? 100),
    border: `1px solid ${colorWithOpacity(config.borderColor, config.borderColorOpacity ?? 100)}`,
    borderRadius: `${config.borderRadius}px`,
    padding: '10px 16px',
    lineHeight: 1,
  };
}

export function BlogFeedRenderer({ posts, widget, deviceView, linkBasePath = '/blog' }: BlogFeedRendererProps) {
  const normalizedWidget = normalizeWidget(widget);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(
    normalizedWidget.pagination.mode === 'load_more' || normalizedWidget.pagination.mode === 'infinite'
      ? normalizedWidget.pagination.infiniteBatchSize
      : responsiveValue(normalizedWidget.perPage, deviceView)
  );

  const query = normalizedWidget.query;
  const filteredSorted = useMemo(() => {
    const categoryNeedle = (query.filters.category || '').trim().toLowerCase();
    const searchNeedle = (query.filters.search || '').trim().toLowerCase();
    const manual = query.mode === 'manual'
      ? query.manualBlogIds.map((id) => posts.find((post) => post.id === id)).filter(Boolean) as BlogFeedRenderPost[]
      : posts.filter((post) => {
          const statuses = query.filters.statuses || [];
          const statusMatch = !statuses.length || statuses.includes((post.status || 'published') as any);
          const categoryMatch = !categoryNeedle || (post.category || '').trim().toLowerCase() === categoryNeedle;
          const searchMatch =
            !searchNeedle ||
            post.title.toLowerCase().includes(searchNeedle) ||
            (post.excerpt || '').toLowerCase().includes(searchNeedle) ||
            (post.category || '').toLowerCase().includes(searchNeedle) ||
            (post.tags || []).some((tag) => tag.toLowerCase().includes(searchNeedle));
          return statusMatch && categoryMatch && searchMatch;
        });

    const sorted = [...manual];
    if (normalizedWidget.sortBy === 'title_asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (normalizedWidget.sortBy === 'title_desc') sorted.sort((a, b) => b.title.localeCompare(a.title));
    if (normalizedWidget.sortBy === 'custom_order') {
      sorted.sort((a, b) => (a.customOrder ?? Number.MAX_SAFE_INTEGER) - (b.customOrder ?? Number.MAX_SAFE_INTEGER));
    }
    if (normalizedWidget.sortBy === 'date_desc') sorted.sort((a, b) => dateValue(b).getTime() - dateValue(a).getTime());
    if (normalizedWidget.sortBy === 'date_asc') sorted.sort((a, b) => dateValue(a).getTime() - dateValue(b).getTime());
    return sorted;
  }, [posts, query, normalizedWidget.sortBy]);

  const perPage = responsiveValue(normalizedWidget.perPage, deviceView);
  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(
      normalizedWidget.pagination.mode === 'load_more' || normalizedWidget.pagination.mode === 'infinite'
        ? normalizedWidget.pagination.infiniteBatchSize
        : perPage
    );
  }, [normalizedWidget.pagination.mode, normalizedWidget.pagination.infiniteBatchSize, perPage, query, normalizedWidget.sortBy, deviceView]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / Math.max(1, perPage)));
  const items = normalizedWidget.pagination.mode === 'none'
    ? filteredSorted.slice(0, perPage)
    : normalizedWidget.pagination.mode === 'paged'
      ? filteredSorted.slice((currentPage - 1) * perPage, currentPage * perPage)
      : filteredSorted.slice(0, visibleCount);

  const isMobile = deviceView === 'mobile';
  const showFeatured =
    !isMobile &&
    normalizedWidget.featuredPost.enabled &&
    (deviceView !== 'tablet' || normalizedWidget.featuredPost.showOnTablet) &&
    items.length > 0;
  const featured = showFeatured ? items[0] : null;
  const gridItems = showFeatured ? items.slice(1) : items;
  const heightValue = responsiveValue(normalizedWidget.thumbnailHeight, deviceView);
  const imageHeight = normalizedWidget.thumbnailHeightUnit === 'vh' ? `${heightValue}vh` : `${heightValue}px`;

  const layout = normalizedWidget.layout!;
  const containerMaxWidth = layout.width === 'container' ? '1200px' : '100%';
  const bgColor = colorWithOpacity(normalizedWidget.background?.color || 'transparent', normalizedWidget.background?.opacity ?? 100);
  const showPagedControls = normalizedWidget.pagination.mode === 'paged' && filteredSorted.length > perPage;
  const showLoadMore = (normalizedWidget.pagination.mode === 'load_more' || normalizedWidget.pagination.mode === 'infinite') && visibleCount < filteredSorted.length;

  const metaLine = (post: BlogFeedRenderPost) => {
    const bits: string[] = [];
    if (normalizedWidget.showDate) bits.push(formatDate(post));
    if (normalizedWidget.showAuthor && post.authorName) bits.push(post.authorName);
    return bits.join(' · ');
  };

  const cardWrapper = (post: BlogFeedRenderPost, content: React.ReactNode) => {
    const href = `${linkBasePath}/${post.slug}`;
    if (!normalizedWidget.cardClickable) return <div key={post.id}>{content}</div>;
    return (
      <a key={post.id} href={href} style={{ color: 'inherit', textDecoration: 'none', display: 'block', height: '100%' }}>
        {content}
      </a>
    );
  };

  return (
    <section
      style={{
        backgroundColor: bgColor,
        paddingTop: `${layout.padding.top}px`,
        paddingRight: `${layout.padding.right}px`,
        paddingBottom: `${layout.padding.bottom}px`,
        paddingLeft: `${layout.padding.left}px`,
      }}
    >
      <div style={{ maxWidth: containerMaxWidth, margin: '0 auto' }}>
        {items.length === 0 ? (
          <div style={{ border: '1px dashed #d1d5db', borderRadius: 12, padding: 32, textAlign: 'center', color: '#6b7280' }}>
            No blog posts available for this feed.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${normalizedWidget.spacing}px` }}>
            {featured &&
              cardWrapper(
                featured,
                <article
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)',
                    backgroundColor: colorWithOpacity(
                      normalizedWidget.style.featuredCardBackgroundColor,
                      normalizedWidget.style.featuredCardBackgroundOpacity
                    ),
                    border: `${normalizedWidget.style.featuredCardBorderWidth}px solid ${colorWithOpacity(
                      normalizedWidget.style.featuredCardBorderColor,
                      normalizedWidget.style.featuredCardBorderOpacity
                    )}`,
                    borderRadius: `${normalizedWidget.style.featuredCardBorderRadius}px`,
                    boxShadow: normalizedWidget.style.featuredCardShadow ? '0 10px 28px rgba(0,0,0,0.16)' : 'none',
                    overflow: 'hidden',
                    gap: `${normalizedWidget.spacing}px`,
                  }}
                >
                  <div
                    style={{
                      height: imageHeight,
                      overflow: 'hidden',
                      borderRadius: `${normalizedWidget.style.imageBorderRadius}px`,
                      border: `${normalizedWidget.style.imageBorderWidth}px solid ${colorWithOpacity(
                        normalizedWidget.style.imageBorderColor,
                        normalizedWidget.style.imageBorderOpacity
                      )}`,
                      boxShadow: normalizedWidget.style.imageShadow ? '0 6px 18px rgba(0,0,0,0.12)' : 'none',
                      background: '#f3f4f6',
                    }}
                  >
                    {featured.featuredImage ? (
                      <img src={featured.featuredImage} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, padding: 24 }}>
                    {normalizedWidget.showCategory && featured.category ? (
                      <p style={{ margin: 0, ...typographyStyle(normalizedWidget.style.typography.category) }}>{featured.category}</p>
                    ) : null}
                    <h3 style={{ margin: 0, ...typographyStyle(normalizedWidget.style.typography.title) }}>{featured.title}</h3>
                    {metaLine(featured) ? (
                      <p style={{ margin: 0, ...typographyStyle(normalizedWidget.style.typography.meta) }}>{metaLine(featured)}</p>
                    ) : null}
                    {normalizedWidget.showExcerpt ? (
                      <p style={{ margin: 0, ...typographyStyle(normalizedWidget.style.typography.excerpt) }}>{previewText(featured)}</p>
                    ) : null}
                    {normalizedWidget.showFeaturedReadMore ? (
                      <span style={{ ...buttonStyle(normalizedWidget.style.featuredButton), ...typographyStyle(normalizedWidget.style.typography.featuredAction) }}>
                        {normalizedWidget.featuredReadMoreLabel}
                      </span>
                    ) : null}
                  </div>
                </article>
              )}

            {gridItems.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${isMobile ? 1 : 2}, minmax(0, 1fr))`,
                  gap: `${normalizedWidget.spacing}px`,
                  alignItems: normalizedWidget.equalHeightCards ? 'stretch' : 'start',
                }}
              >
                {gridItems.map((post) =>
                  cardWrapper(
                    post,
                    <article
                      style={{
                        backgroundColor: colorWithOpacity(normalizedWidget.style.cardBackgroundColor, normalizedWidget.style.cardBackgroundOpacity),
                        border: `${normalizedWidget.style.cardBorderWidth}px solid ${colorWithOpacity(
                          normalizedWidget.style.cardBorderColor,
                          normalizedWidget.style.cardBorderOpacity
                        )}`,
                        borderRadius: `${normalizedWidget.style.cardBorderRadius}px`,
                        boxShadow: normalizedWidget.style.cardShadow ? '0 8px 22px rgba(0,0,0,0.08)' : 'none',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <div
                        style={{
                          height: imageHeight,
                          overflow: 'hidden',
                          borderRadius: `${normalizedWidget.style.imageBorderRadius}px`,
                          border: `${normalizedWidget.style.imageBorderWidth}px solid ${colorWithOpacity(
                            normalizedWidget.style.imageBorderColor,
                            normalizedWidget.style.imageBorderOpacity
                          )}`,
                          boxShadow: normalizedWidget.style.imageShadow ? '0 6px 18px rgba(0,0,0,0.12)' : 'none',
                          background: '#f3f4f6',
                        }}
                      >
                        {post.featuredImage ? (
                          <img src={post.featuredImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : null}
                      </div>
                      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
                        {normalizedWidget.showCategory && post.category ? (
                          <p style={{ margin: 0, ...typographyStyle(normalizedWidget.style.typography.category) }}>{post.category}</p>
                        ) : null}
                        <h3 style={{ margin: 0, ...typographyStyle(normalizedWidget.style.typography.title) }}>{post.title}</h3>
                        {metaLine(post) ? (
                          <p style={{ margin: 0, ...typographyStyle(normalizedWidget.style.typography.meta) }}>{metaLine(post)}</p>
                        ) : null}
                        {normalizedWidget.showExcerpt ? (
                          <p style={{ margin: 0, marginBottom: 'auto', ...typographyStyle(normalizedWidget.style.typography.excerpt) }}>
                            {previewText(post)}
                          </p>
                        ) : null}
                        {normalizedWidget.showReadMore ? (
                          <span style={{ ...buttonStyle(normalizedWidget.style.gridButton), ...typographyStyle(normalizedWidget.style.typography.action) }}>
                            {normalizedWidget.readMoreLabel}
                          </span>
                        ) : null}
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {showPagedControls && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 16 }}>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              style={buttonStyle(normalizedWidget.style.paginationButton)}
            >
              {normalizedWidget.pagination.previousLabel}
            </button>
            {normalizedWidget.pagination.showPageIndicator && (
              <span style={{ fontSize: 13, color: '#6b7280' }}>
                {currentPage} / {totalPages}
              </span>
            )}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage >= totalPages}
              style={buttonStyle(normalizedWidget.style.paginationButton)}
            >
              {normalizedWidget.pagination.nextLabel}
            </button>
          </div>
        )}

        {showLoadMore && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(filteredSorted.length, count + Math.max(1, normalizedWidget.pagination.infiniteBatchSize))
                )
              }
              style={buttonStyle(normalizedWidget.style.paginationButton)}
            >
              {normalizedWidget.pagination.loadMoreLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
