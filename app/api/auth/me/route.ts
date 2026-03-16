import { NextResponse } from "next/server";
import { getCmsSessionUserFromCookies } from "@/lib/server/cmsAuth";

export async function GET() {
  const user = await getCmsSessionUserFromCookies();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}
