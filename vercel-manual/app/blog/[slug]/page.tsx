import { Metadata } from 'next';
import { BlogPostTemplate } from '@/components/blogs/BlogPostTemplate';

interface BlogPostPageProps {
  params: { slug: string };
}

const toTitleCase = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const readableSlug = toTitleCase(params.slug);
  return {
    title: `${readableSlug} | Blog`,
    description: `Read ${readableSlug} on our blog.`,
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <BlogPostTemplate slug={params.slug} />;
}
