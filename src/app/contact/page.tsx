import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact | Aspen Muraski Real Estate",
  description:
    "Get in touch with Aspen Muraski for buying, selling, or general real estate inquiries in Mountain View County and surrounding areas.",
};

export default function ContactPage() {
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <ContactHero />
      <ContactSection />
      <Footer />
    </main>
  );
}
