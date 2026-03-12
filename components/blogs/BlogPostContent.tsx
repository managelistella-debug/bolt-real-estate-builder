import Link from 'next/link';
import type { BlogPost } from '@/lib/types';
import { formatBlogDate, getBlogDisplayDate, getBlogPreviewText } from '@/lib/blogs';

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
}

export function BlogPostContent({ post, relatedPosts = [] }: BlogPostContentProps) {
  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="mb-6 text-sm text-[#6A6A6A]">
        <Link href="/blog" className="hover:text-black">Blog</Link>
      </nav>

      <header>
        {post.featuredImage ? (
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-[300px] w-full object-cover sm:h-[460px]"
              style={{ objectPosition: 'center center' }}
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/5" />
            <div className="absolute inset-0 flex items-end p-6 sm:p-10">
              <div className="max-w-3xl text-white">
                {post.category && (
                  <p className="text-xs uppercase tracking-[0.12em] text-white/85">{post.category}</p>
                )}
                <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
                <p className="mt-3 text-sm text-white/85">
                  {formatBlogDate(getBlogDisplayDate(post))}
                  {post.authorName ? ` · ${post.authorName}` : ''}
                </p>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/35 bg-black/25 px-3 py-1 text-xs text-white/95">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {post.category && (
              <p className="text-xs uppercase tracking-[0.1em] text-[#7A7A7A]">{post.category}</p>
            )}
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-black sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-sm text-[#6A6A6A]">
              {formatBlogDate(getBlogDisplayDate(post))}
              {post.authorName ? ` · ${post.authorName}` : ''}
            </p>
            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#E5E5E5] px-3 py-1 text-xs text-[#6A6A6A]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </header>

      <div
        className="prose prose-slate mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {relatedPosts.length > 0 && (
        <section className="mt-14 border-t border-[#E8E8E8] pt-10">
          <h2 className="text-2xl font-semibold text-black">Related Posts</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {relatedPosts.map((item) => (
              <Link key={item.id} href={`/blog/${item.slug}`} className="rounded-lg border border-[#E8E8E8] p-4 hover:bg-[#FAFAFA]">
                {item.featuredImage && (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="h-36 w-full rounded-md object-cover"
                  />
                )}
                <p className="mt-3 text-xs text-[#7A7A7A]">{formatBlogDate(getBlogDisplayDate(item))}</p>
                <h3 className="mt-1 text-lg font-semibold leading-tight">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#6A6A6A]">{getBlogPreviewText(item)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link href="/blog" className="text-sm font-medium text-[#4A4A4A] hover:text-black">
          ← Back to Blog
        </Link>
      </div>
    </article>
  );
}
