import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCards from "@/components/ServiceCards";
import Testimonials from "@/components/Testimonials";
import FeaturedListings from "@/components/FeaturedListings";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getFeaturedListings } from "@/lib/listings";
import { getHomeTestimonials } from "@/lib/testimonials";

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
