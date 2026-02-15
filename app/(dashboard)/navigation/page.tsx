'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebsiteStore } from '@/lib/stores/website';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';
import { NavItem, Page } from '@/lib/types';
import { normalizeHeaderConfig } from '@/lib/header-config';
import { ArrowDown, ArrowUp, Link2, Plus, Trash2 } from 'lucide-react';

function toNavItemFromPage(page: Page, order: number): NavItem {
  return {
    id: `nav-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: page.name,
    url: page.slug,
    order,
    source: 'page',
    pageId: page.id,
  };
}

export default function NavigationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { getCurrentUserWebsite, initializeUserWebsite, updateWebsite, updatePage } = useWebsiteStore();
  const [items, setItems] = useState<NavItem[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');

  useEffect(() => {
    if (user) initializeUserWebsite(user.id);
  }, [user, initializeUserWebsite]);

  const website = getCurrentUserWebsite();

  useEffect(() => {
    if (!website) return;
    const config = normalizeHeaderConfig(website.header);
    const sorted = [...config.navigation].sort((a, b) => a.order - b.order);
    setItems(sorted);
    if (website.pages.length > 0) {
      setSelectedPageId(website.pages[0].id);
    }
  }, [website]);

  const pageOptions = useMemo(() => website?.pages || [], [website?.pages]);

  if (!website) {
    return <div className="p-6">Loading navigation...</div>;
  }

  const renumber = (next: NavItem[]) => next.map((item, index) => ({ ...item, order: index }));

  const addSelectedPage = () => {
    const page = website.pages.find((p) => p.id === selectedPageId);
    if (!page) return;
    setItems((prev) => [...prev, toNavItemFromPage(page, prev.length)]);
  };

  const addCustomLink = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `nav-${Date.now()}`,
        label: 'New Link',
        url: '/',
        order: prev.length,
        source: 'custom',
      },
    ]);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return renumber(next);
    });
  };

  const updateItem = (id: string, updates: Partial<NavItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => renumber(prev.filter((item) => item.id !== id)));
  };

  const saveNavigation = () => {
    const normalizedHeader = normalizeHeaderConfig(website.header);
    updateWebsite(website.id, {
      header: {
        ...normalizedHeader,
        navigation: renumber(items),
      },
    });
    toast({ title: 'Navigation saved', description: 'Header menu items were updated.' });
  };

  const togglePageCustomHeader = (page: Page, enabled: boolean) => {
    updatePage(page.id, {
      headerSettings: {
        useCustomHeader: enabled,
        headerOverride: enabled ? page.headerSettings?.headerOverride || normalizeHeaderConfig(website.header) : undefined,
      },
    });
  };

  return (
    <div>
      <Header
        title="Navigation"
        description="Manage menu links and page-level header assignment"
        action={<Button onClick={saveNavigation}>Save Navigation</Button>}
      />

      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <Card className="p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Menu Items</h2>
            <p className="text-sm text-muted-foreground">Select pages, add custom links, and reorder your navigation.</p>
          </div>

          <div className="rounded-md border p-3 space-y-3">
            <Label>Add Existing Page</Label>
            <div className="flex gap-2">
              <Select value={selectedPageId} onValueChange={setSelectedPageId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageOptions.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={addSelectedPage}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={addCustomLink}>
              <Link2 className="h-4 w-4 mr-2" />
              Add Custom URL
            </Button>
          </div>

          <div className="space-y-3">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground border rounded-md p-4">No menu items yet. Add a page or custom link.</p>
            )}
            {items.map((item, index) => (
              <div key={item.id} className="space-y-2 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{item.source === 'page' ? 'Page Link' : 'Custom Link'}</p>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => moveItem(index, -1)} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={item.label} onChange={(e) => updateItem(item.id, { label: e.target.value })} placeholder="Label" />
                  <Input value={item.url} onChange={(e) => updateItem(item.id, { url: e.target.value })} placeholder="/about or https://..." />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Open in new tab</Label>
                  <Switch checked={item.openInNewTab || false} onCheckedChange={(checked) => updateItem(item.id, { openInNewTab: checked })} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Header Assignment by Page</h2>
            <p className="text-sm text-muted-foreground">Choose whether each page uses the global header or a page-specific override.</p>
          </div>
          <div className="space-y-3">
            {website.pages.map((page) => (
              <div key={page.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{page.name}</p>
                    <p className="text-xs text-muted-foreground">{page.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Custom Header</Label>
                    <Switch
                      checked={page.headerSettings?.useCustomHeader || false}
                      onCheckedChange={(checked) => togglePageCustomHeader(page, checked)}
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/header-footer?target=${page.id}`)}
                    disabled={!page.headerSettings?.useCustomHeader}
                  >
                    Edit Page Header
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
