import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PublicPageShell } from '@/components/public/PublicPageShell';
import { getPublicListing } from '@/lib/publicSiteData';

export default function ActiveListingDetailPage({ params }: { params: { slug: string } }) {
  const listing = getPublicListing(params.slug, 'active');
  if (!listing) return notFound();

  return (
    <PublicPageShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#818181]">Active Listing</p>
        <h1 className="mt-2 font-serif text-[56px] leading-[1.1]">{listing.title}</h1>
        <p className="mt-2 text-[20px]">{listing.price}</p>
        <p className="mt-1 text-[14px] text-[#666]">
          {listing.beds} Bed · {listing.baths} Bath · {listing.city}
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <Image src={listing.image} alt={listing.title} width={1600} height={900} className="h-[460px] w-full object-cover" />
        <p className="mt-6 max-w-4xl text-[16px] leading-7 text-[#36363d]">{listing.description}</p>
      </section>
    </PublicPageShell>
  );
}
