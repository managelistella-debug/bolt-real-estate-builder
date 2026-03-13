"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/testimonials", label: "Testimonials" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-full max-w-[260px] border-r border-white/10 bg-[#07271f] p-5">
      <div className="mb-8">
        <p className="font-heading text-2xl text-white" style={{ fontWeight: 400 }}>
          Aspen CMS
        </p>
      </div>
      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                active ? "bg-[#daaf3a] text-[#09312a]" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={signOut}
        className="mt-10 w-full rounded-md border border-white/20 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
      >
        Log out
      </button>
    </aside>
  );
}
