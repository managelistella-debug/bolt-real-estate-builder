import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/api-auth";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;

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

  const insertPayload = {
    slug,
    address,
    description: String(payload.description || ""),
    list_price: Number(payload.listPrice || 0),
    listing_status: payload.listingStatus || "active",
    representation: payload.representation || null,
    neighborhood: String(payload.neighborhood || ""),
    city,
    bedrooms: Number(payload.bedrooms || 0),
    bathrooms: Number(payload.bathrooms || 0),
    property_type: String(payload.propertyType || ""),
    year_built: Number(payload.yearBuilt || 0),
    living_area: Number(payload.livingArea || 0),
    lot_area: Number(payload.lotArea || 0),
    lot_area_unit: String(payload.lotAreaUnit || "acres"),
    taxes: Number(payload.taxes || 0),
    listing_brokerage: String(payload.listingBrokerage || ""),
    mls_number: String(payload.mlsNumber || ""),
    thumbnail: String(payload.thumbnail || ""),
    gallery: Array.isArray(payload.gallery) ? payload.gallery : [],
    homepage_featured: !!payload.homepageFeatured,
    ranch_estate_featured: !!payload.ranchEstateFeatured,
  };

  const { data, error } = await auth.supabase
    .from("listings")
    .insert(insertPayload as never)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
