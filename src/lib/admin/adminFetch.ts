"use client";

/** Wraps every admin API call: on 401, bounce back to /admin/login. */
export async function adminFetch(input: string, init?: RequestInit) {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error("Unauthorized");
  }
  return res;
}

export async function adminJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await adminFetch(input, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body as T;
}

/** Client-side resize + compress before upload, matching the reference architecture's flow. */
export async function compressImage(file: File, maxDimension = 2400, quality = 0.82): Promise<{ data: string; contentType: string; filename: string }> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  if (width > maxDimension || height > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Compression failed"))), "image/jpeg", quality)
  );
  const data = await blobToBase64(blob);
  return { data, contentType: "image/jpeg", filename: file.name.replace(/\.[^.]+$/, "") + ".jpg" };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function uploadImage(file: File): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } }> {
  const { data, contentType, filename } = await compressImage(file);
  const res = await adminJson<{ image: { _type: "image"; asset: { _type: "reference"; _ref: string } } }>(
    "/api/admin/upload-image",
    { method: "POST", body: JSON.stringify({ filename, contentType, data }) }
  );
  return res.image;
}
