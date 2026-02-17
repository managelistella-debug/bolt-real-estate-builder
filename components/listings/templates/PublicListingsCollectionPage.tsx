'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { SiteHeader } from '@/components/site-header/SiteHeader';
import { SiteFooter } from '@/components/site-footer/SiteFooter';
import { useAuthStore } from '@/lib/stores/auth';
import { useWebsiteStore } from '@/lib/stores/website';
import { useListingsStore } from '@/lib/stores/listings';
import { useListingsTemplatesStore } from '@/lib/stores/listingsTemplates';
import { ListingsCollectionRenderer } from './ListingsCollectionRenderer';

interface PublicListingsCollectionPageProps {
  pageSlug?: string;
}

export function PublicListingsCollectionPage({ pageSlug }: PublicListingsCollectionPageProps) {
  const { user } = useAuthStore();
  const { currentWebsite, websites } = useWebsiteStore();
  const { listings } = useListingsStore();
  const { templates, initializeTemplatesForUser } = useListingsTemplatesStore();

  useEffect(() => {
    if (user) {
      initializeTemplatesForUser(user.id);
    }
  }, [initializeTemplatesForUser, user]);

  const website = currentWebsite ?? websites[0] ?? null;
  const userTemplates = useMemo(
    () => templates.filter((template) => (user?.id ? template.userId === user.id : true)),
    [templates, user?.id]
  );

  const template = useMemo(() => {
    if (pageSlug) {
      const bySlug = userTemplates.find((item) => item.pageSlug === pageSlug);
      if (bySlug) return bySlug;
    }
    return userTemplates.find((item) => item.isActive) ?? userTemplates[0];
  }, [pageSlug, userTemplates]);

  const userListings = useMemo(
    () => listings.filter((listing) => (user?.id ? listing.userId === user.id : true)),
    [listings, user?.id]
  );

  if (!template) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Listings collection not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure a listings template in your dashboard first.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {website && (
        <SiteHeader
          websiteName={website.name}
          header={website.header}
          globalStyles={website.globalStyles}
          deviceView="desktop"
          className="border-b border-black/10"
        />
      )}

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{template.name}</h1>
            <p className="text-sm text-black/60">Template preset: {template.preset}</p>
          </div>
          <Link href="/listings/templates" className="text-sm text-black/60 hover:text-black">
            Manage templates
          </Link>
        </div>
      </div>

      <ListingsCollectionRenderer template={template} listings={userListings} />

      {website && (
        <SiteFooter
          websiteName={website.name}
          footer={website.footer}
          headerNavigation={website.header.navigation}
          globalStyles={website.globalStyles}
          deviceView="desktop"
        />
      )}
    </div>
  );
}
