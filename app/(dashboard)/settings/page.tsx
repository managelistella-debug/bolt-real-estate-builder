'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWebsiteStore } from '@/lib/stores/website';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';
import { getPlatformBaseDomain } from '@/lib/domain/config';
import { isValidDomain, normalizeDomainInput } from '@/lib/domain/dns';
import { DomainConnectionStatus } from '@/lib/types';

const statusStyles: Record<DomainConnectionStatus, string> = {
  not_started: 'bg-slate-100 text-slate-700',
  pending_dns: 'bg-amber-100 text-amber-800',
  verifying: 'bg-blue-100 text-blue-800',
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

  if (!website || !domainSettings) {
    return <div className="p-6">Loading settings...</div>;
  }

  const handleSaveDomain = () => {
    if (!isDomainValid) {
      toast({
        title: 'Invalid domain',
        description: 'Enter a valid domain like example.com',
        variant: 'destructive',
      });
      return;
    }

    setCustomDomain(website.id, normalizedInput);
    toast({
      title: 'Custom domain saved',
      description: 'Add the DNS records below, then run verification.',
    });
  };

  const handleVerifyDomain = async () => {
    if (!domainSettings.customDomain) return;
    setIsVerifying(true);
    const success = await verifyCustomDomain(website.id);
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
    disconnectCustomDomain(website.id);
    setDomainInput('');
    toast({
      title: 'Custom domain removed',
      description: 'Your site will continue using the default platform subdomain.',
    });
  };

  return (
    <div>
      <Header
        title="Settings"
        description="Manage your website account-level settings"
      />

      <div className="p-6">
        <Tabs defaultValue="domains" className="space-y-4">
          <TabsList>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          <TabsContent value="domains" className="space-y-4">
            <Card className="p-4 space-y-3">
              <h2 className="text-lg font-semibold">Step 1: Default Platform Subdomain</h2>
              <p className="text-sm text-muted-foreground">
                Every website gets a default subdomain on your platform domain.
              </p>
              <div className="rounded-md border p-3 bg-muted/30">
                <p className="text-sm font-medium">{domainSettings.platformUrl}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Base domain: {getPlatformBaseDomain()}
                </p>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <h2 className="text-lg font-semibold">Step 2: Add Your Custom Domain</h2>
              <p className="text-sm text-muted-foreground">
                Enter the domain you want visitors to use for this website.
              </p>
              <div className="space-y-2">
                <Label htmlFor="custom-domain">Custom domain</Label>
                <Input
                  id="custom-domain"
                  placeholder="example.com"
                  value={domainInput}
                  onChange={(event) => setDomainInput(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Local prototype mode: verification is simulated, but the flow mirrors production.
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveDomain} disabled={!isDomainValid}>
                  Save Domain
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDisconnectDomain}
                  disabled={!domainSettings.customDomain}
                >
                  Disconnect
                </Button>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <h2 className="text-lg font-semibold">Step 3: Add DNS Records</h2>
              {!domainSettings.customDomain && (
                <p className="text-sm text-muted-foreground">
                  Add a custom domain first to generate DNS instructions.
                </p>
              )}
              {domainSettings.customDomain && (
                <div className="space-y-3">
                  <p className="text-sm">
                    Configure these records in your DNS provider for{' '}
                    <span className="font-medium">{domainSettings.customDomain}</span>.
                  </p>
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Type</th>
                          <th className="px-3 py-2 text-left font-medium">Name</th>
                          <th className="px-3 py-2 text-left font-medium">Value</th>
                          <th className="px-3 py-2 text-left font-medium">TTL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {domainSettings.expectedDnsRecords.map((record) => (
                          <tr key={`${record.type}-${record.name}-${record.value}`} className="border-t">
                            <td className="px-3 py-2">{record.type}</td>
                            <td className="px-3 py-2">{record.name}</td>
                            <td className="px-3 py-2 font-mono text-xs">{record.value}</td>
                            <td className="px-3 py-2">{record.ttl}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-4 space-y-3">
              <h2 className="text-lg font-semibold">Step 4: Verify Connection</h2>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[domainSettings.status]}`}
                >
                  {statusLabels[domainSettings.status]}
                </span>
                {domainSettings.lastVerifiedAt && (
                  <span className="text-xs text-muted-foreground">
                    Last checked {new Date(domainSettings.lastVerifiedAt).toLocaleString()}
                  </span>
                )}
              </div>
              {domainSettings.verificationError && (
                <p className="text-sm text-destructive">{domainSettings.verificationError}</p>
              )}
              <Button
                onClick={handleVerifyDomain}
                disabled={!domainSettings.customDomain || isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify DNS Records'}
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card className="p-4">
              <h2 className="text-lg font-semibold">General Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Additional website settings can be added here as this section grows.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
