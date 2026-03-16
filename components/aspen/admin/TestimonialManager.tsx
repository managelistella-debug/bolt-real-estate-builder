"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, Search, Sparkles, Trash2 } from "lucide-react";

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

const inputClass =
  "h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]";
const labelClass = "text-[13px] text-[#888C99]";

export default function TestimonialManager() {
  const [rows, setRows] = useState<TestimonialForm[]>([]);
  const [form, setForm] = useState<TestimonialForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const safeMsg = (s: string) =>
    typeof s === "string" && s.trimStart().startsWith("<") ? "Unable to load testimonials. Please try again." : s;

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/testimonials", { credentials: "include" });
      const text = await res.text();
      if (!res.ok) {
        let errMsg = `Unable to load testimonials (HTTP ${res.status}${res.status === 401 ? " — please sign in again" : res.status === 404 ? ", page not found" : ""}).`;
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
        quote: item.quote || "",
        author: item.author_name || item.author || "",
        rating: Number(item.rating || 5),
        displayContext: (item.display_context || "both") as TestimonialForm["displayContext"],
        sortOrder: Number(item.sort_order || 0),
        isPublished: item.is_published !== false,
      }));
      setRows(mapped);
    } catch (err) {
      setMessage(`Unable to load testimonials: ${err instanceof Error ? err.message : String(err)}`);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSample = async () => {
    setMessage(null);
    const body = {
      quote:
        "We recently worked with Aspen to purchase a recreational RV lot, and the experience was absolutely fantastic. Aspen was knowledgeable, responsive, and incredibly helpful throughout the entire process.",
      author: "Patti Lang",
      rating: 5,
      displayContext: "both",
      sortOrder: 0,
      isPublished: true,
    };
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage((err as { error?: string }).error || "Failed to create sample testimonial.");
      return;
    }
    setMessage("Sample testimonial created.");
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
      r.author.toLowerCase().includes(term) ||
      r.quote.toLowerCase().includes(term)
    );
  });

  const save = async () => {
    if (!form) return;
    setSaving(true);
    setMessage(null);
    const url = form.id
      ? `/api/admin/testimonials/${form.id}`
      : "/api/admin/testimonials";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(err.error || "Failed to save testimonial.");
      setSaving(false);
      return;
    }
    setMessage(form.id ? "Testimonial updated." : "Testimonial created.");
    setForm(null);
    setSaving(false);
    load();
  };

  const handleTogglePublish = async (row: TestimonialForm) => {
    if (!row.id) return;
    const next = !row.isPublished;
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, isPublished: next } : r))
    );
    const res = await fetch(`/api/admin/testimonials/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: next }),
      credentials: "include",
    });
    if (!res.ok) {
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, isPublished: !next } : r))
      );
      setMessage("Failed to update publish status.");
    }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE", credentials: "include" });
    if (form?.id === id) setForm(null);
    load();
  };

  return (
    <div
      className="min-h-screen bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <div className="border-b border-[#EBEBEB] bg-white">
        <div className="flex items-center justify-between px-6 py-3.5">
          <div>
            <h1 className="text-[15px] font-medium text-black">
              Testimonials
            </h1>
            <p className="text-[13px] text-[#888C99]">
              Manage testimonials shown on homepage and about page
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
              New Testimonial
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-4">
          <div className="relative md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by author or quote"
              className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] pl-9 pr-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
            />
          </div>
        </div>

        {message && (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] text-[#888C99]">{safeMsg(message)}</p>
            {(message.includes("Unable to load") || message.includes("Invalid response") || message.includes("Unauthorized") || message.includes("HTTP")) && (
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

        <div className="rounded-xl border border-[#EBEBEB] bg-white">
          {loading ? (
            <div className="py-16 text-center text-[13px] text-[#888C99]">
              Loading...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[15px] text-black">No testimonials yet</p>
              <p className="mt-1 text-[13px] text-[#888C99]">
                Create your first testimonial.
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
                  Create Testimonial
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
                      {row.author}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-[13px] text-[#888C99]">
                      {row.quote}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(row)}
                      className={`relative inline-block h-4 w-7 flex-shrink-0 rounded-full transition-colors ${
                        row.isPublished ? "bg-[#DAFF07]" : "bg-[#CCCCCC]"
                      }`}
                      title={row.isPublished ? "Published — click to unpublish" : "Unpublished — click to publish"}
                    >
                      <span
                        className={`mt-0.5 block h-3 w-3 rounded-full bg-white shadow transition-transform ${
                          row.isPublished ? "translate-x-3.5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <span className="text-[11px] text-[#888C99] w-14">
                      {row.isPublished ? "Published" : "Hidden"}
                    </span>
                    <div className="flex items-center gap-1.5">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      {form !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#EBEBEB] bg-white p-6 shadow-xl">
            <h2 className="text-[15px] font-medium text-black">
              {form.id ? "Edit Testimonial" : "Create Testimonial"}
            </h2>
            <p className="mb-4 text-[13px] text-[#888C99]">
              Fill in the testimonial details.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <label className={labelClass}>Quote</label>
                <textarea
                  rows={5}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  className="w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-2 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Author</label>
                <input
                  value={form.author}
                  onChange={(e) =>
                    setForm({ ...form, author: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: Number(e.target.value) })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Display Context</label>
                <select
                  value={form.displayContext}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      displayContext: e.target.value as TestimonialForm["displayContext"],
                    })
                  }
                  className={inputClass}
                >
                  <option value="both">Home + About</option>
                  <option value="home">Home only</option>
                  <option value="about">About only</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: Number(e.target.value) })
                  }
                  className={inputClass}
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
                    : "Create Testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
