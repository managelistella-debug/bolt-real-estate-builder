import Link from 'next/link';
import Image from 'next/image';
import { PublicPageShell } from '@/components/public/PublicPageShell';
import { getListingsByStatus } from '@/lib/publicSiteData';

export default function SoldListingsPage() {
  const listings = getListingsByStatus('sold');
  return (
    <PublicPageShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#818181]">Listings</p>
        <h1 className="mt-2 font-serif text-[56px] leading-[1.1]">Featured Sales</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.slug}
              href={`/listings/sold/${listing.slug}`}
              className="border border-[#e4dfd8] bg-white"
            >
              <Image src={listing.image} alt={listing.title} width={900} height={600} className="h-52 w-full object-cover" />
              <div className="p-4">
                <h2 className="font-serif text-[30px]">{listing.title}</h2>
                <p className="text-[14px] text-[#555]">{listing.city}</p>
                <p className="mt-2 text-[16px]">{listing.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
