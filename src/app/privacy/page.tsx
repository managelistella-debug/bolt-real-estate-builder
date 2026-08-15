import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrivacyContent from "@/components/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Aspen Muraski Real Estate",
  description:
    "Privacy policy for Aspen Muraski Real Estate, RE/MAX House of Real Estate.",
};

export default function PrivacyPage() {
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <PrivacyContent />
      <Footer />
    </main>
  );
}
