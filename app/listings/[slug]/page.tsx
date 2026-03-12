import Script from 'next/script';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { PublicPageShell } from '@/components/public/PublicPageShell';
import { ListingDetailContent } from '@/components/listings/ListingDetailContent';
import { formatListingPrice, getPrimaryListingImage } from '@/lib/listings';
import { getPublicListingBySlug } from '@/lib/server/publicContent';

interface ListingDetailsPageProps {
  params: { slug: string };
}

export const revalidate = 300;

function getBaseUrl(host?: string | null) {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL;
  if (envBase) return envBase.replace(/\/$/, '');
  if (!host) return null;
  return `https://${host.replace(/:\d+$/, '')}`;
}

export async function generateMetadata({ params }: ListingDetailsPageProps): Promise<Metadata> {
  const headerStore = headers();
  const host = headerStore.get('x-site-host') || headerStore.get('host');
  const listing = await getPublicListingBySlug(params.slug, host);
  if (!listing) {
    return {
      title: 'Listing Not Found',
      robots: { index: false, follow: false },
    };
  }
  const baseUrl = getBaseUrl(host);
  const canonical = `/listings/${listing.slug}`;
  const image = getPrimaryListingImage(listing);
  const description = listing.description.slice(0, 155);

  return {
    title: `${listing.address} | ${formatListingPrice(listing.listPrice)}`,
    description,
    alternates: {
      canonical: `/listings/${listing.slug}`,
    },
    openGraph: {
      type: 'article',
      title: `${listing.address} | ${formatListingPrice(listing.listPrice)}`,
      description,
      url: baseUrl ? `${baseUrl}${canonical}` : undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: `${listing.address} | ${formatListingPrice(listing.listPrice)}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const headerStore = headers();
  const host = headerStore.get('x-site-host') || headerStore.get('host');
  const listing = await getPublicListingBySlug(params.slug, host);
  if (!listing) return notFound();

  const listingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.address,
    description: listing.description,
    url: `/listings/${listing.slug}`,
    image: listing.gallery.map((image) => image.url),
    datePosted: new Date(listing.createdAt).toISOString(),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: listing.listPrice,
      availability: listing.listingStatus === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
    itemOffered: {
      '@type': 'Residence',
      address: {
        '@type': 'PostalAddress',
        streetAddress: listing.address,
        addressLocality: listing.city,
      },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: listing.livingAreaSqft,
        unitText: 'sqft',
      },
      numberOfRooms: listing.bedrooms,
      numberOfBathroomsTotal: listing.bathrooms,
      yearBuilt: listing.yearBuilt,
    },
  };

  return (
    <PublicPageShell>
      <Script
        id={`listing-jsonld-${listing.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }}
      />
      <ListingDetailContent
        listing={listing}
        backHref={listing.listingStatus === 'sold' ? '/listings/sold' : '/listings/active'}
        agent={{
          name: 'Listing Agent',
          email: undefined,
          phone: undefined,
        }}
      />
    </PublicPageShell>
  );
}
