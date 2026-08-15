import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin/requireAuth";
import { ensureUniqueSlug, withArrayKeys } from "@/lib/admin/helpers";
import { getSanityWriteClient } from "@/lib/sanity/client";
import { slugify } from "@/lib/sanity/slugify";

const LIST_PROJECTION = `{
  _id, title, slug, publishedDate, authorName, featuredImage, published, _updatedAt,
  "category": category->{_id, name}
}`;

export async function GET(req: NextRequest) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const client = getSanityWriteClient();
  const posts = await client.fetch(
    `*[_type == "blogPost"] | order(publishedDate desc, _createdAt desc) ${LIST_PROJECTION}`
  );
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const client = getSanityWriteClient();
  const baseSlug = slugify(typeof body.slug === "string" && body.slug ? body.slug : title);
  const slug = await ensureUniqueSlug(client, "blogPost", baseSlug);

  const doc = {
    _type: "blogPost",
    title,
    slug: { _type: "slug", current: slug },
    category: body.categoryId ? { _type: "reference", _ref: body.categoryId } : undefined,
    publishedDate: body.publishedDate || new Date().toISOString().slice(0, 10),
    authorName: body.authorName || "Aspen Muraski",
    authorImage: body.authorImage || undefined,
    featuredImage: body.featuredImage || undefined,
    excerpt: body.excerpt || "",
    tags: Array.isArray(body.tags) ? body.tags.filter((t: unknown) => typeof t === "string") : [],
    content: Array.isArray(body.content) ? withArrayKeys(body.content) : [],
    published: !!body.published,
  };

  const created = await client.create(doc);
  return NextResponse.json({ post: created });
}
