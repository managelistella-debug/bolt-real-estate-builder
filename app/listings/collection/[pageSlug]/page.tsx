import { PublicListingsCollectionPage } from '@/components/listings/templates/PublicListingsCollectionPage';

interface ListingsCollectionSlugPageProps {
  params: { pageSlug: string };
}

export default function ListingsCollectionSlugPage({ params }: ListingsCollectionSlugPageProps) {
  return <PublicListingsCollectionPage pageSlug={params.pageSlug} />;
}
