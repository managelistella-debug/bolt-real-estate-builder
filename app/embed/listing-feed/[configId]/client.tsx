'use client';

import { useEffect, useState } from 'react';

interface FeedConfig {
  columns: number;
  itemsPerPage: number | 'unlimited';
  paginationType: 'pagination' | 'load_more' | 'none';
  filters: {
    statuses: string[];
    cities: string[];
    neighborhoods: string[];
    propertyTypes: string[];
  };
  sortBy: string;
  detailPageUrlPattern: string;
}

interface ListingRow {
  id: string;
  slug: string;
  address: string;
  list_price: number;
  listing_status: string;
  bedrooms: number;
  bathrooms: number;
  living_area_sqft: number;
  thumbnail: string | null;
  gallery: { url: string }[];
}

interface PaginatedResponse {
  data: ListingRow[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

function formatNum(value: number) {
  return new Intl.NumberFormat('en-US').format(value || 0);
}

const STATUS_LABELS: Record<string, string> = { for_sale: 'For Sale', pending: 'Pending', sold: 'Sold' };

function statusBadgeStyle(status: string): React.CSSProperties {
  if (status === 'for_sale') return { background: '#DAFF07', color: '#000' };
  if (status === 'pending') return { background: '#F5F5F3', color: '#888C99', border: '1px solid #EBEBEB' };
  return { background: '#000', color: '#fff' };
}

function getImageUrl(listing: ListingRow) {
  return listing.thumbnail || listing.gallery?.[0]?.url || '';
}

interface Props {
  configId: string;
  tenantId: string;
  feedConfig: FeedConfig;
}

export function EmbedFeedClient({ configId, tenantId, feedConfig }: Props) {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadedExtra, setLoadedExtra] = useState(0);
  const [loading, setLoading] = useState(true);

  const perPage = feedConfig.itemsPerPage === 'unlimited' ? undefined : feedConfig.itemsPerPage;
  const totalPages = perPage ? Math.ceil(total / perPage) : 1;

  useEffect(() => {
    const sp = new URLSearchParams();
    sp.set('tenantId', tenantId);
    if (feedConfig.filters.statuses.length > 0) sp.set('status', feedConfig.filters.statuses.join(','));
    if (feedConfig.filters.cities.length > 0) sp.set('city', feedConfig.filters.cities.join(','));
    if (feedConfig.filters.neighborhoods.length > 0) sp.set('neighborhood', feedConfig.filters.neighborhoods.join(','));
    if (feedConfig.filters.propertyTypes.length > 0) sp.set('propertyType', feedConfig.filters.propertyTypes.join(','));
    sp.set('sort', feedConfig.sortBy);

    if (feedConfig.paginationType === 'pagination' && perPage) {
      sp.set('page', String(page));
      sp.set('perPage', String(perPage));
    } else if (feedConfig.paginationType === 'load_more' && perPage) {
      sp.set('page', '1');
      sp.set('perPage', String(perPage + loadedExtra));
    }

    setLoading(true);
    fetch(`/api/public/listings?${sp.toString()}`)
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res)) {
          setListings(res);
          setTotal(res.length);
        } else {
          setListings(res.data || []);
          setTotal(res.total || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tenantId, feedConfig, page, loadedExtra, perPage]);

  const gridCols =
    feedConfig.columns === 1
      ? '1fr'
      : feedConfig.columns === 2
        ? 'repeat(2, 1fr)'
        : 'repeat(3, 1fr)';

  const detailUrl = (slug: string) =>
    feedConfig.detailPageUrlPattern.replace('{slug}', slug);

  const hasMore = feedConfig.paginationType === 'load_more' && perPage && (perPage + loadedExtra) < total;

  if (loading && listings.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#888C99' }}>
        Loading listings...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif", padding: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 16,
        }}
      >
        {listings.map((listing) => (
          <a
            key={listing.id}
            href={detailUrl(listing.slug)}
            style={{
              display: 'block',
              borderRadius: 12,
              border: '1px solid #EBEBEB',
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              background: '#fff',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F5F5F3' }}>
              {getImageUrl(listing) ? (
                <img
                  src={getImageUrl(listing)}
                  alt={listing.address}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CCC', fontSize: 13 }}>
                  No image
                </div>
              )}
              <span
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 12,
                  borderRadius: 999,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 500,
                  ...statusBadgeStyle(listing.listing_status),
                }}
              >
                {STATUS_LABELS[listing.listing_status] || listing.listing_status}
              </span>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#000', margin: 0 }}>
                {formatPrice(listing.list_price)}
              </p>
              <p style={{ fontSize: 13, color: '#555', margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.address}
              </p>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#888C99', marginTop: 8 }}>
                <span>{listing.bedrooms} Beds</span>
                <span>{listing.bathrooms} Baths</span>
                <span>{formatNum(listing.living_area_sqft)} Sqft</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Pagination */}
      {feedConfig.paginationType === 'pagination' && perPage && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{ padding: '8px 12px', border: '1px solid #EBEBEB', borderRadius: 8, background: '#fff', cursor: page <= 1 ? 'default' : 'pointer', opacity: page <= 1 ? 0.4 : 1 }}
          >
            &larr;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: page === p ? 'none' : '1px solid #EBEBEB',
                background: page === p ? '#000' : '#fff',
                color: page === p ? '#fff' : '#888C99',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{ padding: '8px 12px', border: '1px solid #EBEBEB', borderRadius: 8, background: '#fff', cursor: page >= totalPages ? 'default' : 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}
          >
            &rarr;
          </button>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button
            type="button"
            onClick={() => setLoadedExtra((c) => c + (perPage || 9))}
            style={{
              padding: '10px 24px',
              border: '1px solid #EBEBEB',
              borderRadius: 8,
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
