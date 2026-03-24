import type { Listing } from "./listing.types";

/** Single field: ACF text as-is; numbers use locale formatting. */
export function formatAreaField(v: number | string | undefined | null): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") return v.trim() || "—";
  return v.toLocaleString();
}

/** Living area: show ACF text as-is (e.g. "1,053"); legacy numeric uses locale formatting. */
export function formatLivingArea(listing: Listing): string {
  return formatAreaField(listing.livingArea);
}

/** Lot size: same idea — "NA" and text preserved when string. */
export function formatLotAreaValue(listing: Listing): string {
  return formatAreaField(listing.lotArea);
}

/** Schema.org / JSON-LD expects a number when possible. */
export function livingAreaNumericForSchema(listing: Listing): number | undefined {
  const v = listing.livingArea;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v).replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/** Omit ambiguous values like "1 + 1" for structured data. */
export function bathroomsNumericForSchema(bathrooms: string): number | undefined {
  const raw = bathrooms.trim();
  if (!raw || raw.includes("+")) return undefined;
  const n = parseFloat(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}
