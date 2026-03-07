import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Listing, ListingStatus, ListingsSortOption } from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

interface ListingsFilterConfig {
  statuses?: ListingStatus[];
  sortBy?: ListingsSortOption;
}

interface ListingsState {
  listings: Listing[];
  loaded: boolean;
  loading: boolean;
  fetchListings: (tenantId: string) => Promise<void>;
  createListing: (payload: Omit<Listing, 'id' | 'slug' | 'customOrder' | 'createdAt' | 'updatedAt'>) => Promise<Listing>;
  createSampleListing: (userId: string) => Promise<Listing>;
  updateListing: (id: string, updates: Partial<Omit<Listing, 'id' | 'userId' | 'createdAt'>>) => void;
  deleteListing: (id: string) => void;
  duplicateListing: (id: string) => void;
  updateListingOrder: (orderedListingIds: string[]) => void;
  getListingsForCurrentUser: (userId?: string) => Listing[];
  getListingBySlug: (slug: string) => Listing | undefined;
  filterAndSortListings: (listings: Listing[], config?: ListingsFilterConfig) => Listing[];
  seedCountryTemplateListings: (userId: string) => void;
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
  while (used.has(`${initialSlug}-${index}`)) index += 1;
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
      loaded: false,
      loading: false,

      fetchListings: async () => {
        set({ loaded: true });
      },

