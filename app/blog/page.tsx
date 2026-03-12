import { Metadata } from 'next';
import { PublicBlogFeedPage } from '@/components/blogs/PublicBlogFeedPage';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Browse published blog posts.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogFeedPage() {
  return <PublicBlogFeedPage />;
}
