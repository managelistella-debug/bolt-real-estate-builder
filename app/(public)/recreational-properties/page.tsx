import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import EstatesListingsPage from "@/components/aspen/estates/EstatesListingsPage";
import { getRecreationalPropertyListings } from "@/lib/aspen/listings";

export const metadata = {
  title: "Recreational Properties | Aspen Muraski Real Estate",
  description:
    "Browse recreational properties in Sundre, Mountain View County, and the Alberta foothills with Aspen Muraski.",
};

export default async function RecreationalPropertiesPage() {
  const listings = await getRecreationalPropertyListings();
  return (
    <main className="overflow-x-clip">
      <Header />
      <EstatesListingsPage
        listings={listings}
        title="Recreational Properties"
        description="Discover recreational land and getaway properties across Sundre, Mountain View County, and the surrounding Alberta foothills."
      />
      <Footer />
    </main>
  );
}
