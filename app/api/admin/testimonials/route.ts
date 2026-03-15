import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/aspen/api-auth";
import { getTenantId } from "@/lib/aspen/tenant";

export async function GET() {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }

  const { data, error } = await auth.db
    .from("testimonials")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const payload = await request.json();

  const quote = String(payload.quote || "").trim();
  const author = String(payload.author || "").trim();
  if (!quote || !author) {
    return NextResponse.json({ error: "Quote and author are required." }, { status: 400 });
  }

  const testimonialId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `testimonial_${crypto.randomUUID()}`
      : `testimonial_${Date.now()}`;

  const insertPayload = {
    id: testimonialId,
    tenant_id: tenantId,
    user_id: auth.user.id,
    quote,
    author_name: author,
    author_title: null,
    rating: Number(payload.rating || 5),
    display_context: payload.displayContext || "both",
    is_published: payload.isPublished !== false,
    sort_order: Number(payload.sortOrder || 0),
  };

  const { data, error } = await auth.db
    .from("testimonials")
    .insert(insertPayload as never)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
