'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';
import { loginSchema } from '@/lib/validation/schemas';
import { createClient } from '@/lib/supabase/client';

type LoginFormData = z.infer<typeof loginSchema>;

const inputClass = 'h-[40px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] pl-10 pr-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

const useSupabaseAuth = typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const normalizedEmail = data.email.trim().toLowerCase();
      const normalizedPassword = data.password.trim();

      if (useSupabaseAuth) {
        const supabase = createClient();
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: normalizedPassword,
        });
        if (error) {
          toast({ variant: 'destructive', title: 'Login failed', description: error.message });
          setIsLoading(false);
          return;
        }
        const user = authData.user;
        if (!user) {
          toast({ variant: 'destructive', title: 'Login failed', description: 'Could not retrieve user.' });
          setIsLoading(false);
          return;
        }
        const profileRes = await fetch(`/api/auth/profile?userId=${encodeURIComponent(user.id)}`);
        const profile = profileRes.ok ? await profileRes.json() : null;
        useAuthStore.setState({
          user: {
            id: user.id,
            email: user.email || normalizedEmail,
            name: profile?.name || normalizedEmail.split('@')[0],
            role: profile?.role || 'business_user',
            createdAt: new Date(profile?.created_at || Date.now()),
            businessId: profile?.business_id ?? undefined,
            lastLoginAt: new Date(),
            permissions: profile?.permissions ?? undefined,
          },
          actorUser: {
            id: user.id,
            email: user.email || normalizedEmail,
            name: profile?.name || normalizedEmail.split('@')[0],
            role: profile?.role || 'business_user',
            createdAt: new Date(profile?.created_at || Date.now()),
            businessId: profile?.business_id ?? undefined,
            lastLoginAt: new Date(),
            permissions: profile?.permissions ?? undefined,
          },
          isAuthenticated: true,
          isImpersonating: false,
        });
        toast({ title: 'Welcome back!', description: "You've successfully logged in." });
        const nextPath = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('next') : null;
        router.push(nextPath || '/account/dashboard');
        router.refresh();
        return;
      }

      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
      });
      if (!loginRes.ok) {
        const err = await loginRes.json().catch(() => ({}));
        toast({ variant: 'destructive', title: 'Login failed', description: err.error || 'Invalid email or password.' });
        setIsLoading(false);
        return;
      }
      const loginData = await loginRes.json();
      const userId = loginData.user?.id;
      if (!userId) {
        toast({ variant: 'destructive', title: 'Login failed', description: 'Could not retrieve user.' });
        setIsLoading(false);
        return;
      }
      const profileRes = await fetch(`/api/auth/profile?userId=${encodeURIComponent(userId)}`);
      const profile = profileRes.ok ? await profileRes.json() : null;
      useAuthStore.setState({
        user: {
          id: userId,
          email: loginData.user.email || normalizedEmail,
          name: profile?.name || normalizedEmail.split('@')[0],
          role: profile?.role || 'business_user',
          createdAt: new Date(profile?.created_at || Date.now()),
          businessId: profile?.business_id ?? undefined,
          lastLoginAt: new Date(),
          permissions: profile?.permissions ?? undefined,
        },
        actorUser: {
          id: userId,
          email: loginData.user.email || normalizedEmail,
          name: profile?.name || normalizedEmail.split('@')[0],
          role: profile?.role || 'business_user',
          createdAt: new Date(profile?.created_at || Date.now()),
          businessId: profile?.business_id ?? undefined,
          lastLoginAt: new Date(),
          permissions: profile?.permissions ?? undefined,
        },
        isAuthenticated: true,
        isImpersonating: false,
      });
      toast({ title: 'Welcome back!', description: "You've successfully logged in." });
      router.push('/account/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#131212] to-[#393939]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      {/* Decorative accent */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#DAFF07]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#DAFF07]/5 blur-[100px]" />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        {/* Left panel */}
        <section className="hidden md:block">
          <span className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-white/50">
            Real Estate CMS Platform
          </span>
          <h1 className="max-w-lg text-[32px] font-medium leading-tight text-white">
            Manage listings, content, and client websites from one control center.
          </h1>
          <p className="mt-4 max-w-lg text-[13px] leading-6 text-white/40">
            Built for agency teams running multiple tenant websites with centralized publishing and modern design control.
          </p>
          <div className="mt-10 space-y-2">
            {['Multi-tenant content management', 'Static performance with SEO-first pages', 'Domain and integration controls'].map((item) => (
              <div key={item} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] text-white/60">
                <div className="h-1.5 w-1.5 rounded-full bg-[#DAFF07]" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Right panel – login form */}
        <section className="w-full rounded-2xl border border-white/10 bg-white p-6 shadow-2xl md:p-8">
          <div className="mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#DAFF07]">Welcome Back</span>
            <h2 className="mt-2 text-[20px] font-medium text-black">Sign in to your account</h2>
            <p className="mt-1 text-[13px] text-[#888C99]">Use your workspace credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CCCCCC]" />
                <input id="email" type="email" placeholder="name@company.com" {...register('email')} disabled={isLoading} className={inputClass} />
              </div>
              {errors.email && <p className="text-[12px] text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CCCCCC]" />
                <input id="password" type="password" placeholder="Enter your password" {...register('password')} disabled={isLoading} className={inputClass} />
              </div>
              {errors.password && <p className="text-[12px] text-red-500">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="flex h-[40px] w-full items-center justify-center gap-2 rounded-lg bg-[#DAFF07] text-[13px] font-medium text-black transition-colors hover:bg-[#C8ED00] disabled:opacity-50">
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

        </section>
      </div>
    </div>
  );
}
