import { NextRequest, NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/aspen/api-auth";
import { getTenantId } from "@/lib/aspen/tenant";
import { wordPressAdminRouteBlocked } from "@/lib/wordpress/adminRouteGuard";

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

function shouldRetryWithoutOptionalColumns(error: unknown) {
  return (
    isMissingColumnInSchemaCache(error, "display_context") ||
    isMissingColumnInSchemaCache(error, "is_published")
  );
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const blocked = wordPressAdminRouteBlocked();
  if (blocked) return blocked;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const { id } = await context.params;

  const { data, error } = await auth.db
    .from("testimonials")
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
  const blocked = wordPressAdminRouteBlocked();
  if (blocked) return blocked;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const { id } = await context.params;
  const payload = await request.json();

  const updatePayload = {
    quote: payload.quote,
    author_name: payload.author,
    author_title: null,
    rating: Number(payload.rating || 5),
    display_context: payload.displayContext || "both",
    is_published: !!payload.isPublished,
    sort_order: Number(payload.sortOrder || 0),
  };

  const { data, error } = await auth.db
    .from("testimonials")
    .update(updatePayload as never)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select("*")
    .single();

  if (!error) return NextResponse.json(data);
  if (!shouldRetryWithoutOptionalColumns(error)) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    display_context: _dc,
    is_published: _ip,
    ...legacyPayload
  } = updatePayload;

  const { data: legacyData, error: legacyError } = await auth.db
    .from("testimonials")
    .update(legacyPayload as never)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select("*")
    .single();

  if (legacyError) {
    return NextResponse.json({ error: legacyError.message }, { status: 500 });
  }
  return NextResponse.json(legacyData);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const blocked = wordPressAdminRouteBlocked();
  if (blocked) return blocked;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const { id } = await context.params;
  const payload = await request.json();

  const updates: Record<string, unknown> = {};
  if ("isPublished" in payload) {
    updates.is_published = !!payload.isPublished;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 400 });
  }

  const { data, error } = await auth.db
    .from("testimonials")
    .update(updates as never)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select("*")
    .single();

  if (!error) return NextResponse.json(data);
  if (!shouldRetryWithoutOptionalColumns(error)) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireRouteUser();
  if (!auth.ok) return auth.response;
  const blocked = wordPressAdminRouteBlocked();
  if (blocked) return blocked;
  const tenantId = getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is required." }, { status: 500 });
  }
  const { id } = await context.params;

  const { error } = await auth.db
    .from("testimonials")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
