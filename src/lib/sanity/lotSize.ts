import { SQFT_PER_ACRE, type LotSizeUnit } from "./types";

/** Convert a value entered in `unit` into the canonical sqft value stored on the document. */
export function toCanonicalSqft(value: number, unit: LotSizeUnit): number {
  return unit === "acres" ? value * SQFT_PER_ACRE : value;
}

/** Convert the canonical sqft value back into `unit` for display/editing. */
export function fromCanonicalSqft(sqft: number, unit: LotSizeUnit): number {
  return unit === "acres" ? sqft / SQFT_PER_ACRE : sqft;
}

export function formatLotSize(sqft: number | undefined, unit: LotSizeUnit | undefined): string {
  if (!sqft) return "";
  const displayUnit = unit || "sqft";
  const value = fromCanonicalSqft(sqft, displayUnit);
  const rounded = displayUnit === "acres" ? Math.round(value * 100) / 100 : Math.round(value);
  const label = displayUnit === "acres" ? "acres" : "sq ft";
  return `${rounded.toLocaleString()} ${label}`;
}
