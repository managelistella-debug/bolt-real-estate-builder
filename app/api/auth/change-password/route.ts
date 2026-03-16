import { NextRequest, NextResponse } from "next/server";
import { changeCmsPassword, getCmsSessionUserFromCookies } from "@/lib/server/cmsAuth";

export async function POST(req: NextRequest) {
  const sessionUser = await getCmsSessionUserFromCookies();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const currentPassword = String(body?.currentPassword ?? "");
  const newPassword = String(body?.newPassword ?? "");
  const confirmPassword = String(body?.confirmPassword ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json(
      { error: "Current password, new password, and confirmation are required." },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { error: "New password and confirmation do not match." },
      { status: 400 }
    );
  }

  const changed = await changeCmsPassword(currentPassword, newPassword);
  if (!changed.ok) {
    return NextResponse.json({ error: changed.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
