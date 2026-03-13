import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutTestimonials from "@/components/about/AboutTestimonials";
import AboutCTA from "@/components/about/AboutCTA";
import { getAboutTestimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "About Aspen | Aspen Muraski Real Estate",
  description:
    "Meet Aspen Muraski — a dedicated Mountain View County realtor specializing in acreages, farms, and estate properties with a strategic, client-first approach.",
};

export default async function AboutPage() {
  const testimonials = await getAboutTestimonials();
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <AboutHero />
      <AboutStory />
      <AboutTestimonials testimonials={testimonials} />
      <AboutCTA />
      <Footer />
    </main>
  );
}
