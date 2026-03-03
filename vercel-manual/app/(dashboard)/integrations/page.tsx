'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIntegrationsStore } from '@/lib/stores/integrations';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';

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
    <div>
      <Header
        title="Integrations"
        description="Connect third-party services used by your coded websites."
      />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="googleApiKey">Google API Key</Label>
              <Input
                id="googleApiKey"
                placeholder="AIza..."
                defaultValue={config?.google.apiKey || ''}
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
              <Label htmlFor="googlePlaceId">Place ID</Label>
              <Input
                id="googlePlaceId"
                placeholder="ChIJ..."
                defaultValue={config?.google.placeId || ''}
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
              onClick={() => toast({ title: 'Sync queued', description: 'Google reviews sync has been queued.' })}
            >
              Sync Reviews
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resendApiKey">Resend API Key</Label>
              <Input
                id="resendApiKey"
                placeholder="re_..."
                defaultValue={config?.resend.apiKey || ''}
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
              <Label htmlFor="resendTo">Default Recipient Email</Label>
              <Input
                id="resendTo"
                placeholder="team@example.com"
                defaultValue={config?.resend.defaultRecipient || ''}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
