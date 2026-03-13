import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/api-auth";

export async function GET() {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const payload = await request.json();

  const quote = String(payload.quote || "").trim();
  const author = String(payload.author || "").trim();
  if (!quote || !author) {
    return NextResponse.json({ error: "Quote and author are required." }, { status: 400 });
  }

  const insertPayload = {
    quote,
    author,
    rating: Number(payload.rating || 5),
    display_context: payload.displayContext || "both",
    is_published: payload.isPublished !== false,
    sort_order: Number(payload.sortOrder || 0),
  };

  const { data, error } = await auth.supabase
    .from("testimonials")
    .insert(insertPayload as never)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
