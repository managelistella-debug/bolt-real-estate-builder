'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/stores/auth';
import { useTemplateCatalogStore } from '@/lib/stores/templateCatalog';
import { useWebsiteStore } from '@/lib/stores/website';
import { createTemplateFromWebsiteSnapshot } from '@/lib/themeSnapshots';

export default function AdminTemplatesPage() {
  const { user, getAllUsers } = useAuthStore();
  const { currentWebsite } = useWebsiteStore();
  const {
    assets,
    createAsset,
    publishAssetGlobal,
    assignAssetToUser,
  } = useTemplateCatalogStore();

  const [templateName, setTemplateName] = useState('Support Snapshot Theme');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [targetUserId, setTargetUserId] = useState<string>('');

  const userOptions = useMemo(
    () => getAllUsers().filter((entry) => entry.role === 'business_user'),
    [getAllUsers]
  );

  return (
    <div>
      <Header
        title="Admin Templates"
        description="Publish global themes and assign private theme snapshots to specific users."
      />
      <div className="space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-3 p-4">
            <h3 className="font-semibold">Create full-site template from current website</h3>
            <Input
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
              placeholder="Template name"
            />
            <Button
              disabled={!currentWebsite || !user}
              onClick={() => {
                if (!currentWebsite || !user) return;
                const snapshot = createTemplateFromWebsiteSnapshot(currentWebsite, templateName);
                createAsset({
                  name: snapshot.name,
                  description: snapshot.description,
                  kind: 'full_site',
                  payload: snapshot,
                  createdByUserId: user.id,
                });
              }}
            >
              Save template snapshot
            </Button>
          </Card>
          <Card className="space-y-3 p-4">
            <h3 className="font-semibold">Assign template to user (copy-on-assign)</h3>
            <div className="space-y-2">
              <Label>Template asset</Label>
              <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets
                    .filter((entry) => entry.kind === 'full_site' || entry.kind === 'blog_template')
                    .map((entry) => (
                      <SelectItem key={entry.id} value={entry.id}>
                        {entry.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target user</Label>
              <Select value={targetUserId} onValueChange={setTargetUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business user" />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {entry.name} ({entry.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              disabled={!selectedAssetId || !targetUserId || !user}
              onClick={() => {
                if (!selectedAssetId || !targetUserId || !user) return;
                assignAssetToUser(selectedAssetId, targetUserId, user.id);
              }}
            >
              Assign private copy
            </Button>
          </Card>
        </div>

        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Catalog assets</h3>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/templates/sections">Sections</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/templates/sites">Sites</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/templates/blog">Blog</Link>
              </Button>
            </div>
          </div>
          <div className="divide-y">
            {assets.map((asset) => (
              <div key={asset.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">{asset.description}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary">{asset.kind}</Badge>
                    <Badge>{asset.scope}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {asset.scope !== 'global' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (!user) return;
                        publishAssetGlobal(asset.id, user.id);
                      }}
                    >
                      Publish global
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {assets.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">No catalog assets yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
