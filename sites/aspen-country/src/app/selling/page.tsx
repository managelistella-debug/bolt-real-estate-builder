import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SellingHero from "@/components/selling/SellingHero";
import MarketingServices from "@/components/selling/MarketingServices";
import SellingProcess from "@/components/selling/SellingProcess";
import ConsultationCTA from "@/components/selling/ConsultationCTA";

export const metadata: Metadata = {
  title: "Selling | Aspen Muraski Real Estate",
  description:
    "Aspen's tailored marketing approach and strategic selling process ensures your property reaches the right buyers and sells with confidence.",
};

export default function SellingPage() {
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <SellingHero />
      <MarketingServices />
      <SellingProcess />
      <ConsultationCTA />
      <Footer />
    </main>
  );
}
