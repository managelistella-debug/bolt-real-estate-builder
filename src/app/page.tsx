import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCards from "@/components/ServiceCards";
import Testimonials from "@/components/Testimonials";
import FeaturedListings from "@/components/FeaturedListings";
import HomepageBlogSection from "@/components/HomepageBlogSection";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getFeaturedListings } from "@/lib/listings";
import { getTestimonials } from "@/lib/testimonials";
import { getRecentPosts } from "@/lib/blog";

export default async function Home() {
  const [featuredListings, testimonials, recentPosts] = await Promise.all([
    getFeaturedListings(),
    getTestimonials(),
    getRecentPosts(3),
  ]);

  return (
    <main className="overflow-x-clip">
      <Header />
      <Hero />
      <ServiceCards />
      <Testimonials testimonials={testimonials} />
      <FeaturedListings listings={featuredListings} />
      <HomepageBlogSection posts={recentPosts} />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
