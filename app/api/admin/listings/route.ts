import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/aspen/api-auth";
import { getTenantId } from "@/lib/aspen/tenant";
import { wordPressAdminRouteBlocked } from "@/lib/wordpress/adminRouteGuard";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isMissingColumnInSchemaCache(error: unknown, column: string) {
  const message =
    typeof error === "object" && error && "message" in error
      ? String((error as { message?: string }).message || "")
      : "";
  return (
    message.includes(`'${column}'`) &&
    message.toLowerCase().includes("schema cache")
  );
}

function shouldRetryWithoutOptionalCmsColumns(error: unknown) {
  return (
    isMissingColumnInSchemaCache(error, "homepage_featured") ||
    isMissingColumnInSchemaCache(error, "ranch_estate_featured") ||
    isMissingColumnInSchemaCache(error, "thumbnail")
  );
}

export async function GET() {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const blocked = wordPressAdminRouteBlocked();
  if (blocked) return blocked;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }

  const { data, error } = await auth.db
    .from("listings")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const blocked = wordPressAdminRouteBlocked();
  if (blocked) return blocked;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }

  const payload = await request.json();
  const address = String(payload.address || "").trim();
  const slug = String(payload.slug || toSlug(address));
  const city = String(payload.city || "").trim();

  if (!address || !city || !slug) {
    return NextResponse.json(
      { error: "Address, city, and slug are required." },
      { status: 400 }
    );
  }

  const listingId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `listing_${crypto.randomUUID()}`
      : `listing_${Date.now()}`;
  const listingStatus =
    payload.listingStatus === "sold"
      ? "sold"
      : payload.listingStatus === "pending"
        ? "pending"
        : "for_sale";

  const gallery = Array.isArray(payload.gallery)
    ? payload.gallery.map((url: string, index: number) => ({ url, order: index }))
    : [];

  const insertPayload = {
    id: listingId,
    tenant_id: tenantId,
    user_id: auth.user.id,
    slug,
    address,
    description: String(payload.description || ""),
    list_price: Number(payload.listPrice || 0),
    listing_status: listingStatus,
    representation: payload.representation || null,
    neighborhood: String(payload.neighborhood || ""),
    city,
    bedrooms: Number(payload.bedrooms || 0),
    bathrooms: Number(payload.bathrooms || 0),
    property_type: String(payload.propertyType || ""),
    year_built: Number(payload.yearBuilt || 0),
    living_area_sqft: Number(payload.livingArea || 0),
    lot_area_value: Number(payload.lotArea || 0),
    lot_area_unit: String(payload.lotAreaUnit || "acres").toLowerCase() === "acres" ? "acres" : "sqft",
    taxes_annual: Number(payload.taxes || 0),
    listing_brokerage: String(payload.listingBrokerage || ""),
    mls_number: String(payload.mlsNumber || ""),
    thumbnail: String(payload.thumbnail || ""),
    gallery,
    homepage_featured: !!payload.homepageFeatured,
    ranch_estate_featured: !!payload.ranchEstateFeatured,
  };

  const { data, error } = await auth.db
    .from("listings")
    .insert(insertPayload as never)
    .select("*")
    .single();

  if (!error) return NextResponse.json(data, { status: 201 });
  if (!shouldRetryWithoutOptionalCmsColumns(error)) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    thumbnail: _thumbnail,
    homepage_featured: _homepage_featured,
    ranch_estate_featured: _ranch_estate_featured,
    ...legacyInsertPayload
  } = insertPayload;

  const { data: legacyData, error: legacyError } = await auth.db
    .from("listings")
    .insert(legacyInsertPayload as never)
    .select("*")
    .single();

  if (legacyError) {
    return NextResponse.json({ error: legacyError.message }, { status: 500 });
  }
  return NextResponse.json(legacyData, { status: 201 });
}
