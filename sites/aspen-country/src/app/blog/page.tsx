import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCollectionPage from "@/components/blog/BlogCollectionPage";

export const metadata = {
  title: "Blog | Aspen Muraski Real Estate",
  description:
    "Insights, market updates, and expert advice on buying and selling rural properties in Sundre, Mountain View County, and the Alberta foothills.",
};

export default function BlogPage() {
  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <BlogCollectionPage />
      <Footer />
    </main>
  );
}
