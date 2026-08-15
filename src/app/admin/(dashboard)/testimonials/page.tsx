"use client";

import { useEffect, useState } from "react";
import { adminJson } from "@/lib/admin/adminFetch";
import type { Testimonial } from "@/lib/sanity/types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { testimonials } = await adminJson<{ testimonials: Testimonial[] }>("/api/admin/testimonials");
    setTestimonials(testimonials);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setQuote("");
    setName("");
  }

  function startEdit(t: Testimonial) {
    setEditingId(t._id);
    setQuote(t.quote);
    setName(t.name);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await adminJson(`/api/admin/testimonials/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify({ quote, name }),
        });
      } else {
        await adminJson("/api/admin/testimonials", {
          method: "POST",
          body: JSON.stringify({ quote, name, published: true }),
        });
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await adminJson(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    load();
  }

  async function togglePublished(t: Testimonial) {
    setTestimonials((prev) => prev.map((x) => (x._id === t._id ? { ...x, published: !x.published } : x)));
    await adminJson(`/api/admin/testimonials/${t._id}`, {
      method: "PATCH",
      body: JSON.stringify({ published: !t.published }),
    });
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const fromIndex = testimonials.findIndex((t) => t._id === dragId);
    const toIndex = testimonials.findIndex((t) => t._id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...testimonials];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setTestimonials(reordered);
    setDragId(null);

    reordered.forEach((t, index) => {
      if (t.order !== index) {
        adminJson(`/api/admin/testimonials/${t._id}`, {
          method: "PATCH",
          body: JSON.stringify({ order: index }),
        }).catch(() => {});
      }
    });
  }

  const inputClass =
    "w-full bg-[rgba(17,61,53,0.4)] border border-white/15 px-3 py-2 text-white text-[14px] placeholder:text-white/30 outline-none focus:border-[#daaf3a]";

  return (
    <div>
      <h2 className="font-heading text-white text-[24px] mb-6" style={{ fontWeight: 400 }}>
        Testimonials
      </h2>

      <form onSubmit={handleSubmit} className="max-w-[560px] mb-10 border border-white/10 p-5">
        <p className="text-white/50 text-[12px] mb-3">{editingId ? "Editing testimonial" : "New testimonial"}</p>
        {error && <p className="text-red-400 text-[13px] mb-3">{error}</p>}
        <textarea
          className={`${inputClass} h-[100px] resize-y mb-3`}
          placeholder="Testimonial quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          required
        />
        <input
          className={`${inputClass} mb-3`}
          placeholder="Reviewer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="gold-gradient-bg text-[#09312a] font-semibold text-[13px] px-4 py-2 disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update" : "Add Testimonial"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-white/50 hover:text-white text-[13px] px-2">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-white/50 text-[14px]">Loading...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-white/50 text-[14px]">No testimonials yet.</p>
      ) : (
        <div className="flex flex-col gap-2 max-w-[720px]">
          {testimonials.map((t) => (
            <div
              key={t._id}
              draggable
              onDragStart={() => setDragId(t._id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(t._id)}
              className="flex items-start gap-3 border border-white/10 p-3 cursor-move"
            >
              <span className="text-white/30 pt-1">⠿</span>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-[13px] line-clamp-2">{t.quote}</p>
                <p className="text-white/40 text-[12px] mt-1">{t.name}</p>
              </div>
              <button
                onClick={() => togglePublished(t)}
                className={`shrink-0 px-2 py-1 text-[11px] ${t.published ? "bg-[#daaf3a]/20 text-[#daaf3a]" : "bg-white/5 text-white/40"}`}
              >
                {t.published ? "Published" : "Draft"}
              </button>
              <button onClick={() => startEdit(t)} className="shrink-0 text-white/50 hover:text-white text-[12px]">
                Edit
              </button>
              <button onClick={() => handleDelete(t._id)} className="shrink-0 text-red-400/70 hover:text-red-400 text-[12px]">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
