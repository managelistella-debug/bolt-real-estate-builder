import type { Metadata } from "next";
import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import SellingHero from "@/components/aspen/selling/SellingHero";
import MarketingServices from "@/components/aspen/selling/MarketingServices";
import SellingProcess from "@/components/aspen/selling/SellingProcess";
import ConsultationCTA from "@/components/aspen/selling/ConsultationCTA";

export const metadata: Metadata = {
  title: "Selling | Aspen Muraski Real Estate",
  description:
    "Aspen's tailored marketing approach and strategic selling process ensures your property reaches the right buyers and sells with confidence.",
};

export default function SellingPage() {
  return (
    <main className="overflow-x-clip">
      <Header />
      <SellingHero />
      <MarketingServices />
      <SellingProcess />
      <ConsultationCTA />
      <Footer />
    </main>
  );
}
