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
    .from("testimonials")
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
    quote: payload.quote,
    author: payload.author,
    rating: Number(payload.rating || 5),
    display_context: payload.displayContext || "both",
    is_published: !!payload.isPublished,
    sort_order: Number(payload.sortOrder || 0),
  };

  const { data, error } = await auth.supabase
    .from("testimonials")
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

  const { error } = await auth.supabase.from("testimonials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
