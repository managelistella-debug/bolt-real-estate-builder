"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Listings", href: "/admin/listings" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Blog Posts", href: "/admin/blog" },
  { label: "Categories", href: "/admin/blog/categories" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#09312a]" style={{ fontFamily: "'Lato', sans-serif" }}>
      <div className="flex flex-col md:flex-row">
        <aside className="md:w-[220px] shrink-0 border-b md:border-b-0 md:border-r border-white/10 p-5 md:min-h-screen">
          <h1 className="font-heading gold-gradient-text text-[20px] mb-1" style={{ fontWeight: 400 }}>
            Aspen Muraski
          </h1>
          <p className="text-white/40 text-[12px] mb-6">Admin</p>
          <nav className="flex md:flex-col gap-1 flex-wrap">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-[14px] rounded transition-colors ${
                    active ? "gold-gradient-bg text-[#09312a] font-semibold" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={handleLogout}
            className="mt-6 text-white/50 hover:text-white text-[13px] transition-colors"
          >
            Log out
          </button>
        </aside>

        <main className="flex-1 p-5 md:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
