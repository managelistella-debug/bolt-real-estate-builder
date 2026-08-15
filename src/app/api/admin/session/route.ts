import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/admin/auth";

export async function GET(req: NextRequest) {
  const authenticated = await getSessionFromRequest(req);
  return NextResponse.json({ authenticated });
}
