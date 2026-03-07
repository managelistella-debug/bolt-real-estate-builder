'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Listing, ListingGalleryImage, ListingRepresentation, ListingStatus, LotAreaUnit } from '@/lib/types';
import { listingSchema } from '@/lib/validation/schemas';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, GripVertical, Star, Trash2 } from 'lucide-react';

interface ListingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: Listing | null;
  onSubmit: (payload: Omit<Listing, 'id' | 'slug' | 'customOrder' | 'createdAt' | 'updatedAt'>) => void;
  userId: string;
  livePreviewHref?: string;
}

type ListingDraft = {
  address: string;
  description: string;
  listPrice: string;
  neighborhood: string;
  city: string;
  listingStatus: ListingStatus;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  yearBuilt: string;
  livingAreaSqft: string;
  lotAreaValue: string;
  lotAreaUnit: LotAreaUnit;
  taxesAnnual: string;
  listingBrokerage: string;
  mlsNumber: string;
  representation?: ListingRepresentation;
  gallery: ListingGalleryImage[];
  homepageFeatured: boolean;
};

const createDefaultDraft = (): ListingDraft => ({
  address: '', description: '', listPrice: '', neighborhood: '', city: '', listingStatus: 'for_sale',
  bedrooms: '', bathrooms: '', propertyType: '', yearBuilt: '', livingAreaSqft: '', lotAreaValue: '',
  lotAreaUnit: 'sqft', taxesAnnual: '', listingBrokerage: '', mlsNumber: '', representation: undefined, gallery: [],
  homepageFeatured: false,
});

const mapListingToDraft = (listing: Listing): ListingDraft => ({
  address: listing.address, description: listing.description, listPrice: String(listing.listPrice),
  neighborhood: listing.neighborhood, city: listing.city, listingStatus: listing.listingStatus,
  bedrooms: String(listing.bedrooms), bathrooms: String(listing.bathrooms), propertyType: listing.propertyType,
  yearBuilt: String(listing.yearBuilt), livingAreaSqft: String(listing.livingAreaSqft),
  lotAreaValue: String(listing.lotAreaValue), lotAreaUnit: listing.lotAreaUnit, taxesAnnual: String(listing.taxesAnnual),
  listingBrokerage: listing.listingBrokerage, mlsNumber: listing.mlsNumber, representation: listing.representation,
  gallery: [...listing.gallery].sort((a, b) => a.order - b.order),
  homepageFeatured: listing.homepageFeatured ?? false,
});

const inputClass = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const labelClass = 'text-[13px] text-[#888C99]';

