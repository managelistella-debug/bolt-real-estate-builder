import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin/requireAuth";
import { getSanityWriteClient } from "@/lib/sanity/client";

export async function POST(req: NextRequest) {
  const unauthorized = await requireAuth(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const { filename, contentType, data } = body as {
    filename?: string;
    contentType?: string;
    data?: string;
  };
  if (!data) {
    return NextResponse.json({ error: "Missing image data." }, { status: 400 });
  }

  const buffer = Buffer.from(data, "base64");
  const client = getSanityWriteClient();
  const asset = await client.assets.upload("image", buffer, {
    filename: filename || "upload.jpg",
    contentType: contentType || "image/jpeg",
  });

  return NextResponse.json({
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
  });
}
