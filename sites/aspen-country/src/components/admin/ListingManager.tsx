"use client";

import { useEffect, useMemo, useState } from "react";

type ListingForm = {
  id?: string;
  slug: string;
  address: string;
  description: string;
  listPrice: number;
  listingStatus: "active" | "sold" | "pending";
  representation: string;
  neighborhood: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  yearBuilt: number;
  livingArea: number;
  lotArea: number;
  lotAreaUnit: string;
  taxes: number;
  listingBrokerage: string;
  mlsNumber: string;
  thumbnail: string;
  galleryText: string;
  homepageFeatured: boolean;
  ranchEstateFeatured: boolean;
};

const EMPTY_FORM: ListingForm = {
  slug: "",
  address: "",
  description: "",
  listPrice: 0,
  listingStatus: "active",
  representation: "",
  neighborhood: "",
  city: "",
  bedrooms: 0,
  bathrooms: 0,
  propertyType: "",
  yearBuilt: 0,
  livingArea: 0,
  lotArea: 0,
  lotAreaUnit: "acres",
  taxes: 0,
  listingBrokerage: "",
  mlsNumber: "",
  thumbnail: "",
  galleryText: "",
  homepageFeatured: false,
  ranchEstateFeatured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ListingManager() {
  const [rows, setRows] = useState<ListingForm[]>([]);
  const [form, setForm] = useState<ListingForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => (b.listPrice || 0) - (a.listPrice || 0)),
    [rows]
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/listings");
      const data = await res.json();
      const mapped = (Array.isArray(data) ? data : []).map((item) => ({
        id: item.id,
        slug: item.slug || "",
        address: item.address || "",
        description: item.description || "",
        listPrice: Number(item.list_price || 0),
        listingStatus: (item.listing_status || "active") as "active" | "sold" | "pending",
        representation: item.representation || "",
        neighborhood: item.neighborhood || "",
        city: item.city || "",
        bedrooms: Number(item.bedrooms || 0),
        bathrooms: Number(item.bathrooms || 0),
        propertyType: item.property_type || "",
        yearBuilt: Number(item.year_built || 0),
        livingArea: Number(item.living_area || 0),
        lotArea: Number(item.lot_area || 0),
        lotAreaUnit: item.lot_area_unit || "acres",
        taxes: Number(item.taxes || 0),
        listingBrokerage: item.listing_brokerage || "",
        mlsNumber: item.mls_number || "",
        thumbnail: item.thumbnail || "",
        galleryText: Array.isArray(item.gallery) ? item.gallery.join("\n") : "",
        homepageFeatured: !!item.homepage_featured,
        ranchEstateFeatured: !!item.ranch_estate_featured,
      }));
      setRows(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const editRow = (row: ListingForm) => {
    setForm(row);
    setMessage(null);
  };

  const reset = () => setForm(EMPTY_FORM);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.address),
      gallery: form.galleryText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const url = form.id ? `/api/admin/listings/${form.id}` : "/api/admin/listings";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      setMessage(err.error || "Failed to save listing.");
      setSaving(false);
      return;
    }

    setMessage(form.id ? "Listing updated." : "Listing created.");
    setSaving(false);
    reset();
    load();
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this listing?")) return;
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    if (form.id === id) reset();
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-[#0b3a30] p-5">
        <h2 className="font-heading text-2xl text-white" style={{ fontWeight: 400 }}>
          {form.id ? "Edit Listing" : "New Listing"}
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="field" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input className="field" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input className="field" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className="field" placeholder="Price" type="number" value={form.listPrice} onChange={(e) => setForm({ ...form, listPrice: Number(e.target.value) })} />
          <select className="field" value={form.listingStatus} onChange={(e) => setForm({ ...form, listingStatus: e.target.value as ListingForm["listingStatus"] })}>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
          </select>
          <input className="field" placeholder="Property Type" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} />
          <input className="field" placeholder="Bedrooms" type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} />
          <input className="field" placeholder="Bathrooms" type="number" step="0.5" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} />
          <input className="field" placeholder="Living Area" type="number" value={form.livingArea} onChange={(e) => setForm({ ...form, livingArea: Number(e.target.value) })} />
          <input className="field" placeholder="Lot Area" type="number" value={form.lotArea} onChange={(e) => setForm({ ...form, lotArea: Number(e.target.value) })} />
          <input className="field" placeholder="Lot Area Unit (acres/sq ft)" value={form.lotAreaUnit} onChange={(e) => setForm({ ...form, lotAreaUnit: e.target.value })} />
          <input className="field" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
          <input className="field" placeholder="Neighborhood" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
          <input className="field" placeholder="Year Built" type="number" value={form.yearBuilt} onChange={(e) => setForm({ ...form, yearBuilt: Number(e.target.value) })} />
          <input className="field" placeholder="Taxes" type="number" value={form.taxes} onChange={(e) => setForm({ ...form, taxes: Number(e.target.value) })} />
          <input className="field" placeholder="MLS Number" value={form.mlsNumber} onChange={(e) => setForm({ ...form, mlsNumber: e.target.value })} />
          <input className="field" placeholder="Listing Brokerage" value={form.listingBrokerage} onChange={(e) => setForm({ ...form, listingBrokerage: e.target.value })} />
          <input className="field" placeholder="Representation (optional)" value={form.representation} onChange={(e) => setForm({ ...form, representation: e.target.value })} />
        </div>
        <textarea className="field mt-3 min-h-[110px] w-full" placeholder="Description (HTML supported)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <textarea className="field mt-3 min-h-[90px] w-full" placeholder="Gallery image URLs (one per line)" value={form.galleryText} onChange={(e) => setForm({ ...form, galleryText: e.target.value })} />

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.homepageFeatured} onChange={(e) => setForm({ ...form, homepageFeatured: e.target.checked })} />
            Homepage Featured
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.ranchEstateFeatured} onChange={(e) => setForm({ ...form, ranchEstateFeatured: e.target.checked })} />
            Ranch/Estate Featured
          </label>
        </div>

        <div className="mt-4 flex gap-3">
          <button type="button" onClick={save} disabled={saving} className="gold-gradient-bg rounded-md px-4 py-2 text-sm font-semibold text-[#09312a]">
            {saving ? "Saving..." : form.id ? "Update Listing" : "Create Listing"}
          </button>
          <button type="button" onClick={reset} className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/80">
            Clear
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-white/70">{message}</p>}
      </div>

      <div className="rounded-lg border border-white/10 bg-[#0b3a30] p-5">
        <h3 className="text-lg text-white">All Listings</h3>
        {loading ? (
          <p className="mt-3 text-white/60">Loading...</p>
        ) : (
          <div className="mt-3 space-y-2">
            {sortedRows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-white/10 bg-[#07271f] p-3">
                <div>
                  <p className="text-sm text-white">{row.address}, {row.city}</p>
                  <p className="text-xs text-white/60">{row.slug} · {row.listingStatus}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => editRow(row)} className="rounded-md border border-white/20 px-3 py-1 text-xs text-white/80">Edit</button>
                  <button type="button" onClick={() => remove(row.id)} className="rounded-md border border-red-300/40 px-3 py-1 text-xs text-red-200">Delete</button>
                </div>
              </div>
            ))}
            {sortedRows.length === 0 && <p className="text-sm text-white/60">No listings yet.</p>}
          </div>
        )}
      </div>

      <style jsx>{`
        .field {
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: #06241d;
          color: white;
          padding: 8px 10px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
