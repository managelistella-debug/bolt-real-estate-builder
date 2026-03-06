import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SoldListingsPage from "@/components/listings/SoldListingsPage";

export const metadata = {
  title: "Sold Properties | Aspen Muraski Real Estate",
  description:
    "View properties successfully sold by Aspen Muraski across Alberta's foothills region.",
};

export default function SoldListings() {
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <SoldListingsPage />
      <Footer />
    </main>
  );
}