export function ListingFormDialog({ open, onOpenChange, listing, onSubmit, userId, livePreviewHref }: ListingFormDialogProps) {
  const [draft, setDraft] = useState<ListingDraft>(createDefaultDraft());
  const [error, setError] = useState<string | null>(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(listing ? mapListingToDraft(listing) : createDefaultDraft());
    setError(null);
  }, [listing, open]);

  const dialogTitle = useMemo(() => (listing ? 'Edit Listing' : 'Create Listing'), [listing]);

  const readAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve((event.target?.result as string) || '');
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!imageFiles.length) { setError('Please select one or more image files.'); return; }
    try {
      const urls = await Promise.all(imageFiles.map((f) => readAsDataUrl(f)));
      setDraft((prev) => {
        const next = [...prev.gallery];
        urls.forEach((url, i) => {
          next.push({ id: `listing_image_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${i}`, url, caption: '', order: next.length });
        });
        return { ...prev, gallery: next };
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload.');
    }
  }, []);

  const handleFilePick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDropActive(true); };
  const handleDropZoneDragLeave = () => setIsDropActive(false);
  const handleDropZoneDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDropActive(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); };

  const removeImage = (id: string) => {
    setDraft((prev) => ({ ...prev, gallery: prev.gallery.filter((img) => img.id !== id).map((img, i) => ({ ...img, order: i })) }));
  };

  const handleImageDragStart = (idx: number) => setDraggedIdx(idx);
  const handleImageDragEnd = () => setDraggedIdx(null);
  const handleImageDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    setDraft((prev) => {
      const imgs = [...prev.gallery];
      const dragged = imgs[draggedIdx];
      imgs.splice(draggedIdx, 1);
      imgs.splice(idx, 0, dragged);
      setDraggedIdx(idx);
      return { ...prev, gallery: imgs.map((img, i) => ({ ...img, order: i })) };
    });
  };

  const handleSubmit = () => {
    setError(null);
    const parsed = listingSchema.safeParse({ ...draft, gallery: draft.gallery.filter((img) => img.url) });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || 'Please review the form fields.'); return; }
    try {
      onSubmit({ ...parsed.data, userId, homepageFeatured: draft.homepageFeatured, gallery: parsed.data.gallery.map((img, i) => ({ ...img, order: i })) });
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to save listing. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-[#EBEBEB] bg-white p-6 text-black">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-medium text-black">{dialogTitle}</DialogTitle>
          <DialogDescription className="text-[13px] text-[#888C99]">
            Add listing details and gallery images. The first image becomes the thumbnail.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 pr-1 md:grid-cols-2">
          {/* --- Form fields --- */}
          <div className="space-y-1.5 md:col-span-2">
            <label className={labelClass}>Address</label>
            <input value={draft.address} onChange={(e) => setDraft((p) => ({ ...p, address: e.target.value }))} placeholder="581 Sagee Woods Drive" className={inputClass} />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea rows={5} value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} placeholder="A paragraph or two describing the property." className="w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-2 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]" />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>List Price</label>
            <input type="number" min={0} step="1" value={draft.listPrice} onChange={(e) => setDraft((p) => ({ ...p, listPrice: e.target.value }))} placeholder="4999999" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Listing Status</label>
            <Select value={draft.listingStatus} onValueChange={(v: ListingStatus) => setDraft((p) => ({ ...p, listingStatus: v }))}>
              <SelectTrigger className="h-[34px] rounded-lg border-[#EBEBEB] bg-[#F5F5F3] text-[13px] text-black focus:ring-[#DAFF07]"><SelectValue /></SelectTrigger>
              <SelectContent className="border-[#EBEBEB] bg-white text-[13px]">
                <SelectItem value="for_sale">For Sale</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Homepage Featured</label>
            <button
              type="button"
              onClick={() => setDraft((p) => ({ ...p, homepageFeatured: !p.homepageFeatured }))}
              className={`h-[34px] w-full rounded-lg border px-3 text-[13px] text-left transition-colors ${draft.homepageFeatured ? 'border-[#DAFF07] bg-[#DAFF07]/10 text-black' : 'border-[#EBEBEB] bg-[#F5F5F3] text-[#888C99]'}`}
            >
              {draft.homepageFeatured ? 'Featured on Homepage' : 'Not Featured'}
            </button>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Representation (Optional)</label>
            <Select value={draft.representation || 'none'} onValueChange={(v) => setDraft((p) => ({ ...p, representation: v === 'none' ? undefined : v as ListingRepresentation }))}>
              <SelectTrigger className="h-[34px] rounded-lg border-[#EBEBEB] bg-[#F5F5F3] text-[13px] text-black focus:ring-[#DAFF07]"><SelectValue placeholder="Select representation" /></SelectTrigger>
              <SelectContent className="border-[#EBEBEB] bg-white text-[13px]">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="buyer_representation">Buyer Representation</SelectItem>
                <SelectItem value="seller_representation">Seller Representation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Neighborhood</label>
            <input value={draft.neighborhood} onChange={(e) => setDraft((p) => ({ ...p, neighborhood: e.target.value }))} placeholder="Highlands" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>City</label>
            <input value={draft.city} onChange={(e) => setDraft((p) => ({ ...p, city: e.target.value }))} placeholder="Austin" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Bedrooms</label>
            <input type="number" min={0} step="1" value={draft.bedrooms} onChange={(e) => setDraft((p) => ({ ...p, bedrooms: e.target.value }))} className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Bathrooms</label>
            <input type="number" min={0} step="0.5" value={draft.bathrooms} onChange={(e) => setDraft((p) => ({ ...p, bathrooms: e.target.value }))} className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Property Type</label>
            <input value={draft.propertyType} onChange={(e) => setDraft((p) => ({ ...p, propertyType: e.target.value }))} placeholder="Single Family Residence" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Year Built</label>
            <input type="number" min={1800} step="1" value={draft.yearBuilt} onChange={(e) => setDraft((p) => ({ ...p, yearBuilt: e.target.value }))} className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Living Area (sqft)</label>
            <input type="number" min={0} step="1" value={draft.livingAreaSqft} onChange={(e) => setDraft((p) => ({ ...p, livingAreaSqft: e.target.value }))} className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Lot Area</label>
            <input type="number" min={0} step="0.01" value={draft.lotAreaValue} onChange={(e) => setDraft((p) => ({ ...p, lotAreaValue: e.target.value }))} className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Lot Area Unit</label>
            <Select value={draft.lotAreaUnit} onValueChange={(v: LotAreaUnit) => setDraft((p) => ({ ...p, lotAreaUnit: v }))}>
              <SelectTrigger className="h-[34px] rounded-lg border-[#EBEBEB] bg-[#F5F5F3] text-[13px] text-black focus:ring-[#DAFF07]"><SelectValue /></SelectTrigger>
              <SelectContent className="border-[#EBEBEB] bg-white text-[13px]">
                <SelectItem value="sqft">Square Feet</SelectItem>
                <SelectItem value="acres">Acres</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Taxes (Annual)</label>
            <input type="number" min={0} step="1" value={draft.taxesAnnual} onChange={(e) => setDraft((p) => ({ ...p, taxesAnnual: e.target.value }))} className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Listing Brokerage</label>
            <input value={draft.listingBrokerage} onChange={(e) => setDraft((p) => ({ ...p, listingBrokerage: e.target.value }))} placeholder="Compass RE Texas, LLC" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>MLS Listing Number</label>
            <input value={draft.mlsNumber} onChange={(e) => setDraft((p) => ({ ...p, mlsNumber: e.target.value }))} placeholder="CAR4120551" className={inputClass} />
          </div>

          {/* ---- Gallery drop zone ---- */}
          <div className="space-y-3 md:col-span-2">
            <label className={labelClass}>Gallery</label>

            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${isDropActive ? 'border-[#DAFF07] bg-[#DAFF07]/5' : 'border-[#EBEBEB] bg-[#F5F5F3]'}`}
              onDragOver={handleDropZoneDragOver}
              onDragLeave={handleDropZoneDragLeave}
              onDrop={handleDropZoneDrop}
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#EBEBEB]">
                <Upload className="h-4 w-4 text-[#888C99]" />
              </div>
              <p className="text-[13px] font-medium text-black">Drag & drop listing photos here</p>
              <p className="my-1 text-[11px] text-[#CCCCCC]">or</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="h-[28px] rounded-lg bg-[#DAFF07] px-3 text-[12px] text-black hover:bg-[#C8ED00]">
                Browse Files
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFilePick} />
              <p className="mt-2 text-[11px] text-[#CCCCCC]">First image becomes the listing thumbnail. Drag images to reorder.</p>
            </div>

            {/* Thumbnail grid */}
            {draft.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                {draft.gallery.map((img, idx) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => handleImageDragStart(idx)}
                    onDragEnd={handleImageDragEnd}
                    onDragOver={(e) => handleImageDragOver(e, idx)}
                    className={`group relative cursor-move overflow-hidden rounded-lg border transition-all ${idx === 0 ? 'border-[#DAFF07] ring-1 ring-[#DAFF07]' : 'border-[#EBEBEB]'} ${draggedIdx === idx ? 'opacity-40' : ''}`}
                  >
                    <div className="aspect-square">
                      {img.url ? (
                        <img src={img.url} alt={img.caption || `Image ${idx + 1}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#F5F5F3] text-[11px] text-[#CCCCCC]">No image</div>
                      )}
                    </div>

                    {/* Thumbnail badge */}
                    {idx === 0 && (
                      <div className="absolute left-1 top-1 z-10 flex h-5 items-center gap-0.5 rounded bg-[#DAFF07] px-1 text-[9px] font-semibold text-black">
                        <Star className="h-2.5 w-2.5 fill-current" /> Thumbnail
                      </div>
                    )}

                    {/* Drag handle */}
                    <div className="absolute bottom-1 left-1 z-10 rounded bg-black/50 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <GripVertical className="h-3 w-3" />
                    </div>

                    {/* Delete */}
                    <button type="button" onClick={() => removeImage(img.id)} className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {draft.gallery.length === 0 && (
              <div className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-4 text-center text-[13px] text-[#888C99]">
                No images yet. Drop photos above or click "Browse Files".
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        <DialogFooter className="gap-2 pt-2">
          {livePreviewHref && (
            <a href={livePreviewHref}>
              <button type="button" className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">View Live Listing</button>
            </a>
          )}
          <button type="button" onClick={() => onOpenChange(false)} className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">Cancel</button>
          <button type="button" onClick={handleSubmit} className="h-[30px] rounded-lg bg-[#DAFF07] px-4 text-[13px] text-black hover:bg-[#C8ED00]">{listing ? 'Save Changes' : 'Create Listing'}</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
