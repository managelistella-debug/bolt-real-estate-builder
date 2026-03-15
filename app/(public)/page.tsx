import Header from "@/components/aspen/Header";
import Hero from "@/components/aspen/Hero";
import ServiceCards from "@/components/aspen/ServiceCards";
import Testimonials from "@/components/aspen/Testimonials";
import FeaturedListings from "@/components/aspen/FeaturedListings";
import About from "@/components/aspen/About";
import Contact from "@/components/aspen/Contact";
import Footer from "@/components/aspen/Footer";
import { getFeaturedListings } from "@/lib/aspen/listings";
import { getHomeTestimonials } from "@/lib/aspen/testimonials";

export default async function Home() {
  const [featuredListings, testimonials] = await Promise.all([
    getFeaturedListings(),
    getHomeTestimonials(),
  ]);

  return (
    <main className="overflow-x-clip">
      <Header />
      <Hero />
      <ServiceCards />
      <Testimonials testimonials={testimonials} />
      <FeaturedListings listings={featuredListings} />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
