'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Listing, ListingGalleryImage, ListingRepresentation, ListingStatus, LotAreaUnit } from '@/lib/types';
import { listingSchema } from '@/lib/validation/schemas';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/builder/ImageUpload';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

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
};

const createDefaultDraft = (): ListingDraft => ({
  address: '',
  description: '',
  listPrice: '',
  neighborhood: '',
  city: '',
  listingStatus: 'for_sale',
  bedrooms: '',
  bathrooms: '',
  propertyType: '',
  yearBuilt: '',
  livingAreaSqft: '',
  lotAreaValue: '',
  lotAreaUnit: 'sqft',
  taxesAnnual: '',
  listingBrokerage: '',
  mlsNumber: '',
  representation: undefined,
  gallery: [],
});

const mapListingToDraft = (listing: Listing): ListingDraft => ({
  address: listing.address,
  description: listing.description,
  listPrice: String(listing.listPrice),
  neighborhood: listing.neighborhood,
  city: listing.city,
  listingStatus: listing.listingStatus,
  bedrooms: String(listing.bedrooms),
  bathrooms: String(listing.bathrooms),
  propertyType: listing.propertyType,
  yearBuilt: String(listing.yearBuilt),
  livingAreaSqft: String(listing.livingAreaSqft),
  lotAreaValue: String(listing.lotAreaValue),
  lotAreaUnit: listing.lotAreaUnit,
  taxesAnnual: String(listing.taxesAnnual),
  listingBrokerage: listing.listingBrokerage,
  mlsNumber: listing.mlsNumber,
  representation: listing.representation,
  gallery: [...listing.gallery].sort((a, b) => a.order - b.order),
});

