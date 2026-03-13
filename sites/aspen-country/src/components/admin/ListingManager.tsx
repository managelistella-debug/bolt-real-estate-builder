"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { GripVertical, Star, Upload, X } from "lucide-react";

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
  gallery: string[];
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
  gallery: [],
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
  const [isDropActive, setIsDropActive] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => (b.listPrice || 0) - (a.listPrice || 0)),
    [rows]
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/listings");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage(err.error || "Unable to load listings.");
        setRows([]);
        return;
      }
      const data = await res.json();
      const mapped = (Array.isArray(data) ? data : []).map((item) => ({
        // Normalize shared-table status values to Aspen UI statuses.
        id: item.id,
        slug: item.slug || "",
        address: item.address || "",
        description: item.description || "",
        listPrice: Number(item.list_price || 0),
        listingStatus: (item.listing_status === "sold"
          ? "sold"
          : item.listing_status === "pending"
            ? "pending"
            : "active") as ListingForm["listingStatus"],
        representation: item.representation || "",
        neighborhood: item.neighborhood || "",
        city: item.city || "",
        bedrooms: Number(item.bedrooms || 0),
        bathrooms: Number(item.bathrooms || 0),
        propertyType: item.property_type || "",
        yearBuilt: Number(item.year_built || 0),
        livingArea: Number(item.living_area_sqft || item.living_area || 0),
        lotArea: Number(item.lot_area_value || item.lot_area || 0),
        lotAreaUnit: item.lot_area_unit === "sqft" ? "sq ft" : item.lot_area_unit || "acres",
        taxes: Number(item.taxes_annual || item.taxes || 0),
        listingBrokerage: item.listing_brokerage || "",
        mlsNumber: item.mls_number || "",
        thumbnail: item.thumbnail || "",
        gallery: Array.isArray(item.gallery)
          ? item.gallery
              .map((entry: { url?: string }) =>
                typeof entry === "string" ? entry : entry?.url || ""
              )
              .filter(Boolean)
          : [],
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
    setForm({
      ...row,
      thumbnail: row.thumbnail || row.gallery[0] || "",
    });
    setMessage(null);
  };

  const reset = () => setForm(EMPTY_FORM);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.address),
      gallery: form.gallery.map((item) => item.trim()).filter(Boolean),
      thumbnail: form.thumbnail || form.gallery[0] || "",
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

  const readAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve((event.target?.result as string) || "");
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (!src) {
          reject(new Error(`Failed to read ${file.name}`));
          return;
        }

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to initialize image canvas."));
            return;
          }

          let width = img.width;
          let height = img.height;
          const maxDimension = 1600;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.82;
          let output = canvas.toDataURL("image/jpeg", quality);
          while (output.length > 1_200_000 && quality > 0.35) {
            quality -= 0.08;
            output = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(output);
        };
        img.onerror = () => reject(new Error(`Failed to process ${file.name}.`));
        img.src = src;
      };
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const addFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (!imageFiles.length) {
      setMessage("Please select one or more image files.");
      return;
    }
    try {
      const urls = await Promise.all(
        imageFiles.map(async (file) => {
          if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
            return readAsDataUrl(file);
          }
          return compressImage(file);
        })
      );
      setForm((prev) => {
        const nextGallery = [...prev.gallery, ...urls];
        const nextThumbnail = prev.thumbnail || nextGallery[0] || "";
        return { ...prev, gallery: nextGallery, thumbnail: nextThumbnail };
      });
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to add images.");
    }
  };

  const handleFilePick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDropZoneDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDropActive(true);
  };
  const handleDropZoneDragLeave = () => setIsDropActive(false);
  const handleDropZoneDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDropActive(false);
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  };

  const removeImage = (idx: number) => {
    setForm((prev) => {
      const nextGallery = prev.gallery.filter((_, i) => i !== idx);
      const nextThumbnail =
        prev.thumbnail === prev.gallery[idx]
          ? nextGallery[0] || ""
          : prev.thumbnail;
      return { ...prev, gallery: nextGallery, thumbnail: nextThumbnail };
    });
  };

  const moveImage = (from: number, to: number) => {
    setForm((prev) => {
      const images = [...prev.gallery];
      const moved = images[from];
      images.splice(from, 1);
      images.splice(to, 0, moved);
      return { ...prev, gallery: images };
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
        <h2 className="font-heading text-2xl text-black" style={{ fontWeight: 400 }}>
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

        <div className="mt-4 space-y-3">
          <p className="text-[13px] text-[#888C99]">Gallery Images</p>
          <div
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              isDropActive ? "border-[#DAFF07] bg-[#DAFF07]/10" : "border-[#EBEBEB] bg-[#F5F5F3]"
            }`}
            onDragOver={handleDropZoneDragOver}
            onDragLeave={handleDropZoneDragLeave}
            onDrop={handleDropZoneDrop}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#EBEBEB]">
              <Upload className="h-4 w-4 text-[#888C99]" />
            </div>
            <p className="text-[13px] font-medium text-black">Drag & drop listing photos here</p>
            <p className="my-1 text-[11px] text-[#CCCCCC]">or</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-[28px] rounded-lg bg-[#DAFF07] px-3 text-[12px] text-black hover:bg-[#C8ED00]"
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilePick}
            />
            <p className="mt-2 text-[11px] text-[#CCCCCC]">
              Click a star to set thumbnail. Drag tiles to reorder.
            </p>
          </div>

          {form.gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {form.gallery.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  draggable
                  onDragStart={() => setDraggedIdx(idx)}
                  onDragEnd={() => setDraggedIdx(null)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (draggedIdx === null || draggedIdx === idx) return;
                    moveImage(draggedIdx, idx);
                    setDraggedIdx(idx);
                  }}
                  className={`group relative overflow-hidden rounded-lg border bg-[#F5F5F3] ${
                    draggedIdx === idx ? "opacity-40" : ""
                  } ${form.thumbnail === url ? "border-[#DAFF07] ring-1 ring-[#DAFF07]" : "border-[#EBEBEB]"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Image ${idx + 1}`} className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, thumbnail: url }))}
                    className="absolute left-1 top-1 rounded bg-black/60 p-1 text-white"
                    title="Set as thumbnail"
                  >
                    <Star className={`h-3 w-3 ${form.thumbnail === url ? "fill-current text-[#DAFF07]" : ""}`} />
                  </button>
                  <div className="absolute bottom-1 left-1 rounded bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="h-3 w-3" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#555]">
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
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-[#DAFF07] px-4 py-2 text-sm font-semibold text-black hover:bg-[#C8ED00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : form.id ? "Update Listing" : "Create Listing"}
          </button>
          <button type="button" onClick={reset} className="rounded-md border border-[#EBEBEB] bg-white px-4 py-2 text-sm text-[#666]">
            Clear
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-[#666]">{message}</p>}
      </div>

      <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
        <h3 className="text-lg text-black">All Listings</h3>
        {loading ? (
          <p className="mt-3 text-[#888C99]">Loading...</p>
        ) : (
          <div className="mt-3 space-y-2">
            {sortedRows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#EBEBEB] bg-[#F5F5F3] p-3">
                <div>
                  <p className="text-sm text-black">{row.address}, {row.city}</p>
                  <p className="text-xs text-[#888C99]">{row.slug} · {row.listingStatus}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => editRow(row)} className="rounded-md border border-[#EBEBEB] bg-white px-3 py-1 text-xs text-[#666]">Edit</button>
                  <button type="button" onClick={() => remove(row.id)} className="rounded-md border border-red-300/40 bg-white px-3 py-1 text-xs text-red-500">Delete</button>
                </div>
              </div>
            ))}
            {sortedRows.length === 0 && <p className="text-sm text-[#888C99]">No listings yet.</p>}
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
