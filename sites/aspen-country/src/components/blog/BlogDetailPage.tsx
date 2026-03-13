import Link from "next/link";
import { BlogPost, formatDate } from "@/lib/blog";

interface BlogTypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
}

interface AspenBlogDetailConfig {
  relatedPostsCount: number;
  showRelatedPosts: boolean;
  relatedHeading: string;
  style: {
    containerBackgroundColor: string;
    lineColor: string;
    lineWidth: number;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    heroImageBorderRadius: number;
    imageBorderRadius: number;
    headingColor: string;
    bodyTextColor: string;
    metaTextColor: string;
    mutedTextColor: string;
    tagBackgroundColor: string;
    tagBorderColor: string;
    tagBorderWidth: number;
    tagBorderRadius: number;
    relatedCardBackgroundColor: string;
    relatedCardBorderColor: string;
    relatedCardBorderWidth: number;
    relatedCardBorderRadius: number;
    relatedImageBorderRadius: number;
    typography: {
      title: BlogTypographyToken;
      meta: BlogTypographyToken;
      body: BlogTypographyToken;
      tag: BlogTypographyToken;
      relatedTitle: BlogTypographyToken;
      relatedMeta: BlogTypographyToken;
    };
  };
}

const DEFAULT_BLOG_DETAIL_CONFIG: AspenBlogDetailConfig = {
  relatedPostsCount: 3,
  showRelatedPosts: true,
  relatedHeading: "Related Posts",
  style: {
    containerBackgroundColor: "#ffffff",
    lineColor: "#E8E8E8",
    lineWidth: 1,
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 12,
    heroImageBorderRadius: 12,
    imageBorderRadius: 8,
    headingColor: "#111111",
    bodyTextColor: "#333333",
    metaTextColor: "#6A6A6A",
    mutedTextColor: "#7A7A7A",
    tagBackgroundColor: "#ffffff",
    tagBorderColor: "#E5E5E5",
    tagBorderWidth: 1,
    tagBorderRadius: 999,
    relatedCardBackgroundColor: "#ffffff",
    relatedCardBorderColor: "#E8E8E8",
    relatedCardBorderWidth: 1,
    relatedCardBorderRadius: 10,
    relatedImageBorderRadius: 6,
    typography: {
      title: { fontFamily: "Inter", fontSize: 48, fontWeight: "600", color: "#111111" },
      meta: { fontFamily: "Inter", fontSize: 14, fontWeight: "400", color: "#6A6A6A" },
      body: { fontFamily: "Inter", fontSize: 16, fontWeight: "400", color: "#333333" },
      tag: { fontFamily: "Inter", fontSize: 12, fontWeight: "500", color: "#6A6A6A" },
      relatedTitle: { fontFamily: "Inter", fontSize: 20, fontWeight: "600", color: "#111111" },
      relatedMeta: { fontFamily: "Inter", fontSize: 12, fontWeight: "400", color: "#7A7A7A" },
    },
  },
};

interface BlogDetailPageProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
  appearance?: AspenBlogDetailConfig;
}

function previewText(post: BlogPost) {
  if (post.excerpt) return post.excerpt;
  const stripped = post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return stripped.slice(0, 160);
}

