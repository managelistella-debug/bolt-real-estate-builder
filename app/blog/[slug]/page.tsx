import Script from 'next/script';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { PublicPageShell } from '@/components/public/PublicPageShell';
import { BlogPostContent } from '@/components/blogs/BlogPostContent';
import { getBlogDisplayDate, getBlogPreviewText } from '@/lib/blogs';
import { getPublishedBlogBySlug, getRecentPublishedBlogs } from '@/lib/server/publicContent';

interface BlogPostPageProps {
  params: { slug: string };
}

export const revalidate = 300;

function getBaseUrl(host?: string | null) {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL;
  if (envBase) return envBase.replace(/\/$/, '');
  if (!host) return null;
  return `https://${host.replace(/:\d+$/, '')}`;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const headerStore = headers();
  const host = headerStore.get('x-site-host') || headerStore.get('host');
  const post = await getPublishedBlogBySlug(params.slug, host);
  if (!post) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    };
  }
  const baseUrl = getBaseUrl(host);
  const canonical = `/blog/${post.slug}`;
  const description = post.metaDescription || post.excerpt || getBlogPreviewText(post);
  return {
    title: `${post.title} | Blog`,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: `${post.title} | Blog`,
      description,
      url: baseUrl ? `${baseUrl}${canonical}` : undefined,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
      publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
      authors: post.authorName ? [post.authorName] : undefined,
    },
    twitter: {
      card: post.featuredImage ? 'summary_large_image' : 'summary',
      title: `${post.title} | Blog`,
      description,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const headerStore = headers();
  const host = headerStore.get('x-site-host') || headerStore.get('host');
  const post = await getPublishedBlogBySlug(params.slug, host);
  if (!post) return notFound();

  const relatedPosts = await getRecentPublishedBlogs(3, { excludeId: post.id, host });
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription || post.excerpt || getBlogPreviewText(post),
    datePublished: post.publishedAt ? post.publishedAt.toISOString() : new Date(getBlogDisplayDate(post)).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.featuredImage ? [post.featuredImage] : undefined,
    author: post.authorName ? { '@type': 'Person', name: post.authorName } : undefined,
  };

  return (
    <PublicPageShell>
      <Script
        id={`blog-jsonld-${post.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPostContent post={post} relatedPosts={relatedPosts} />
    </PublicPageShell>
  );
}
