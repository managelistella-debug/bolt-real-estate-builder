import { getAllListings } from "@/lib/listings";
import { getAllPosts } from "@/lib/blog";
import { getAllTestimonials } from "@/lib/testimonials";

export default async function AdminDashboardPage() {
  const [listings, posts, testimonials] = await Promise.all([
    getAllListings(),
    getAllPosts(),
    getAllTestimonials(),
  ]);

  const cards = [
    { label: "Listings", value: listings.length },
    { label: "Blog Posts", value: posts.length },
    { label: "Testimonials", value: testimonials.length },
  ];

  return (
    <div>
      <h1 className="font-heading text-4xl text-black" style={{ fontWeight: 400 }}>
        Dashboard
      </h1>
      <p className="mt-2 text-[#888C99]">Manage your Aspen website content.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#EBEBEB] bg-white p-5">
            <p className="text-sm text-[#888C99]">{card.label}</p>
            <p className="mt-2 text-3xl text-black">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