      createListing: async (payload) => {
        const listings = get().listings;
        const slug = ensureUniqueSlug(slugify(payload.address), listings);
        const now = new Date();
        const tenantId = payload.tenantId || payload.userId;
        const sortedGallery = [...payload.gallery].sort((a, b) => a.order - b.order);
        const listing: Listing = {
          ...payload,
          tenantId,
          id: `listing_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          slug,
          customOrder: listings.length,
          createdAt: now,
          updatedAt: now,
          gallery: sortedGallery,
          thumbnail: sortedGallery[0]?.url || undefined,
        };

        set((state) => ({ listings: [...state.listings, listing] }));
        return listing;
      },

      createSampleListing: async (userId) => {
        return get().createListing({
          userId,
          tenantId: userId,
          address: '7523 Grover Ave',
          description: 'Sample listing data for interaction testing.',
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
            { id: `sample_img_${Date.now()}_1`, url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80', caption: 'Front exterior', order: 0 },
            { id: `sample_img_${Date.now()}_2`, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80', caption: 'Living room', order: 1 },
            { id: `sample_img_${Date.now()}_3`, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', caption: 'Kitchen', order: 2 },
            { id: `sample_img_${Date.now()}_4`, url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80', caption: 'Primary bedroom', order: 3 },
            { id: `sample_img_${Date.now()}_5`, url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80', caption: 'Backyard', order: 4 },
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
        set((state) => ({ listings: state.listings.filter((l) => l.id !== id) }));
      },

      duplicateListing: (id) => {
        const existing = get().listings.find((l) => l.id === id);
        if (!existing) return;
        get().createListing({
          ...existing,
          address: `${existing.address} Copy`,
          gallery: existing.gallery.map((img) => ({
            ...img,
            id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          })),
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
        const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
        if (!effectiveUserId) return [];
        return normalizedListings.filter((l) => l.userId === effectiveUserId);
      },

      getListingBySlug: (slug) => {
        const effectiveUserId = useTenantContextStore.getState().effectiveUserId;
        if (!effectiveUserId) return undefined;
        const listing = get().listings.find((item) => item.slug === slug && item.userId === effectiveUserId);
        return listing ? normalizeListing(listing) : undefined;
      },

      seedCountryTemplateListings: (userId) => {
        const existing = get().listings.filter((l) => l.userId === userId);
        if (existing.length > 0) return;
        const img = '/templates/country/images';
        const now = new Date();
        const active: Omit<Listing, 'id' | 'slug' | 'customOrder' | 'createdAt' | 'updatedAt'>[] = [
          { userId, tenantId: userId, address: '33289 Lakeview Court', description: 'A stunning estate property with panoramic mountain views, custom finishes, and a spacious open-concept layout.', listPrice: 1200000, neighborhood: 'Lakeview Estates', city: 'Mountain View County', listingStatus: 'for_sale', bedrooms: 4, bathrooms: 3, propertyType: 'Residential', yearBuilt: 2018, livingAreaSqft: 3200, lotAreaValue: 2.5, lotAreaUnit: 'acres', taxesAnnual: 8500, listingBrokerage: 'Sample Brokerage', mlsNumber: 'MLS-001', representation: 'seller_representation', gallery: [{ id: `si_1a`, url: `${img}/featured-1.webp`, caption: 'Front view', order: 0 }, { id: `si_1b`, url: `${img}/buying-hero.webp`, caption: 'Surroundings', order: 1 }] },
          { userId, tenantId: userId, address: '22034 Lakeview Drive', description: 'Nestled in the foothills, this property features a wraparound deck, updated kitchen, and private pond.', listPrice: 1350000, neighborhood: 'Lakeview Estates', city: 'Mountain View County', listingStatus: 'for_sale', bedrooms: 5, bathrooms: 4, propertyType: 'Residential', yearBuilt: 2020, livingAreaSqft: 3800, lotAreaValue: 5.0, lotAreaUnit: 'acres', taxesAnnual: 9800, listingBrokerage: 'Sample Brokerage', mlsNumber: 'MLS-002', representation: 'seller_representation', gallery: [{ id: `si_2a`, url: `${img}/featured-2.webp`, caption: 'Front view', order: 0 }, { id: `si_2b`, url: `${img}/selling-hero.webp`, caption: 'Property', order: 1 }] },
          { userId, tenantId: userId, address: '33291 Lakeview Court', description: 'Contemporary ranch-style home on a private lot backing onto crown land with exceptional privacy.', listPrice: 1200000, neighborhood: 'Lakeview Estates', city: 'Mountain View County', listingStatus: 'for_sale', bedrooms: 3, bathrooms: 2, propertyType: 'Residential', yearBuilt: 2019, livingAreaSqft: 2800, lotAreaValue: 3.0, lotAreaUnit: 'acres', taxesAnnual: 7200, listingBrokerage: 'Sample Brokerage', mlsNumber: 'MLS-003', representation: 'seller_representation', gallery: [{ id: `si_3a`, url: `${img}/featured-3.webp`, caption: 'Front view', order: 0 }] },
        ];
        const sold: Omit<Listing, 'id' | 'slug' | 'customOrder' | 'createdAt' | 'updatedAt'>[] = [
          { userId, tenantId: userId, address: '14422 Mountain View Road', description: 'Charming heritage farmhouse fully renovated with modern amenities while preserving original character.', listPrice: 985000, neighborhood: 'Mountain View', city: 'Mountain View County', listingStatus: 'sold', bedrooms: 4, bathrooms: 2, propertyType: 'Residential', yearBuilt: 1965, livingAreaSqft: 2400, lotAreaValue: 10, lotAreaUnit: 'acres', taxesAnnual: 5200, listingBrokerage: 'Sample Brokerage', mlsNumber: 'MLS-004', representation: 'seller_representation', gallery: [{ id: `si_4a`, url: `${img}/featured-1.webp`, caption: 'Front view', order: 0 }] },
          { userId, tenantId: userId, address: '78901 Range Road 54', description: 'Working ranch with barn, corrals, and year-round creek running through the property.', listPrice: 1475000, neighborhood: 'Foothills', city: 'Mountain View County', listingStatus: 'sold', bedrooms: 5, bathrooms: 3, propertyType: 'Farm/Ranch', yearBuilt: 2005, livingAreaSqft: 3100, lotAreaValue: 80, lotAreaUnit: 'acres', taxesAnnual: 6800, listingBrokerage: 'Sample Brokerage', mlsNumber: 'MLS-005', representation: 'seller_representation', gallery: [{ id: `si_5a`, url: `${img}/featured-2.webp`, caption: 'Front view', order: 0 }] },
          { userId, tenantId: userId, address: '55123 Foothills Drive', description: 'Luxury estate with panoramic views, heated shop, and guest suite above the detached garage.', listPrice: 2100000, neighborhood: 'Foothills', city: 'Mountain View County', listingStatus: 'sold', bedrooms: 6, bathrooms: 5, propertyType: 'Residential', yearBuilt: 2022, livingAreaSqft: 4500, lotAreaValue: 5, lotAreaUnit: 'acres', taxesAnnual: 12000, listingBrokerage: 'Sample Brokerage', mlsNumber: 'MLS-006', representation: 'seller_representation', gallery: [{ id: `si_6a`, url: `${img}/featured-3.webp`, caption: 'Front view', order: 0 }] },
        ];
        const all = [...active, ...sold];
        all.forEach((l, i) => {
          const listings = get().listings;
          const slug = ensureUniqueSlug(slugify(l.address), listings);
          const listing: Listing = { ...l, id: `country_${Date.now()}_${i}`, slug, customOrder: listings.length, createdAt: now, updatedAt: now, gallery: l.gallery };
          set((state) => ({ listings: [...state.listings, listing] }));
        });
      },

      filterAndSortListings: (listings, config) => {
        const statuses = config?.statuses ?? [];
        const sortBy = config?.sortBy ?? 'date_added_desc';
        const filtered = statuses.length
          ? listings.filter((l) => statuses.includes(l.listingStatus))
          : listings;
        const sorted = [...filtered];
        if (sortBy === 'price_desc') sorted.sort((a, b) => b.listPrice - a.listPrice);
        else if (sortBy === 'price_asc') sorted.sort((a, b) => a.listPrice - b.listPrice);
        else if (sortBy === 'custom_order') sorted.sort((a, b) => a.customOrder - b.customOrder);
        else sorted.sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime());
        return sorted.map(normalizeListing);
      },
    }),
    {
      name: 'listings-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ listings: state.listings }),
    }
  )
);
