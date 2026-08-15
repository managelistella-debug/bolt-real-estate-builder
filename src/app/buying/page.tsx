import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BuyingHero from "@/components/buying/BuyingHero";
import BuyingProcess from "@/components/buying/BuyingProcess";
import LandExpertise from "@/components/buying/LandExpertise";
import MortgageCalculator from "@/components/buying/MortgageCalculator";

export const metadata: Metadata = {
  title: "Buying | Aspen Muraski Real Estate",
  description:
    "Expert guidance for buying land, acreages, and estate properties. Aspen Muraski helps you navigate every step of the buying process with confidence.",
};

export default function BuyingPage() {
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <BuyingHero />
      <BuyingProcess />
      <LandExpertise />
      <MortgageCalculator />
      <Footer />
    </main>
  );
}
