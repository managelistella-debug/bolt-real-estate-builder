import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageRef } from "./types";
import { dataset, projectId } from "./client";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(image: SanityImageRef | undefined | null) {
  if (!image?.asset?._ref) return null;
  return builder.image(image);
}

/** Convenience: image URL string at a given width, or null if no image. */
export function imageUrl(image: SanityImageRef | undefined | null, width?: number) {
  const b = urlForImage(image);
  if (!b) return null;
  return (width ? b.width(width) : b).auto("format").url();
}