export function ListingFormDialog({
  open,
  onOpenChange,
  listing,
  onSubmit,
  userId,
  livePreviewHref,
}: ListingFormDialogProps) {
  const [draft, setDraft] = useState<ListingDraft>(createDefaultDraft());
  const [error, setError] = useState<string | null>(null);
  const multiUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(listing ? mapListingToDraft(listing) : createDefaultDraft());
    setError(null);
  }, [listing, open]);

  const dialogTitle = useMemo(() => (listing ? 'Edit Listing' : 'Create Listing'), [listing]);

  const addGalleryImage = () => {
    setDraft((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          id: `listing_image_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          url: '',
          caption: '',
          order: prev.gallery.length,
        },
      ],
    }));
  };

  const updateGalleryImage = (imageId: string, updates: Partial<ListingGalleryImage>) => {
    setDraft((prev) => ({
      ...prev,
      gallery: prev.gallery.map((image) => (image.id === imageId ? { ...image, ...updates } : image)),
    }));
  };

  const removeGalleryImage = (imageId: string) => {
    setDraft((prev) => ({
      ...prev,
      gallery: prev.gallery
        .filter((image) => image.id !== imageId)
        .map((image, index) => ({ ...image, order: index })),
    }));
  };

  const moveGalleryImage = (imageId: string, direction: 'up' | 'down') => {
    setDraft((prev) => {
      const images = [...prev.gallery];
      const index = images.findIndex((image) => image.id === imageId);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= images.length) return prev;
      [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
      return {
        ...prev,
        gallery: images.map((image, idx) => ({ ...image, order: idx })),
      };
    });
  };

  const readAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve((event.target?.result as string) || '');
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const handleMultiUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (!imageFiles.length) {
      setError('Please select one or more image files.');
      return;
    }

    try {
      const uploadedUrls = await Promise.all(imageFiles.map((file) => readAsDataUrl(file)));
      setDraft((prev) => {
        const nextGallery = [...prev.gallery];
        uploadedUrls.forEach((url, idx) => {
          nextGallery.push({
            id: `listing_image_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${idx}`,
            url,
            caption: '',
            order: nextGallery.length,
          });
        });
        return {
          ...prev,
          gallery: nextGallery,
        };
      });
      setError(null);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload selected images.');
    } finally {
      if (multiUploadRef.current) {
        multiUploadRef.current.value = '';
      }
    }
  };

  const handleSubmit = () => {
    setError(null);
    const parsed = listingSchema.safeParse({
      ...draft,
      gallery: draft.gallery.filter((image) => image.url),
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setError(firstIssue?.message || 'Please review the form fields.');
      return;
    }

    try {
      onSubmit({
        ...parsed.data,
        userId,
        gallery: parsed.data.gallery.map((image, index) => ({ ...image, order: index })),
      });
      onOpenChange(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save listing. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Add listing details and gallery images. The first image will be used as the main image.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={draft.address}
              onChange={(event) => setDraft((prev) => ({ ...prev, address: event.target.value }))}
              placeholder="581 Sagee Woods Drive"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={draft.description}
              onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="A paragraph or two describing the property."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="listPrice">List Price</Label>
            <Input
              id="listPrice"
              type="number"
              min={0}
              step="1"
              value={draft.listPrice}
              onChange={(event) => setDraft((prev) => ({ ...prev, listPrice: event.target.value }))}
              placeholder="4999999"
            />
          </div>

          <div className="space-y-2">
            <Label>Listing Status</Label>
            <Select
              value={draft.listingStatus}
              onValueChange={(value: ListingStatus) => setDraft((prev) => ({ ...prev, listingStatus: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="for_sale">For Sale</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Representation (Optional)</Label>
            <Select
              value={draft.representation || 'none'}
              onValueChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  representation: value === 'none' ? undefined : (value as ListingRepresentation),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select representation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="buyer_representation">Buyer Representation</SelectItem>
                <SelectItem value="seller_representation">Seller Representation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Neighborhood</Label>
            <Input
              id="neighborhood"
              value={draft.neighborhood}
              onChange={(event) => setDraft((prev) => ({ ...prev, neighborhood: event.target.value }))}
              placeholder="Highlands"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={draft.city}
              onChange={(event) => setDraft((prev) => ({ ...prev, city: event.target.value }))}
              placeholder="Austin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              min={0}
              step="1"
              value={draft.bedrooms}
              onChange={(event) => setDraft((prev) => ({ ...prev, bedrooms: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              min={0}
              step="0.5"
              value={draft.bathrooms}
              onChange={(event) => setDraft((prev) => ({ ...prev, bathrooms: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Input
              id="propertyType"
              value={draft.propertyType}
              onChange={(event) => setDraft((prev) => ({ ...prev, propertyType: event.target.value }))}
              placeholder="Single Family Residence"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearBuilt">Year Built</Label>
            <Input
              id="yearBuilt"
              type="number"
              min={1800}
              step="1"
              value={draft.yearBuilt}
              onChange={(event) => setDraft((prev) => ({ ...prev, yearBuilt: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="livingAreaSqft">Living Area (sqft)</Label>
            <Input
              id="livingAreaSqft"
              type="number"
              min={0}
              step="1"
              value={draft.livingAreaSqft}
              onChange={(event) => setDraft((prev) => ({ ...prev, livingAreaSqft: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lotAreaValue">Lot Area</Label>
            <Input
              id="lotAreaValue"
              type="number"
              min={0}
              step="0.01"
              value={draft.lotAreaValue}
              onChange={(event) => setDraft((prev) => ({ ...prev, lotAreaValue: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Lot Area Unit</Label>
            <Select
              value={draft.lotAreaUnit}
              onValueChange={(value: LotAreaUnit) => setDraft((prev) => ({ ...prev, lotAreaUnit: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sqft">Square Feet</SelectItem>
                <SelectItem value="acres">Acres</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxesAnnual">Taxes (Annual)</Label>
            <Input
              id="taxesAnnual"
              type="number"
              min={0}
              step="1"
              value={draft.taxesAnnual}
              onChange={(event) => setDraft((prev) => ({ ...prev, taxesAnnual: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="listingBrokerage">Listing Brokerage</Label>
            <Input
              id="listingBrokerage"
              value={draft.listingBrokerage}
              onChange={(event) => setDraft((prev) => ({ ...prev, listingBrokerage: event.target.value }))}
              placeholder="Compass RE Texas, LLC"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mlsNumber">MLS Listing Number</Label>
            <Input
              id="mlsNumber"
              value={draft.mlsNumber}
              onChange={(event) => setDraft((prev) => ({ ...prev, mlsNumber: event.target.value }))}
              placeholder="CAR4120551"
            />
          </div>

          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label>Gallery</Label>
              <div className="flex items-center gap-2">
                <input
                  ref={multiUploadRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleMultiUpload}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => multiUploadRef.current?.click()}>
                  Upload Multiple
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={addGalleryImage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image Slot
                </Button>
              </div>
            </div>

            {draft.gallery.length === 0 && (
              <div className="text-sm text-muted-foreground border rounded-md p-4">
                Add one or more gallery images. The first image will be the main image.
              </div>
            )}

            <div className="space-y-3">
              {draft.gallery.map((image, index) => (
                <div key={image.id} className="border rounded-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Image {index + 1} {index === 0 ? '(Main Image)' : ''}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => moveGalleryImage(image.id, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => moveGalleryImage(image.id, 'down')}
                        disabled={index === draft.gallery.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => removeGalleryImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <ImageUpload
                    value={image.url}
                    onChange={(url) => updateGalleryImage(image.id, { url })}
                    label=""
                  />
                  <Input
                    value={image.caption || ''}
                    onChange={(event) => updateGalleryImage(image.id, { caption: event.target.value })}
                    placeholder="Optional image caption"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          {livePreviewHref && (
            <a href={livePreviewHref}>
              <Button variant="outline">View Live Listing</Button>
            </a>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{listing ? 'Save Changes' : 'Create Listing'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
