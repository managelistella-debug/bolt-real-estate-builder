import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin/requireAuth";
import { getSanityWriteClient } from "@/lib/sanity/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const client = getSanityWriteClient();

  const inUse = await client.fetch<number>(
    `count(*[_type == "blogPost" && category._ref == $id])`,
    { id }
  );
  if (inUse > 0) {
    return NextResponse.json(
      { error: `${inUse} post(s) still use this category. Reassign them first.` },
      { status: 409 }
    );
  }

  await client.delete(id);
  return NextResponse.json({ ok: true });
}
