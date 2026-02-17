import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Listing, ListingStatus, ListingsSortOption } from '@/lib/types';

interface ListingsFilterConfig {
  statuses?: ListingStatus[];
  sortBy?: ListingsSortOption;
}

interface ListingsState {
  listings: Listing[];
  createListing: (payload: Omit<Listing, 'id' | 'slug' | 'customOrder' | 'createdAt' | 'updatedAt'>) => Listing;
  createSampleListing: (userId: string) => Listing;
  updateListing: (id: string, updates: Partial<Omit<Listing, 'id' | 'userId' | 'createdAt'>>) => void;
  deleteListing: (id: string) => void;
  duplicateListing: (id: string) => void;
  updateListingOrder: (orderedListingIds: string[]) => void;
  getListingsForCurrentUser: (userId?: string) => Listing[];
  getListingBySlug: (slug: string) => Listing | undefined;
  filterAndSortListings: (listings: Listing[], config?: ListingsFilterConfig) => Listing[];
}

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const ensureUniqueSlug = (baseSlug: string, listings: Listing[], excludeId?: string): string => {
  const initialSlug = baseSlug || 'listing';
  const used = new Set(
    listings
      .filter((listing) => (excludeId ? listing.id !== excludeId : true))
      .map((listing) => listing.slug)
  );

  if (!used.has(initialSlug)) return initialSlug;

  let index = 2;
  while (used.has(`${initialSlug}-${index}`)) {
    index += 1;
  }
  return `${initialSlug}-${index}`;
};

const toDate = (value: Date | string | number | undefined) => new Date(value ?? Date.now());

const normalizeListing = (listing: Listing): Listing => ({
  ...listing,
  createdAt: toDate(listing.createdAt),
  updatedAt: toDate(listing.updatedAt),
  gallery: [...listing.gallery].sort((a, b) => a.order - b.order),
});

export const useListingsStore = create<ListingsState>()(
  persist(
    (set, get) => ({
      listings: [],

      createListing: (payload) => {
        const listings = get().listings;
        const slug = ensureUniqueSlug(slugify(payload.address), listings);
        const now = new Date();
        const listing: Listing = {
          ...payload,
          id: `listing_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          slug,
          customOrder: listings.length,
          createdAt: now,
          updatedAt: now,
          gallery: [...payload.gallery].sort((a, b) => a.order - b.order),
        };

        set((state) => ({
          listings: [...state.listings, listing],
        }));

        return listing;
      },

      createSampleListing: (userId) => {
        const sampleAddress = '7523 Grover Ave';
        return get().createListing({
          userId,
          address: sampleAddress,
          description:
            'Sample listing data for interaction testing. This modern residence features an open layout, updated finishes, and a private backyard ideal for entertaining.',
          listPrice: 875000,
          neighborhood: 'Brentwood',
          city: 'Austin',
          listingStatus: 'for_sale',
          bedrooms: 4,
          bathrooms: 3,
          propertyType: 'Residential',
          yearBuilt: 1954,
          livingAreaSqft: 2024,
          lotAreaValue: 0.21,
          lotAreaUnit: 'acres',
          taxesAnnual: 10318,
          listingBrokerage: 'Compass RE Texas, LLC',
          mlsNumber: `SAMPLE-${Date.now().toString().slice(-6)}`,
          representation: 'seller_representation',
          gallery: [
            {
              id: `sample_img_${Date.now()}_1`,
              url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80',
              caption: 'Front exterior',
              order: 0,
            },
            {
              id: `sample_img_${Date.now()}_2`,
              url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
              caption: 'Living room',
              order: 1,
            },
            {
              id: `sample_img_${Date.now()}_3`,
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
              caption: 'Kitchen',
              order: 2,
            },
            {
              id: `sample_img_${Date.now()}_4`,
              url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
              caption: 'Primary bedroom',
              order: 3,
            },
            {
              id: `sample_img_${Date.now()}_5`,
              url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80',
              caption: 'Backyard',
              order: 4,
            },
          ],
        });
      },

      updateListing: (id, updates) => {
        set((state) => ({
          listings: state.listings.map((listing) => {
            if (listing.id !== id) return listing;
            const nextAddress = updates.address ?? listing.address;
            const nextSlug = ensureUniqueSlug(slugify(nextAddress), state.listings, id);
            return normalizeListing({
              ...listing,
              ...updates,
              slug: nextSlug,
              updatedAt: new Date(),
              gallery: updates.gallery ?? listing.gallery,
            });
          }),
        }));
      },

      deleteListing: (id) => {
        set((state) => ({
          listings: state.listings.filter((listing) => listing.id !== id),
        }));
      },

      duplicateListing: (id) => {
        const existing = get().listings.find((listing) => listing.id === id);
        if (!existing) return;
        const listingCopyInput = {
          ...existing,
          address: `${existing.address} Copy`,
          gallery: existing.gallery.map((img) => ({ ...img, id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` })),
        };
        get().createListing({
          ...listingCopyInput,
          userId: existing.userId,
          address: listingCopyInput.address,
          description: listingCopyInput.description,
          listPrice: listingCopyInput.listPrice,
          neighborhood: listingCopyInput.neighborhood,
          city: listingCopyInput.city,
          listingStatus: listingCopyInput.listingStatus,
          bedrooms: listingCopyInput.bedrooms,
          bathrooms: listingCopyInput.bathrooms,
          propertyType: listingCopyInput.propertyType,
          yearBuilt: listingCopyInput.yearBuilt,
          livingAreaSqft: listingCopyInput.livingAreaSqft,
          lotAreaValue: listingCopyInput.lotAreaValue,
          lotAreaUnit: listingCopyInput.lotAreaUnit,
          taxesAnnual: listingCopyInput.taxesAnnual,
          listingBrokerage: listingCopyInput.listingBrokerage,
          mlsNumber: listingCopyInput.mlsNumber,
          representation: listingCopyInput.representation,
          gallery: listingCopyInput.gallery,
        });
      },

      updateListingOrder: (orderedListingIds) => {
        set((state) => ({
          listings: state.listings.map((listing) => {
            const nextOrder = orderedListingIds.indexOf(listing.id);
            if (nextOrder === -1) return listing;
            return { ...listing, customOrder: nextOrder, updatedAt: new Date() };
          }),
        }));
      },

      getListingsForCurrentUser: (userId) => {
        const normalizedListings = get().listings.map(normalizeListing);
        if (!userId) return normalizedListings;
        return normalizedListings.filter((listing) => listing.userId === userId);
      },

      getListingBySlug: (slug) => {
        const listing = get().listings.find((item) => item.slug === slug);
        return listing ? normalizeListing(listing) : undefined;
      },

      filterAndSortListings: (listings, config) => {
        const statuses = config?.statuses ?? [];
        const sortBy = config?.sortBy ?? 'date_added_desc';

        const filtered = statuses.length
          ? listings.filter((listing) => statuses.includes(listing.listingStatus))
          : listings;

        const sorted = [...filtered];
        if (sortBy === 'price_desc') {
          sorted.sort((a, b) => b.listPrice - a.listPrice);
        } else if (sortBy === 'price_asc') {
          sorted.sort((a, b) => a.listPrice - b.listPrice);
        } else if (sortBy === 'custom_order') {
          sorted.sort((a, b) => a.customOrder - b.customOrder);
        } else {
          sorted.sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime());
        }

        return sorted.map(normalizeListing);
      },
    }),
    {
      name: 'listings-storage',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (error) {
            // Prevent quota exceptions from breaking create/update flows.
            console.error('Failed to persist listings state:', error);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);
