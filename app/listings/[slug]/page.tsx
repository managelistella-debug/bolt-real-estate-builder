import { Metadata } from 'next';
import { ListingDetailTemplate } from '@/components/listings/ListingDetailTemplate';

interface ListingDetailsPageProps {
  params: { slug: string };
}

const toTitleCase = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export async function generateMetadata({ params }: ListingDetailsPageProps): Promise<Metadata> {
  const { slug } = params;
  const readableSlug = toTitleCase(slug);
  return {
    title: `${readableSlug} | Property Listing`,
    description: `View property details for ${readableSlug}.`,
    alternates: {
      canonical: `/listings/${slug}`,
    },
  };
}

export default async function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const { slug } = params;
  return <ListingDetailTemplate slug={slug} />;
}
