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
    <Link
      href={targetHref}
      className="group block overflow-hidden rounded-xl border border-[#EBEBEB] bg-white transition-colors hover:border-[#DAFF07]"
    >
      <div className="relative aspect-[4/3] bg-[#F5F5F3]">
        {imageUrl ? (
          <img src={imageUrl} alt={listing.address} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-center justify-center text-[13px] text-[#CCCCCC]">No image</div>
        )}
        {showStatusBadge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${getListingStatusBadgeClass(listing.listingStatus)}`}
          >
            {LISTING_STATUS_LABELS[listing.listingStatus]}
          </span>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-[11px] uppercase tracking-widest text-[#888C99]">{listing.city}</p>
        <h3 className="line-clamp-1 text-[13px] font-medium text-black">{listing.address}</h3>
        <p className="text-[15px] font-medium text-black">{formatListingPrice(listing.listPrice)}</p>
        {listing.representation && (
          <p className="text-[11px] text-[#888C99]">{LISTING_REPRESENTATION_LABELS[listing.representation]}</p>
        )}
      </div>
    </Link>
  );
}
