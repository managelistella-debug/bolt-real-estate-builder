"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Incorrect password.");
      }
      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09312a] flex items-center justify-center px-5">
      <div className="w-full max-w-[380px]">
        <h1
          className="font-heading text-[28px] text-center gold-gradient-text mb-1"
          style={{ fontWeight: 400 }}
        >
          Aspen Muraski
        </h1>
        <p className="text-center text-white/50 text-[13px] mb-8" style={{ fontFamily: "'Lato', sans-serif" }}>
          Admin Login
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-[rgba(17,61,53,0.4)] border border-[#daaf3a]/70 px-4 py-3 text-white text-[15px] placeholder:text-white/40 outline-none focus:border-[#daaf3a]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          />
          {error && (
            <p className="text-red-400 text-[13px]" style={{ fontFamily: "'Lato', sans-serif" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="gold-gradient-bg h-[46px] text-[#09312a] font-semibold text-[14px] tracking-wider disabled:opacity-50 mt-2"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
