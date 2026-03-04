'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIntegrationsStore } from '@/lib/stores/integrations';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';
import { Check, Copy } from 'lucide-react';

const inputClass =
  'h-[34px] rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const labelClass = 'text-[13px] text-[#888C99]';
const secondaryButtonClass =
  'h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black';

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

function statusColor(status: string) {
  const active = ['connected', 'active', 'syncing', 'ok'].some((s) =>
    status.toLowerCase().includes(s)
  );
  return active ? 'text-[#DAFF07]' : 'text-[#888C99]';
}

export default function IntegrationsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { getConfigForUser, upsertConfig } = useIntegrationsStore();
  const config = user ? getConfigForUser(user.id) : undefined;

  const save = (patch: Partial<NonNullable<typeof config>>) => {
    if (!user) return;
    upsertConfig(user.id, patch);
    toast({
      title: 'Integration updated',
      description: 'Your integration settings were saved.',
    });
  };

  return (
    <div
      className="min-h-screen bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Integrations"
          description="Connect third-party services used by your coded websites."
        />
      </div>
      <div className="space-y-4 p-6">
        {/* Website Connection Details */}
        {user && (() => {
          const tenantId = user.id;
          const defaultApiKey = `demo_public_key_${tenantId}`;
          const apiBaseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          return (
            <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[15px] font-normal text-black">Connect a Website</h2>
                  <p className="mt-1 text-[13px] text-[#888C99]">Use these credentials to connect an external website to your CMS listings.</p>
                </div>
                <span className="rounded-full bg-[#DAFF07] px-2.5 py-0.5 text-[11px] font-medium text-black">Listings API</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Tenant ID</p>
                  <div className="flex items-center gap-2 rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-1.5">
                    <code className="flex-1 truncate text-[12px] text-black">{tenantId}</code>
                    <CopyButton value={tenantId} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">API Key</p>
                  <div className="flex items-center gap-2 rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-1.5">
                    <code className="flex-1 truncate text-[12px] text-black">{defaultApiKey}</code>
                    <CopyButton value={defaultApiKey} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">API Base URL</p>
                  <div className="flex items-center gap-2 rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-1.5">
                    <code className="flex-1 truncate text-[12px] text-black">{apiBaseUrl}</code>
                    <CopyButton value={apiBaseUrl} />
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Listings Endpoint</p>
                <div className="flex items-center gap-2 rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-1.5">
                  <code className="flex-1 truncate text-[12px] text-black">{apiBaseUrl}/api/public/{tenantId}/listings</code>
                  <CopyButton value={`${apiBaseUrl}/api/public/${tenantId}/listings`} />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Environment Variables</p>
                <div className="relative rounded-md border border-[#EBEBEB] bg-[#F5F5F3] p-3">
                  <pre className="overflow-x-auto text-[12px] leading-5 text-black">{`CMS_BASE_URL=${apiBaseUrl}
CMS_READ_TOKEN=${defaultApiKey}
TENANT_ID=${tenantId}`}</pre>
                  <div className="absolute right-2 top-2">
                    <CopyButton value={`CMS_BASE_URL=${apiBaseUrl}\nCMS_READ_TOKEN=${defaultApiKey}\nTENANT_ID=${tenantId}`} />
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Quick Fetch Example</p>
                <div className="relative rounded-md border border-[#EBEBEB] bg-[#F5F5F3] p-3">
                  <pre className="overflow-x-auto text-[12px] leading-5 text-black">{`const res = await fetch(
  \`\${process.env.CMS_BASE_URL}/api/public/\${process.env.TENANT_ID}/listings\`,
  { headers: { 'x-api-key': process.env.CMS_READ_TOKEN } }
);
const { data: listings } = await res.json();`}</pre>
                  <div className="absolute right-2 top-2">
                    <CopyButton value={`const res = await fetch(\n  \`\${process.env.CMS_BASE_URL}/api/public/\${process.env.TENANT_ID}/listings\`,\n  { headers: { 'x-api-key': process.env.CMS_READ_TOKEN } }\n);\nconst { data: listings } = await res.json();`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="text-[15px] font-normal text-black">Google Reviews</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="googleApiKey" className={labelClass}>
                Google API Key
              </Label>
              <Input
                id="googleApiKey"
                placeholder="AIza..."
                defaultValue={config?.google.apiKey || ''}
                className={inputClass}
                onBlur={(event) =>
                  save({
                    google: {
                      enabled: config?.google.enabled ?? false,
                      placeId: config?.google.placeId,
                      apiKey: event.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googlePlaceId" className={labelClass}>
                Place ID
              </Label>
              <Input
                id="googlePlaceId"
                placeholder="ChIJ..."
                defaultValue={config?.google.placeId || ''}
                className={inputClass}
                onBlur={(event) =>
                  save({
                    google: {
                      enabled: config?.google.enabled ?? false,
                      apiKey: config?.google.apiKey,
                      placeId: event.target.value,
                    },
                  })
                }
              />
            </div>
            <Button
              variant="outline"
              className={secondaryButtonClass}
              onClick={() =>
                toast({
                  title: 'Sync queued',
                  description: 'Google reviews sync has been queued.',
                })
              }
            >
              Sync Reviews
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="text-[15px] font-normal text-black">Resend</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resendApiKey" className={labelClass}>
                Resend API Key
              </Label>
              <Input
                id="resendApiKey"
                placeholder="re_..."
                defaultValue={config?.resend.apiKey || ''}
                className={inputClass}
                onBlur={(event) =>
                  save({
                    resend: {
                      enabled: config?.resend.enabled ?? false,
                      defaultRecipient: config?.resend.defaultRecipient,
                      apiKey: event.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resendTo" className={labelClass}>
                Default Recipient Email
              </Label>
              <Input
                id="resendTo"
                placeholder="team@example.com"
                defaultValue={config?.resend.defaultRecipient || ''}
                className={inputClass}
                onBlur={(event) =>
                  save({
                    resend: {
                      enabled: config?.resend.enabled ?? false,
                      apiKey: config?.resend.apiKey,
                      defaultRecipient: event.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vercelProjectId" className={labelClass}>
                Vercel Project ID
              </Label>
              <Input
                id="vercelProjectId"
                placeholder="prj_..."
                defaultValue={config?.vercelProjectId || ''}
                className={inputClass}
                onBlur={(event) =>
                  save({
                    vercelProjectId: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revalidationWebhookUrl" className={labelClass}>
                Revalidation Webhook URL
              </Label>
              <Input
                id="revalidationWebhookUrl"
                placeholder="https://..."
                defaultValue={config?.revalidationWebhookUrl || ''}
                className={inputClass}
                onBlur={(event) =>
                  save({
                    revalidationWebhookUrl: event.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2 text-[13px] md:grid-cols-2">
              <div className="rounded-lg border border-[#EBEBEB] p-3">
                <p className={labelClass}>Webhook status</p>
                <p
                  className={`font-medium ${statusColor(config?.webhookStatus || 'idle')}`}
                >
                  {config?.webhookStatus || 'idle'}
                </p>
              </div>
              <div className="rounded-lg border border-[#EBEBEB] p-3">
                <p className={labelClass}>Revalidation status</p>
                <p
                  className={`font-medium ${statusColor(config?.revalidationStatus || 'idle')}`}
                >
                  {config?.revalidationStatus || 'idle'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
