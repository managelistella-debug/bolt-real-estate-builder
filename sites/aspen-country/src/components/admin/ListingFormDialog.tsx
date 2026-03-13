"use client";

import { ChangeEvent, useEffect, useRef, useState, useCallback } from "react";
import { Upload, X, GripVertical, Star } from "lucide-react";

type ListingStatus = "active" | "sold" | "pending";
type LotAreaUnit = "acres" | "sq ft";

export interface ListingPayload {
  id?: string;
  slug: string;
  address: string;
  description: string;
  listPrice: number;
  listingStatus: ListingStatus;
  representation: string;
  neighborhood: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  yearBuilt: number;
  livingArea: number;
  lotArea: number;
  lotAreaUnit: LotAreaUnit;
  taxes: number;
  listingBrokerage: string;
  mlsNumber: string;
  thumbnail: string;
  gallery: string[];
  homepageFeatured: boolean;
  ranchEstateFeatured: boolean;
}

type Draft = {
  slug: string;
  address: string;
  description: string;
  listPrice: string;
  listingStatus: ListingStatus;
  representation: string;
  neighborhood: string;
  city: string;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  yearBuilt: string;
  livingArea: string;
  lotArea: string;
  lotAreaUnit: LotAreaUnit;
  taxes: string;
  listingBrokerage: string;
  mlsNumber: string;
  gallery: string[];
  thumbnail: string;
  homepageFeatured: boolean;
  ranchEstateFeatured: boolean;
};

const emptyDraft = (): Draft => ({
  slug: "",
  address: "",
  description: "",
  listPrice: "",
  listingStatus: "active",
  representation: "",
  neighborhood: "",
  city: "",
  bedrooms: "",
  bathrooms: "",
  propertyType: "",
  yearBuilt: "",
  livingArea: "",
  lotArea: "",
  lotAreaUnit: "acres",
  taxes: "",
  listingBrokerage: "",
  mlsNumber: "",
  gallery: [],
  thumbnail: "",
  homepageFeatured: false,
  ranchEstateFeatured: false,
});

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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: ListingPayload | null;
  onSubmit: (payload: ListingPayload) => void;
}

