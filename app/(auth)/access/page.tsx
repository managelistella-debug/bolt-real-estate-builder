'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';

const inputClass =
  'h-[40px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

export default function AccessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          password: normalizedPassword,
        }),
      });

      const loginJson = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok || !loginJson?.user?.id) {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description:
            loginJson?.error || 'Invalid email or password.',
        });
        return;
      }

      const profileRes = await fetch(`/api/auth/profile?userId=${loginJson.user.id}`);
      const profile = profileRes.ok ? await profileRes.json() : null;

      const hydratedUser = {
        id: loginJson.user.id as string,
        email: (loginJson.user.email || normalizedEmail) as string,
        name: (profile?.name || normalizedEmail.split('@')[0]) as string,
        role: (profile?.role || 'business_user') as 'super_admin' | 'internal_admin' | 'business_user',
        createdAt: new Date(profile?.created_at || Date.now()),
        businessId: profile?.business_id ?? undefined,
        lastLoginAt: new Date(),
        permissions: profile?.permissions ?? undefined,
      };

      useAuthStore.setState({
        user: hydratedUser,
        actorUser: hydratedUser,
        isAuthenticated: true,
        isImpersonating: false,
      });

      toast({ title: 'Welcome back!', description: 'Signed in successfully.' });
      router.push('/dashboard');
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not sign in. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#131212] to-[#393939] px-6"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-2xl md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#DAFF07]">Direct Access</p>
        <h1 className="mt-2 text-[20px] font-medium text-black">Sign in</h1>
        <p className="mt-1 text-[13px] text-[#888C99]">
          This route bypasses old cached login bundles.
        </p>

        <form onSubmit={handleLogin} className="mt-5 space-y-3">
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            disabled={isLoading}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="flex h-[40px] w-full items-center justify-center gap-2 rounded-lg bg-[#DAFF07] text-[13px] font-medium text-black transition-colors hover:bg-[#C8ED00] disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-4 text-center text-[13px] text-[#888C99]">
          Need an account?{' '}
          <Link href="/register" className="font-medium text-black hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
