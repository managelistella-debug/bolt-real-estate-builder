import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import BlogDetailPageLegacy from "@/components/aspen/blog/BlogDetailPageLegacy";
import { getPostBySlug, getAllPosts } from "@/lib/aspen/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  const description = post.excerpt || post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  const canonical = `/blog/${post.slug}`;

  return {
    title: `${post.title} | Aspen Muraski Real Estate`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: `${post.title} | Aspen Muraski Real Estate`,
      description,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
    twitter: {
      card: post.featuredImage ? "summary_large_image" : "summary",
      title: `${post.title} | Aspen Muraski Real Estate`,
      description,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const resolved = await getPostBySlug(slug);
  if (!resolved) {
    notFound();
  }
  const description =
    resolved.excerpt ||
    resolved.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: resolved.title,
    description,
    datePublished: new Date(resolved.publishDate).toISOString(),
    image: resolved.featuredImage ? [resolved.featuredImage] : undefined,
    author: resolved.author ? { "@type": "Person", name: resolved.author } : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/blog/${resolved.slug}`,
    },
  };

  return (
    <main className="overflow-x-clip">
      <Header />
      <Script
        id={`blog-jsonld-${resolved.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogDetailPageLegacy post={resolved} />
      <Footer />
    </main>
  );
}
