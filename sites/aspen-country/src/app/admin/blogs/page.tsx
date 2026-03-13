import BlogManager from "@/components/admin/BlogManager";

export default function AdminBlogsPage() {
  return (
    <div>
      <h1 className="font-heading text-4xl text-white" style={{ fontWeight: 400 }}>
        Blogs
      </h1>
      <p className="mt-2 text-white/70">Create and update blog collection and detail content.</p>
      <div className="mt-6">
        <BlogManager />
      </div>
    </div>
  );
}
