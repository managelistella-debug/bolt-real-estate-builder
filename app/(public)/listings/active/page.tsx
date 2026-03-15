import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import ActiveListingsPage from "@/components/aspen/listings/ActiveListingsPage";
import { getActiveListings } from "@/lib/aspen/listings";

export const metadata = {
  title: "Active Listings | Aspen Muraski Real Estate",
  description:
    "Explore current properties for sale across Mountain View County, Sundre, Olds, and the Alberta foothills with Aspen Muraski.",
};

export default async function ActiveListings() {
  const listings = await getActiveListings();

  return (
    <main className="overflow-x-clip">
      <Header />
      <ActiveListingsPage listings={listings} />
      <Footer />
    </main>
  );
}
