import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EstatesListingsPage from "@/components/estates/EstatesListingsPage";
import { getRanchEstateListings } from "@/lib/listings";

export const metadata = {
  title: "Acreages | Aspen Muraski Real Estate",
  description:
    "Explore exclusive acreages in Sundre, Mountain View County, and the Alberta foothills with Aspen Muraski.",
};

export default async function AcreagesPage() {
  const listings = await getRanchEstateListings();
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <EstatesListingsPage listings={listings} />
      <Footer />
    </main>
  );
}
