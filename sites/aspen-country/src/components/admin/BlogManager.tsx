"use client";

import { useEffect, useState } from "react";

type BlogForm = {
  id?: string;
  title: string;
  slug: string;
  author: string;
  publishDate: string;
  featuredImage: string;
  featuredImageAlt: string;
  excerpt: string;
  content: string;
  category: string;
  tagsText: string;
  isPublished: boolean;
};

const EMPTY_FORM: BlogForm = {
  title: "",
  slug: "",
  author: "Aspen Muraski",
  publishDate: new Date().toISOString().slice(0, 10),
  featuredImage: "",
  featuredImageAlt: "",
  excerpt: "",
  content: "",
  category: "",
  tagsText: "",
  isPublished: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogManager() {
  const [rows, setRows] = useState<BlogForm[]>([]);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/blogs");
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(err.error || "Unable to load blog posts.");
      setRows([]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    const mapped = (Array.isArray(data) ? data : []).map((item) => ({
      id: item.id,
      title: item.title || "",
      slug: item.slug || "",
      author: item.author_name || item.author || "Aspen Muraski",
      publishDate: (item.published_at || item.publish_date || new Date().toISOString()).slice(0, 10),
      featuredImage: item.featured_image || "",
      featuredImageAlt: item.meta_description || item.featured_image_alt || "",
      excerpt: item.excerpt || "",
      content: item.content_html || item.content || "",
      category: item.category || "",
      tagsText: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      isPublished: item.status ? item.status === "published" : !!item.is_published,
    }));
    setRows(mapped);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      tags: form.tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const url = form.id ? `/api/admin/blogs/${form.id}` : "/api/admin/blogs";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      setMessage(err.error || "Failed to save post.");
      setSaving(false);
      return;
    }
    setMessage(form.id ? "Blog post updated." : "Blog post created.");
    setForm(EMPTY_FORM);
    setSaving(false);
    load();
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this blog post?")) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    if (form.id === id) setForm(EMPTY_FORM);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
        <h2 className="font-heading text-2xl text-black" style={{ fontWeight: 400 }}>
          {form.id ? "Edit Blog Post" : "New Blog Post"}
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="field" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className="field" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <input className="field" placeholder="Publish Date" type="date" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} />
          <input className="field" placeholder="Featured Image URL" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} />
          <input className="field" placeholder="Featured Image Alt" value={form.featuredImageAlt} onChange={(e) => setForm({ ...form, featuredImageAlt: e.target.value })} />
          <input className="field" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="field" placeholder="Tags (comma separated)" value={form.tagsText} onChange={(e) => setForm({ ...form, tagsText: e.target.value })} />
        </div>
        <textarea className="field mt-3 min-h-[90px] w-full" placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <textarea className="field mt-3 min-h-[180px] w-full" placeholder="Post content (HTML supported)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <label className="mt-3 inline-flex items-center gap-2 text-sm text-[#666]">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
          Published
        </label>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={save} disabled={saving} className="gold-gradient-bg rounded-md px-4 py-2 text-sm font-semibold text-[#09312a]">
            {saving ? "Saving..." : form.id ? "Update Post" : "Create Post"}
          </button>
          <button type="button" onClick={() => setForm(EMPTY_FORM)} className="rounded-md border border-[#EBEBEB] bg-white px-4 py-2 text-sm text-[#666]">
            Clear
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-[#666]">{message}</p>}
      </div>

      <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
        <h3 className="text-lg text-black">All Blog Posts</h3>
        {loading ? (
          <p className="mt-3 text-[#888C99]">Loading...</p>
        ) : (
          <div className="mt-3 space-y-2">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#EBEBEB] bg-[#F5F5F3] p-3">
                <div>
                  <p className="text-sm text-black">{row.title}</p>
                  <p className="text-xs text-[#888C99]">{row.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setForm(row)} className="rounded-md border border-[#EBEBEB] bg-white px-3 py-1 text-xs text-[#666]">Edit</button>
                  <button type="button" onClick={() => remove(row.id)} className="rounded-md border border-red-300/40 bg-white px-3 py-1 text-xs text-red-500">Delete</button>
                </div>
              </div>
            ))}
            {rows.length === 0 && <p className="text-sm text-[#888C99]">No posts yet.</p>}
          </div>
        )}
      </div>

      <style jsx>{`
        .field {
          border-radius: 8px;
          border: 1px solid #ebebeb;
          background: #f5f5f3;
          color: #111;
          padding: 8px 10px;
          font-size: 14px;
        }
        .field::placeholder {
          color: #b5b5b5;
        }
      `}</style>
    </div>
  );
}
