import type { Metadata } from "next";
import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import AboutHero from "@/components/aspen/about/AboutHero";
import AboutStory from "@/components/aspen/about/AboutStory";
import AboutTestimonials from "@/components/aspen/about/AboutTestimonials";
import AboutCTA from "@/components/aspen/about/AboutCTA";
import { getAboutTestimonials } from "@/lib/aspen/testimonials";

export const metadata: Metadata = {
  title: "About Aspen | Aspen Muraski Real Estate",
  description:
    "Meet Aspen Muraski — a dedicated Mountain View County realtor specializing in acreages, farms, and estate properties with a strategic, client-first approach.",
};

export default async function AboutPage() {
  const testimonials = await getAboutTestimonials();
  return (
    <main className="overflow-x-clip">
      <Header />
      <AboutHero />
      <AboutStory />
      <AboutTestimonials testimonials={testimonials} />
      <AboutCTA />
      <Footer />
    </main>
  );
}
