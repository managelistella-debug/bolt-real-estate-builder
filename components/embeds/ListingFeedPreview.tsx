'use client';

import { useEffect, useMemo, useState } from 'react';
import { Listing, ListingFeedConfig } from '@/lib/types';
import { EmbedListingCard, EmbedListingCarousel } from './EmbedListingCard';
import { ChevronLeft, ChevronRight, Monitor, Smartphone, Tablet } from 'lucide-react';

interface ListingFeedPreviewProps {
  config: ListingFeedConfig;
  listings: Listing[];
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  onBreakpointChange: (bp: 'desktop' | 'tablet' | 'mobile') => void;
}

function applyFeedFilters(listings: Listing[], config: ListingFeedConfig): Listing[] {
  let result = [...listings];
  const { statuses, cities, neighborhoods, propertyTypes } = config.filters;

  if (statuses.length > 0) result = result.filter((l) => statuses.includes(l.listingStatus));
  if (cities.length > 0) result = result.filter((l) => cities.some((c) => l.city?.toLowerCase() === c.toLowerCase()));
  if (neighborhoods.length > 0) result = result.filter((l) => neighborhoods.some((n) => l.neighborhood?.toLowerCase() === n.toLowerCase()));
  if (propertyTypes.length > 0) result = result.filter((l) => propertyTypes.some((t) => l.propertyType?.toLowerCase() === t.toLowerCase()));

  switch (config.sortBy) {
    case 'price_asc': result.sort((a, b) => a.listPrice - b.listPrice); break;
    case 'price_desc': result.sort((a, b) => b.listPrice - a.listPrice); break;
    case 'oldest': result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
    case 'custom_order': result.sort((a, b) => a.customOrder - b.customOrder); break;
    case 'newest': default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
  }
  return result;
}

type Breakpoint = 'desktop' | 'tablet' | 'mobile';

function getColumnsForBreakpoint(config: ListingFeedConfig, bp: Breakpoint): number {
  if (bp === 'desktop') return config.columns;
  const override = config.responsive[bp]?.columns;
  if (override) return override;
  if (bp === 'mobile') return config.responsive.tablet?.columns || config.columns;
  return config.columns;
}

function getConfigForBreakpoint(config: ListingFeedConfig, bp: Breakpoint): ListingFeedConfig {
  if (bp === 'desktop') return config;
  const cols = getColumnsForBreakpoint(config, bp);
  const ih = config.responsive[bp]?.imageHeight || config.imageHeight;
  const ipp = config.responsive[bp]?.itemsPerPage ?? config.itemsPerPage;
  const pt = config.responsive[bp]?.paginationType ?? config.paginationType;
  return { ...config, columns: cols as 1 | 2 | 3, imageHeight: ih, itemsPerPage: ipp, paginationType: pt };
}

const BP_ICONS = { desktop: Monitor, tablet: Tablet, mobile: Smartphone } as const;
const BP_WIDTHS: Record<Breakpoint, string> = { desktop: '100%', tablet: '768px', mobile: '375px' };

export function ListingFeedPreview({ config, listings, breakpoint, onBreakpointChange }: ListingFeedPreviewProps) {
  const [page, setPage] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);

  const effectiveConfig = useMemo(() => getConfigForBreakpoint(config, breakpoint), [config, breakpoint]);

  const filtered = useMemo(() => applyFeedFilters(listings, config), [listings, config]);

  const perPage = effectiveConfig.itemsPerPage === 'unlimited' ? filtered.length : effectiveConfig.itemsPerPage;
  const totalPages = Math.ceil(filtered.length / perPage) || 1;

  const visibleListings = useMemo(() => {
    if (effectiveConfig.paginationType === 'load_more') return filtered.slice(0, perPage + loadedCount);
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage, effectiveConfig.paginationType, loadedCount]);

  const hasMore = effectiveConfig.paginationType === 'load_more' && perPage + loadedCount < filtered.length;

  useEffect(() => { setPage(1); setLoadedCount(0); }, [config.filters, config.sortBy, config.itemsPerPage]);

  if (filtered.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[#EBEBEB] bg-[#FAFAFA]">
        <div className="text-center">
          <p className="text-[13px] text-[#888C99]">No listings match your filters</p>
          <p className="mt-1 text-[12px] text-[#CCCCCC]">Adjust your filters or add listings to your CMS</p>
        </div>
      </div>
    );
  }

  const isCarousel = effectiveConfig.cardLayout === 'carousel';

  return (
    <div>
      {/* Breakpoint toggle */}
      <div className="mb-4 flex items-center gap-1">
        {(Object.keys(BP_ICONS) as Breakpoint[]).map((bp) => {
          const Icon = BP_ICONS[bp];
          return (
            <button key={bp} type="button" onClick={() => onBreakpointChange(bp)} className={`flex h-[30px] items-center gap-1.5 rounded-lg px-2.5 text-[12px] capitalize transition-colors ${breakpoint === bp ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>
              <Icon className="h-3.5 w-3.5" />{bp}
            </button>
          );
        })}
      </div>

      {/* Preview container */}
      <div style={{ maxWidth: BP_WIDTHS[breakpoint], margin: breakpoint !== 'desktop' ? '0 auto' : undefined, transition: 'max-width 0.3s' }}>
        {isCarousel ? (
          <EmbedListingCarousel listings={filtered} config={effectiveConfig} />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${effectiveConfig.columns}, 1fr)`,
              gap: effectiveConfig.gap,
            }}
          >
            {visibleListings.map((listing) => (
              <EmbedListingCard key={listing.id} listing={listing} config={effectiveConfig} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isCarousel && effectiveConfig.paginationType === 'pagination' && effectiveConfig.itemsPerPage !== 'unlimited' && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" onClick={() => setPage(p)} className={`flex h-[34px] min-w-[34px] items-center justify-center rounded-lg px-2 text-[13px] transition-colors ${page === p ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>{p}</button>
          ))}
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black disabled:opacity-40">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Load More */}
      {!isCarousel && effectiveConfig.paginationType === 'load_more' && hasMore && (
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={() => setLoadedCount((c) => c + perPage)} className="flex h-[38px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-6 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]">Load More</button>
        </div>
      )}

      {config.showListingCount !== false && !isCarousel && (
        <p className="mt-4 text-center text-[12px] text-[#CCCCCC]">Showing {visibleListings.length} of {filtered.length} listings</p>
      )}
    </div>
  );
}
