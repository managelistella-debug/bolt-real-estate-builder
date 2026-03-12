import { redirect } from 'next/navigation';

export default function ActiveListingDetailPage({ params }: { params: { slug: string } }) {
  redirect(`/listings/${params.slug}`);
}
