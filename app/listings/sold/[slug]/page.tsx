import { redirect } from 'next/navigation';

export default function SoldListingDetailPage({ params }: { params: { slug: string } }) {
  redirect(`/listings/${params.slug}`);
}
