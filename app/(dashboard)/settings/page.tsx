'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWebsiteStore } from '@/lib/stores/website';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';
import { getPlatformBaseDomain } from '@/lib/domain/config';
import { isValidDomain, normalizeDomainInput } from '@/lib/domain/dns';
import { DomainConnectionStatus } from '@/lib/types';
import { useApiKeysStore } from '@/lib/stores/apiKeys';

interface DomainApiRecord {
  domain: string;
  projectId?: string;
  status: DomainConnectionStatus;
  isPrimary: boolean;
  verificationError?: string;
  updatedAt: string;
}

const statusStyles: Record<DomainConnectionStatus, string> = {
  not_started: 'bg-slate-100 text-slate-700',
  pending_dns: 'bg-amber-100 text-amber-800',
  verifying: 'bg-[#DAFF07]/20 text-[#556000]',
  connected: 'bg-emerald-100 text-emerald-800',
  error: 'bg-rose-100 text-rose-800',
};

const statusLabels: Record<DomainConnectionStatus, string> = {
  not_started: 'Not Started',
  pending_dns: 'Pending DNS',
  verifying: 'Verifying',
  connected: 'Connected',
  error: 'Needs Attention',
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const {
    getCurrentUserWebsite,
    initializeUserWebsite,
    setCustomDomain,
    verifyCustomDomain,
    disconnectCustomDomain,
  } = useWebsiteStore();

  const [domainInput, setDomainInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiKeyLabel, setApiKeyLabel] = useState('');
  const [apiKeyRawValue, setApiKeyRawValue] = useState('');
  const [domains, setDomains] = useState<DomainApiRecord[]>([]);
  const [projectIdInput, setProjectIdInput] = useState('');
  const { createKey, getKeysForUser } = useApiKeysStore();

  useEffect(() => {
    if (user) initializeUserWebsite(user.id);
  }, [user, initializeUserWebsite]);

  const website = getCurrentUserWebsite();
  const domainSettings = website?.domains;
  const normalizedInput = normalizeDomainInput(domainInput);
  const isDomainValid = normalizedInput.length > 0 && isValidDomain(normalizedInput);

  useEffect(() => {
    setDomainInput(domainSettings?.customDomain || '');
  }, [domainSettings?.customDomain]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/domains?tenantId=${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setDomains(data.items || []);
        setProjectIdInput(data.projectId || '');
      })
      .catch(() => undefined);
  }, [user]);

  if (!website || !domainSettings) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] p-6" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
        Loading settings...
      </div>
    );
  }
  const apiKeys = user ? getKeysForUser(user.id) : [];

  const handleSaveDomain = () => {
    if (!isDomainValid) {
      toast({
        title: 'Invalid domain',
        description: 'Enter a valid domain like example.com',
        variant: 'destructive',
      });
      return;
    }

    fetch('/api/domains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: user?.id, domain: normalizedInput, projectId: projectIdInput || undefined }),
    })
      .then((response) => response.json())
      .then((data) => setDomains(data.items || []))
      .catch(() => undefined);
    setCustomDomain(website.id, normalizedInput);
    toast({
      title: 'Custom domain saved',
      description: 'Add the DNS records below, then run verification.',
    });
  };

  const handleVerifyDomain = async () => {
    if (!domainSettings.customDomain) return;
    setIsVerifying(true);
    const response = await fetch(`/api/domains/${encodeURIComponent(domainSettings.customDomain)}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: user?.id }),
    });
    const payload = await response.json();
    const success = Boolean(payload?.success);
    if (payload?.items) setDomains(payload.items);
    await verifyCustomDomain(website.id);
    setIsVerifying(false);

    toast({
      title: success ? 'Domain connected' : 'Verification failed',
      description: success
        ? 'Your custom domain is now marked as connected.'
        : 'DNS records were not detected. Double check your DNS provider and retry.',
      variant: success ? 'default' : 'destructive',
    });
  };

  const handleDisconnectDomain = () => {
    if (domainSettings.customDomain) {
      fetch(`/api/domains/${encodeURIComponent(domainSettings.customDomain)}?tenantId=${user?.id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => setDomains(data.items || []))
        .catch(() => undefined);
    }
    disconnectCustomDomain(website.id);
    setDomainInput('');
    toast({
      title: 'Custom domain removed',
      description: 'Your site will continue using the default platform subdomain.',
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Settings"
          description="Manage your website account-level settings"
        />
      </div>

      <div className="space-y-4 p-6">
        <Tabs defaultValue="domains" className="space-y-4">
          <TabsList className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#EBEBEB] bg-white p-1">
            <TabsTrigger
              value="domains"
              className="rounded-md px-3 py-1 text-[13px] text-[#888C99] data-[state=active]:bg-[#F5F5F3] data-[state=active]:text-black"
            >
              Domains
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="rounded-md px-3 py-1 text-[13px] text-[#888C99] data-[state=active]:bg-[#F5F5F3] data-[state=active]:text-black"
            >
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="domains" className="space-y-4">
            <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
              <h2 className="text-[15px] font-normal text-black">Step 1: Default Platform Subdomain</h2>
              <p className="text-[13px] text-[#888C99]">
                Every website gets a default subdomain on your platform domain.
              </p>
              <div className="rounded-lg border border-[#EBEBEB] p-3 bg-[#F5F5F3]">
                <p className="text-[13px] font-medium text-black">{domainSettings.platformUrl}</p>
                <p className="text-[13px] text-[#888C99] mt-1">
                  Base domain: {getPlatformBaseDomain()}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
              <h2 className="text-[15px] font-normal text-black">Step 2: Add Your Custom Domain</h2>
              <p className="text-[13px] text-[#888C99]">
                Enter the domain you want visitors to use for this website.
              </p>
              <div className="space-y-2">
                <label htmlFor="project-id" className="text-[13px] text-[#888C99]">
                  Vercel project ID
                </label>
                <input
                  id="project-id"
                  placeholder="prj_..."
                  value={projectIdInput}
                  onChange={(event) => setProjectIdInput(event.target.value)}
                  className="flex h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="custom-domain" className="text-[13px] text-[#888C99]">
                  Custom domain
                </label>
                <input
                  id="custom-domain"
                  placeholder="example.com"
                  value={domainInput}
                  onChange={(event) => setDomainInput(event.target.value)}
                  className="flex h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                />
                <p className="text-[13px] text-[#888C99]">
                  Domain operations use Vercel APIs when `VERCEL_API_TOKEN` is configured.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDomain}
                  disabled={!isDomainValid}
                  className="inline-flex h-[30px] items-center justify-center rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] disabled:pointer-events-none disabled:opacity-50"
                >
                  Save Domain
                </button>
                <button
                  type="button"
                  onClick={handleDisconnectDomain}
                  disabled={!domainSettings.customDomain}
                  className="inline-flex h-[30px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black disabled:pointer-events-none disabled:opacity-50"
                >
                  Disconnect
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
              <h2 className="text-[15px] font-normal text-black">Connected Domains</h2>
              {domains.length === 0 && (
                <p className="text-[13px] text-[#888C99]">No connected domains yet.</p>
              )}
              {domains.length > 0 && (
                <div className="space-y-2">
                  {domains.map((entry) => (
                    <div key={entry.domain} className="rounded-lg border border-[#EBEBEB] p-3 bg-[#F5F5F3]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-[13px] font-medium text-black">{entry.domain}</p>
                          <p className="text-[13px] text-[#888C99]">
                            status: {entry.status} {entry.isPrimary ? '(primary)' : ''}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!entry.isPrimary && (
                            <button
                              type="button"
                              onClick={() => {
                                fetch(`/api/domains/${encodeURIComponent(entry.domain)}/primary`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ tenantId: user?.id }),
                                })
                                  .then((response) => response.json())
                                  .then((data) => setDomains(data.items || []))
                                  .catch(() => undefined);
                              }}
                              className="inline-flex h-[30px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              fetch(`/api/domains/${encodeURIComponent(entry.domain)}?tenantId=${user?.id}`, {
                                method: 'DELETE',
                              })
                                .then((response) => response.json())
                                .then((data) => setDomains(data.items || []))
                                .catch(() => undefined);
                            }}
                            className="inline-flex h-[30px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
              <h2 className="text-[15px] font-normal text-black">Step 3: Add DNS Records</h2>
              {!domainSettings.customDomain && (
                <p className="text-[13px] text-[#888C99]">
                  Add a custom domain first to generate DNS instructions.
                </p>
              )}
              {domainSettings.customDomain && (
                <div className="space-y-3">
                  <p className="text-[13px] text-black">
                    Configure these records in your DNS provider for{' '}
                    <span className="font-medium">{domainSettings.customDomain}</span>.
                  </p>
                  <div className="rounded-lg border border-[#EBEBEB] overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead className="bg-[#F5F5F3]">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-black">Type</th>
                          <th className="px-3 py-2 text-left font-medium text-black">Name</th>
                          <th className="px-3 py-2 text-left font-medium text-black">Value</th>
                          <th className="px-3 py-2 text-left font-medium text-black">TTL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {domainSettings.expectedDnsRecords.map((record) => (
                          <tr key={`${record.type}-${record.name}-${record.value}`} className="border-t border-[#EBEBEB]">
                            <td className="px-3 py-2 text-black">{record.type}</td>
                            <td className="px-3 py-2 text-black">{record.name}</td>
                            <td className="px-3 py-2 font-mono text-[13px] text-black">{record.value}</td>
                            <td className="px-3 py-2 text-black">{record.ttl}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
              <h2 className="text-[15px] font-normal text-black">Step 4: Verify Connection</h2>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[domainSettings.status]}`}
                >
                  {statusLabels[domainSettings.status]}
                </span>
                {domainSettings.lastVerifiedAt && (
                  <span className="text-[13px] text-[#888C99]">
                    Last checked {new Date(domainSettings.lastVerifiedAt).toLocaleString()}
                  </span>
                )}
              </div>
              {domainSettings.verificationError && (
                <p className="text-[13px] text-red-500">{domainSettings.verificationError}</p>
              )}
              <button
                type="button"
                onClick={handleVerifyDomain}
                disabled={!domainSettings.customDomain || isVerifying}
                className="inline-flex h-[30px] items-center justify-center rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] disabled:pointer-events-none disabled:opacity-50"
              >
                {isVerifying ? 'Verifying...' : 'Verify DNS Records'}
              </button>
            </div>
          </TabsContent>

          <TabsContent value="general">
            <div className="space-y-4">
              <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
                <h2 className="text-[15px] font-normal text-black">Public API Keys</h2>
                <p className="text-[13px] text-[#888C99] mt-1">
                  Generate API keys used by coded websites to read CMS content.
                </p>
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  <input
                    placeholder="Key label (e.g. production-site)"
                    value={apiKeyLabel}
                    onChange={(event) => setApiKeyLabel(event.target.value)}
                    className="flex h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                  />
                  <input
                    placeholder="Raw key value"
                    value={apiKeyRawValue}
                    onChange={(event) => setApiKeyRawValue(event.target.value)}
                    className="flex h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                  />
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex h-[30px] items-center justify-center rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]"
                  onClick={() => {
                    if (!user || !apiKeyLabel || !apiKeyRawValue) return;
                    createKey({
                      userId: user.id,
                      websiteId: website.id,
                      label: apiKeyLabel,
                      rawKey: apiKeyRawValue,
                      scopes: ['content:read', 'forms:write'],
                    });
                    setApiKeyLabel('');
                    setApiKeyRawValue('');
                    toast({ title: 'API key created', description: 'Use this key in x-api-key headers.' });
                  }}
                >
                  Create API Key
                </button>
                <div className="mt-4 space-y-2">
                  {apiKeys.length === 0 && (
                    <p className="text-[13px] text-[#888C99]">No API keys created yet.</p>
                  )}
                  {apiKeys.map((entry) => (
                    <div key={entry.id} className="rounded-lg border border-[#EBEBEB] p-3 bg-[#F5F5F3]">
                      <p className="text-[13px] font-medium text-black">{entry.label}</p>
                      <p className="text-[13px] text-[#888C99]">Preview: {entry.keyPreview}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
