'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Header } from '@/components/layout/header';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Unable to change password',
          description: payload?.error || 'Please try again.',
        });
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: 'Password updated',
        description: 'Your CMS password has been changed.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong while saving.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Settings" description="Update your CMS login password." />
      </div>

      <div className="p-4 sm:p-6">
        <div className="max-w-xl rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="mb-1 text-[15px] font-medium text-black">Change Password</h2>
          <p className="mb-4 text-[13px] text-[#888C99]">
            This updates the single CMS login password used for your account.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-[13px] text-[#888C99]">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-[40px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                disabled={isSaving}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] text-[#888C99]">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-[40px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                disabled={isSaving}
                minLength={8}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] text-[#888C99]">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-[40px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                disabled={isSaving}
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-[40px] items-center justify-center rounded-lg bg-[#DAFF07] px-4 text-[13px] font-medium text-black hover:bg-[#C8ED00] disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
