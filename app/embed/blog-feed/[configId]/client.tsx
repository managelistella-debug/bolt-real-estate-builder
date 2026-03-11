'use client';

import { useEffect, useMemo, useState } from 'react';

interface BlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  author_name?: string;
  category?: string;
  published_at?: string;
  created_at: string;
}

interface FeedConfig {
  perPage?: { desktop?: number; tablet?: number; mobile?: number };
  thumbnailHeight?: { desktop?: number; tablet?: number; mobile?: number };
  featuredPost?: { enabled?: boolean; showOnTablet?: boolean };
  showCategory?: boolean;
  showDate?: boolean;
  showAuthor?: boolean;
  showExcerpt?: boolean;
  showReadMore?: boolean;
  showFeaturedReadMore?: boolean;
  readMoreLabel?: string;
  featuredReadMoreLabel?: string;
  spacing?: number;
}

interface Props {
  configId: string;
  tenantId: string;
  feedConfig: FeedConfig;
}

function formatDate(value?: string) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return value;
  }
}

export function EmbedBlogFeedClient({ tenantId, feedConfig }: Props) {
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    fetch(`/api/public/blogs?tenantId=${encodeURIComponent(tenantId)}`)
      .then((r) => r.json())
      .then((rows) => {
        setBlogs(Array.isArray(rows) ? rows : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tenantId]);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const device = width <= 640 ? 'mobile' : width <= 1024 ? 'tablet' : 'desktop';
  const perPage = Math.max(1, feedConfig.perPage?.[device] || feedConfig.perPage?.desktop || 9);
  const thumbHeight = Math.max(120, feedConfig.thumbnailHeight?.[device] || feedConfig.thumbnailHeight?.desktop || 280);
  const showFeatured =
    device !== 'mobile' &&
    (feedConfig.featuredPost?.enabled ?? true) &&
    (device !== 'tablet' || (feedConfig.featuredPost?.showOnTablet ?? true));

  const visible = useMemo(() => blogs.slice(0, perPage), [blogs, perPage]);
  const featured = showFeatured && visible.length > 0 ? visible[0] : null;
  const items = featured ? visible.slice(1) : visible;
  const gap = feedConfig.spacing ?? 20;

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#888', fontFamily: 'system-ui, sans-serif' }}>Loading...</div>;
  }
  if (visible.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#888', fontFamily: 'system-ui, sans-serif' }}>No blog posts to display.</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {featured && (
        <a href={`/blog/${featured.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          <article style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap, marginBottom: gap }}>
            <div style={{ height: thumbHeight, overflow: 'hidden', borderRadius: 10, background: '#f4f4f5' }}>
              {featured.featured_image ? (
                <img src={featured.featured_image} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : null}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
              {feedConfig.showCategory !== false && featured.category ? (
                <p style={{ margin: 0, fontSize: 12, textTransform: 'uppercase', color: '#888C99' }}>{featured.category}</p>
              ) : null}
              <h2 style={{ margin: 0, fontSize: 34, lineHeight: 1.15 }}>{featured.title}</h2>
              {(feedConfig.showDate !== false || feedConfig.showAuthor !== false) && (
                <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
                  {feedConfig.showDate !== false ? formatDate(featured.published_at || featured.created_at) : ''}
                  {feedConfig.showAuthor !== false && featured.author_name ? ` · ${featured.author_name}` : ''}
                </p>
              )}
              {feedConfig.showExcerpt !== false && (
                <p style={{ margin: 0, fontSize: 15, color: '#444' }}>{featured.excerpt || ''}</p>
              )}
              {feedConfig.showFeaturedReadMore !== false && (
                <span style={{ width: 'fit-content', border: '1px solid #fbbf24', background: '#fbbf24', color: '#111', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
                  {feedConfig.featuredReadMoreLabel || 'Read Article'}
                </span>
              )}
            </div>
          </article>
        </a>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${device === 'mobile' ? 1 : 2}, minmax(0, 1fr))`, gap }}>
        {items.map((blog) => (
          <a key={blog.id} href={`/blog/${blog.slug}`} style={{ color: 'inherit', textDecoration: 'none', height: '100%' }}>
            <article style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ height: thumbHeight, overflow: 'hidden', background: '#f4f4f5' }}>
                {blog.featured_image ? (
                  <img src={blog.featured_image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : null}
              </div>
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
                {feedConfig.showCategory !== false && blog.category ? (
                  <p style={{ margin: 0, fontSize: 12, textTransform: 'uppercase', color: '#888C99' }}>{blog.category}</p>
                ) : null}
                <h3 style={{ margin: 0, fontSize: 22, lineHeight: 1.2 }}>{blog.title}</h3>
                {(feedConfig.showDate !== false || feedConfig.showAuthor !== false) && (
                  <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
                    {feedConfig.showDate !== false ? formatDate(blog.published_at || blog.created_at) : ''}
                    {feedConfig.showAuthor !== false && blog.author_name ? ` · ${blog.author_name}` : ''}
                  </p>
                )}
                {feedConfig.showExcerpt !== false && (
                  <p style={{ margin: 0, fontSize: 15, color: '#444', marginTop: 'auto' }}>{blog.excerpt || ''}</p>
                )}
                {feedConfig.showReadMore !== false && (
                  <span style={{ width: 'fit-content', border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
                    {feedConfig.readMoreLabel || 'Read More'}
                  </span>
                )}
              </div>
            </article>
          </a>
        ))}
      </div>
    </div>
  );
}
