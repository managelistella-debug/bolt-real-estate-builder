'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { useTenantContextStore } from '@/lib/stores/tenantContext';
import { useListingsStore } from '@/lib/stores/listings';
import { useBlogsStore } from '@/lib/stores/blogs';
import { useLeadsStore } from '@/lib/stores/leads';
import { useTestimonialsStore } from '@/lib/stores/testimonials';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { useIntegrationsStore } from '@/lib/stores/integrations';

export function useDataLoader() {
  const { user, isAuthenticated } = useAuthStore();
  const { effectiveUserId } = useTenantContextStore();

  const { loaded: listingsLoaded, fetchListings } = useListingsStore();
  const { loaded: blogsLoaded, fetchBlogs } = useBlogsStore();
  const { loaded: leadsLoaded, fetchLeads } = useLeadsStore();
  const { loaded: testimonialsLoaded, fetchTestimonials } = useTestimonialsStore();
  const { loaded: collectionsLoaded, fetchCollections } = useImageCollectionsStore();
  const { loaded: integrationsLoaded, fetchConfig } = useIntegrationsStore();

  const tenantId = effectiveUserId || user?.id;

  useEffect(() => {
    if (!isAuthenticated || !tenantId) return;

    if (!listingsLoaded) fetchListings(tenantId);
    if (!blogsLoaded) fetchBlogs(tenantId);
    if (!leadsLoaded) fetchLeads(tenantId);
    if (!testimonialsLoaded) fetchTestimonials(tenantId);
    if (!collectionsLoaded) fetchCollections(tenantId);
    if (!integrationsLoaded) fetchConfig(tenantId);
  }, [
    isAuthenticated,
    tenantId,
    listingsLoaded,
    blogsLoaded,
    leadsLoaded,
    testimonialsLoaded,
    collectionsLoaded,
    integrationsLoaded,
    fetchListings,
    fetchBlogs,
    fetchLeads,
    fetchTestimonials,
    fetchCollections,
    fetchConfig,
  ]);
}
