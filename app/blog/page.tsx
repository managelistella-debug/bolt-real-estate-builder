import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Browse published blog posts.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogFeedPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div
        data-bolt-embed="blog-feed"
        data-tenant-id="business-1772752217587"
        data-embed-id="embed_1773209433302_2wdm6t"
      />
      <Script
        src="https://bolt-real-estate-builder-dereks-projects-6a01aa79.vercel.app/embed/bolt-embed.js"
        strategy="afterInteractive"
      />
    </main>
  );
}
