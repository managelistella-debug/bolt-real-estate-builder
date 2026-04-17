import type { Testimonial } from "./testimonials.types";

export type { Testimonial } from "./testimonials.types";

/** Curated testimonials baked into the site (not loaded from WordPress or Supabase). */
const HARDCODED_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Aspen Muraski was absolutely incredible to work with she helped us buy our farm. From the very beginning, we connected right away she's down-to-earth, genuine, and truly easy to talk to. What stood out the most was her diligence and attention to detail. She goes above and beyond to make sure everything is done properly and that all the ducks are in a row. At every step, I felt supported and confident because she was always one step ahead. Aspen genuinely cares about her clients and it shows. She is not just there for the commission she is there for you. I would recommend her to anyone without hesitation.",
    author: "Kayla Jackson",
    rating: 5,
    displayContext: "both",
    sortOrder: 1,
  },
  {
    id: "t2",
    quote:
      "Working with Aspen was an absolute pleasure! Quick, responsive, great to work with. Highly recommend working with Aspen for your real estate needs!",
    author: "Kim & Ivy Mathison",
    rating: 5,
    displayContext: "both",
    sortOrder: 2,
  },
  {
    id: "t3",
    quote:
      "We recently worked with Aspen to purchase a recreational RV lot, and the experience was absolutely fantastic. Aspen was knowledgeable, responsive, and incredibly helpful throughout the entire process. Her knowledge of the RV resort made a big difference—she helped us navigate all the little details that come with buying an RV lot. Aspen was always available to answer questions and made sure everything was handled efficiently and professionally. Thanks to Aspen, we now have the perfect spot to relax and enjoy the outdoors. We couldn't be happier and highly recommend her to anyone looking for a reliable and experienced realtor in the Sundre area!",
    author: "Patti Lang",
    rating: 5,
    displayContext: "both",
    sortOrder: 3,
  },
  {
    id: "t4",
    quote:
      "Aspen was a great realtor for us. Cheerful, a mover and shaker, she gets it done. Working with Aspen was a real pleasure. We would highly recommend Aspen for your real estate agent. Very thorough and professional.",
    author: "Vince Cooper",
    rating: 5,
    displayContext: "both",
    sortOrder: 4,
  },
  {
    id: "t5",
    quote:
      "It was a pleasure working with Aspen as we were selling our property. She communicated with us every step of the way so we always knew the plan, and worked so hard to sell it for us. Would highly recommend Aspen for your realty needs, a real go getter!! You won't be disappointed. Thanks again Aspen for all your hard work.",
    author: "Brenda Price",
    rating: 5,
    displayContext: "both",
    sortOrder: 5,
  },
  {
    id: "t6",
    quote:
      "Aspen was highly responsive and addressed all our questions promptly. We thoroughly enjoyed working with her and would enthusiastically recommend her to any prospective buyers.",
    author: "Joy Quiring",
    rating: 5,
    displayContext: "both",
    sortOrder: 6,
  },
  {
    id: "t7",
    quote:
      "Aspen is lovely! She's friendly, and has a very warm & inviting personality. She listens to your concerns and provides thorough recommendations. I would highly recommend her!",
    author: "Karen Nielsen",
    rating: 5,
    displayContext: "both",
    sortOrder: 7,
  },
];

function sortedCopy(): Testimonial[] {
  return [...HARDCODED_TESTIMONIALS].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return sortedCopy();
}

export async function getHomeTestimonials(): Promise<Testimonial[]> {
  return sortedCopy().filter(
    (item) => item.displayContext === "home" || item.displayContext === "both"
  );
}

export async function getAboutTestimonials(): Promise<Testimonial[]> {
  return sortedCopy().filter(
    (item) => item.displayContext === "about" || item.displayContext === "both"
  );
}
