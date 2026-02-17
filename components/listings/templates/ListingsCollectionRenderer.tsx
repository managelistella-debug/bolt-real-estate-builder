'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Listing, ListingCollectionTemplate, ListingRepresentation } from '@/lib/types';
import {
  formatListingPrice,
  getPrimaryListingImage,
  LISTING_REPRESENTATION_LABELS,
  LISTING_STATUS_LABELS,
} from '@/lib/listings';

interface ListingsCollectionRendererProps {
  template: ListingCollectionTemplate;
  listings: Listing[];
  previewMode?: boolean;
}

const getRepresentationLabel = (value?: ListingRepresentation) =>
  value ? LISTING_REPRESENTATION_LABELS[value] : null;

const clampColumns = (value: number) => Math.max(1, Math.min(3, value));

export function ListingsCollectionRenderer({
  template,
  listings,
  previewMode = false,
}: ListingsCollectionRendererProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [infiniteVisible, setInfiniteVisible] = useState(template.pagination.infiniteBatch);
  const [viewportWidth, setViewportWidth] = useState(1200);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setInfiniteVisible(template.pagination.infiniteBatch);
  }, [template.id, template.pagination.infiniteBatch, template.pagination.mode, template.pagination.itemsPerPage]);

  const filteredAndSorted = useMemo(() => {
    const filtered = template.statuses.length
      ? listings.filter((listing) => template.statuses.includes(listing.listingStatus))
      : listings;

    const sorted = [...filtered];
    if (template.sortBy === 'price_desc') sorted.sort((a, b) => b.listPrice - a.listPrice);
    if (template.sortBy === 'price_asc') sorted.sort((a, b) => a.listPrice - b.listPrice);
    if (template.sortBy === 'custom_order') sorted.sort((a, b) => a.customOrder - b.customOrder);
    if (template.sortBy === 'date_added_desc') sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted;
  }, [listings, template.sortBy, template.statuses]);

  const pagedListings = useMemo(() => {
    if (template.pagination.mode === 'infinite') {
      return filteredAndSorted.slice(0, infiniteVisible);
    }
    const start = (currentPage - 1) * template.pagination.itemsPerPage;
    return filteredAndSorted.slice(start, start + template.pagination.itemsPerPage);
  }, [
    currentPage,
    filteredAndSorted,
    infiniteVisible,
    template.pagination.infiniteBatch,
    template.pagination.itemsPerPage,
    template.pagination.mode,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / template.pagination.itemsPerPage));
  const responsiveColumns = viewportWidth < 640
    ? clampColumns(template.columns.mobile)
    : viewportWidth < 1024
      ? clampColumns(template.columns.tablet)
      : clampColumns(template.columns.desktop);

  return (
    <section style={{ backgroundColor: template.backgroundColor }} className="text-black">
      {template.hero.enabled && (
        <div className="mb-8 overflow-hidden">
          <div className="relative h-[280px] sm:h-[360px]">
            {template.hero.imageUrl && (
              <img src={template.hero.imageUrl} alt={template.hero.heading || 'Listings hero'} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-4 py-8 text-white sm:px-6">
              {template.hero.heading && <h1 className="text-3xl font-semibold sm:text-4xl">{template.hero.heading}</h1>}
              {template.hero.subheading && <p className="mt-2 text-sm text-white/85 sm:text-base">{template.hero.subheading}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        {pagedListings.length === 0 ? (
          <div className="rounded-md border border-black/10 bg-white p-8 text-center text-sm text-black/60">
            No listings match this template configuration.
          </div>
        ) : (
          <div
            className={template.preset === 'compact' ? 'space-y-3' : 'grid gap-5'}
            style={
              template.preset === 'compact'
                ? undefined
                : { gridTemplateColumns: `repeat(${responsiveColumns}, minmax(0, 1fr))` }
            }
          >
            {pagedListings.map((listing) => {
              const image = getPrimaryListingImage(listing);
              const representationLabel = getRepresentationLabel(listing.representation);
              const href = `/listings/${listing.slug}`;

              if (template.preset === 'compact') {
                return (
                  <article key={listing.id} className="rounded-md border border-black/10 bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        {template.showFields.address && (
                          <h3
                            style={{
                              fontFamily: template.typography.address.fontFamily,
                              fontSize: `${template.typography.address.fontSize}px`,
                              fontWeight: template.typography.address.fontWeight as any,
                              color: template.typography.address.color,
                            }}
                          >
                            {listing.address}
                          </h3>
                        )}
                        {template.showFields.city && (
                          <p
                            style={{
                              fontFamily: template.typography.city.fontFamily,
                              fontSize: `${template.typography.city.fontSize}px`,
                              fontWeight: template.typography.city.fontWeight as any,
                              color: template.typography.city.color,
                            }}
                          >
                            {listing.city}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {template.showFields.status && template.statusBadgeStyles[listing.listingStatus].enabled && (
                          <span
                            className="px-2.5 py-1 text-xs font-semibold"
                            style={{
                              borderRadius: `${template.statusBadgeStyles[listing.listingStatus].borderRadius}px`,
                              backgroundColor: template.statusBadgeStyles[listing.listingStatus].backgroundColor,
                              color: template.statusBadgeStyles[listing.listingStatus].textColor,
                            }}
                          >
                            {LISTING_STATUS_LABELS[listing.listingStatus]}
                          </span>
                        )}
                        {template.showFields.representation &&
                          representationLabel &&
                          listing.representation &&
                          template.representationBadgeStyles[listing.representation].enabled && (
                            <span
                              className="px-2.5 py-1 text-xs font-semibold"
                              style={{
                                borderRadius: `${template.representationBadgeStyles[listing.representation].borderRadius}px`,
                                backgroundColor: template.representationBadgeStyles[listing.representation].backgroundColor,
                                color: template.representationBadgeStyles[listing.representation].textColor,
                              }}
                            >
                              {representationLabel}
                            </span>
                          )}
                        {template.showFields.price && (
                          <p
                            style={{
                              fontFamily: template.typography.price.fontFamily,
                              fontSize: `${template.typography.price.fontSize}px`,
                              fontWeight: template.typography.price.fontWeight as any,
                              color: template.typography.price.color,
                            }}
                          >
                            {formatListingPrice(listing.listPrice)}
                          </p>
                        )}
                        {!previewMode && (
                          <Link href={href} className="text-xs font-semibold text-black/65 hover:text-black">
                            View Property
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article key={listing.id} className="overflow-hidden rounded-md border border-black/10 bg-white">
                  {image && (
                    <div className={template.preset === 'hero-featured' ? 'aspect-[16/10]' : 'aspect-[4/3]'}>
                      <img src={image} alt={listing.address} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-2 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {template.showFields.status && template.statusBadgeStyles[listing.listingStatus].enabled && (
                        <span
                          className="px-2.5 py-1 text-xs font-semibold"
                          style={{
                            borderRadius: `${template.statusBadgeStyles[listing.listingStatus].borderRadius}px`,
                            backgroundColor: template.statusBadgeStyles[listing.listingStatus].backgroundColor,
                            color: template.statusBadgeStyles[listing.listingStatus].textColor,
                          }}
                        >
                          {LISTING_STATUS_LABELS[listing.listingStatus]}
                        </span>
                      )}
                      {template.showFields.representation &&
                        representationLabel &&
                        listing.representation &&
                        template.representationBadgeStyles[listing.representation].enabled && (
                          <span
                            className="px-2.5 py-1 text-xs font-semibold"
                            style={{
                              borderRadius: `${template.representationBadgeStyles[listing.representation].borderRadius}px`,
                              backgroundColor: template.representationBadgeStyles[listing.representation].backgroundColor,
                              color: template.representationBadgeStyles[listing.representation].textColor,
                            }}
                          >
                            {representationLabel}
                          </span>
                        )}
                    </div>
                    {template.showFields.address && (
                      <h3
                        style={{
                          fontFamily: template.typography.address.fontFamily,
                          fontSize: `${template.typography.address.fontSize}px`,
                          fontWeight: template.typography.address.fontWeight as any,
                          color: template.typography.address.color,
                        }}
                      >
                        {listing.address}
                      </h3>
                    )}
                    {template.showFields.city && (
                      <p
                        style={{
                          fontFamily: template.typography.city.fontFamily,
                          fontSize: `${template.typography.city.fontSize}px`,
                          fontWeight: template.typography.city.fontWeight as any,
                          color: template.typography.city.color,
                        }}
                      >
                        {listing.city}
                      </p>
                    )}
                    {template.showFields.price && (
                      <p
                        style={{
                          fontFamily: template.typography.price.fontFamily,
                          fontSize: `${template.typography.price.fontSize}px`,
                          fontWeight: template.typography.price.fontWeight as any,
                          color: template.typography.price.color,
                        }}
                      >
                        {formatListingPrice(listing.listPrice)}
                      </p>
                    )}
                    {!previewMode && (
                      <Link href={href} className="inline-block text-xs font-semibold text-black/65 hover:text-black">
                        View Property
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {template.pagination.mode === 'paged' && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded border border-black/20 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-black/70">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded border border-black/20 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {template.pagination.mode === 'infinite' && infiniteVisible < filteredAndSorted.length && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setInfiniteVisible((count) => count + template.pagination.infiniteBatch)}
              className="rounded border border-black/30 px-4 py-2 text-sm font-medium"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
