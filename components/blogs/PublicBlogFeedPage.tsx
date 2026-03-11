'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useBlogsStore } from '@/lib/stores/blogs';
import { useWebsiteStore } from '@/lib/stores/website';
import { SiteHeader } from '@/components/site-header/SiteHeader';
import { SiteFooter } from '@/components/site-footer/SiteFooter';
import { formatBlogDate, getBlogDisplayDate, getBlogPreviewText } from '@/lib/blogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PublicBlogFeedPage() {
  const blogs = useBlogsStore((state) => state.blogs);
  const { currentWebsite, websites } = useWebsiteStore();
  const website = currentWebsite ?? websites[0] ?? null;
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

  const publishedBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return blogs
      .filter((blog) => blog.status === 'published')
      .filter((blog) => {
        if (!query) return true;
        return (
          blog.title.toLowerCase().includes(query) ||
          (blog.excerpt || '').toLowerCase().includes(query) ||
          (blog.category || '').toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(getBlogDisplayDate(b)).getTime() - new Date(getBlogDisplayDate(a)).getTime());
  }, [blogs, search]);

  const visibleBlogs = publishedBlogs.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-background">
      {website && (
        <SiteHeader
          websiteName={website.name}
          header={website.header}
          globalStyles={website.globalStyles}
          deviceView="desktop"
        />
      )}

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="mt-2 text-muted-foreground">Latest insights and updates.</p>
          <Input
            className="mt-4 max-w-md"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search blog posts"
          />
        </div>

        {visibleBlogs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            No published blog posts yet.
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleBlogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="block rounded-lg border p-4 hover:bg-muted/50">
                  {blog.featuredImage && (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="h-48 w-full rounded-md object-cover"
                    />
                  )}
                  {blog.category && (
                    <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{blog.category}</p>
                  )}
                  <h2 className="mt-2 text-xl font-semibold leading-tight">{blog.title}</h2>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatBlogDate(getBlogDisplayDate(blog))}
                    {blog.authorName ? ` · ${blog.authorName}` : ''}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{getBlogPreviewText(blog)}</p>
                  <span className="mt-3 inline-block text-sm font-medium">Read Article</span>
                </Link>
              ))}
            </div>

            {visibleCount < publishedBlogs.length && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" onClick={() => setVisibleCount((count) => count + 9)}>
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
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
