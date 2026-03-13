import { BlogPostRow } from "@/lib/supabase/database.types";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { getTenantId } from "@/lib/tenant";

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

function mapBlogRow(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    author: row.author_name || "Aspen Muraski",
    publishDate: (row.published_at || row.created_at || "").slice(0, 10),
    featuredImage: row.featured_image || "/images/featured-1.webp",
    featuredImageAlt: row.title,
    excerpt: row.excerpt || row.meta_description || "",
    content: row.content_html || "",
    category: row.category || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

async function fetchPostsFromSupabase(): Promise<BlogPost[] | null> {
  const supabase = getSupabasePublicClient();
  const tenantId = getTenantId();
  if (!supabase) return null;
  if (!tenantId) return null;

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) return null;
    if (!data || data.length === 0) return [];
    return data.map((row) => mapBlogRow(row as BlogPostRow));
  } catch {
    return null;
  }
}

async function getResolvedPosts(): Promise<BlogPost[]> {
  const remote = await fetchPostsFromSupabase();
  if (remote && remote.length > 0) return remote;
  return [...fallbackPosts];
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getResolvedPosts();
  return posts.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const posts = await getResolvedPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPostById(
  id: string
): Promise<BlogPost | undefined> {
  const posts = await getResolvedPosts();
  return posts.find((post) => post.id === id);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 Things to Know Before Buying an Acreage in Sundre",
    slug: "5-things-before-buying-acreage-sundre",
    author: "Aspen Muraski",
    publishDate: "2026-02-28",
    featuredImage: "/images/featured-1.webp",
    featuredImageAlt:
      "Aerial view of an acreage property near Sundre with mountain backdrop",
    excerpt:
      "Purchasing an acreage is different from buying a home in town. From water wells to septic systems, here are five essential things every buyer should know before making the move to rural living near Sundre.",
    content:
      '<h2>1. Water Supply Matters</h2><p>Unlike properties in town, most acreages rely on private wells for water.</p><h2>2. Septic Systems Need Inspection</h2><p>Acreages typically use septic systems rather than municipal sewer.</p>',
    category: "Buying",
    tags: ["Acreages", "Sundre", "Buying Tips", "Rural Living"],
  },
  {
    id: "2",
    title: "How Aspen's Marketing Strategy Sells Properties Faster",
    slug: "aspens-marketing-strategy-sells-faster",
    author: "Aspen Muraski",
    publishDate: "2026-02-15",
    featuredImage: "/images/featured-2.webp",
    featuredImageAlt:
      "Professional real estate photography setup in a luxury home",
    excerpt:
      "In today's competitive market, great marketing is what separates a property that sits from one that sells.",
    content:
      "<h2>Professional Photography</h2><p>First impressions happen online. Aspen invests in professional photography and cinematic video tours.</p>",
    category: "Selling",
    tags: ["Marketing", "Selling Tips", "Photography", "Social Media"],
  },
  {
    id: "3",
    title:
      "Understanding Mountain View County Zoning for Rural Properties",
    slug: "mountain-view-county-zoning-rural-properties",
    author: "Aspen Muraski",
    publishDate: "2026-01-30",
    featuredImage: "/images/featured-3.webp",
    featuredImageAlt:
      "Rural property with fenced land in Mountain View County",
    excerpt:
      "Zoning regulations in Mountain View County affect everything from building a shop to keeping livestock.",
    content:
      "<h2>What Is Zoning?</h2><p>Zoning dictates how land can be used within a municipality.</p>",
    category: "Market Insights",
    tags: ["Zoning", "Mountain View County", "Rural Living", "Land Use"],
  },
];

export { fallbackPosts as blogPosts };