export default function BlogDetailPage({
  post,
  relatedPosts = [],
  appearance = DEFAULT_BLOG_DETAIL_CONFIG,
}: BlogDetailPageProps) {
  const style = appearance.style;
  const visibleRelatedPosts = relatedPosts.slice(0, Math.max(1, appearance.relatedPostsCount));
  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14" style={{ backgroundColor: style.containerBackgroundColor, fontFamily: style.typography.body.fontFamily }}>
      <nav className="mb-6 text-sm" style={{ color: style.metaTextColor }}>
        <Link href="/blog" className="hover:text-black">Blog</Link>
      </nav>

      <header>
        {post.featuredImage ? (
          <div className="relative overflow-hidden" style={{ borderRadius: `${style.heroImageBorderRadius}px` }}>
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              className="h-[300px] w-full object-cover sm:h-[460px]"
              style={{ objectPosition: "center center" }}
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/5" />
            <div className="absolute inset-0 flex items-end p-6 sm:p-10">
              <div className="max-w-3xl text-white">
                {post.category && (
                  <p className="text-xs uppercase tracking-[0.12em] text-white/85">{post.category}</p>
                )}
                <h1 className="mt-2 leading-tight sm:text-5xl" style={{ fontFamily: style.typography.title.fontFamily, fontSize: `${style.typography.title.fontSize}px`, fontWeight: style.typography.title.fontWeight }}>{post.title}</h1>
                <p className="mt-3 text-sm text-white/85" style={{ fontFamily: style.typography.meta.fontFamily, fontSize: `${style.typography.meta.fontSize}px`, fontWeight: style.typography.meta.fontWeight }}>
                  {formatDate(post.publishDate)}
                  {post.author ? ` · ${post.author}` : ""}
                </p>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs"
                        style={{
                          borderRadius: `${style.tagBorderRadius}px`,
                          border: `${style.tagBorderWidth}px solid ${style.tagBorderColor}`,
                          backgroundColor: style.tagBackgroundColor,
                          color: style.typography.tag.color,
                          fontFamily: style.typography.tag.fontFamily,
                          fontSize: `${style.typography.tag.fontSize}px`,
                          fontWeight: style.typography.tag.fontWeight,
                        }}
                      >
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
              <p className="text-xs uppercase tracking-[0.1em]" style={{ color: style.mutedTextColor }}>{post.category}</p>
            )}
            <h1 className="mt-3 leading-tight sm:text-5xl" style={{ color: style.headingColor, fontFamily: style.typography.title.fontFamily, fontSize: `${style.typography.title.fontSize}px`, fontWeight: style.typography.title.fontWeight }}>{post.title}</h1>
            <p className="mt-4 text-sm" style={{ color: style.metaTextColor, fontFamily: style.typography.meta.fontFamily, fontSize: `${style.typography.meta.fontSize}px`, fontWeight: style.typography.meta.fontWeight }}>
              {formatDate(post.publishDate)}
              {post.author ? ` · ${post.author}` : ""}
            </p>
            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs"
                    style={{
                      borderRadius: `${style.tagBorderRadius}px`,
                      border: `${style.tagBorderWidth}px solid ${style.tagBorderColor}`,
                      backgroundColor: style.tagBackgroundColor,
                      color: style.typography.tag.color,
                      fontFamily: style.typography.tag.fontFamily,
                      fontSize: `${style.typography.tag.fontSize}px`,
                      fontWeight: style.typography.tag.fontWeight,
                    }}
                  >
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
        style={{
          color: style.typography.body.color,
          fontFamily: style.typography.body.fontFamily,
          fontSize: `${style.typography.body.fontSize}px`,
          fontWeight: style.typography.body.fontWeight,
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {appearance.showRelatedPosts && visibleRelatedPosts.length > 0 && (
        <section className="mt-14 pt-10" style={{ borderTop: `${style.lineWidth}px solid ${style.lineColor}` }}>
          <h2 className="text-2xl" style={{ color: style.headingColor, fontFamily: style.typography.relatedTitle.fontFamily, fontSize: `${style.typography.relatedTitle.fontSize}px`, fontWeight: style.typography.relatedTitle.fontWeight }}>{appearance.relatedHeading}</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {visibleRelatedPosts.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.slug}`}
                className="p-4 hover:bg-[#FAFAFA]"
                style={{
                  borderRadius: `${style.relatedCardBorderRadius}px`,
                  border: `${style.relatedCardBorderWidth}px solid ${style.relatedCardBorderColor}`,
                  backgroundColor: style.relatedCardBackgroundColor,
                }}
              >
                {item.featuredImage && (
                  <img
                    src={item.featuredImage}
                    alt={item.featuredImageAlt || item.title}
                    className="h-36 w-full object-cover"
                    style={{ borderRadius: `${style.relatedImageBorderRadius}px` }}
                  />
                )}
                <p className="mt-3 text-xs" style={{ color: style.typography.relatedMeta.color, fontFamily: style.typography.relatedMeta.fontFamily, fontSize: `${style.typography.relatedMeta.fontSize}px`, fontWeight: style.typography.relatedMeta.fontWeight }}>{formatDate(item.publishDate)}</p>
                <h3 className="mt-1 leading-tight" style={{ color: style.typography.relatedTitle.color, fontFamily: style.typography.relatedTitle.fontFamily, fontSize: `${style.typography.relatedTitle.fontSize}px`, fontWeight: style.typography.relatedTitle.fontWeight }}>{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm" style={{ color: style.metaTextColor }}>{previewText(item)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link href="/blog" className="text-sm font-medium hover:text-black" style={{ color: style.metaTextColor }}>
          ← Back to Blog
        </Link>
      </div>
    </article>
  );
}
