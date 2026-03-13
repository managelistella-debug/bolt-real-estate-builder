"use client";

import { useEffect, useState } from "react";

type TestimonialForm = {
  id?: string;
  quote: string;
  author: string;
  rating: number;
  displayContext: "home" | "about" | "both";
  sortOrder: number;
  isPublished: boolean;
};

const EMPTY_FORM: TestimonialForm = {
  quote: "",
  author: "",
  rating: 5,
  displayContext: "both",
  sortOrder: 0,
  isPublished: true,
};

export default function TestimonialManager() {
  const [rows, setRows] = useState<TestimonialForm[]>([]);
  const [form, setForm] = useState<TestimonialForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials");
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(err.error || "Unable to load testimonials.");
      setRows([]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    const mapped = (Array.isArray(data) ? data : []).map((item) => ({
      id: item.id,
      quote: item.quote || "",
      author: item.author_name || item.author || "",
      rating: Number(item.rating || 5),
      displayContext: (item.display_context || "both") as "home" | "about" | "both",
      sortOrder: Number(item.sort_order || 0),
      isPublished: item.is_published !== false,
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
    const url = form.id ? `/api/admin/testimonials/${form.id}` : "/api/admin/testimonials";
    const method = form.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const err = await res.json();
      setMessage(err.error || "Failed to save testimonial.");
      setSaving(false);
      return;
    }
    setMessage(form.id ? "Testimonial updated." : "Testimonial created.");
    setForm(EMPTY_FORM);
    setSaving(false);
    load();
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (form.id === id) setForm(EMPTY_FORM);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
        <h2 className="font-heading text-2xl text-black" style={{ fontWeight: 400 }}>
          {form.id ? "Edit Testimonial" : "New Testimonial"}
        </h2>
        <textarea className="field mt-4 min-h-[130px] w-full" placeholder="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input className="field" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <input className="field" placeholder="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          <input className="field" placeholder="Rating" type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
          <select className="field" value={form.displayContext} onChange={(e) => setForm({ ...form, displayContext: e.target.value as TestimonialForm["displayContext"] })}>
            <option value="both">Home + About</option>
            <option value="home">Home only</option>
            <option value="about">About only</option>
          </select>
        </div>
        <label className="mt-3 inline-flex items-center gap-2 text-sm text-[#666]">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
          Published
        </label>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-[#DAFF07] px-4 py-2 text-sm font-semibold text-black hover:bg-[#C8ED00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : form.id ? "Update Testimonial" : "Create Testimonial"}
          </button>
          <button type="button" onClick={() => setForm(EMPTY_FORM)} className="rounded-md border border-[#EBEBEB] bg-white px-4 py-2 text-sm text-[#666]">
            Clear
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-[#666]">{message}</p>}
      </div>

      <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
        <h3 className="text-lg text-black">All Testimonials</h3>
        {loading ? (
          <p className="mt-3 text-[#888C99]">Loading...</p>
        ) : (
          <div className="mt-3 space-y-2">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#EBEBEB] bg-[#F5F5F3] p-3">
                <div>
                  <p className="text-sm text-black">{row.author}</p>
                  <p className="line-clamp-1 text-xs text-[#888C99]">{row.quote}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setForm(row)} className="rounded-md border border-[#EBEBEB] bg-white px-3 py-1 text-xs text-[#666]">Edit</button>
                  <button type="button" onClick={() => remove(row.id)} className="rounded-md border border-red-300/40 bg-white px-3 py-1 text-xs text-red-500">Delete</button>
                </div>
              </div>
            ))}
            {rows.length === 0 && <p className="text-sm text-[#888C99]">No testimonials yet.</p>}
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
