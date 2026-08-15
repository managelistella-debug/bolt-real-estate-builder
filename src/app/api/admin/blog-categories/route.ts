import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin/requireAuth";
import { ensureUniqueSlug } from "@/lib/admin/helpers";
import { getSanityWriteClient } from "@/lib/sanity/client";
import { slugify } from "@/lib/sanity/slugify";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const client = getSanityWriteClient();
  const categories = await client.fetch(`*[_type == "blogCategory"] | order(name asc){_id, name, slug}`);
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  }

  const client = getSanityWriteClient();
  const slug = await ensureUniqueSlug(client, "blogCategory", slugify(name));
  const created = await client.create({
    _type: "blogCategory",
    name,
    slug: { _type: "slug", current: slug },
  });
  return NextResponse.json({ category: created });
}
