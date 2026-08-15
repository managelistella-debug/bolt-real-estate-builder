import BlogPostForm from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h2 className="font-heading text-white text-[24px] mb-6" style={{ fontWeight: 400 }}>
        New Blog Post
      </h2>
      <BlogPostForm />
    </div>
  );
}
