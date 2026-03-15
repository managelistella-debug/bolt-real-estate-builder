import type { Metadata } from "next";
import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import ContactHero from "@/components/aspen/contact/ContactHero";
import ContactSection from "@/components/aspen/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact | Aspen Muraski Real Estate",
  description:
    "Get in touch with Aspen Muraski for buying, selling, or general real estate inquiries in Mountain View County and surrounding areas.",
};

export default function ContactPage() {
  return (
    <main className="overflow-x-clip">
      <Header />
      <ContactHero />
      <ContactSection />
      <Footer />
    </main>
  );
}
