import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin/requireAuth";
import { ensureUniqueSlug, sanitizePatch, withArrayKeys } from "@/lib/admin/helpers";
import { getSanityWriteClient } from "@/lib/sanity/client";
import { slugify } from "@/lib/sanity/slugify";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const client = getSanityWriteClient();
  const post = await client.fetch(
    `*[_id == $id][0]{..., "categoryId": category._ref}`,
    { id }
  );
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const client = getSanityWriteClient();
  const updates = sanitizePatch(body);

  if ("categoryId" in updates) {
    const categoryId = updates.categoryId as string | null;
    delete updates.categoryId;
    updates.category = categoryId ? { _type: "reference", _ref: categoryId } : undefined;
  }
  if (typeof updates.slug === "object" && updates.slug && "current" in updates.slug) {
    const current = String((updates.slug as { current: string }).current || "");
    const base = slugify(current);
    updates.slug = { _type: "slug", current: await ensureUniqueSlug(client, "blogPost", base, id) };
  }
  if ("content" in updates) {
    updates.content = Array.isArray(updates.content)
      ? withArrayKeys(updates.content as Record<string, unknown>[])
      : [];
  }
  if ("tags" in updates) {
    updates.tags = Array.isArray(updates.tags)
      ? (updates.tags as unknown[]).filter((t) => typeof t === "string")
      : [];
  }

  const updated = await client.patch(id).set(updates).commit({ returnDocuments: true });
  return NextResponse.json({ post: updated });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const client = getSanityWriteClient();
  await client.delete(id);
  return NextResponse.json({ ok: true });
}
