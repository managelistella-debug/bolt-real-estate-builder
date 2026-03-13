import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/api-auth";
import { getTenantId } from "@/lib/tenant";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const { id } = await context.params;

  const { data, error } = await auth.db
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenantId)
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
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const { id } = await context.params;
  const payload = await request.json();
  const status = payload.isPublished === false ? "draft" : "published";
  const publishDate = String(payload.publishDate || new Date().toISOString().slice(0, 10));

  const updatePayload = {
    title: payload.title,
    slug: payload.slug,
    author_name: payload.author,
    published_at: `${publishDate}T12:00:00.000Z`,
    featured_image: payload.featuredImage,
    meta_description: payload.featuredImageAlt,
    excerpt: payload.excerpt,
    content_html: payload.content,
    category: payload.category,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    status,
  };

  const { data, error } = await auth.db
    .from("blog_posts")
    .update(updatePayload as never)
    .eq("id", id)
    .eq("tenant_id", tenantId)
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
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const { id } = await context.params;

  const { error } = await auth.db
    .from("blog_posts")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
