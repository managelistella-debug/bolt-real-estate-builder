import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;

  const { data, error } = await auth.supabase
    .from("listings")
    .select("*")
    .eq("id", id)
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
  const { id } = await context.params;
  const payload = await request.json();

  const updatePayload = {
    slug: payload.slug,
    address: payload.address,
    description: payload.description,
    list_price: payload.listPrice,
    listing_status: payload.listingStatus,
    representation: payload.representation || null,
    neighborhood: payload.neighborhood,
    city: payload.city,
    bedrooms: payload.bedrooms,
    bathrooms: payload.bathrooms,
    property_type: payload.propertyType,
    year_built: payload.yearBuilt,
    living_area: payload.livingArea,
    lot_area: payload.lotArea,
    lot_area_unit: payload.lotAreaUnit,
    taxes: payload.taxes,
    listing_brokerage: payload.listingBrokerage,
    mls_number: payload.mlsNumber,
    thumbnail: payload.thumbnail,
    gallery: Array.isArray(payload.gallery) ? payload.gallery : [],
    homepage_featured: !!payload.homepageFeatured,
    ranch_estate_featured: !!payload.ranchEstateFeatured,
  };

  const { data, error } = await auth.supabase
    .from("listings")
    .update(updatePayload as never)
    .eq("id", id)
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
  const { id } = await context.params;

  const { error } = await auth.supabase.from("listings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
