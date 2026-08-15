import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromRequest } from "./auth";

/** Returns a 401 response if unauthenticated, otherwise null (caller should `return` it if non-null). */
export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  const authenticated = await getSessionFromRequest(req);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