export default function ListingFormDialog({
  open,
  onOpenChange,
  listing,
  onSubmit,
}: Props) {
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [error, setError] = useState<string | null>(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (listing) {
      setDraft({
        slug: listing.slug || "",
        address: listing.address || "",
        description: listing.description || "",
        listPrice: listing.listPrice ? String(listing.listPrice) : "",
        listingStatus: listing.listingStatus || "active",
        representation: listing.representation || "",
        neighborhood: listing.neighborhood || "",
        city: listing.city || "",
        bedrooms: listing.bedrooms ? String(listing.bedrooms) : "",
        bathrooms: listing.bathrooms ? String(listing.bathrooms) : "",
        propertyType: listing.propertyType || "",
        yearBuilt: listing.yearBuilt ? String(listing.yearBuilt) : "",
        livingArea: listing.livingArea ? String(listing.livingArea) : "",
        lotArea: listing.lotArea ? String(listing.lotArea) : "",
        lotAreaUnit: (listing.lotAreaUnit as LotAreaUnit) || "acres",
        taxes: listing.taxes ? String(listing.taxes) : "",
        listingBrokerage: listing.listingBrokerage || "",
        mlsNumber: listing.mlsNumber || "",
        gallery: listing.gallery || [],
        thumbnail: listing.thumbnail || listing.gallery?.[0] || "",
        homepageFeatured: !!listing.homepageFeatured,
        ranchEstateFeatured: !!listing.ranchEstateFeatured,
      });
    } else {
      setDraft(emptyDraft());
    }
    setError(null);
  }, [listing, open]);

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
            reject(new Error("Canvas error"));
            return;
          }
          let w = img.width;
          let h = img.height;
          const max = 1600;
          if (w > max || h > max) {
            if (w > h) {
              h = (h / w) * max;
              w = max;
            } else {
              w = (w / h) * max;
              h = max;
            }
          }
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);
          let q = 0.82;
          let out = canvas.toDataURL("image/jpeg", q);
          while (out.length > 1_200_000 && q > 0.35) {
            q -= 0.08;
            out = canvas.toDataURL("image/jpeg", q);
          }
          resolve(out);
        };
        img.onerror = () => reject(new Error(`Failed to process ${file.name}`));
        img.src = src;
      };
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const readAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (!imageFiles.length) {
        setError("Please select one or more image files.");
        return;
      }
      try {
        const urls = await Promise.all(
          imageFiles.map((f) =>
            f.type === "image/svg+xml" || f.name.endsWith(".svg")
              ? readAsDataUrl(f)
              : compressImage(f)
          )
        );
        setDraft((prev) => {
          const next = [...prev.gallery, ...urls];
          return { ...prev, gallery: next, thumbnail: prev.thumbnail || next[0] || "" };
        });
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add images.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFilePick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropActive(true);
  };
  const handleDropZoneDragLeave = () => setIsDropActive(false);
  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropActive(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const removeImage = (idx: number) => {
    setDraft((prev) => {
      const next = prev.gallery.filter((_, i) => i !== idx);
      const thumb =
        prev.thumbnail === prev.gallery[idx] ? next[0] || "" : prev.thumbnail;
      return { ...prev, gallery: next, thumbnail: thumb };
    });
  };

  const moveImage = (from: number, to: number) => {
    setDraft((prev) => {
      const imgs = [...prev.gallery];
      const moved = imgs[from];
      imgs.splice(from, 1);
      imgs.splice(to, 0, moved);
      return { ...prev, gallery: imgs };
    });
  };

  const handleSubmit = () => {
    setError(null);
    if (!draft.address.trim()) {
      setError("Address is required.");
      return;
    }
    if (!draft.city.trim()) {
      setError("City is required.");
      return;
    }
    const payload: ListingPayload = {
      id: listing?.id,
      slug: draft.slug || slugify(draft.address),
      address: draft.address,
      description: draft.description,
      listPrice: Number(draft.listPrice) || 0,
      listingStatus: draft.listingStatus,
      representation: draft.representation,
      neighborhood: draft.neighborhood,
      city: draft.city,
      bedrooms: Number(draft.bedrooms) || 0,
      bathrooms: Number(draft.bathrooms) || 0,
      propertyType: draft.propertyType,
      yearBuilt: Number(draft.yearBuilt) || 0,
      livingArea: Number(draft.livingArea) || 0,
      lotArea: Number(draft.lotArea) || 0,
      lotAreaUnit: draft.lotAreaUnit,
      taxes: Number(draft.taxes) || 0,
      listingBrokerage: draft.listingBrokerage,
      mlsNumber: draft.mlsNumber,
      thumbnail: draft.thumbnail || draft.gallery[0] || "",
      gallery: draft.gallery,
      homepageFeatured: draft.homepageFeatured,
      ranchEstateFeatured: draft.ranchEstateFeatured,
    };
    onSubmit(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-[#EBEBEB] bg-white p-6 shadow-xl"
        style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
      >
        <div className="mb-4">
          <h2 className="text-[15px] font-medium text-black">
            {listing ? "Edit Listing" : "Create Listing"}
          </h2>
          <p className="text-[13px] text-[#888C99]">
            Add listing details and gallery images. The first image becomes the
            thumbnail.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              value={draft.address}
              onChange={(e) => setDraft((p) => ({ ...p, address: e.target.value }))}
              placeholder="581 Sagee Woods Drive"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              value={draft.description}
              onChange={(e) =>
                setDraft((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="A paragraph or two describing the property."
              className="w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-2 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>List Price</label>
            <input
              type="number"
              min={0}
              value={draft.listPrice}
              onChange={(e) => setDraft((p) => ({ ...p, listPrice: e.target.value }))}
              placeholder="4999999"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Listing Status</label>
            <select
              value={draft.listingStatus}
              onChange={(e) =>
                setDraft((p) => ({
                  ...p,
                  listingStatus: e.target.value as ListingStatus,
                }))
              }
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {/* Toggle: Homepage Featured */}
          <div className="space-y-1.5">
            <label className={labelClass}>Homepage Featured</label>
            <button
              type="button"
              onClick={() =>
                setDraft((p) => ({ ...p, homepageFeatured: !p.homepageFeatured }))
              }
              className={`relative h-[34px] w-full rounded-lg border px-3 text-left text-[13px] transition-colors ${
                draft.homepageFeatured
                  ? "border-[#DAFF07] bg-[#DAFF07]/10 text-black"
                  : "border-[#EBEBEB] bg-[#F5F5F3] text-[#888C99]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`inline-block h-4 w-7 rounded-full transition-colors ${
                    draft.homepageFeatured ? "bg-[#DAFF07]" : "bg-[#CCCCCC]"
                  }`}
                >
                  <span
                    className={`mt-0.5 block h-3 w-3 rounded-full bg-white shadow transition-transform ${
                      draft.homepageFeatured ? "translate-x-3.5" : "translate-x-0.5"
                    }`}
                  />
                </span>
                {draft.homepageFeatured ? "Featured on Homepage" : "Not Featured"}
              </span>
            </button>
          </div>

          {/* Toggle: Ranch/Estate Featured */}
          <div className="space-y-1.5">
            <label className={labelClass}>Ranch / Estate Featured</label>
            <button
              type="button"
              onClick={() =>
                setDraft((p) => ({
                  ...p,
                  ranchEstateFeatured: !p.ranchEstateFeatured,
                }))
              }
              className={`relative h-[34px] w-full rounded-lg border px-3 text-left text-[13px] transition-colors ${
                draft.ranchEstateFeatured
                  ? "border-[#DAFF07] bg-[#DAFF07]/10 text-black"
                  : "border-[#EBEBEB] bg-[#F5F5F3] text-[#888C99]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`inline-block h-4 w-7 rounded-full transition-colors ${
                    draft.ranchEstateFeatured ? "bg-[#DAFF07]" : "bg-[#CCCCCC]"
                  }`}
                >
                  <span
                    className={`mt-0.5 block h-3 w-3 rounded-full bg-white shadow transition-transform ${
                      draft.ranchEstateFeatured
                        ? "translate-x-3.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </span>
                {draft.ranchEstateFeatured ? "Ranch/Estate Featured" : "Not Featured"}
              </span>
            </button>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Neighborhood</label>
            <input
              value={draft.neighborhood}
              onChange={(e) =>
                setDraft((p) => ({ ...p, neighborhood: e.target.value }))
              }
              placeholder="Highlands"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>City</label>
            <input
              value={draft.city}
              onChange={(e) => setDraft((p) => ({ ...p, city: e.target.value }))}
              placeholder="Sundre"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Slug</label>
            <input
              value={draft.slug}
              onChange={(e) => setDraft((p) => ({ ...p, slug: e.target.value }))}
              placeholder="auto-generated-from-address"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Property Type</label>
            <input
              value={draft.propertyType}
              onChange={(e) =>
                setDraft((p) => ({ ...p, propertyType: e.target.value }))
              }
              placeholder="Ranch"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Bedrooms</label>
            <input
              type="number"
              min={0}
              value={draft.bedrooms}
              onChange={(e) => setDraft((p) => ({ ...p, bedrooms: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Bathrooms</label>
            <input
              type="number"
              min={0}
              step="0.5"
              value={draft.bathrooms}
              onChange={(e) =>
                setDraft((p) => ({ ...p, bathrooms: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Year Built</label>
            <input
              type="number"
              min={1800}
              value={draft.yearBuilt}
              onChange={(e) =>
                setDraft((p) => ({ ...p, yearBuilt: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Living Area (sqft)</label>
            <input
              type="number"
              min={0}
              value={draft.livingArea}
              onChange={(e) =>
                setDraft((p) => ({ ...p, livingArea: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Lot Area</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={draft.lotArea}
              onChange={(e) => setDraft((p) => ({ ...p, lotArea: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Lot Area Unit</label>
            <select
              value={draft.lotAreaUnit}
              onChange={(e) =>
                setDraft((p) => ({
                  ...p,
                  lotAreaUnit: e.target.value as LotAreaUnit,
                }))
              }
              className={inputClass}
            >
              <option value="acres">Acres</option>
              <option value="sq ft">Square Feet</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Taxes (Annual)</label>
            <input
              type="number"
              min={0}
              value={draft.taxes}
              onChange={(e) => setDraft((p) => ({ ...p, taxes: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Listing Brokerage</label>
            <input
              value={draft.listingBrokerage}
              onChange={(e) =>
                setDraft((p) => ({ ...p, listingBrokerage: e.target.value }))
              }
              placeholder="Compass RE Texas, LLC"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>MLS Number</label>
            <input
              value={draft.mlsNumber}
              onChange={(e) =>
                setDraft((p) => ({ ...p, mlsNumber: e.target.value }))
              }
              placeholder="CAR4120551"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Representation</label>
            <input
              value={draft.representation}
              onChange={(e) =>
                setDraft((p) => ({ ...p, representation: e.target.value }))
              }
              placeholder="Optional"
              className={inputClass}
            />
          </div>

          {/* Gallery */}
          <div className="space-y-3 md:col-span-2">
            <label className={labelClass}>Gallery</label>

            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                isDropActive
                  ? "border-[#DAFF07] bg-[#DAFF07]/5"
                  : "border-[#EBEBEB] bg-[#F5F5F3]"
              }`}
              onDragOver={handleDropZoneDragOver}
              onDragLeave={handleDropZoneDragLeave}
              onDrop={handleDropZoneDrop}
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#EBEBEB]">
                <Upload className="h-4 w-4 text-[#888C99]" />
              </div>
              <p className="text-[13px] font-medium text-black">
                Drag & drop listing photos here
              </p>
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
                First image becomes the listing thumbnail. Drag images to reorder.
              </p>
            </div>

            {draft.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                {draft.gallery.map((url, idx) => (
                  <div
                    key={`${idx}-${url.slice(0, 20)}`}
                    draggable
                    onDragStart={() => setDraggedIdx(idx)}
                    onDragEnd={() => setDraggedIdx(null)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedIdx === null || draggedIdx === idx) return;
                      moveImage(draggedIdx, idx);
                      setDraggedIdx(idx);
                    }}
                    className={`group relative cursor-move overflow-hidden rounded-lg border transition-all ${
                      draft.thumbnail === url
                        ? "border-[#DAFF07] ring-1 ring-[#DAFF07]"
                        : "border-[#EBEBEB]"
                    } ${draggedIdx === idx ? "opacity-40" : ""}`}
                  >
                    <div className="aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Image ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {draft.thumbnail === url && (
                      <div className="absolute left-1 top-1 z-10 flex h-5 items-center gap-0.5 rounded bg-[#DAFF07] px-1 text-[9px] font-semibold text-black">
                        <Star className="h-2.5 w-2.5 fill-current" /> Thumbnail
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setDraft((p) => ({ ...p, thumbnail: url }))
                      }
                      className={`absolute left-1 ${
                        draft.thumbnail === url ? "top-7" : "top-1"
                      } z-10 rounded bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100`}
                      title="Set as thumbnail"
                    >
                      <Star className="h-3 w-3" />
                    </button>

                    <div className="absolute bottom-1 left-1 z-10 rounded bg-black/50 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <GripVertical className="h-3 w-3" />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {draft.gallery.length === 0 && (
              <div className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-4 text-center text-[13px] text-[#888C99]">
                No images yet. Drop photos above or click &quot;Browse Files&quot;.
              </div>
            )}
          </div>
        </div>

        {error && <p className="mt-3 text-[13px] text-red-500">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-[30px] rounded-lg bg-[#DAFF07] px-4 text-[13px] text-black hover:bg-[#C8ED00]"
          >
            {listing ? "Save Changes" : "Create Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}
