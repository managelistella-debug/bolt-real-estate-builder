import { NextResponse } from "next/server";
import { getWordPressBaseUrl } from "./env";

/** When WordPress is the CMS, in-app Supabase admin writes are disabled. */
export function wordPressAdminRouteBlocked(): NextResponse | null {
  if (!getWordPressBaseUrl()) return null;
  return NextResponse.json(
    {
      error:
        "Content is managed in WordPress. Edit content in wp-admin, or remove WORDPRESS_BASE_URL to use the built-in database CMS.",
    },
    { status: 501 }
  );
}
