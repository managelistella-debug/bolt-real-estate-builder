import type { SanityClient } from "@sanity/client";

export function numOrUndefined(v: unknown): number | undefined {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Normalises a date input to a bare `YYYY-MM-DD` string. Anything blank or
 * malformed becomes undefined, which clears the field rather than storing junk
 * that would corrupt listing order.
 */
export function isoDateOrUndefined(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined;
  return Number.isNaN(Date.parse(trimmed)) ? undefined : trimmed;
}

/** Ensures every object in an array has a `_key`, required by Sanity for array-of-object fields. */
export function withArrayKeys<T extends Record<string, unknown>>(
  items: T[]
): (T & { _key: string })[] {
  return items.map((item, i) => ({
    _key:
      typeof item._key === "string" && item._key
        ? item._key
        : `k-${Date.now().toString(36)}-${i}-${Math.random().toString(36).slice(2, 8)}`,
    ...item,
  }));
}

/**
 * Finds a slug that doesn't collide with an existing document of `docType`
 * (excluding `excludeId`, for edits), appending `-2`, `-3`, ... as needed.
 * Closes a known gap in the reference architecture, which had no
 * slug-uniqueness check at all.
 */
export async function ensureUniqueSlug(
  client: SanityClient,
  docType: string,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let candidate = baseSlug || "untitled";
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existingId = await client.fetch<string | null>(
      `*[_type == $docType && slug.current == $slug && _id != $excludeId][0]._id`,
      { docType, slug: candidate, excludeId: excludeId || "" }
    );
    if (!existingId) return candidate;
    n += 1;
    candidate = `${baseSlug}-${n}`;
  }
}

/** Strips fields Sanity rejects/ignores on write, and normalizes a stray string slug. */
export function sanitizePatch(body: Record<string, unknown>): Record<string, unknown> {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = body;
  if (typeof rest.slug === "string") {
    rest.slug = { _type: "slug", current: rest.slug };
  }
  return rest;
}
