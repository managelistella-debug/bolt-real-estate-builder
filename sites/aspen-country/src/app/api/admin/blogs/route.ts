import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/api-auth";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("blog_posts")
    .select("*")
    .order("publish_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const payload = await request.json();

  const title = String(payload.title || "").trim();
  const slug = String(payload.slug || toSlug(title));
  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required." }, { status: 400 });
  }

  const insertPayload = {
    title,
    slug,
    author: String(payload.author || "Aspen Muraski"),
    publish_date: String(payload.publishDate || new Date().toISOString().slice(0, 10)),
    featured_image: String(payload.featuredImage || ""),
    featured_image_alt: String(payload.featuredImageAlt || title),
    excerpt: String(payload.excerpt || ""),
    content: String(payload.content || ""),
    category: String(payload.category || ""),
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    is_published: payload.isPublished !== false,
  };

  const { data, error } = await auth.supabase
    .from("blog_posts")
    .insert(insertPayload as never)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
