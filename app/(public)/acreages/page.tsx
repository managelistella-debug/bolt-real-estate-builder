import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import EstatesListingsPage from "@/components/aspen/estates/EstatesListingsPage";
import { getRanchEstateListings } from "@/lib/aspen/listings";

export const metadata = {
  title: "Acreages | Aspen Muraski Real Estate",
  description:
    "Explore exclusive acreages in Sundre, Mountain View County, and the Alberta foothills with Aspen Muraski.",
};

export default async function AcreagesPage() {
  const listings = await getRanchEstateListings();
  return (
    <main className="overflow-x-clip">
      <Header />
      <EstatesListingsPage listings={listings} />
      <Footer />
    </main>
  );
}
