'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';
import { registerSchema } from '@/lib/validation/schemas';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

type RegisterFormData = z.infer<typeof registerSchema>;

const inputClass = 'h-[40px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] pl-10 pr-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'business_user' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const success = await registerUser(data.email, data.password, data.name, data.role);
      if (success) {
        toast({ title: 'Account created!', description: 'Your account has been successfully created.' });
        router.push('/dashboard');
      } else {
        toast({ variant: 'destructive', title: 'Registration failed', description: 'An account with this email already exists.' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#131212] to-[#393939]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#DAFF07]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#DAFF07]/5 blur-[100px]" />

      <section className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#DAFF07]">Get Started</span>
          <h2 className="mt-2 text-[20px] font-medium text-black">Create an account</h2>
          <p className="mt-1 text-[13px] text-[#888C99]">Set up your workspace to manage listings and content.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] text-[#888C99]">Full Name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CCCCCC]" />
              <input type="text" placeholder="John Doe" {...register('name')} disabled={isLoading} className={inputClass} />
            </div>
            {errors.name && <p className="text-[12px] text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] text-[#888C99]">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CCCCCC]" />
              <input type="email" placeholder="john@example.com" {...register('email')} disabled={isLoading} className={inputClass} />
            </div>
            {errors.email && <p className="text-[12px] text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] text-[#888C99]">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CCCCCC]" />
              <input type="password" placeholder="••••••••" {...register('password')} disabled={isLoading} className={inputClass} />
            </div>
            {errors.password && <p className="text-[12px] text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] text-[#888C99]">Confirm Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#CCCCCC]" />
              <input type="password" placeholder="••••••••" {...register('confirmPassword')} disabled={isLoading} className={inputClass} />
            </div>
            {errors.confirmPassword && <p className="text-[12px] text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <input type="hidden" {...register('role')} value="business_user" />

          <button type="submit" disabled={isLoading} className="flex h-[40px] w-full items-center justify-center gap-2 rounded-lg bg-[#DAFF07] text-[13px] font-medium text-black transition-colors hover:bg-[#C8ED00] disabled:opacity-50">
            {isLoading ? 'Creating account...' : 'Create account'}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-5 text-center text-[13px]">
          <span className="text-[#888C99]">Already have an account? </span>
          <Link href="/login" className="font-medium text-black hover:underline">Sign in</Link>
        </div>
      </section>
    </div>
  );
}
