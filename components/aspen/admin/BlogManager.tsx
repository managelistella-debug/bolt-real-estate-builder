"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, Search, Sparkles, Trash2, Upload, X } from "lucide-react";

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

const inputClass =
  "h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]";
const labelClass = "text-[13px] text-[#888C99]";

export default function BlogManager() {
  const [rows, setRows] = useState<BlogForm[]>([]);
  const [form, setForm] = useState<BlogForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const safeMsg = (s: string) =>
    typeof s === "string" && s.trimStart().startsWith("<") ? "Unable to load blog posts. Please try again." : s;

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/blogs", { credentials: "include" });
      const text = await res.text();
      if (!res.ok) {
        let errMsg = `Unable to load blog posts${res.status === 401 ? " — please sign in again" : res.status === 404 ? " (page not found)" : ""}.`;
        if (!text.trimStart().startsWith("<")) {
          try {
            const err = JSON.parse(text) as { error?: string };
            errMsg = err.error || errMsg;
          } catch {
            /* use default */
          }
        }
        setMessage(safeMsg(errMsg));
        setRows([]);
        setLoading(false);
        return;
      }
      if (text.trimStart().startsWith("<")) {
        setMessage("Invalid response from server. Please try again.");
        setRows([]);
        setLoading(false);
        return;
      }
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        setMessage("Invalid response. Please try again.");
        setRows([]);
        setLoading(false);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        title: item.title || "",
        slug: item.slug || "",
        author: item.author_name || item.author || "Aspen Muraski",
        publishDate: (
          item.published_at ||
          item.publish_date ||
          new Date().toISOString()
        ).slice(0, 10),
        featuredImage: item.featured_image || "",
        featuredImageAlt: item.meta_description || item.featured_image_alt || "",
        excerpt: item.excerpt || "",
        content: item.content_html || item.content || "",
        category: item.category || "",
        tagsText: Array.isArray(item.tags) ? item.tags.join(", ") : "",
        isPublished: item.status ? item.status === "published" : !!item.is_published,
      }));
      setRows(mapped);
    } catch {
      setMessage("Unable to load blog posts. Please try again.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSample = async () => {
    setMessage(null);
    const body = {
      title: "5 Things to Know Before Buying an Acreage in Sundre",
      slug: `sample-${Date.now().toString().slice(-6)}`,
      author: "Aspen Muraski",
      publishDate: new Date().toISOString().slice(0, 10),
      featuredImage: "/images/featured-1.webp",
      featuredImageAlt: "Aerial view of an acreage property near Sundre",
      excerpt:
        "Purchasing an acreage is different from buying a home in town. From water wells to septic systems, here are five essential things every buyer should know.",
      content:
        "<h2>1. Water Supply Matters</h2><p>Unlike properties in town, most acreages rely on private wells for water.</p><h2>2. Septic Systems Need Inspection</h2><p>Acreages typically use septic systems rather than municipal sewer.</p>",
      category: "Buying",
      tags: ["Acreages", "Sundre", "Buying Tips"],
      isPublished: true,
    };
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage((err as { error?: string }).error || "Failed to create sample post.");
      return;
    }
    setMessage("Sample blog post created.");
    load();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const filteredRows = rows.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(term) ||
      r.slug.toLowerCase().includes(term)
    );
  });

  const save = async () => {
    if (!form) return;
    setSaving(true);
    setMessage(null);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      tags: form.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const url = form.id ? `/api/admin/blogs/${form.id}` : "/api/admin/blogs";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(err.error || "Failed to save post.");
      setSaving(false);
      return;
    }
    setMessage(form.id ? "Blog post updated." : "Blog post created.");
    setForm(null);
    setSaving(false);
    load();
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this blog post?")) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE", credentials: "include" });
    if (form?.id === id) setForm(null);
    load();
  };

  const handleFeaturedImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (url && form) setForm({ ...form, featuredImage: url });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="min-h-screen bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <div className="border-b border-[#EBEBEB] bg-white">
        <div className="flex items-center justify-between px-6 py-3.5">
          <div>
            <h1 className="text-[15px] font-medium text-black">Blog Posts</h1>
            <p className="text-[13px] text-[#888C99]">
              Create and update blog collection and detail content
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateSample}
              className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#888C99]" />
              Add Sample
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...EMPTY_FORM })}
              className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]"
            >
              <Plus className="h-3.5 w-3.5" />
              New Post
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        {/* Search */}
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-4">
          <div className="relative md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or slug"
              className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] pl-9 pr-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
            />
          </div>
        </div>

        {message && (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] text-[#888C99]">{safeMsg(message)}</p>
            {(message.includes("Unable to load") || message.includes("Invalid response") || message.includes("Unauthorized")) && (
              <>
                <button
                  type="button"
                  onClick={() => { setMessage(null); load(); }}
                  className="text-[13px] text-[#DAFF07] hover:underline"
                >
                  Retry
                </button>
                {(message.includes("sign in") || message.includes("Unauthorized")) && (
                  <a href="/login" className="text-[13px] text-[#DAFF07] hover:underline">
                    Sign in
                  </a>
                )}
              </>
            )}
          </div>
        )}

        {/* List */}
        <div className="rounded-xl border border-[#EBEBEB] bg-white">
          {loading ? (
            <div className="py-16 text-center text-[13px] text-[#888C99]">
              Loading...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[15px] text-black">No blog posts yet</p>
              <p className="mt-1 text-[13px] text-[#888C99]">
                Create your first blog post.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleCreateSample}
                  className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Add Sample
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...EMPTY_FORM })}
                  className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Post
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#EBEBEB]">
              {filteredRows.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[13px] font-medium text-black">
                      {row.title}
                    </h3>
                    <p className="mt-0.5 text-[13px] text-[#888C99]">
                      {row.slug}
                      {row.publishDate && (
                        <>
                          <span className="mx-1.5 text-[#CCCCCC]">·</span>
                          {row.publishDate}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setForm(row)}
                      className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(row.id)}
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-[#CCCCCC] hover:bg-[#F5F5F3] hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      {form !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#EBEBEB] bg-white p-6 shadow-xl">
            <h2 className="text-[15px] font-medium text-black">
              {form.id ? "Edit Blog Post" : "Create Blog Post"}
            </h2>
            <p className="mb-4 text-[13px] text-[#888C99]">
              Fill in the blog post details.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <label className={labelClass}>Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Post title"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Author</label>
                <input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Publish Date</label>
                <input
                  type="date"
                  value={form.publishDate}
                  onChange={(e) =>
                    setForm({ ...form, publishDate: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Category</label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className={labelClass}>Tags (comma separated)</label>
                <input
                  value={form.tagsText}
                  onChange={(e) =>
                    setForm({ ...form, tagsText: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              {/* Featured image upload */}
              <div className="space-y-1.5 md:col-span-2">
                <label className={labelClass}>Featured Image</label>
                {form.featuredImage ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.featuredImage}
                      alt="Featured"
                      className="h-40 rounded-lg border border-[#EBEBEB] object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, featuredImage: "" })
                      }
                      className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white hover:bg-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#EBEBEB] bg-[#F5F5F3] p-6 text-center transition-colors hover:border-[#DAFF07]"
                    onClick={() => {
                      const inp = document.createElement("input");
                      inp.type = "file";
                      inp.accept = "image/*";
                      inp.onchange = (e) => {
                        const f = (e.target as HTMLInputElement).files?.[0];
                        if (f) handleFeaturedImageUpload(f);
                      };
                      inp.click();
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files[0];
                      if (f) handleFeaturedImageUpload(f);
                    }}
                  >
                    <Upload className="mb-2 h-5 w-5 text-[#888C99]" />
                    <p className="text-[13px] text-black">
                      Drop an image or click to browse
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className={labelClass}>Featured Image Alt</label>
                <input
                  value={form.featuredImageAlt}
                  onChange={(e) =>
                    setForm({ ...form, featuredImageAlt: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className={labelClass}>Excerpt</label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm({ ...form, excerpt: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-2 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className={labelClass}>Content (HTML)</label>
                <textarea
                  rows={8}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-2 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, isPublished: !form.isPublished })
                  }
                  className={`relative inline-block h-4 w-7 rounded-full transition-colors ${
                    form.isPublished ? "bg-[#DAFF07]" : "bg-[#CCCCCC]"
                  }`}
                >
                  <span
                    className={`mt-0.5 block h-3 w-3 rounded-full bg-white shadow transition-transform ${
                      form.isPublished ? "translate-x-3.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-[13px] text-[#888C99]">Published</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="h-[30px] rounded-lg bg-[#DAFF07] px-4 text-[13px] text-black hover:bg-[#C8ED00] disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : form.id
                    ? "Save Changes"
                    : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
