import Image from 'next/image';
import { PublicPageShell } from '@/components/public/PublicPageShell';
import { stockSectionImages } from '@/lib/publicSiteData';

export default function BuyingPage() {
  return (
    <PublicPageShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#818181]">Buying Services</p>
        <h1 className="mt-2 font-serif text-[56px] leading-[1.1]">Find Your Next Home With Confidence</h1>
        <p className="mt-4 max-w-3xl text-[16px] leading-7 text-[#36363d]">
          We guide buyers through every step, from neighborhood selection and showings to negotiation
          and close. Explore active listings and request private tours directly from our team.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <Image
          src={stockSectionImages.buying}
          alt="Luxury real estate buying"
          width={1600}
          height={900}
          className="h-[420px] w-full object-cover"
        />
      </section>
    </PublicPageShell>
  );
}
