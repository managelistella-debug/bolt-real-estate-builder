import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin/requireAuth";
import { sanitizePatch } from "@/lib/admin/helpers";
import { getSanityWriteClient } from "@/lib/sanity/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const client = getSanityWriteClient();
  const updated = await client
    .patch(id)
    .set(sanitizePatch(body))
    .commit({ returnDocuments: true });
  return NextResponse.json({ testimonial: updated });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const client = getSanityWriteClient();
  await client.delete(id);
  return NextResponse.json({ ok: true });
}
