import { fetchTestimonials } from "./sanity/queries";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
}

/** Same records power both the homepage and About page sliders, per design. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const testimonials = await fetchTestimonials();
  return testimonials.map((t) => ({
    id: t._id,
    quote: t.quote,
    author: t.name,
  }));
}
