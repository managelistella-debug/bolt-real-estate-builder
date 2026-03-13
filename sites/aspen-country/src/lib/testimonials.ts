import { TestimonialRow } from "@/lib/supabase/database.types";
import { getSupabasePublicClient } from "@/lib/supabase/public";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  rating: number;
  displayContext: "home" | "about" | "both";
  sortOrder: number;
}

function mapTestimonialRow(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    author: row.author,
    rating: Number(row.rating || 5),
    displayContext: row.display_context,
    sortOrder: Number(row.sort_order || 0),
  };
}

async function fetchTestimonialsFromSupabase(): Promise<Testimonial[] | null> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) return null;
    if (!data || data.length === 0) return [];
    return data.map((row) => mapTestimonialRow(row as TestimonialRow));
  } catch {
    return null;
  }
}

async function getResolvedTestimonials(): Promise<Testimonial[]> {
  const remote = await fetchTestimonialsFromSupabase();
  if (remote && remote.length > 0) return remote;
  return [...fallbackTestimonials];
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
