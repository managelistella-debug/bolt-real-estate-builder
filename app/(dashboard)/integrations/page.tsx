'use client';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIntegrationsStore } from '@/lib/stores/integrations';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';

const inputClass =
  'h-[34px] rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const labelClass = 'text-[13px] text-[#888C99]';
const secondaryButtonClass =
  'h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black';

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
