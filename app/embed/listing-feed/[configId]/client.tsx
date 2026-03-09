'use client';

import React, { useEffect, useMemo, useState } from 'react';

interface TypoEntry { fontFamily: string; fontSize: number; color: string; }
interface BadgeStyle { bg: string; color: string; borderColor: string; fontFamily: string; fontSize: number; radius: number; }
interface ImageHeight { value: number; unit: 'px' | 'vh'; }
interface ResponsiveOverrides { columns?: number; imageHeight?: ImageHeight; }

interface FeedConfig {
  columns: number;
  itemsPerPage: number | 'unlimited';
  paginationType: 'pagination' | 'load_more' | 'none';
  filters: { statuses: string[]; cities: string[]; neighborhoods: string[]; propertyTypes: string[] };
  sortBy: string;
  detailPageUrlPattern: string;
  cardLayout?: 'classic' | 'overlay' | 'minimal' | 'split_info';
  statusBadgePosition?: 'left' | 'right' | 'hidden';
  showRepresentation?: boolean;
  imageHeight?: ImageHeight;
  gap?: number;
  cardRadius?: number;
  imageRadius?: number;
  detailsBoxRadius?: number;
  detailsBoxBg?: string;
  detailsBoxBorder?: string;
  dropShadow?: boolean;
  statusBadge?: BadgeStyle;
  typography?: { address: TypoEntry; city: TypoEntry; price: TypoEntry; specs: TypoEntry };
  responsive?: { tablet: ResponsiveOverrides; mobile: ResponsiveOverrides };
}

interface ListingRow {
  id: string; slug: string; address: string; city: string; list_price: number;
  listing_status: string; bedrooms: number; bathrooms: number; living_area_sqft: number;
  thumbnail: string | null; gallery: { url: string }[]; representation?: string;
}

function formatPrice(v: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0); }
function formatNum(v: number) { return new Intl.NumberFormat('en-US').format(v || 0); }
const STATUS_LABELS: Record<string, string> = { for_sale: 'For Sale', pending: 'Pending', sold: 'Sold' };
const REP_LABELS: Record<string, string> = { buyer_representation: 'Buyer Representation', seller_representation: 'Seller Representation' };

function imgUrl(l: ListingRow) { return l.thumbnail || l.gallery?.[0]?.url || ''; }

function defaults(c: FeedConfig) {
  return {
    layout: c.cardLayout || 'classic',
    badgePos: c.statusBadgePosition || 'left',
    showRep: c.showRepresentation ?? false,
    ih: c.imageHeight || { value: 75, unit: 'vh' as const },
    gap: c.gap ?? 16,
    cRadius: c.cardRadius ?? 12,
    iRadius: c.imageRadius ?? 0,
    dRadius: c.detailsBoxRadius ?? 0,
    dBg: c.detailsBoxBg || '#ffffff',
    dBorder: c.detailsBoxBorder || '#EBEBEB',
    shadow: c.dropShadow ?? false,
    badge: c.statusBadge || { bg: '#DAFF07', color: '#000', borderColor: '', fontFamily: '', fontSize: 11, radius: 999 },
    typo: c.typography || { address: { fontFamily: '', fontSize: 15, color: '#000' }, city: { fontFamily: '', fontSize: 13, color: '#555' }, price: { fontFamily: '', fontSize: 17, color: '#000' }, specs: { fontFamily: '', fontSize: 12, color: '#888C99' } },
    responsive: c.responsive || { tablet: {}, mobile: {} },
  };
}

// ── Card renderers ───────────────────────────────────────────────────────────

