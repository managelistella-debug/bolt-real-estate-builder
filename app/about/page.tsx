import Image from 'next/image';
import { PublicPageShell } from '@/components/public/PublicPageShell';
import { stockSectionImages } from '@/lib/publicSiteData';

export default function AboutPage() {
  return (
    <PublicPageShell>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#818181]">About</p>
        <h1 className="mt-2 font-serif text-[56px] leading-[1.1]">Local Expertise. Global Standards.</h1>
        <p className="mt-4 max-w-3xl text-[16px] leading-7 text-[#36363d]">
          Prestige Realty supports buyers and sellers with market knowledge, white-glove communication,
          and thoughtful strategy. We specialize in high-end residential transactions and client-first service.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <Image
          src={stockSectionImages.about}
          alt="Luxury real estate professional team"
          width={1600}
          height={900}
          className="h-[420px] w-full object-cover"
        />
      </section>
    </PublicPageShell>
  );
}
