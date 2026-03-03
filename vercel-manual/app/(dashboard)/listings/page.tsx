'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { useListingsStore } from '@/lib/stores/listings';
import { Listing, ListingStatus } from '@/lib/types';
import { ListingFormDialog } from '@/components/listings/ListingFormDialog';
import { formatListingPrice, LISTING_REPRESENTATION_LABELS, LISTING_STATUS_LABELS } from '@/lib/listings';
import { Copy, Edit, ExternalLink, Plus, Sparkles, Trash2 } from 'lucide-react';

const STATUS_FILTERS: Array<{ label: string; value: 'all' | ListingStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'For Sale', value: 'for_sale' },
  { label: 'Pending', value: 'pending' },
  { label: 'Sold', value: 'sold' },
];

export default function ListingsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { createListing, createSampleListing, updateListing, deleteListing, duplicateListing, getListingsForCurrentUser } = useListingsStore();

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

  const handleCreate = (payload: Omit<Listing, 'id' | 'slug' | 'customOrder' | 'createdAt' | 'updatedAt'>) => {
    try {
      createListing(payload);
      toast({
        title: 'Listing created',
        description: 'Your new listing has been saved.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not create listing',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
      throw error;
    }
  };

  const handleUpdate = (payload: Omit<Listing, 'id' | 'slug' | 'customOrder' | 'createdAt' | 'updatedAt'>) => {
    if (!editingListing) return;
    try {
      updateListing(editingListing.id, payload);
      setEditingListing(null);
      toast({
        title: 'Listing updated',
        description: 'Your listing changes were saved.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not update listing',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
      throw error;
    }
  };

  const handleDelete = (listingId: string) => {
    if (!confirm('Delete this listing? This action cannot be undone.')) return;
    deleteListing(listingId);
    toast({
      title: 'Listing deleted',
      description: 'The listing has been removed.',
    });
  };

  const handleDuplicate = (listingId: string) => {
    duplicateListing(listingId);
    toast({
      title: 'Listing duplicated',
      description: 'A copy of the listing has been created.',
    });
  };

  const handleCreateSample = () => {
    if (!user) return;
    createSampleListing(user.id);
    toast({
      title: 'Sample listing created',
      description: 'A sample listing was added to help you test interactions.',
    });
  };

  return (
    <div>
      <Header
        title="Listings"
        description="Manage your real estate property listings"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCreateSample}>
              <Sparkles className="h-4 w-4 mr-2" />
              Add Sample Listing
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-4">
        <Card className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search address, city, neighborhood, or MLS #"
              className="md:max-w-md"
            />
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  variant={statusFilter === item.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          {filteredListings.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-lg font-semibold">No listings yet</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-5">
                Create your first property listing to start building your listing feed.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
              <Button variant="outline" className="ml-2" onClick={handleCreateSample}>
                <Sparkles className="h-4 w-4 mr-2" />
                Add Sample Listing
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{listing.address}</h3>
                      <Badge variant="outline">{LISTING_STATUS_LABELS[listing.listingStatus]}</Badge>
                      {listing.representation && (
                        <Badge variant="secondary">{LISTING_REPRESENTATION_LABELS[listing.representation]}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {listing.neighborhood}, {listing.city}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">{formatListingPrice(listing.listPrice)}</span> - MLS#{' '}
                      {listing.mlsNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/listings/${listing.slug}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => setEditingListing(listing)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDuplicate(listing.id)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(listing.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
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
