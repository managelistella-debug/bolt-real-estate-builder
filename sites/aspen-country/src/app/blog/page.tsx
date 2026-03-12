import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata = {
  title: "Blog | Aspen Muraski Real Estate",
  description:
    "Insights, market updates, and expert advice on buying and selling rural properties in Sundre, Mountain View County, and the Alberta foothills.",
};

export default function BlogPage() {
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <section className="relative w-full pt-[100px] md:pt-[140px] pb-10 md:pb-[60px] overflow-hidden">
        <div
          className="absolute inset-0 parallax-bg"
          style={{ backgroundImage: "url(/images/blog-banner.webp)" }}
        />
        <div className="absolute inset-0 bg-[#09312a]/85" />
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px]">
          <h1
            className="font-heading text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.13] text-white"
            style={{ fontWeight: 400 }}
          >
            Blog
          </h1>
          <p
            className="mt-4 md:mt-6 text-white/70 text-[15px] md:text-[16px] max-w-[600px] leading-[26px]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Insights, market updates, and expert advice on buying and selling
            rural properties in Sundre and the surrounding foothills.
          </p>
        </div>
      </section>
      <section className="bg-[#09312a]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-10 md:py-[60px]">
          <div
            data-bolt-embed="blog-feed"
            data-tenant-id="business-1772752217587"
            data-embed-id="embed_1773209433302_2wdm6t"
          />
        </div>
      </section>
      <Script
        src="https://bolt-real-estate-builder-dereks-projects-6a01aa79.vercel.app/embed/bolt-embed.js"
        strategy="afterInteractive"
      />
      <Footer />
    </main>
  );
}
