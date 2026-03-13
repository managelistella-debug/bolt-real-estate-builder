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
    <div
      className="min-h-screen bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <div className="border-b border-[#EBEBEB] bg-white">
        <div className="px-6 py-3.5">
          <h1 className="text-[15px] font-medium text-black">Dashboard</h1>
          <p className="text-[13px] text-[#888C99]">
            Manage your Aspen website content
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-[#EBEBEB] bg-white p-5"
            >
              <p className="text-[13px] text-[#888C99]">{card.label}</p>
              <p className="mt-2 text-3xl font-medium text-black">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
