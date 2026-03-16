import Header from "@/components/aspen/Header";
import Hero from "@/components/aspen/Hero";
import ServiceCards from "@/components/aspen/ServiceCards";
import Testimonials from "@/components/aspen/Testimonials";
import FeaturedListings from "@/components/aspen/FeaturedListings";
import HomepageBlogPreview from "@/components/aspen/HomepageBlogPreview";
import About from "@/components/aspen/About";
import Contact from "@/components/aspen/Contact";
import Footer from "@/components/aspen/Footer";
import { getFeaturedListings } from "@/lib/aspen/listings";
import { getHomeTestimonials } from "@/lib/aspen/testimonials";
import { getRecentPosts } from "@/lib/aspen/blog";

export default async function Home() {
  const [featuredListings, testimonials, recentPosts] = await Promise.all([
    getFeaturedListings(),
    getHomeTestimonials(),
    getRecentPosts(3),
  ]);

  return (
    <main className="overflow-x-clip">
      <Header />
      <Hero />
      <ServiceCards />
      <Testimonials testimonials={testimonials} />
      <FeaturedListings listings={featuredListings} />
      <HomepageBlogPreview posts={recentPosts} />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
