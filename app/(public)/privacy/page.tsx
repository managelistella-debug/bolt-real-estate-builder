import { Metadata } from "next";
import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import PrivacyContent from "@/components/aspen/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Aspen Muraski Real Estate",
  description:
    "Privacy policy for Aspen Muraski Real Estate, RE/MAX House of Real Estate.",
};

export default function PrivacyPage() {
  return (
    <main className="overflow-x-clip">
      <Header />
      <PrivacyContent />
      <Footer />
    </main>
  );
}
