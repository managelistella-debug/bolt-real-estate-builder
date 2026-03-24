import type { Testimonial } from "./testimonials.types";
import { fetchWpTestimonialsRaw } from "../wordpress/client";
import { mapWpTestimonialToTestimonial } from "../wordpress/mappers";
import { getWordPressBaseUrl } from "../wordpress/env";

export type { Testimonial } from "./testimonials.types";

async function fetchTestimonialsFromWordPress(): Promise<Testimonial[]> {
  if (!getWordPressBaseUrl()) return [];
  try {
    const raw = await fetchWpTestimonialsRaw();
    return raw.map(mapWpTestimonialToTestimonial);
  } catch {
    return [];
  }
}

async function getResolvedTestimonials(): Promise<Testimonial[]> {
  if (!getWordPressBaseUrl()) return [...fallbackTestimonials];
  return fetchTestimonialsFromWordPress();
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return getResolvedTestimonials();
}

export async function getHomeTestimonials(): Promise<Testimonial[]> {
  const items = await getResolvedTestimonials();
  return items.filter(
    (item) => item.displayContext === "home" || item.displayContext === "both"
  );
}

export async function getAboutTestimonials(): Promise<Testimonial[]> {
  const items = await getResolvedTestimonials();
  return items.filter(
    (item) => item.displayContext === "about" || item.displayContext === "both"
  );
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "We recently worked with Aspen to purchase a recreational RV lot, and the experience was absolutely fantastic. Aspen was knowledgeable, responsive, and incredibly helpful throughout the entire process.",
    author: "Patti Lang",
    rating: 5,
    displayContext: "both",
    sortOrder: 1,
  },
  {
    id: "t2",
    quote:
      "Aspen made the entire process of selling our family ranch seamless and stress-free. Her understanding of the rural Alberta market is unmatched.",
    author: "Brayden & Kayla M.",
    rating: 5,
    displayContext: "both",
    sortOrder: 2,
  },
  {
    id: "t3",
    quote:
      "Working with Aspen was a game-changer for us. As first-time acreage buyers, we had a lot of questions and concerns. Aspen guided us through every step.",
    author: "Mark & Jennifer H.",
    rating: 5,
    displayContext: "both",
    sortOrder: 3,
  },
];
