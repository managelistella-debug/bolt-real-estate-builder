import type { Metadata } from "next";
import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import BuyingHero from "@/components/aspen/buying/BuyingHero";
import BuyingProcess from "@/components/aspen/buying/BuyingProcess";
import LandExpertise from "@/components/aspen/buying/LandExpertise";
import MortgageCalculator from "@/components/aspen/buying/MortgageCalculator";

export const metadata: Metadata = {
  title: "Buying | Aspen Muraski Real Estate",
  description:
    "Expert guidance for buying land, acreages, and estate properties. Aspen Muraski helps you navigate every step of the buying process with confidence.",
};

export default function BuyingPage() {
  return (
    <main className="overflow-x-clip">
      <Header />
      <BuyingHero />
      <BuyingProcess />
      <LandExpertise />
      <MortgageCalculator />
      <Footer />
    </main>
  );
}
