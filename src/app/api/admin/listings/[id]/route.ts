import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin/requireAuth";
import { ensureUniqueSlug, isoDateOrUndefined, numOrUndefined, sanitizePatch, withArrayKeys } from "@/lib/admin/helpers";
import { getSanityWriteClient } from "@/lib/sanity/client";
import { slugify } from "@/lib/sanity/slugify";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/sanity/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const client = getSanityWriteClient();
  const listing = await client.getDocument(id);
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ listing });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const client = getSanityWriteClient();
  const updates = sanitizePatch(body);

  if (typeof updates.slug === "object" && updates.slug && "current" in updates.slug) {
    const current = String((updates.slug as { current: string }).current || "");
    const base = slugify(current);
    updates.slug = { _type: "slug", current: await ensureUniqueSlug(client, "listing", base, id) };
  }
  if ("propertyType" in updates) {
    updates.propertyType = Array.isArray(updates.propertyType)
      ? (updates.propertyType as string[]).filter((t) => (PROPERTY_TYPE_OPTIONS as string[]).includes(t))
      : [];
  }
  if ("gallery" in updates) {
    updates.gallery = Array.isArray(updates.gallery)
      ? withArrayKeys(updates.gallery as Record<string, unknown>[])
      : [];
  }
  for (const numField of ["price", "bedrooms", "livingAreaSqft", "lotSizeSqft", "yearBuilt", "propertyTaxes", "sortOrder"]) {
    if (numField in updates) {
      updates[numField] = numOrUndefined(updates[numField]);
    }
  }
  const unsets: string[] = [];
  if ("dateListed" in updates) {
    const raw = updates.dateListed;
    delete updates.dateListed;
    if (raw === null || raw === "") {
      unsets.push("dateListed");
    } else {
      const normalized = isoDateOrUndefined(raw);
      // Malformed input is ignored rather than wiping an existing good date.
      if (normalized) updates.dateListed = normalized;
    }
  }

  let patch = client.patch(id).set(updates);
  if (unsets.length) patch = patch.unset(unsets);
  const updated = await patch.commit({ returnDocuments: true });
  return NextResponse.json({ listing: updated });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const client = getSanityWriteClient();
  await client.delete(id);
  return NextResponse.json({ ok: true });
}
