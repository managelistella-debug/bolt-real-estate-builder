'use client';

import { useEffect, useMemo, useState } from 'react';
import { Listing, ListingFeedConfig } from '@/lib/types';
import { EmbedListingCard } from './EmbedListingCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ListingFeedPreviewProps {
  config: ListingFeedConfig;
  listings: Listing[];
}

function applyFeedFilters(listings: Listing[], config: ListingFeedConfig): Listing[] {
  let result = [...listings];

  const { statuses, cities, neighborhoods, propertyTypes } = config.filters;

  if (statuses.length > 0) {
    result = result.filter((l) => statuses.includes(l.listingStatus));
  }
  if (cities.length > 0) {
    result = result.filter((l) =>
      cities.some((c) => l.city.toLowerCase() === c.toLowerCase())
    );
  }
  if (neighborhoods.length > 0) {
    result = result.filter((l) =>
      neighborhoods.some((n) => l.neighborhood.toLowerCase() === n.toLowerCase())
    );
  }
  if (propertyTypes.length > 0) {
    result = result.filter((l) =>
      propertyTypes.some((t) => l.propertyType.toLowerCase() === t.toLowerCase())
    );
  }

  switch (config.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.listPrice - b.listPrice);
      break;
    case 'price_desc':
      result.sort((a, b) => b.listPrice - a.listPrice);
      break;
    case 'oldest':
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case 'custom_order':
      result.sort((a, b) => a.customOrder - b.customOrder);
      break;
    case 'newest':
    default:
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }

  return result;
}

export function ListingFeedPreview({
  config,
  listings,
}: ListingFeedPreviewProps) {
  const [page, setPage] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);

  const filtered = useMemo(
    () => applyFeedFilters(listings, config),
    [listings, config]
  );

  const perPage =
    config.itemsPerPage === 'unlimited'
      ? filtered.length
      : config.itemsPerPage;

  const totalPages = Math.ceil(filtered.length / perPage) || 1;

  const visibleListings = useMemo(() => {
    if (config.paginationType === 'load_more') {
      return filtered.slice(0, perPage + loadedCount);
    }
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage, config.paginationType, loadedCount]);

  const hasMore =
    config.paginationType === 'load_more' &&
    perPage + loadedCount < filtered.length;

  const gridCols =
    config.columns === 1
      ? 'grid-cols-1'
      : config.columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  // Reset page when config changes
  useEffect(() => {
    setPage(1);
    setLoadedCount(0);
  }, [config.filters, config.sortBy, config.itemsPerPage]);

  if (filtered.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[#EBEBEB] bg-[#FAFAFA]">
        <div className="text-center">
          <p className="text-[13px] text-[#888C99]">No listings match your filters</p>
          <p className="mt-1 text-[12px] text-[#CCCCCC]">
            Adjust your filters or add listings to your CMS
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`grid gap-4 ${gridCols}`}>
        {visibleListings.map((listing) => (
          <EmbedListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Pagination */}
      {config.paginationType === 'pagination' &&
        config.itemsPerPage !== 'unlimited' &&
        totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`flex h-[34px] min-w-[34px] items-center justify-center rounded-lg px-2 text-[13px] transition-colors ${
                  page === p
                    ? 'bg-black text-white'
                    : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      {/* Load More */}
      {config.paginationType === 'load_more' && hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setLoadedCount((c) => c + perPage)}
            className="flex h-[38px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-6 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]"
          >
            Load More
          </button>
        </div>
      )}

      <p className="mt-4 text-center text-[12px] text-[#CCCCCC]">
        Showing {visibleListings.length} of {filtered.length} listings
      </p>
    </div>
  );
}
