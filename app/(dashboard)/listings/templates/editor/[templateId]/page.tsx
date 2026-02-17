'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { useListingsStore } from '@/lib/stores/listings';
import { useListingsTemplatesStore } from '@/lib/stores/listingsTemplates';
import { ListingsTemplateEditorPanel } from '@/components/listings/templates/ListingsTemplateEditorPanel';
import { ListingsCollectionRenderer } from '@/components/listings/templates/ListingsCollectionRenderer';
import { ArrowLeft, Save } from 'lucide-react';

export default function ListingsTemplateEditorPage() {
  const params = useParams<{ templateId: string }>();
  const templateId = params?.templateId;
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { listings } = useListingsStore();
  const { initializeTemplatesForUser, getTemplateById, updateTemplate } = useListingsTemplatesStore();

  useEffect(() => {
    if (user) {
      initializeTemplatesForUser(user.id);
    }
  }, [initializeTemplatesForUser, user]);

  const template = getTemplateById(templateId);
  const userListings = useMemo(
    () => listings.filter((listing) => (user?.id ? listing.userId === user.id : true)),
    [listings, user?.id]
  );

  if (!template) {
    return (
      <div className="h-screen grid place-items-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Template not found</h1>
          <Link href="/listings/templates">
            <Button variant="outline" className="mt-3">Back to templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Link href="/listings/templates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">{template.name}</h1>
            <p className="text-xs text-muted-foreground">Listings template editor</p>
          </div>
        </div>
        <Button
          onClick={() => {
            toast({ title: 'Template saved', description: 'Your template settings were updated.' });
          }}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[380px] border-r bg-background overflow-auto">
          <ListingsTemplateEditorPanel
            template={template}
            onChange={(updates) => updateTemplate(template.id, updates)}
          />
        </aside>
        <main className="flex-1 overflow-auto bg-muted/20">
          <ListingsCollectionRenderer template={template} listings={userListings} previewMode />
        </main>
      </div>
    </div>
  );
}