function CardClassic({ l, c, href }: { l: ListingRow; c: FeedConfig; href: string }) {
  const d = defaults(c);
  return (
    <a href={href} style={{ display: 'block', borderRadius: d.cRadius, border: d.dBorder ? `1px solid ${d.dBorder}` : undefined, overflow: 'hidden', textDecoration: 'none', color: 'inherit', background: d.dBg, boxShadow: d.shadow ? '0 2px 12px rgba(0,0,0,0.08)' : undefined, transition: 'border-color 0.2s' }}>
      <div style={{ position: 'relative', height: `${d.ih.value}${d.ih.unit}`, maxHeight: 500, background: '#F5F5F3', overflow: 'hidden', borderRadius: d.iRadius || undefined }}>
        {imgUrl(l) ? <img src={imgUrl(l)} alt={l.address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CCC', fontSize: 13 }}>No image</div>}
        {d.badgePos !== 'hidden' && <span style={{ position: 'absolute', [d.badgePos === 'left' ? 'left' : 'right']: 12, top: 12, borderRadius: d.badge.radius, padding: '4px 10px', fontSize: d.badge.fontSize, fontWeight: 500, background: d.badge.bg, color: d.badge.color, border: d.badge.borderColor ? `1px solid ${d.badge.borderColor}` : undefined, fontFamily: d.badge.fontFamily || undefined }}>{STATUS_LABELS[l.listing_status] || l.listing_status}</span>}
      </div>
      <div style={{ padding: 16, background: d.dBg, borderRadius: d.dRadius || undefined }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: d.typo.price.fontSize, color: d.typo.price.color, fontFamily: d.typo.price.fontFamily || undefined }}>{formatPrice(l.list_price)}</p>
        <p style={{ margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: d.typo.address.fontSize, color: d.typo.address.color, fontFamily: d.typo.address.fontFamily || undefined }}>{l.address}</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: d.typo.specs.fontSize, color: d.typo.specs.color, fontFamily: d.typo.specs.fontFamily || undefined }}>
          <span>{l.bedrooms} Beds</span><span>{l.bathrooms} Baths</span><span>{formatNum(l.living_area_sqft)} Sqft</span>
        </div>
      </div>
    </a>
  );
}

function CardOverlay({ l, c, href }: { l: ListingRow; c: FeedConfig; href: string }) {
  const d = defaults(c);
  return (
    <a href={href} style={{ display: 'block', borderRadius: d.cRadius, overflow: 'hidden', textDecoration: 'none', color: 'inherit', position: 'relative' }}>
      <div style={{ height: `${d.ih.value}${d.ih.unit}`, maxHeight: 500, background: '#F5F5F3', overflow: 'hidden', borderRadius: d.cRadius }}>
        {imgUrl(l) ? <img src={imgUrl(l)} alt={l.address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CCC', fontSize: 13 }}>No image</div>}
        {d.badgePos !== 'hidden' && <span style={{ position: 'absolute', [d.badgePos === 'left' ? 'left' : 'right']: 12, top: 12, borderRadius: d.badge.radius, padding: '4px 10px', fontSize: d.badge.fontSize, fontWeight: 500, background: d.badge.bg, color: d.badge.color, border: d.badge.borderColor ? `1px solid ${d.badge.borderColor}` : undefined, fontFamily: d.badge.fontFamily || undefined }}>{STATUS_LABELS[l.listing_status] || l.listing_status}</span>}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: '#fff', fontSize: d.typo.address.fontSize, fontFamily: d.typo.address.fontFamily || undefined }}>{l.address}</p>
            <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: d.typo.city.fontSize, fontFamily: d.typo.city.fontFamily || undefined }}>{l.city}</p>
          </div>
          <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: d.typo.price.fontSize, fontFamily: d.typo.price.fontFamily || undefined, whiteSpace: 'nowrap' }}>{formatPrice(l.list_price)}</p>
        </div>
      </div>
    </a>
  );
}

