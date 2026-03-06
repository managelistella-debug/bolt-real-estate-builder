import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ActiveListingsPage from "@/components/listings/ActiveListingsPage";

export const metadata = {
  title: "Active Listings | Aspen Muraski Real Estate",
  description:
    "Explore current properties for sale across Mountain View County, Sundre, Olds, and the Alberta foothills with Aspen Muraski.",
};

export default function ActiveListings() {
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <ActiveListingsPage />
      <Footer />
    </main>
  );
}
