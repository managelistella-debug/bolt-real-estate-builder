'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { useTenantContextStore } from '@/lib/stores/tenantContext';
import { useListingsStore } from '@/lib/stores/listings';
import { Listing, ListingStatus } from '@/lib/types';
import { ListingFormDialog } from '@/components/listings/ListingFormDialog';
import { formatListingPrice, LISTING_REPRESENTATION_LABELS, LISTING_STATUS_LABELS } from '@/lib/listings';
import { Copy, Edit, ExternalLink, Plus, Search, Sparkles, Trash2 } from 'lucide-react';

const STATUS_FILTERS: Array<{ label: string; value: 'all' | ListingStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'For Sale', value: 'for_sale' },
  { label: 'Pending', value: 'pending' },
  { label: 'Sold', value: 'sold' },
];

const statusPillClass: Record<string, string> = {
  for_sale: 'bg-[#DAFF07] text-black',
  pending: 'bg-[#F5F5F3] text-[#888C99] border border-[#EBEBEB]',
  sold: 'bg-black text-white',
};

export default function ListingsPage() {
  const { user } = useAuthStore();
  const { effectiveUserId } = useTenantContextStore();
  const { toast } = useToast();
  const { createListing, createSampleListing, fetchListings, updateListing, deleteListing, duplicateListing, getListingsForCurrentUser } = useListingsStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ListingStatus>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const userListings = useMemo(
    () => getListingsForCurrentUser(user?.id),
    [getListingsForCurrentUser, user?.id]
  );

  const filteredListings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return userListings.filter((listing) => {
      const matchesStatus = statusFilter === 'all' || listing.listingStatus === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;
      return (
        listing.address.toLowerCase().includes(term) ||
        listing.city.toLowerCase().includes(term) ||
        listing.neighborhood.toLowerCase().includes(term) ||
        listing.mlsNumber.toLowerCase().includes(term)
      );
    });
  }, [search, statusFilter, userListings]);

  const activeTenantId = effectiveUserId || user?.id;

  const handleCreate = async (payload: Omit<Listing, 'id' | 'slug' | 'customOrder' | 'createdAt' | 'updatedAt'>) => {
    try {
      const tenantId = activeTenantId || payload.userId;
      await createListing({ ...payload, tenantId });
      if (tenantId) await fetchListings(tenantId);
      toast({ title: 'Listing created', description: 'Your new listing has been saved.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Could not create listing', description: error instanceof Error ? error.message : 'Please try again.' });
      throw error;
    }
  };

  const handleUpdate = (payload: Omit<Listing, 'id' | 'slug' | 'customOrder' | 'createdAt' | 'updatedAt'>) => {
    if (!editingListing) return;
    try {
      updateListing(editingListing.id, payload);
      setEditingListing(null);
      toast({ title: 'Listing updated', description: 'Your listing changes were saved.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Could not update listing', description: error instanceof Error ? error.message : 'Please try again.' });
      throw error;
    }
  };

  const handleDelete = (listingId: string) => {
    if (!confirm('Delete this listing? This action cannot be undone.')) return;
    deleteListing(listingId);
    toast({ title: 'Listing deleted', description: 'The listing has been removed.' });
  };

  const handleDuplicate = (listingId: string) => {
    duplicateListing(listingId);
    toast({ title: 'Listing duplicated', description: 'A copy of the listing has been created.' });
  };

  const handleCreateSample = async () => {
    if (!activeTenantId) return;
    try {
      await createSampleListing(activeTenantId);
      await fetchListings(activeTenantId);
      toast({ title: 'Sample listing created', description: 'A sample listing was added to help you test interactions.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not create sample listing',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Listings"
          description="Manage your real estate property listings"
          action={
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
                onClick={() => setIsCreateOpen(true)}
                className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] font-normal text-black transition-colors hover:bg-[#C8ED00]"
              >
                <Plus className="h-3.5 w-3.5" />
                New Listing
              </button>
            </div>
          }
        />
      </div>

      <div className="space-y-4 p-6">
        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#EBEBEB] bg-white p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative md:max-w-md md:flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search address, city, neighborhood, or MLS #"
              className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] pl-9 pr-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatusFilter(item.value)}
                className={`h-[30px] rounded-lg px-3 text-[13px] transition-colors ${
                  statusFilter === item.value
                    ? 'bg-black text-white'
                    : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listing rows */}
        <div className="rounded-xl border border-[#EBEBEB] bg-white">
          {filteredListings.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[15px] text-black">No listings yet</p>
              <p className="mt-1 text-[13px] text-[#888C99]">
                Create your first property listing to start building your listing feed.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Listing
                </button>
                <button
                  type="button"
                  onClick={handleCreateSample}
                  className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Add Sample
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#EBEBEB]">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[13px] font-medium text-black">{listing.address}</h3>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] ${statusPillClass[listing.listingStatus] || 'bg-[#F5F5F3] text-[#888C99]'}`}>
                        {LISTING_STATUS_LABELS[listing.listingStatus]}
                      </span>
                      {listing.representation && (
                        <span className="inline-flex rounded-full border border-[#EBEBEB] bg-white px-2 py-0.5 text-[11px] text-[#888C99]">
                          {LISTING_REPRESENTATION_LABELS[listing.representation]}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[13px] text-[#888C99]">
                      {listing.neighborhood}, {listing.city}
                    </p>
                    <p className="mt-0.5 text-[13px]">
                      <span className="font-medium text-black">{formatListingPrice(listing.listPrice)}</span>
                      <span className="mx-1.5 text-[#CCCCCC]">·</span>
                      <span className="text-[#888C99]">MLS# {listing.mlsNumber}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Link href={`/listings/${listing.slug}`}>
                      <button type="button" className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black">
                        <ExternalLink className="h-3 w-3" />
                        View
                      </button>
                    </Link>
                    <button type="button" onClick={() => setEditingListing(listing)} className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black">
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDuplicate(listing.id)} className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-[#CCCCCC] transition-colors hover:bg-[#F5F5F3] hover:text-black">
                      <Copy className="h-3 w-3" />
                    </button>
                    <button type="button" onClick={() => handleDelete(listing.id)} className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-[#CCCCCC] transition-colors hover:bg-[#F5F5F3] hover:text-red-500">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {user && (
        <>
          <ListingFormDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            userId={user.id}
            onSubmit={handleCreate}
          />
          <ListingFormDialog
            open={!!editingListing}
            onOpenChange={(open) => {
              if (!open) setEditingListing(null);
            }}
            userId={user.id}
            listing={editingListing}
            onSubmit={handleUpdate}
            livePreviewHref={editingListing ? `/listings/${editingListing.slug}` : undefined}
          />
        </>
      )}
    </div>
  );
}
