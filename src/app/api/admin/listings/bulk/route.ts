import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin/requireAuth";
import { getSanityWriteClient } from "@/lib/sanity/client";

export async function POST(req: NextRequest) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const ids: string[] = Array.isArray(body.ids) ? body.ids : [];
  const action = body.action as "delete" | "publish" | "unpublish";

  if (ids.length === 0) {
    return NextResponse.json({ error: "No ids provided." }, { status: 400 });
  }
  if (!["delete", "publish", "unpublish"].includes(action)) {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  const client = getSanityWriteClient();
  const tx = client.transaction();
  for (const id of ids) {
    if (action === "delete") tx.delete(id);
    if (action === "publish") tx.patch(id, (p) => p.set({ published: true }));
    if (action === "unpublish") tx.patch(id, (p) => p.set({ published: false }));
  }
  await tx.commit();

  return NextResponse.json({ ok: true });
}
