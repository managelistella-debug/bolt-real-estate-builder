import Image from 'next/image';
import { PublicPageShell } from '@/components/public/PublicPageShell';
import { stockSectionImages } from '@/lib/publicSiteData';

export default function ContactPage() {
  return (
    <PublicPageShell>
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#818181]">Contact</p>
          <h1 className="mt-2 font-serif text-[56px] leading-[1.1]">Let&apos;s Talk About Your Move</h1>
          <p className="mt-4 text-[16px] leading-7 text-[#36363d]">
            Share what you&apos;re looking for and our team will follow up with curated options and next
            steps.
          </p>
          <div className="mt-6 text-[15px] text-[#36363d]">
            <p>(555) 123-4567</p>
            <p>info@prestigerealty.com</p>
            <p>123 Grand Avenue, Suite 200, Beverly Hills, CA 90210</p>
          </div>
        </div>
        <form className="space-y-3 border border-[#e4dfd8] bg-white p-6">
          <input className="w-full border border-[#e4dfd8] p-3" placeholder="Name" />
          <input className="w-full border border-[#e4dfd8] p-3" placeholder="Email" type="email" />
          <input className="w-full border border-[#e4dfd8] p-3" placeholder="Phone" type="tel" />
          <textarea className="w-full border border-[#e4dfd8] p-3" placeholder="Message" rows={5} />
          <button className="bg-[#c28563] px-6 py-3 text-[11px] uppercase tracking-[0.04em] text-[#f7f8f6]" type="button">
            Submit
          </button>
        </form>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <Image
          src={stockSectionImages.contact}
          alt="Luxury real estate contact"
          width={1600}
          height={900}
          className="h-[360px] w-full object-cover"
        />
      </section>
    </PublicPageShell>
  );
}
