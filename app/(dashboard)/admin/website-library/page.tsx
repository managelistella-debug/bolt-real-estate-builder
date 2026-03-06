'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { useHostedSitesStore } from '@/lib/stores/hostedSites';
import { useTenantSettingsStore } from '@/lib/stores/tenantSettings';
import { ExternalLink, Globe, ToggleLeft, ToggleRight, UserPlus, X } from 'lucide-react';

export default function WebsiteLibraryPage() {
  const { user, getAllUsers } = useAuthStore();
  const { sites, ensureSeeded, assignUser, unassignUser } = useHostedSitesStore();
  const { settings, assignSiteToUser, unassignSiteFromUser, setAiBuilderDisabled } = useTenantSettingsStore();
  const allUsers = getAllUsers();
  const [assignDialogSiteId, setAssignDialogSiteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  if (user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-[#888C99] text-sm">Access restricted to super admins.</p>
      </div>
    );
  }

  const businessUsers = allUsers.filter((u) => u.role === 'business_user');
  const filteredUsers = businessUsers.filter(
    (u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function handleAssign(siteId: string, userId: string) {
    const site = sites.find((s) => s.id === siteId);
    if (!site) return;
    assignUser(siteId, userId);
    assignSiteToUser(userId, site.siteSlug);
    setAssignDialogSiteId(null);
    setSearchQuery('');
  }

  function handleUnassign(siteId: string, userId: string) {
    unassignUser(siteId, userId);
    unassignSiteFromUser(userId);
  }

  function handleToggleAiBuilder(userId: string) {
    const current = settings[userId];
    const isDisabled = current?.aiBuilderDisabled ?? false;
    setAiBuilderDisabled(userId, !isDisabled);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-black">Website Library</h1>
        <p className="text-sm text-[#888C99] mt-1">
          Manage hosted websites and assign them to tenants. Assigned tenants will see their site instead of the AI Builder.
        </p>
      </div>

      {/* Sites List */}
      <div className="space-y-6">
        {sites.map((site) => (
          <div key={site.id} className="border border-[#EBEBEB] rounded-xl bg-white overflow-hidden">
            {/* Site Header */}
            <div className="flex items-start gap-4 p-5">
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-[#F5F5F3] shrink-0">
                {site.previewImage && (
                  <img src={site.previewImage} alt={site.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#888C99]" />
                  <h2 className="text-[15px] font-medium text-black truncate">{site.name}</h2>
                </div>
                <p className="text-[13px] text-[#888C99] mt-0.5 line-clamp-1">{site.description}</p>
              </div>
              <a
                href={`/hosted/${site.siteSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 text-[13px] text-[#888C99] hover:text-black transition-colors border border-[#EBEBEB] rounded-lg px-3 py-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Preview
              </a>
            </div>

            {/* Assigned Users */}
            <div className="border-t border-[#EBEBEB] px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium uppercase tracking-widest text-[#CCCCCC]">
                  Assigned Tenants ({site.assignedUserIds.length})
                </p>
                <button
                  onClick={() => setAssignDialogSiteId(site.id)}
                  className="flex items-center gap-1 text-[13px] text-black bg-[#DAFF07] hover:bg-[#c8eb00] rounded-lg px-3 py-1.5 transition-colors"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Assign
                </button>
              </div>

              {site.assignedUserIds.length === 0 ? (
                <p className="text-[13px] text-[#888C99] italic">No tenants assigned yet.</p>
              ) : (
                <div className="space-y-2">
                  {site.assignedUserIds.map((uid) => {
                    const assignedUser = allUsers.find((u) => u.id === uid);
                    const tenantSettings = settings[uid];
                    const aiDisabled = tenantSettings?.aiBuilderDisabled ?? false;
                    return (
                      <div key={uid} className="flex items-center justify-between bg-[#F5F5F3] rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[11px] font-medium text-black shrink-0">
                            {assignedUser?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] text-black truncate">{assignedUser?.name || uid}</p>
                            <p className="text-[11px] text-[#888C99] truncate">{assignedUser?.email || ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => handleToggleAiBuilder(uid)}
                            className="flex items-center gap-1.5 text-[12px] text-[#888C99] hover:text-black transition-colors"
                            title={aiDisabled ? 'AI Builder is disabled for this tenant' : 'AI Builder is enabled for this tenant'}
                          >
                            {aiDisabled ? (
                              <>
                                <ToggleRight className="h-4 w-4 text-[#DAFF07]" />
                                <span>AI Off</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="h-4 w-4" />
                                <span>AI On</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleUnassign(site.id, uid)}
                            className="text-[#888C99] hover:text-red-500 transition-colors"
                            title="Remove assignment"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {sites.length === 0 && (
        <div className="text-center py-16">
          <Globe className="h-12 w-12 text-[#EBEBEB] mx-auto mb-3" />
          <p className="text-[#888C99] text-sm">No hosted sites in the library yet.</p>
        </div>
      )}

      {/* Assign Dialog */}
      {assignDialogSiteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => { setAssignDialogSiteId(null); setSearchQuery(''); }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBEBEB]">
              <h3 className="text-[15px] font-medium text-black">Assign Tenant</h3>
              <button onClick={() => { setAssignDialogSiteId(null); setSearchQuery(''); }} className="text-[#888C99] hover:text-black transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-[#EBEBEB] rounded-lg px-3 py-2 text-[13px] text-black placeholder:text-[#CCCCCC] focus:outline-none focus:border-[#DAFF07]"
              />
              <div className="mt-3 max-h-[240px] overflow-y-auto space-y-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-[13px] text-[#888C99] text-center py-4">No matching users found.</p>
                ) : (
                  filteredUsers.map((u) => {
                    const alreadyAssigned = sites.find((s) => s.id === assignDialogSiteId)?.assignedUserIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        disabled={alreadyAssigned}
                        onClick={() => handleAssign(assignDialogSiteId, u.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          alreadyAssigned ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#F5F5F3]'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-[#F5F5F3] flex items-center justify-center text-[12px] font-medium text-black shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] text-black truncate">{u.name}</p>
                          <p className="text-[11px] text-[#888C99] truncate">{u.email}</p>
                        </div>
                        {alreadyAssigned && <span className="text-[11px] text-[#888C99] ml-auto shrink-0">Assigned</span>}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Tenants AI Builder Status */}
      <div className="mt-12 border border-[#EBEBEB] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBEBEB]">
          <h2 className="text-[15px] font-medium text-black">AI Builder Status per Tenant</h2>
          <p className="text-[12px] text-[#888C99] mt-0.5">Toggle the AI website builder on or off for each tenant.</p>
        </div>
        <div className="divide-y divide-[#EBEBEB]">
          {businessUsers.length === 0 ? (
            <div className="px-5 py-6 text-center"><p className="text-[13px] text-[#888C99]">No business users found.</p></div>
          ) : (
            businessUsers.map((u) => {
              const ts = settings[u.id];
              const aiDisabled = ts?.aiBuilderDisabled ?? false;
              const assignedSlug = ts?.assignedHostedSiteSlug;
              const assignedSite = assignedSlug ? sites.find((s) => s.siteSlug === assignedSlug) : null;
              return (
                <div key={u.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#F5F5F3] flex items-center justify-center text-[12px] font-medium text-black shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] text-black truncate">{u.name}</p>
                      <p className="text-[11px] text-[#888C99] truncate">
                        {u.email}
                        {assignedSite && <span className="ml-2 text-[#888C99]">• {assignedSite.name}</span>}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleAiBuilder(u.id)}
                    className={`flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${
                      aiDisabled
                        ? 'border-[#DAFF07] bg-[#DAFF07]/10 text-black'
                        : 'border-[#EBEBEB] text-[#888C99] hover:border-black hover:text-black'
                    }`}
                  >
                    {aiDisabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    {aiDisabled ? 'AI Builder Off' : 'AI Builder On'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
