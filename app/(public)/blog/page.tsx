import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import BlogCollectionPage from "@/components/aspen/blog/BlogCollectionPage";
import { getAllPosts } from "@/lib/aspen/blog";

export const metadata = {
  title: "Blog | Aspen Muraski Real Estate",
  description:
    "Insights, market updates, and expert advice on buying and selling rural properties in Sundre, Mountain View County, and the Alberta foothills.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="overflow-x-clip">
      <Header />
      <BlogCollectionPage posts={posts} />
      <Footer />
    </main>
  );
}
