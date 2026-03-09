import Script from "next/script";

export default function FeaturedListings() {
  return (
    <section id="featured" className="bg-[#09312a]">
      <div className="max-w-[1440px] mx-auto py-10 md:py-[60px] px-5 md:px-10 lg:px-[60px]">
        <div
          data-bolt-embed="listing-feed"
          data-tenant-id="business-1772752217587"
          data-embed-id="embed_1773034270410_gyopck"
        />
        <Script
          src="https://bolt-real-estate-builder-dereks-projects-6a01aa79.vercel.app/embed/bolt-embed.js"
          strategy="afterInteractive"
        />
      </div>
    </section>
  );
}
