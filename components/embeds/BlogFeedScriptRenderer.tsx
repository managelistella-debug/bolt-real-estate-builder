'use client';

import { useEffect, useMemo, useState } from 'react';
import { BlogFeedWidget } from '@/lib/types';
import type { BlogFeedDevice, BlogFeedRenderPost } from './BlogFeedRenderer';

interface BlogFeedScriptRendererProps {
  posts: BlogFeedRenderPost[];
  widget: BlogFeedWidget;
  deviceView: BlogFeedDevice;
  linkPattern?: string;
}

function dateValue(post: BlogFeedRenderPost): Date {
  const source = post.publishedAt || post.createdAt;
  const parsed = source ? new Date(source) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function formatDate(post: BlogFeedRenderPost): string {
  return dateValue(post).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function responsiveValue(config: { desktop: number; tablet: number; mobile: number }, device: BlogFeedDevice, fallback: number): number {
  if (!config) return fallback;
  if (device === 'mobile') return config.mobile ?? config.tablet ?? config.desktop ?? fallback;
  if (device === 'tablet') return config.tablet ?? config.desktop ?? fallback;
  return config.desktop ?? fallback;
}

function resolveBlogHref(pattern: string, slug: string) {
  const safePattern = pattern.includes('{slug}') ? pattern : '/blog/{slug}';
  return safePattern.replace('{slug}', slug);
}

function normalizeWidget(widget: BlogFeedWidget): BlogFeedWidget {
  const oldWidget = widget as any;
  return {
    ...widget,
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
    detailPageUrlPattern:
      typeof oldWidget.detailPageUrlPattern === 'string' && oldWidget.detailPageUrlPattern.trim().length > 0
        ? oldWidget.detailPageUrlPattern.trim()
        : '/blog/{slug}',
    cardClickable: typeof oldWidget.cardClickable === 'boolean' ? oldWidget.cardClickable : true,
    featuredPost: {
      enabled: typeof oldWidget.featuredPost?.enabled === 'boolean' ? oldWidget.featuredPost.enabled : true,
      showOnTablet:
        typeof oldWidget.featuredPost?.showOnTablet === 'boolean' ? oldWidget.featuredPost.showOnTablet : true,
    },
  };
}

export function BlogFeedScriptRenderer({ posts, widget, deviceView, linkPattern }: BlogFeedScriptRendererProps) {
  const normalizedWidget = normalizeWidget(widget);
  const detailPattern =
    linkPattern && linkPattern.trim().length > 0
      ? linkPattern.trim()
      : normalizedWidget.detailPageUrlPattern;

  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(
    normalizedWidget.pagination.mode === 'load_more' || normalizedWidget.pagination.mode === 'infinite'
      ? normalizedWidget.pagination.infiniteBatchSize
      : responsiveValue(normalizedWidget.perPage, deviceView, 9)
  );

  const filteredSorted = useMemo(() => {
    const query = normalizedWidget.query;
    const categoryNeedle = (query.filters.category || '').trim().toLowerCase();
    const searchNeedle = (query.filters.search || '').trim().toLowerCase();
    const filterTags = (query.filters.tags || []).map((tag) => String(tag).toLowerCase()).filter(Boolean);

    const manual = query.mode === 'manual'
      ? query.manualBlogIds.map((id) => posts.find((post) => post.id === id)).filter(Boolean) as BlogFeedRenderPost[]
      : posts.filter((post) => {
          const statuses = query.filters.statuses || [];
          const postStatus = post.status || 'published';
          const statusMatch = !statuses.length || statuses.includes(postStatus as any);
          const categoryMatch = !categoryNeedle || (post.category || '').trim().toLowerCase() === categoryNeedle;
          const tags = (post.tags || []).map((tag) => tag.toLowerCase());
          const tagsMatch = !filterTags.length || filterTags.every((tag) => tags.includes(tag));
          const searchMatch =
            !searchNeedle ||
            post.title.toLowerCase().includes(searchNeedle) ||
            (post.excerpt || '').toLowerCase().includes(searchNeedle) ||
            (post.category || '').toLowerCase().includes(searchNeedle) ||
            tags.some((tag) => tag.includes(searchNeedle));
          return statusMatch && categoryMatch && tagsMatch && searchMatch;
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
  }, [posts, normalizedWidget]);

  const perPage = responsiveValue(normalizedWidget.perPage, deviceView, 9);
  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(
      normalizedWidget.pagination.mode === 'load_more' || normalizedWidget.pagination.mode === 'infinite'
        ? normalizedWidget.pagination.infiniteBatchSize
        : perPage
    );
  }, [normalizedWidget.pagination.mode, normalizedWidget.pagination.infiniteBatchSize, perPage]);

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
  const columns = Math.max(1, responsiveValue(normalizedWidget.columns, deviceView, isMobile ? 1 : 2));

  const card = (post: BlogFeedRenderPost, isFeatured: boolean) => {
    const href = resolveBlogHref(detailPattern, post.slug);
    const content = (
      <article
        style={{
          border: '1px solid #E5E7EB',
          borderRadius: isFeatured ? 14 : 12,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: isFeatured ? '0 10px 28px rgba(0,0,0,0.16)' : '0 8px 22px rgba(0,0,0,0.08)',
          height: '100%',
        }}
      >
        {post.featuredImage ? (
          <div style={{ position: 'relative', background: '#f3f4f6', overflow: 'hidden', height: isFeatured ? 330 : 240 }}>
            <img src={post.featuredImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : null}
        <div style={{ padding: isFeatured ? 24 : 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {normalizedWidget.showCategory && post.category ? (
            <p style={{ margin: 0, fontSize: 12, color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {post.category}
            </p>
          ) : null}
          <h3 style={{ margin: 0, fontSize: isFeatured ? 28 : 22, lineHeight: 1.2, color: '#111827' }}>{post.title}</h3>
          {(normalizedWidget.showDate || normalizedWidget.showAuthor) ? (
            <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
              {[normalizedWidget.showDate ? formatDate(post) : '', normalizedWidget.showAuthor ? (post.authorName || '') : ''].filter(Boolean).join(' · ')}
            </p>
          ) : null}
          {normalizedWidget.showExcerpt && post.excerpt ? (
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: '#374151' }}>{post.excerpt}</p>
          ) : null}
          {(isFeatured ? normalizedWidget.showFeaturedReadMore : normalizedWidget.showReadMore) ? (
            <span
              style={{
                marginTop: 4,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'fit-content',
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: isFeatured ? 14 : 13,
                fontWeight: 600,
                color: '#111827',
                background: isFeatured ? '#fbbf24' : '#fff',
              }}
            >
              {isFeatured ? normalizedWidget.featuredReadMoreLabel : normalizedWidget.readMoreLabel}
            </span>
          ) : null}
        </div>
      </article>
    );
    if (!normalizedWidget.cardClickable) return <div key={post.id}>{content}</div>;
    return (
      <a key={post.id} href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
        {content}
      </a>
    );
  };

  return (
    <section style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {items.length === 0 ? (
          <div style={{ border: '1px dashed #d1d5db', borderRadius: 12, padding: 32, textAlign: 'center', color: '#6b7280' }}>
            No blog posts available for this feed.
          </div>
        ) : (
          <>
            {featured ? card(featured, true) : null}
            {gridItems.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`, gap: 20 }}>
                {gridItems.map((post) => card(post, false))}
              </div>
            ) : null}
          </>
        )}

        {normalizedWidget.pagination.mode === 'paged' && filteredSorted.length > perPage ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 6 }}>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              style={{ padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', opacity: currentPage === 1 ? 0.45 : 1 }}
            >
              {normalizedWidget.pagination.previousLabel}
            </button>
            {normalizedWidget.pagination.showPageIndicator ? (
              <span style={{ fontSize: 13, color: '#6b7280' }}>{currentPage} / {totalPages}</span>
            ) : null}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage >= totalPages}
              style={{ padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', opacity: currentPage >= totalPages ? 0.45 : 1 }}
            >
              {normalizedWidget.pagination.nextLabel}
            </button>
          </div>
        ) : null}

        {(normalizedWidget.pagination.mode === 'load_more' || normalizedWidget.pagination.mode === 'infinite') && visibleCount < filteredSorted.length ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
            <button
              type="button"
              onClick={() => setVisibleCount((count) => Math.min(filteredSorted.length, count + Math.max(1, normalizedWidget.pagination.infiniteBatchSize)))}
              style={{ padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff' }}
            >
              {normalizedWidget.pagination.loadMoreLabel}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
