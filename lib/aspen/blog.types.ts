export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  publishDate: string;
  featuredImage: string;
  featuredImageAlt: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
}
