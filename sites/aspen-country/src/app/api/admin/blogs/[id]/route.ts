import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;

  const { data, error } = await auth.supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const payload = await request.json();

  const updatePayload = {
    title: payload.title,
    slug: payload.slug,
    author: payload.author,
    publish_date: payload.publishDate,
    featured_image: payload.featuredImage,
    featured_image_alt: payload.featuredImageAlt,
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    is_published: !!payload.isPublished,
  };

  const { data, error } = await auth.supabase
    .from("blog_posts")
    .update(updatePayload as never)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;

  const { error } = await auth.supabase.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
