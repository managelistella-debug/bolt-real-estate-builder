import { BlogPost, BlogStatus } from '@/lib/types';

export const BLOG_STATUS_LABELS: Record<BlogStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

export const BLOG_SEO_RECOMMENDATIONS = {
  title: 'Recommended: 50-60 characters',
  excerpt: 'Recommended: 120-160 characters',
  metaDescription: 'Recommended: 150-160 characters',
} as const;

export const formatBlogDate = (value?: Date | string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getBlogDisplayDate = (post: BlogPost) => post.publishedAt || post.createdAt;

export const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '').trim();

export const getBlogPreviewText = (post: BlogPost) =>
  post.excerpt?.trim() || stripHtml(post.contentHtml).slice(0, 180);
