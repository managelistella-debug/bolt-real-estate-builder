'use client';

import { useEffect, useMemo, useState } from 'react';
import { BlogFeedRenderer } from '@/components/embeds/BlogFeedRenderer';
import { BlogFeedWidget } from '@/lib/types';

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

type FeedConfig = BlogFeedWidget;

interface Props {
  configId: string;
  tenantId: string;
  feedConfig: FeedConfig;
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
  const mappedBlogs = useMemo(
    () =>
      blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        featuredImage: blog.featured_image,
        authorName: blog.author_name,
        category: blog.category,
        status: 'published',
        publishedAt: blog.published_at,
        createdAt: blog.created_at,
      })),
    [blogs]
  );

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#888', fontFamily: 'system-ui, sans-serif' }}>Loading...</div>;
  }
  if (mappedBlogs.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#888', fontFamily: 'system-ui, sans-serif' }}>No blog posts to display.</div>;
  }

  return (
    <BlogFeedRenderer posts={mappedBlogs} widget={feedConfig} deviceView={device} />
  );
}
