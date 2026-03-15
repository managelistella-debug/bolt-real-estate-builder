import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/aspen/api-auth";
import { getTenantId } from "@/lib/aspen/tenant";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const { id } = await context.params;

  const { data, error } = await auth.db
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const { id } = await context.params;
  const payload = await request.json();

  const listingStatus =
    payload.listingStatus === "sold"
      ? "sold"
      : payload.listingStatus === "pending"
        ? "pending"
        : "for_sale";

  const gallery = Array.isArray(payload.gallery)
    ? payload.gallery.map((url: string, index: number) => ({ url, order: index }))
    : [];

  const updatePayload = {
    slug: payload.slug,
    address: payload.address,
    description: payload.description,
    list_price: payload.listPrice,
    listing_status: listingStatus,
    representation: payload.representation || null,
    neighborhood: payload.neighborhood,
    city: payload.city,
    bedrooms: payload.bedrooms,
    bathrooms: payload.bathrooms,
    property_type: payload.propertyType,
    year_built: payload.yearBuilt,
    living_area_sqft: payload.livingArea,
    lot_area_value: payload.lotArea,
    lot_area_unit: String(payload.lotAreaUnit || "acres").toLowerCase() === "acres" ? "acres" : "sqft",
    taxes_annual: payload.taxes,
    listing_brokerage: payload.listingBrokerage,
    mls_number: payload.mlsNumber,
    thumbnail: payload.thumbnail,
    gallery,
    homepage_featured: !!payload.homepageFeatured,
    ranch_estate_featured: !!payload.ranchEstateFeatured,
  };

  const { data, error } = await auth.db
    .from("listings")
    .update(updatePayload as never)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const { id } = await context.params;

  const { error } = await auth.db
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
