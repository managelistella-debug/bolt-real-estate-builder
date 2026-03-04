'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/lib/stores/auth';
import { useAuditLogStore } from '@/lib/stores/auditLog';
import { ActivityDrawer } from '@/components/admin/ActivityDrawer';
import { WebsiteConnectionPanel } from '@/components/integrations/WebsiteConnectionPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Search, ChevronDown, ChevronUp, Copy, Check, KeyRound, Clock, ExternalLink,
  Building2, FileText, Users as UsersIcon, Globe, Trash2,
} from 'lucide-react';

const inputCls = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

interface ClientProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  business_id: string | null;
  created_at: string;
  last_login_at: string | null;
  stats: { listings: number; blogs: number; leads: number };
  connectionStatus: 'connected' | 'not_connected';
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#888C99] hover:text-black"
      title="Copy"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

export default function ClientUsersPage() {
  const router = useRouter();
  const { user, startImpersonation } = useAuthStore();
  const { addEvent } = useAuditLogStore();

  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reason, setReason] = useState('Customer support');

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<ClientProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ClientProfile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [activityUserId, setActivityUserId] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data/users?role=business_user');
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (!term) return true;
      return (
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term) ||
        (c.business_id && c.business_id.toLowerCase().includes(term))
      );
    });
  }, [clients, search]);

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

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/data/users?userId=${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        addEvent({
          type: 'user_updated',
          actorUserId: user?.id || '',
          targetUserId: deleteTarget.id,
          metadata: { action: 'deleted', email: deleteTarget.email },
        });
        setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
      }
    } catch { /* ignore */ }
    setDeleteLoading(false);
  };

  const handleImpersonate = (client: ClientProfile) => {
    if (startImpersonation(client.id, reason)) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Client Users" description="View client accounts, connection details, content stats, and manage their access." />
      </div>

      <div className="space-y-4 p-6">
        {/* Search and impersonation reason */}
        <div className="flex gap-3">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Impersonation reason"
            className={inputCls}
          />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or tenant ID"
              className={`${inputCls} pl-8`}
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-[#EBEBEB] bg-white p-8 text-center text-[13px] text-[#888C99]">
            Loading client accounts...
          </div>
        ) : (
          <div className="divide-y divide-[#EBEBEB] rounded-xl border border-[#EBEBEB] bg-white">
            {rows.map((client) => {
              const isExpanded = expandedId === client.id;
              const tenantId = client.business_id || client.id;

              return (
                <div key={client.id} className="p-4">
                  {/* Collapsed row */}
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-black">{client.name || client.email}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                          client.connectionStatus === 'connected'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-[#888C99]'
                        }`}>
                          {client.connectionStatus === 'connected' ? 'Connected' : 'Not linked'}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#888C99]">{client.email}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 rounded-full border border-[#EBEBEB] px-2 py-0.5 text-[11px] font-mono text-[#888C99]">
                          ID: {tenantId.length > 20 ? `${tenantId.slice(0, 8)}...${tenantId.slice(-4)}` : tenantId}
                          <CopyButton value={tenantId} />
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#888C99]">
                          <Building2 className="h-3 w-3" /> {client.stats.listings}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#888C99]">
                          <FileText className="h-3 w-3" /> {client.stats.blogs}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#888C99]">
                          <UsersIcon className="h-3 w-3" /> {client.stats.leads}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : client.id)}
                        className={`inline-flex h-[30px] items-center gap-1 rounded-lg border px-3 text-[13px] ${
                          isExpanded
                            ? 'border-[#DAFF07] bg-[#DAFF07]/10 text-black'
                            : 'border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                        }`}
                      >
                        Details
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImpersonate(client)}
                        className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]"
                      >
                        Log in as user
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4">
                      {/* Account info + Stats */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-4">
                          <h4 className="mb-3 text-[13px] font-medium text-black">Account Information</h4>
                          <dl className="space-y-2 text-[13px]">
                            <div className="flex justify-between">
                              <dt className="text-[#888C99]">Name</dt>
                              <dd className="text-black">{client.name || '—'}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-[#888C99]">Email</dt>
                              <dd className="text-black">{client.email}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-[#888C99]">Tenant ID</dt>
                              <dd className="flex items-center gap-1 font-mono text-black">
                                {tenantId.slice(0, 12)}...
                                <CopyButton value={tenantId} />
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-[#888C99]">Created</dt>
                              <dd className="text-black">{new Date(client.created_at).toLocaleDateString()}</dd>
                            </div>
                            {client.last_login_at && (
                              <div className="flex justify-between">
                                <dt className="text-[#888C99]">Last Login</dt>
                                <dd className="text-black">{new Date(client.last_login_at).toLocaleString()}</dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        <div className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-4">
                          <h4 className="mb-3 text-[13px] font-medium text-black">Content Statistics</h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-lg bg-white p-3 text-center">
                              <Building2 className="mx-auto mb-1 h-4 w-4 text-[#888C99]" />
                              <p className="text-[18px] font-medium text-black">{client.stats.listings}</p>
                              <p className="text-[11px] text-[#888C99]">Listings</p>
                            </div>
                            <div className="rounded-lg bg-white p-3 text-center">
                              <FileText className="mx-auto mb-1 h-4 w-4 text-[#888C99]" />
                              <p className="text-[18px] font-medium text-black">{client.stats.blogs}</p>
                              <p className="text-[11px] text-[#888C99]">Blogs</p>
                            </div>
                            <div className="rounded-lg bg-white p-3 text-center">
                              <UsersIcon className="mx-auto mb-1 h-4 w-4 text-[#888C99]" />
                              <p className="text-[18px] font-medium text-black">{client.stats.leads}</p>
                              <p className="text-[11px] text-[#888C99]">Leads</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions bar */}
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setResetTarget(client);
                            setResetDialogOpen(true);
                          }}
                          className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          Reset Password
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivityUserId(client.id)}
                          className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                        >
                          <Clock className="h-3.5 w-3.5" />
                          Activity
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImpersonate(client)}
                          className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View Dashboard
                        </button>
                        {user?.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteTarget(client);
                              setDeleteDialogOpen(true);
                            }}
                            className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-[13px] text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete User
                          </button>
                        )}
                      </div>

                      {/* Website Connection */}
                      <div className="rounded-lg border border-[#EBEBEB] bg-white p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-[#888C99]" />
                          <h4 className="text-[13px] font-medium text-black">Website Connection</h4>
                        </div>
                        <WebsiteConnectionPanel
                          tenantId={tenantId}
                          userName={client.name}
                          isAdmin
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {rows.length === 0 && (
              <div className="p-8 text-center text-[13px] text-[#888C99]">
                {clients.length === 0 ? 'No client users found.' : 'No results matched your search.'}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This will permanently delete {deleteTarget?.name || deleteTarget?.email} and all their data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setDeleteDialogOpen(false); setDeleteTarget(null); }}
              className="h-[34px] flex-1 rounded-lg border border-white/10 bg-white/5 text-[13px] text-white hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteUser}
              disabled={deleteLoading}
              className="h-[34px] flex-1 rounded-lg bg-red-600 text-[13px] text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
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
