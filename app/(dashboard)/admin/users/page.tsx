'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/lib/stores/auth';
import { useAuditLogStore } from '@/lib/stores/auditLog';
import { ActivityDrawer } from '@/components/admin/ActivityDrawer';
import { Search, KeyRound, ShieldCheck, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { SupportPermissions } from '@/lib/types';
import { DEFAULT_SUPPORT_PERMISSIONS } from '@/lib/types';

const inputCls = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

interface StaffProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  last_login_at: string | null;
  permissions: SupportPermissions | null;
}

export default function AdminStaffPage() {
  const { user } = useAuthStore();
  const { addEvent } = useAuditLogStore();
  const isSuperAdmin = user?.role === 'super_admin';

  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<StaffProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [permExpandedId, setPermExpandedId] = useState<string | null>(null);
  const [permSaving, setPermSaving] = useState(false);

  const [activityUserId, setActivityUserId] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data/users?role=admin');
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return staff.filter((s) => {
      if (!term) return true;
      return (
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.role.toLowerCase().includes(term)
      );
    });
  }, [staff, search]);

  const handleResetPassword = async () => {
    if (!resetTarget || !newPassword) return;
    setResetLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: resetTarget.id, newPassword }),
      });
      if (res.ok) {
        addEvent({
          type: 'password_reset',
          actorUserId: user?.id || '',
          targetUserId: resetTarget.id,
          metadata: { targetEmail: resetTarget.email },
        });
        setResetSuccess(true);
        setTimeout(() => {
          setResetDialogOpen(false);
          setResetSuccess(false);
          setNewPassword('');
          setResetTarget(null);
        }, 1500);
      }
    } catch { /* ignore */ }
    setResetLoading(false);
  };

  const handlePermissionToggle = async (profile: StaffProfile, key: keyof SupportPermissions) => {
    setPermSaving(true);
    const current = profile.permissions || DEFAULT_SUPPORT_PERMISSIONS;
    const updated = { ...current, [key]: !current[key] };

    try {
      const res = await fetch('/api/data/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, permissions: updated }),
      });
      if (res.ok) {
        addEvent({
          type: 'permissions_updated',
          actorUserId: user?.id || '',
          targetUserId: profile.id,
          metadata: { key, newValue: String(!current[key]) },
        });
        setStaff((prev) =>
          prev.map((s) => (s.id === profile.id ? { ...s, permissions: updated } : s))
        );
      }
    } catch { /* ignore */ }
    setPermSaving(false);
  };

  const permissionLabels: { key: keyof SupportPermissions; label: string }[] = [
    { key: 'canDeleteUsers', label: 'Can delete users' },
    { key: 'canResetPasswords', label: 'Can reset passwords' },
    { key: 'canManageIntegrations', label: 'Can manage integrations' },
    { key: 'canViewAllClients', label: 'Can view all clients' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Admin Staff" description="Manage admin and support team members, permissions, and credentials." />
      </div>

      <div className="space-y-4 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role"
            className={`${inputCls} pl-8`}
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-[#EBEBEB] bg-white p-8 text-center text-[13px] text-[#888C99]">
            Loading staff members...
          </div>
        ) : (
          <div className="divide-y divide-[#EBEBEB] rounded-xl border border-[#EBEBEB] bg-white">
            {rows.map((member) => {
              const isPermExpanded = permExpandedId === member.id;
              const perms = member.permissions || DEFAULT_SUPPORT_PERMISSIONS;

              return (
                <div key={member.id} className="p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-black">{member.name || member.email}</p>
                        {member.id === user?.id && (
                          <span className="rounded-full bg-[#DAFF07] px-2 py-0.5 text-[11px] text-black">You</span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#888C99]">{member.email}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] ${member.role === 'super_admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-[#DAFF07]/20 text-[#556000]'}`}>
                          {member.role === 'super_admin' ? 'Super Admin' : 'Support'}
                        </span>
                        {member.last_login_at && (
                          <span className="flex items-center gap-1 text-[11px] text-[#888C99]">
                            <Clock className="h-3 w-3" />
                            Last login: {new Date(member.last_login_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setResetTarget(member);
                          setResetDialogOpen(true);
                        }}
                        className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        Reset Password
                      </button>

                      {isSuperAdmin && member.role === 'internal_admin' && (
                        <button
                          type="button"
                          onClick={() => setPermExpandedId(isPermExpanded ? null : member.id)}
                          className={`inline-flex h-[30px] items-center gap-1.5 rounded-lg border px-3 text-[13px] ${
                            isPermExpanded
                              ? 'border-[#DAFF07] bg-[#DAFF07]/10 text-black'
                              : 'border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                          }`}
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Permissions
                          {isPermExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setActivityUserId(member.id)}
                        className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        Activity
                      </button>
                    </div>
                  </div>

                  {isPermExpanded && member.role === 'internal_admin' && (
                    <div className="mt-4 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-4">
                      <p className="mb-3 text-[13px] font-medium text-black">Support Permissions</p>
                      <div className="space-y-2">
                        {permissionLabels.map(({ key, label }) => (
                          <label key={key} className="flex items-center justify-between">
                            <span className="text-[13px] text-[#888C99]">{label}</span>
                            <button
                              type="button"
                              disabled={permSaving}
                              onClick={() => handlePermissionToggle(member, key)}
                              className={`relative h-5 w-9 rounded-full transition-colors ${
                                perms[key] ? 'bg-[#DAFF07]' : 'bg-[#EBEBEB]'
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                  perms[key] ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {rows.length === 0 && (
              <div className="p-8 text-center text-[13px] text-[#888C99]">
                {staff.length === 0 ? 'No admin staff members found.' : 'No results matched your search.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {resetTarget?.name || resetTarget?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className="h-[38px] w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-white/30 focus:border-[#DAFF07] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetLoading || newPassword.length < 6}
              className="h-[34px] w-full rounded-lg bg-[#DAFF07] text-[13px] font-medium text-black hover:bg-[#C8ED00] disabled:opacity-50"
            >
              {resetSuccess ? 'Password Updated!' : resetLoading ? 'Updating...' : 'Reset Password'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Drawer */}
      {activityUserId && (
        <ActivityDrawer
          userId={activityUserId}
          onClose={() => setActivityUserId(null)}
        />
      )}
    </div>
  );
}
