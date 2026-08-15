"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminJson } from "@/lib/admin/adminFetch";

interface AdminPostRow {
  _id: string;
  title: string;
  slug: { current: string };
  publishedDate: string;
  authorName: string;
  published: boolean;
  category?: { name: string } | null;
}

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<AdminPostRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { posts } = await adminJson<{ posts: AdminPostRow[] }>("/api/admin/blog-posts");
    setPosts(posts);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublished(post: AdminPostRow) {
    setPosts((prev) => prev.map((p) => (p._id === post._id ? { ...p, published: !p.published } : p)));
    await adminJson(`/api/admin/blog-posts/${post._id}`, {
      method: "PATCH",
      body: JSON.stringify({ published: !post.published }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This can't be undone.")) return;
    await adminJson(`/api/admin/blog-posts/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-heading text-white text-[24px]" style={{ fontWeight: 400 }}>
          Blog Posts
        </h2>
        <Link href="/admin/blog/new" className="gold-gradient-bg text-[#09312a] font-semibold text-[13px] px-4 py-2">
          + New Post
        </Link>
      </div>

      {loading ? (
        <p className="text-white/50 text-[14px]">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-white/50 text-[14px]">No blog posts yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr className="text-white/40 border-b border-white/10">
                <th className="py-2 pr-3">Title</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Author</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Published</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-b border-white/5 text-white/80">
                  <td className="py-2 pr-3">
                    <Link href={`/admin/blog/${post._id}`} className="hover:text-[#daaf3a]">
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-2 pr-3">{post.category?.name || "—"}</td>
                  <td className="py-2 pr-3">{post.authorName}</td>
                  <td className="py-2 pr-3">{post.publishedDate}</td>
                  <td className="py-2 pr-3">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`px-2 py-1 text-[11px] ${post.published ? "bg-[#daaf3a]/20 text-[#daaf3a]" : "bg-white/5 text-white/40"}`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-2 pr-3 text-right whitespace-nowrap">
                    <Link href={`/admin/blog/${post._id}`} className="text-white/50 hover:text-white mr-3">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(post._id)} className="text-red-400/70 hover:text-red-400">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
