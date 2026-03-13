import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/api-auth";
import { getTenantId } from "@/lib/tenant";

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
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }

  const { data, error } = await auth.db
    .from("blog_posts")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("published_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const payload = await request.json();

  const title = String(payload.title || "").trim();
  const slug = String(payload.slug || toSlug(title));
  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required." }, { status: 400 });
  }

  const blogId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `blog_${crypto.randomUUID()}`
      : `blog_${Date.now()}`;

  const status = payload.isPublished === false ? "draft" : "published";
  const publishDate = String(payload.publishDate || new Date().toISOString().slice(0, 10));

  const insertPayload = {
    id: blogId,
    tenant_id: tenantId,
    user_id: auth.user.id,
    title,
    slug,
    author_name: String(payload.author || "Aspen Muraski"),
    published_at: `${publishDate}T12:00:00.000Z`,
    featured_image: String(payload.featuredImage || ""),
    meta_description: String(payload.featuredImageAlt || title),
    excerpt: String(payload.excerpt || ""),
    content_html: String(payload.content || ""),
    category: String(payload.category || ""),
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    status,
  };

  const { data, error } = await auth.db
    .from("blog_posts")
    .insert(insertPayload as never)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
