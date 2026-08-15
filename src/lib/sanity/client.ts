import { createClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.SANITY_API_VERSION || "2025-02-19";

/** Public, read-only client. No token — used for all frontend/public queries. */
export const sanityReadClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Authenticated write client. Only ever imported from `/api/admin/*` route
 * handlers — never from a client component or public page.
 */
export function getSanityWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    throw new Error("SANITY_WRITE_TOKEN is not configured.");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "raw",
  });
}
