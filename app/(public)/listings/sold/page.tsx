import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import SoldListingsPage from "@/components/aspen/listings/SoldListingsPage";
import { getSoldListings } from "@/lib/aspen/listings";

export const metadata = {
  title: "Sold Properties | Aspen Muraski Real Estate",
  description:
    "View properties successfully sold by Aspen Muraski across Alberta's foothills region.",
};

export default async function SoldListings() {
  const listings = await getSoldListings();

  return (
    <main className="overflow-x-clip">
      <Header />
      <SoldListingsPage listings={listings} />
      <Footer />
    </main>
  );
}
