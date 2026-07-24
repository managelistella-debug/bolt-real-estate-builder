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
  {
    id: "t8",
    quote:
      "We found Aspen to be a great real estate agent, She was very easy to visit with and was very knowledgeable of the Sundre area. We can recommend her to anyone looking for a property in Sundre.",
    author: "Trevor Williams",
    rating: 5,
    displayContext: "both",
    sortOrder: 8,
  },
  {
    id: "t9",
    quote:
      "If you're looking for a realtor who's equal parts kind-hearted, hardworking, and completely authentic, look no further than Aspen Muraski. She is incredibly responsive, always willing to go the extra mile, and somehow manages to make what could be a stressful process feel easy and enjoyable. She genuinely cares about her clients and treats people with warmth, patience, and respect. One of the things I appreciated most was that she never felt like a salesperson. She felt like someone who was truly in my corner, helping me make the best decisions for me. She's professional, knowledgeable, funny, a little quirky in the best possible way, and just an all-around wonderful human being. Buying a home is a big deal, and having someone you trust makes all the difference. By the end of the process, I felt like I had gained a friend. I would recommend her to anyone without hesitation.",
    author: "Jocelyn Waggoner",
    rating: 5,
    displayContext: "both",
    sortOrder: 9,
  },
  {
    id: "t10",
    quote:
      "Aspen worked very hard behind the scene to sell our property. We would definitely work with her again and would recommend her to others.",
    author: "Valerie Hall",
    rating: 5,
    displayContext: "both",
    sortOrder: 10,
  },
  {
    id: "t11",
    quote:
      "Aspen Muraski was knowledgeable, friendly, easy going, and super responsive. Zero communication issues. We would use her again and highly recommend.",
    author: "Jennifer Watson",
    rating: 5,
    displayContext: "both",
    sortOrder: 11,
  },
  {
    id: "t12",
    quote:
      "Very helpful. I wanted a fast closing and Aspen made it happen. I would definitely recommend her as an agent",
    author: "Mike Roberts",
    rating: 5,
    displayContext: "both",
    sortOrder: 12,
  },
  {
    id: "t13",
    quote:
      "Excellent support and all tasks were completed in a timely manner. Aspen made the whole process seamless and I would recommend her to my friends and family.",
    author: "M L",
    rating: 4.5,
    displayContext: "both",
    sortOrder: 13,
  },
  {
    id: "t14",
    quote:
      "Aspen was really good to deal with and she took alot of time and effort gathering information about my listing which I am certain helped getting the sale. She always replied to any concerns I had immeddiately which is getting harder to find people that have that quality these days. Very happy with the deal she closed for me. Thanks Aspen your the best",
    author: "Keith Silzer",
    rating: 5,
    displayContext: "both",
    sortOrder: 14,
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
