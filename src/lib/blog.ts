import { fetchAllPublishedPosts, fetchPostBySlug, fetchRecentPosts } from "./sanity/queries";
import { imageUrl } from "./sanity/image";
import type { BlogPostWithCategory, PortableTextContent } from "./sanity/types";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  authorImage: string;
  publishDate: string;
  featuredImage: string;
  featuredImageAlt: string;
  excerpt: string;
  content: PortableTextContent;
  category: string;
  tags: string[];
}

function toBlogPost(post: BlogPostWithCategory): BlogPost {
  return {
    id: post._id,
    title: post.title,
    slug: post.slug.current,
    author: post.authorName,
    authorImage: imageUrl(post.authorImage, 200) || "",
    publishDate: post.publishedDate,
    featuredImage: imageUrl(post.featuredImage, 1200) || "",
    featuredImageAlt: post.title,
    excerpt: post.excerpt,
    content: post.content || [],
    category: post.category?.name || "",
    tags: post.tags || [],
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await fetchAllPublishedPosts();
  return posts.map(toBlogPost);
}

export async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await fetchRecentPosts(limit);
  return posts.map(toBlogPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const post = await fetchPostBySlug(slug);
  return post ? toBlogPost(post) : undefined;
}

export function portableTextToPlainText(blocks: PortableTextContent): string {
  return blocks
    .filter((b): b is Extract<PortableTextContent[number], { _type: "block" }> => b._type === "block")
    .map((b) => b.children.map((c) => c.text).join(""))
    .join(" ")
    .trim();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
