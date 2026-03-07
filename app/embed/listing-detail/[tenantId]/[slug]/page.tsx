import { Metadata } from 'next';
import { getServiceClient } from '@/lib/supabase/server';
import { EmbedDetailClient } from './client';

interface Props {
  params: Promise<{ tenantId: string; slug: string }>;
}

async function getListing(tenantId: string, slug: string) {
  const sb = getServiceClient();

  const possibleTenantIds = [tenantId];
  const { data: profiles } = await sb
    .from('profiles')
    .select('id')
    .eq('business_id', tenantId);
  if (profiles) {
    profiles.forEach((p: { id: string }) => {
      if (!possibleTenantIds.includes(p.id)) possibleTenantIds.push(p.id);
    });
  }

  const { data } = await sb
    .from('listings')
    .select('*')
    .in('tenant_id', possibleTenantIds)
    .eq('slug', slug)
    .maybeSingle();

  return data;
}

async function getDetailConfig(tenantId: string) {
  const sb = getServiceClient();
  const { data } = await sb
    .from('embed_configs')
    .select('config')
    .eq('tenant_id', tenantId)
    .eq('type', 'listing_detail')
    .maybeSingle();
  return data?.config || {};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenantId, slug } = await params;
  const listing = await getListing(tenantId, slug);

  if (!listing) {
    return { title: 'Listing Not Found' };
  }

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(listing.list_price || 0);

  return {
    title: `${listing.address} | ${price}`,
    description: `${listing.bedrooms} bed, ${listing.bathrooms} bath, ${listing.living_area_sqft?.toLocaleString()} sqft property in ${listing.city}. ${listing.description?.slice(0, 150)}`,
    openGraph: {
      title: `${listing.address} - ${price}`,
      description: listing.description?.slice(0, 200),
      images: listing.thumbnail
        ? [{ url: listing.thumbnail, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

export default async function EmbedListingDetailPage({ params }: Props) {
  const { tenantId, slug } = await params;
  const [listing, detailConfig] = await Promise.all([
    getListing(tenantId, slug),
    getDetailConfig(tenantId),
  ]);

  if (!listing) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ color: '#888' }}>Listing not found.</p>
      </div>
    );
  }

  return <EmbedDetailClient listing={listing} config={detailConfig} />;
}
