import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ActiveListingsPage from "@/components/listings/ActiveListingsPage";
import { getActiveListings } from "@/lib/listings";

export const metadata = {
  title: "Active Listings | Aspen Muraski Real Estate",
  description:
    "Explore current properties for sale across Mountain View County, Sundre, Olds, and the Alberta foothills with Aspen Muraski.",
};

export default async function ActiveListings() {
  const listings = await getActiveListings();

  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <ActiveListingsPage listings={listings} />
      <Footer />
    </main>
  );
}
