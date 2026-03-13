"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  LayoutDashboard,
  Building2,
  FileText,
  MessageSquareQuote,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/listings", label: "Listings", icon: Building2 },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
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
    <div
      className="flex h-full w-64 flex-col border-r border-[#EBEBEB] bg-white"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <div className="flex h-14 items-center border-b border-[#EBEBEB] px-5">
        <h1 className="text-[15px] font-medium tracking-tight text-black">
          Aspen CMS
        </h1>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                isActive
                  ? "bg-[#DAFF07] text-black"
                  : "text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#EBEBEB] p-4">
        <button
          type="button"
          onClick={signOut}
          className="flex h-[30px] w-full items-center justify-center gap-2 rounded-lg border border-[#EBEBEB] bg-white text-[13px] text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
