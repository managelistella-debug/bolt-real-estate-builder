"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
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
    <main className="min-h-screen bg-[#09312a] px-5 py-16">
      <div className="mx-auto w-full max-w-md rounded-lg border border-white/10 bg-[#0b3a30] p-7">
        <h1 className="font-heading text-3xl text-white" style={{ fontWeight: 400 }}>
          Aspen CMS Login
        </h1>
        <p className="mt-2 text-sm text-white/70">Sign in to manage listings, blogs, and testimonials.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-white/80">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-white/20 bg-[#06241d] px-3 py-2 text-white outline-none focus:border-[#daaf3a]"
            />
          </label>
          <label className="block text-sm text-white/80">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-white/20 bg-[#06241d] px-3 py-2 text-white outline-none focus:border-[#daaf3a]"
            />
          </label>

          {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="gold-gradient-bg w-full rounded-md px-4 py-2 text-sm font-semibold text-[#09312a] disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
