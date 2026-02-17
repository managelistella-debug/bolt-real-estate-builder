'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/stores/auth';
import { useListingsTemplatesStore } from '@/lib/stores/listingsTemplates';
import { ListingCollectionTemplatePreset } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';

const PRESET_LABELS: Record<ListingCollectionTemplatePreset, string> = {
  editorial: 'Editorial',
  'hero-featured': 'Hero Featured',
  compact: 'Compact',
};

export default function ListingsTemplatesPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const {
    initializeTemplatesForUser,
    getTemplatesForUser,
    setActiveTemplate,
    createTemplateFromPreset,
  } = useListingsTemplatesStore();

  useEffect(() => {
    if (user) {
      initializeTemplatesForUser(user.id);
    }
  }, [initializeTemplatesForUser, user]);

  const templates = getTemplatesForUser(user?.id);

  const handleCreate = (preset: ListingCollectionTemplatePreset) => {
    if (!user) return;
    const template = createTemplateFromPreset(user.id, preset);
    toast({
      title: 'Template created',
      description: `${template.name} was added.`,
    });
  };

  return (
    <div>
      <Header
        title="Listings Templates"
        description="Manage collection page templates for active and sold listings"
      />

      <div className="p-6 space-y-6">
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => handleCreate('editorial')}>
              <Plus className="h-4 w-4 mr-2" />
              New Editorial Template
            </Button>
            <Button variant="outline" onClick={() => handleCreate('hero-featured')}>
              <Plus className="h-4 w-4 mr-2" />
              New Hero Template
            </Button>
            <Button variant="outline" onClick={() => handleCreate('compact')}>
              <Plus className="h-4 w-4 mr-2" />
              New Compact Template
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{template.name}</h3>
                {template.isActive && <Badge>Active</Badge>}
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Preset: {PRESET_LABELS[template.preset]}</p>
                <p>Page slug: /listings/collection/{template.pageSlug}</p>
                <p>Statuses: {template.statuses.join(', ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => user && setActiveTemplate(template.id, user.id)}
                  disabled={template.isActive}
                >
                  Set Active
                </Button>
                <Link href={`/listings/templates/editor/${template.id}`}>
                  <Button size="sm">Edit Template</Button>
                </Link>
                <Link href={`/listings/collection/${template.pageSlug}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
