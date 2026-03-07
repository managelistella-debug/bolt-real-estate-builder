'use client';

import { Listing } from '@/lib/types';
import {
  formatListingPrice,
  getListingStatusBadgeClass,
  getPrimaryListingImage,
  LISTING_STATUS_LABELS,
} from '@/lib/listings';
import { formatNumber } from '@/lib/listings';
import { Bath, BedDouble, Ruler } from 'lucide-react';

interface EmbedListingCardProps {
  listing: Listing;
  onClick?: () => void;
}

export function EmbedListingCard({ listing, onClick }: EmbedListingCardProps) {
  const imageUrl = getPrimaryListingImage(listing);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full overflow-hidden rounded-xl border border-[#EBEBEB] bg-white text-left transition-colors hover:border-[#DAFF07]"
    >
      <div className="relative aspect-[4/3] bg-[#F5F5F3]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.address}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[13px] text-[#CCCCCC]">
            No image
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${getListingStatusBadgeClass(listing.listingStatus)}`}
        >
          {LISTING_STATUS_LABELS[listing.listingStatus]}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <p className="text-[17px] font-semibold text-black">
          {formatListingPrice(listing.listPrice)}
        </p>
        <p className="line-clamp-1 text-[13px] text-[#555]">{listing.address}</p>
        <div className="flex items-center gap-3 text-[12px] text-[#888C99]">
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" />
            {listing.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            {listing.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5" />
            {formatNumber(listing.livingAreaSqft)} Sqft
          </span>
        </div>
      </div>
    </button>
  );
}
