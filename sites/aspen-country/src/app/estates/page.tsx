import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EstatesListingsPage from "@/components/estates/EstatesListingsPage";

export const metadata = {
  title: "Estates & Ranch Properties | Aspen Muraski Real Estate",
  description:
    "Explore exclusive estate and ranch properties in Sundre, Mountain View County, and the Alberta foothills with Aspen Muraski.",
};

export default function EstatesPage() {
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <EstatesListingsPage />
      <Footer />
    </main>
  );
}
