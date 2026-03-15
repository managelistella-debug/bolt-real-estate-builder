import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import EstatesListingsPage from "@/components/aspen/estates/EstatesListingsPage";
import { getRanchEstateListings } from "@/lib/aspen/listings";

export const metadata = {
  title: "Estates & Ranch Properties | Aspen Muraski Real Estate",
  description:
    "Explore exclusive estate and ranch properties in Sundre, Mountain View County, and the Alberta foothills with Aspen Muraski.",
};

export default async function EstatesPage() {
  const listings = await getRanchEstateListings();
  return (
    <main className="overflow-x-clip">
      <Header />
      <EstatesListingsPage listings={listings} />
      <Footer />
    </main>
  );
}
