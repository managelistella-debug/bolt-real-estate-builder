import Link from "next/link";

const CARDS = [
  { label: "Listings", href: "/admin/listings", description: "Active, sold, acreage & recreational properties" },
  { label: "Testimonials", href: "/admin/testimonials", description: "Client reviews shown on Home and About" },
  { label: "Blog Posts", href: "/admin/blog", description: "Articles, drafts, and publishing" },
  { label: "Categories", href: "/admin/blog/categories", description: "Blog category management" },
];

export default function AdminHomePage() {
  return (
    <div>
      <h2 className="font-heading text-white text-[24px] mb-6" style={{ fontWeight: 400 }}>
        Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[640px]">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block border border-white/10 hover:border-[#daaf3a]/60 p-5 transition-colors"
          >
            <h3 className="text-white font-semibold text-[16px] mb-1">{card.label}</h3>
            <p className="text-white/50 text-[13px]">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
