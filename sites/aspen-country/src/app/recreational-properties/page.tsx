import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EstatesListingsPage from "@/components/estates/EstatesListingsPage";
import { getRecreationalPropertyListings } from "@/lib/listings";

export const metadata = {
  title: "Recreational Properties | Aspen Muraski Real Estate",
  description:
    "Browse recreational properties in Sundre, Mountain View County, and the Alberta foothills with Aspen Muraski.",
};

export default async function RecreationalPropertiesPage() {
  const listings = await getRecreationalPropertyListings();
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
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
