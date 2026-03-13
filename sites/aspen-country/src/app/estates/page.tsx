import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EstatesListingsPage from "@/components/estates/EstatesListingsPage";
import { getRanchEstateListings } from "@/lib/listings";

export const metadata = {
  title: "Estates & Ranch Properties | Aspen Muraski Real Estate",
  description:
    "Explore exclusive estate and ranch properties in Sundre, Mountain View County, and the Alberta foothills with Aspen Muraski.",
};

export default async function EstatesPage() {
  const listings = await getRanchEstateListings();
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <EstatesListingsPage listings={listings} />
      <Footer />
    </main>
  );
}
