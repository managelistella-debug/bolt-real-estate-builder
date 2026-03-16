import { NextRequest, NextResponse } from "next/server";
import { getCmsAuthIdentity } from "@/lib/server/cmsAuth";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const identity = await getCmsAuthIdentity();
  if (userId !== identity.userId) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: identity.userId,
    email: identity.email,
    name: "Aspen Admin",
    role: identity.role,
    business_id: "aspen",
    created_at: new Date(0).toISOString(),
  });
}
