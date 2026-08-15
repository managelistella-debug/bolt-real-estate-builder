import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin/requireAuth";
import { getSanityWriteClient } from "@/lib/sanity/client";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const client = getSanityWriteClient();
  const testimonials = await client.fetch(
    `*[_type == "testimonial"] | order(order asc, _createdAt asc){_id, quote, name, order, published, _updatedAt}`
  );
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const quote = typeof body.quote === "string" ? body.quote.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!quote || !name) {
    return NextResponse.json({ error: "Quote and reviewer name are required." }, { status: 400 });
  }

  const client = getSanityWriteClient();
  let order = Number(body.order);
  if (!Number.isFinite(order)) {
    const maxOrder = await client.fetch<number | null>(`math::max(*[_type == "testimonial"].order)`);
    order = (maxOrder ?? 0) + 1;
  }

  const created = await client.create({
    _type: "testimonial",
    quote,
    name,
    order,
    published: body.published === undefined ? true : !!body.published,
  });
  return NextResponse.json({ testimonial: created });
}
