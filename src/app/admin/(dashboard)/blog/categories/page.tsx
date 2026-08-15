"use client";

import { useEffect, useState } from "react";
import { adminJson } from "@/lib/admin/adminFetch";
import type { BlogCategory } from "@/lib/sanity/types";

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { categories } = await adminJson<{ categories: BlogCategory[] }>("/api/admin/blog-categories");
    setCategories(categories);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminJson("/api/admin/blog-categories", { method: "POST", body: JSON.stringify({ name }) });
      setName("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    try {
      await adminJson(`/api/admin/blog-categories/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete category.");
    }
  }

  return (
    <div>
      <h2 className="font-heading text-white text-[24px] mb-6" style={{ fontWeight: 400 }}>
        Blog Categories
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 max-w-[420px] mb-8">
        <input
          className="flex-1 bg-[rgba(17,61,53,0.4)] border border-white/15 px-3 py-2 text-white text-[14px] placeholder:text-white/30 outline-none focus:border-[#daaf3a]"
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" disabled={saving} className="gold-gradient-bg text-[#09312a] font-semibold text-[13px] px-4 disabled:opacity-50">
          Add
        </button>
      </form>
      {error && <p className="text-red-400 text-[13px] mb-4">{error}</p>}

      {loading ? (
        <p className="text-white/50 text-[14px]">Loading...</p>
      ) : (
        <div className="flex flex-col gap-1 max-w-[420px]">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between border-b border-white/10 py-2">
              <span className="text-white/80 text-[14px]">{c.name}</span>
              <button onClick={() => handleDelete(c._id)} className="text-red-400/70 hover:text-red-400 text-[12px]">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
