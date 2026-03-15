"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const inputClass =
  "h-[40px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] pl-10 pr-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      const nextPath =
        new URLSearchParams(window.location.search).get("next") ||
        "/admin/dashboard";
      router.push(nextPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#131212] to-[#393939]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Decorative accent */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#DAFF07]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#DAFF07]/5 blur-[100px]" />

      <section className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#DAFF07]">
            Welcome Back
          </span>
          <h2 className="mt-2 text-[20px] font-medium text-black">
            Sign in to your account
          </h2>
          <p className="mt-1 text-[13px] text-[#888C99]">
            Manage your listings and testimonials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] text-[#888C99]">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CCCCCC]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                disabled={loading}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] text-[#888C99]">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CCCCCC]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                className={inputClass}
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-[12px] text-red-500">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-[40px] w-full items-center justify-center gap-2 rounded-lg bg-[#DAFF07] text-[13px] font-medium text-black transition-colors hover:bg-[#C8ED00] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </section>
    </div>
  );
}