function CardMinimal({ l, c, href }: { l: ListingRow; c: FeedConfig; href: string }) {
  const d = defaults(c);
  return (
    <a href={href} style={{ display: 'block', borderRadius: d.cRadius, border: d.dBorder ? `1px solid ${d.dBorder}` : undefined, overflow: 'hidden', textDecoration: 'none', color: 'inherit', background: d.dBg, boxShadow: d.shadow ? '0 2px 12px rgba(0,0,0,0.08)' : undefined }}>
      <div style={{ position: 'relative', height: `${d.ih.value}${d.ih.unit}`, maxHeight: 500, background: '#F5F5F3', overflow: 'hidden', borderRadius: d.iRadius || undefined }}>
        {imgUrl(l) ? <img src={imgUrl(l)} alt={l.address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CCC', fontSize: 13 }}>No image</div>}
        {d.badgePos !== 'hidden' && <span style={{ position: 'absolute', [d.badgePos === 'left' ? 'left' : 'right']: 12, top: 12, borderRadius: d.badge.radius, padding: '4px 10px', fontSize: d.badge.fontSize, fontWeight: 500, background: d.badge.bg, color: d.badge.color, border: d.badge.borderColor ? `1px solid ${d.badge.borderColor}` : undefined, fontFamily: d.badge.fontFamily || undefined }}>{STATUS_LABELS[l.listing_status] || l.listing_status}</span>}
      </div>
      <div style={{ padding: '14px 16px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: 500, fontSize: d.typo.address.fontSize, color: d.typo.address.color, fontFamily: d.typo.address.fontFamily || undefined }}>{l.address}</p>
        <p style={{ margin: '4px 0 0', fontSize: d.typo.city.fontSize, color: d.typo.city.color, fontFamily: d.typo.city.fontFamily || undefined }}>{l.city}, {formatPrice(l.list_price)}</p>
        {d.showRep && l.representation && <p style={{ margin: '4px 0 0', fontSize: d.typo.specs.fontSize, color: d.typo.specs.color }}>{REP_LABELS[l.representation] || l.representation}</p>}
      </div>
    </a>
  );
}

function CardSplitInfo({ l, c, href }: { l: ListingRow; c: FeedConfig; href: string }) {
  const d = defaults(c);
  return (
    <a href={href} style={{ display: 'block', borderRadius: d.cRadius, border: d.dBorder ? `1px solid ${d.dBorder}` : undefined, overflow: 'hidden', textDecoration: 'none', color: 'inherit', background: d.dBg, boxShadow: d.shadow ? '0 2px 12px rgba(0,0,0,0.08)' : undefined }}>
      <div style={{ height: `${d.ih.value}${d.ih.unit}`, maxHeight: 500, background: '#F5F5F3', overflow: 'hidden', borderRadius: d.iRadius || undefined }}>
        {imgUrl(l) ? <img src={imgUrl(l)} alt={l.address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CCC', fontSize: 13 }}>No image</div>}
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 500, fontSize: d.typo.address.fontSize, color: d.typo.address.color, fontFamily: d.typo.address.fontFamily || undefined }}>{l.address}</p>
          <p style={{ margin: '2px 0 0', fontSize: d.typo.city.fontSize, color: d.typo.city.color, fontFamily: d.typo.city.fontFamily || undefined }}>{l.city}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {d.badgePos !== 'hidden' && <p style={{ margin: 0, fontSize: d.badge.fontSize, fontWeight: 500, color: d.badge.color }}>{STATUS_LABELS[l.listing_status] || l.listing_status}</p>}
          <p style={{ margin: '2px 0 0', fontWeight: 600, fontSize: d.typo.price.fontSize, color: d.typo.price.color, fontFamily: d.typo.price.fontFamily || undefined }}>{formatPrice(l.list_price)}</p>
        </div>
      </div>
    </a>
  );
}

function ListingCard({ l, c, href }: { l: ListingRow; c: FeedConfig; href: string }) {
  const layout = c.cardLayout || 'classic';
  if (layout === 'overlay') return <CardOverlay l={l} c={c} href={href} />;
  if (layout === 'minimal') return <CardMinimal l={l} c={c} href={href} />;
  if (layout === 'split_info') return <CardSplitInfo l={l} c={c} href={href} />;
  return <CardClassic l={l} c={c} href={href} />;
}

// ── Main Client ──────────────────────────────────────────────────────────────

interface Props { configId: string; tenantId: string; feedConfig: FeedConfig; }

export function EmbedFeedClient({ configId, tenantId, feedConfig }: Props) {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadedExtra, setLoadedExtra] = useState(0);
  const [loading, setLoading] = useState(true);

  const perPage = feedConfig.itemsPerPage === 'unlimited' ? undefined : feedConfig.itemsPerPage;
  const totalPages = perPage ? Math.ceil(total / perPage) : 1;
  const d = defaults(feedConfig);

  useEffect(() => {
    const sp = new URLSearchParams();
    sp.set('tenantId', tenantId);
    if (feedConfig.filters.statuses.length > 0) sp.set('status', feedConfig.filters.statuses.join(','));
    if (feedConfig.filters.cities.length > 0) sp.set('city', feedConfig.filters.cities.join(','));
    if (feedConfig.filters.neighborhoods.length > 0) sp.set('neighborhood', feedConfig.filters.neighborhoods.join(','));
    if (feedConfig.filters.propertyTypes.length > 0) sp.set('propertyType', feedConfig.filters.propertyTypes.join(','));
    sp.set('sort', feedConfig.sortBy);
    if (feedConfig.paginationType === 'pagination' && perPage) { sp.set('page', String(page)); sp.set('perPage', String(perPage)); }
    else if (feedConfig.paginationType === 'load_more' && perPage) { sp.set('page', '1'); sp.set('perPage', String(perPage + loadedExtra)); }
    setLoading(true);
    fetch(`/api/public/listings?${sp.toString()}`)
      .then((r) => r.json())
      .then((res) => { if (Array.isArray(res)) { setListings(res); setTotal(res.length); } else { setListings(res.data || []); setTotal(res.total || 0); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tenantId, feedConfig, page, loadedExtra, perPage]);

  const detailUrl = (slug: string) => feedConfig.detailPageUrlPattern.replace('{slug}', slug);
  const hasMore = feedConfig.paginationType === 'load_more' && perPage && (perPage + loadedExtra) < total;

  const tabletCols = d.responsive.tablet?.columns || feedConfig.columns;
  const mobileCols = d.responsive.mobile?.columns || tabletCols;

  const responsiveCss = useMemo(() => {
    let css = '';
    css += `@media(max-width:768px){.bolt-feed-grid{grid-template-columns:repeat(${tabletCols},1fr)!important;}}`;
    css += `@media(max-width:480px){.bolt-feed-grid{grid-template-columns:repeat(${mobileCols},1fr)!important;}}`;
    return css;
  }, [tabletCols, mobileCols]);

  if (loading && listings.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#888C99' }}>Loading listings...</div>;
  }

  return (
    <div style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif", padding: 16 }}>
      <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
      <div className="bolt-feed-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${feedConfig.columns}, 1fr)`, gap: d.gap }}>
        {listings.map((l) => <ListingCard key={l.id} l={l} c={feedConfig} href={detailUrl(l.slug)} />)}
      </div>

      {feedConfig.paginationType === 'pagination' && perPage && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={{ padding: '8px 12px', border: '1px solid #EBEBEB', borderRadius: 8, background: '#fff', cursor: page <= 1 ? 'default' : 'pointer', opacity: page <= 1 ? 0.4 : 1 }}>&larr;</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" onClick={() => setPage(p)} style={{ padding: '8px 12px', borderRadius: 8, border: page === p ? 'none' : '1px solid #EBEBEB', background: page === p ? '#000' : '#fff', color: page === p ? '#fff' : '#888C99', cursor: 'pointer', fontSize: 13 }}>{p}</button>
          ))}
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={{ padding: '8px 12px', border: '1px solid #EBEBEB', borderRadius: 8, background: '#fff', cursor: page >= totalPages ? 'default' : 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}>&rarr;</button>
        </div>
      )}

      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button type="button" onClick={() => setLoadedExtra((c) => c + (perPage || 9))} style={{ padding: '10px 24px', border: '1px solid #EBEBEB', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13 }}>Load More</button>
        </div>
      )}
    </div>
  );
}
