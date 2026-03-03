'use client';

import Link from 'next/link';
import { Listing } from '@/lib/types';
import {
  formatListingPrice,
  getListingStatusBadgeClass,
  getPrimaryListingImage,
  LISTING_REPRESENTATION_LABELS,
  LISTING_STATUS_LABELS,
} from '@/lib/listings';

interface ListingCardProps {
  listing: Listing;
  href?: string;
  showStatusBadge?: boolean;
}

export function ListingCard({ listing, href, showStatusBadge = true }: ListingCardProps) {
  const imageUrl = getPrimaryListingImage(listing);
  const targetHref = href ?? `/listings/${listing.slug}`;

  return (
    <Link href={targetHref} className="group block overflow-hidden rounded-lg border bg-background transition hover:shadow-md">
      <div className="relative aspect-[4/3] bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={listing.address} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>
        )}
        {showStatusBadge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${getListingStatusBadgeClass(
              listing.listingStatus
            )}`}
          >
            {LISTING_STATUS_LABELS[listing.listingStatus]}
          </span>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{listing.city}</p>
        <h3 className="line-clamp-1 font-semibold">{listing.address}</h3>
        <p className="text-lg font-bold">{formatListingPrice(listing.listPrice)}</p>
        {listing.representation && (
          <p className="text-xs text-muted-foreground">{LISTING_REPRESENTATION_LABELS[listing.representation]}</p>
        )}
      </div>
    </Link>
  );
}
