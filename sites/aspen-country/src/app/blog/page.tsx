import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCollectionPage from "@/components/blog/BlogCollectionPage";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Aspen Muraski Real Estate",
  description:
    "Insights, market updates, and expert advice on buying and selling rural properties in Sundre, Mountain View County, and the Alberta foothills.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <BlogCollectionPage posts={posts} />
      <Footer />
    </main>
  );
}
