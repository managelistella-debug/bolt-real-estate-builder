'use client';

import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Listing, ListingFeedConfig } from '@/lib/types';
import {
  formatListingPrice,
  getPrimaryListingImage,
  LISTING_STATUS_LABELS,
} from '@/lib/listings';
import { formatNumber } from '@/lib/listings';

interface EmbedListingCardProps {
  listing: Listing;
  config: ListingFeedConfig;
  onClick?: () => void;
}

const REPRESENTATION_LABELS: Record<string, string> = {
  buyer_representation: 'Buyer Representation',
  seller_representation: 'Seller Representation',
};

function isGradient(v: string) { return v?.startsWith('linear-gradient'); }

function bgStyle(value: string): CSSProperties {
  return { background: value || undefined };
}

function textColorStyle(value: string): CSSProperties {
  if (isGradient(value)) {
    return {
      background: value,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    } as CSSProperties;
  }
  return { color: value };
}

function font(entry: { fontFamily: string; fontSize: number; color: string }): CSSProperties {
  return {
    fontFamily: entry.fontFamily || undefined,
    fontSize: entry.fontSize,
    ...textColorStyle(entry.color),
  };
}

function badgeStyle(config: ListingFeedConfig): CSSProperties {
  const b = config.statusBadge;
  return {
    position: 'absolute',
    borderRadius: b.radius,
    padding: '4px 10px',
    fontSize: b.fontSize,
    fontWeight: 500,
    fontFamily: b.fontFamily || undefined,
    ...bgStyle(b.bg),
    ...textColorStyle(b.color),
    border: b.borderColor ? `1px solid ${b.borderColor}` : undefined,
    ...(config.statusBadgePosition === 'left'
      ? { left: 12, top: 12 }
      : { right: 12, top: 12 }),
  };
}

function imageContainerStyle(config: ListingFeedConfig): CSSProperties {
  return {
    position: 'relative',
    height: `${config.imageHeight.value}${config.imageHeight.unit}`,
    maxHeight: 500,
    background: '#F5F5F3',
    overflow: 'hidden',
    borderRadius: config.imageRadius || undefined,
  };
}

function cardWrapperStyle(config: ListingFeedConfig): CSSProperties {
  return {
    display: 'block',
    width: '100%',
    overflow: 'hidden',
    borderRadius: config.cardRadius,
    border: config.detailsBoxBorder ? `1px solid ${config.detailsBoxBorder}` : undefined,
    background: 'transparent',
    boxShadow: config.dropShadow ? '0 2px 12px rgba(0,0,0,0.08)' : undefined,
    textAlign: 'left' as const,
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
}

function StatusBadge({ listing, config }: { listing: Listing; config: ListingFeedConfig }) {
  if (config.statusBadgePosition === 'hidden') return null;
  return (
    <span style={badgeStyle(config)}>
      {LISTING_STATUS_LABELS[listing.listingStatus]}
    </span>
  );
}

function CardImage({ listing, config }: { listing: Listing; config: ListingFeedConfig }) {
  const imageUrl = getPrimaryListingImage(listing);
  return imageUrl ? (
    <img
      src={imageUrl}
      alt={listing.address}
      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
    />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CCC', fontSize: 13 }}>
      No image
    </div>
  );
}

// ── Classic ──────────────────────────────────────────────────────────────────

function CardClassic({ listing, config, onClick }: EmbedListingCardProps) {
  const dRadius = config.detailsBoxRadius || 0;
  return (
    <button type="button" onClick={onClick} style={cardWrapperStyle(config)}>
      <div style={imageContainerStyle(config)}>
        <CardImage listing={listing} config={config} />
        <StatusBadge listing={listing} config={config} />
      </div>
      <div
        style={{
          padding: 16,
          ...bgStyle(config.detailsBoxBg),
          borderRadius: dRadius ? `${dRadius}px ${dRadius}px 0 0` : undefined,
          marginTop: dRadius ? -dRadius : 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, ...font(config.typography.price) }}>
          {formatListingPrice(listing.listPrice)}
        </p>
        <p style={{ margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...font(config.typography.address) }}>
          {listing.address}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, ...font(config.typography.specs) }}>
          <span>{listing.bedrooms} Beds</span>
          <span>{listing.bathrooms} Baths</span>
          <span>{formatNumber(listing.livingAreaSqft)} Sqft</span>
        </div>
      </div>
    </button>
  );
}

// ── Overlay ──────────────────────────────────────────────────────────────────

function CardOverlay({ listing, config, onClick }: EmbedListingCardProps) {
  const imageUrl = getPrimaryListingImage(listing);
  return (
    <button type="button" onClick={onClick} style={{ ...cardWrapperStyle(config), border: 'none', background: 'transparent' }}>
      <div style={{ ...imageContainerStyle(config), borderRadius: config.cardRadius }}>
        {imageUrl ? (
          <img src={imageUrl} alt={listing.address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CCC', fontSize: 13 }}>
            No image
          </div>
        )}
        <StatusBadge listing={listing} config={config} />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: '#fff', fontSize: config.typography.address.fontSize, fontFamily: config.typography.address.fontFamily || undefined }}>
              {listing.address}
            </p>
            <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: config.typography.city.fontSize, fontFamily: config.typography.city.fontFamily || undefined }}>
              {listing.city}
            </p>
          </div>
          <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: config.typography.price.fontSize, fontFamily: config.typography.price.fontFamily || undefined, whiteSpace: 'nowrap' }}>
            {formatListingPrice(listing.listPrice)}
          </p>
        </div>
      </div>
    </button>
  );
}

// ── Minimal ──────────────────────────────────────────────────────────────────

function CardMinimal({ listing, config, onClick }: EmbedListingCardProps) {
  return (
    <button type="button" onClick={onClick} style={cardWrapperStyle(config)}>
      <div style={imageContainerStyle(config)}>
        <CardImage listing={listing} config={config} />
        <StatusBadge listing={listing} config={config} />
      </div>
      <div style={{ padding: '14px 16px', textAlign: 'center', ...bgStyle(config.detailsBoxBg) }}>
        <p style={{ margin: 0, fontWeight: 500, ...font(config.typography.address) }}>
          {listing.address}
        </p>
        <p style={{ margin: '4px 0 0', ...font(config.typography.city) }}>
          {listing.city}, {formatListingPrice(listing.listPrice)}
        </p>
        {config.showRepresentation && listing.representation && (
          <p style={{ margin: '4px 0 0', ...font(config.typography.specs) }}>
            {REPRESENTATION_LABELS[listing.representation] || listing.representation}
          </p>
        )}
      </div>
    </button>
  );
}

// ── Split Info ───────────────────────────────────────────────────────────────

function CardSplitInfo({ listing, config, onClick }: EmbedListingCardProps) {
  return (
    <button type="button" onClick={onClick} style={cardWrapperStyle(config)}>
      <div style={imageContainerStyle(config)}>
        <CardImage listing={listing} config={config} />
      </div>
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          ...bgStyle(config.detailsBoxBg),
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: 500, ...font(config.typography.address) }}>
            {listing.address}
          </p>
          <p style={{ margin: '2px 0 0', ...font(config.typography.city) }}>
            {listing.city}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {config.statusBadgePosition !== 'hidden' && (
            <p style={{ margin: 0, fontSize: config.statusBadge.fontSize, fontWeight: 500, color: config.statusBadge.bg === '#DAFF07' ? '#000' : config.statusBadge.color }}>
              {LISTING_STATUS_LABELS[listing.listingStatus]}
            </p>
          )}
          <p style={{ margin: '2px 0 0', fontWeight: 600, ...font(config.typography.price) }}>
            {formatListingPrice(listing.listPrice)}
          </p>
        </div>
      </div>
    </button>
  );
}

// ── Carousel ─────────────────────────────────────────────────────────────────

function DefaultArrow({ direction, size, color }: { direction: 'left' | 'right'; size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 6 15 12 9 18" />}
    </svg>
  );
}

export function EmbedListingCarousel({ listings, config, onCardClick }: { listings: Listing[]; config: ListingFeedConfig; onCardClick?: (listing: Listing) => void }) {
  const cc = config.carousel;
  const displayed = listings.slice(0, cc.totalListings || listings.length);
  const visible = cc.visibleCount || 3;
  const [offset, setOffset] = useState(0);
  const maxOffset = Math.max(0, displayed.length - visible);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prev = useCallback(() => setOffset((o) => Math.max(0, o - 1)), []);
  const next = useCallback(() => setOffset((o) => Math.min(maxOffset, o + 1)), [maxOffset]);

  useEffect(() => {
    if (cc.autoplay && cc.autoplayInterval > 0) {
      autoplayRef.current = setInterval(() => {
        setOffset((o) => (o >= maxOffset ? 0 : o + 1));
      }, cc.autoplayInterval * 1000);
      return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
    }
  }, [cc.autoplay, cc.autoplayInterval, maxOffset]);

  const arrowBtn = (dir: 'left' | 'right') => {
    const svgStr = dir === 'left' ? cc.customLeftArrowSvg : cc.customRightArrowSvg;
    return (
      <button
        type="button"
        onClick={dir === 'left' ? prev : next}
        disabled={dir === 'left' ? offset <= 0 : offset >= maxOffset}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: cc.arrowSize, height: cc.arrowSize,
          borderRadius: '50%', border: `1px solid ${cc.arrowColor || '#000'}`,
          background: 'transparent', cursor: 'pointer',
          opacity: (dir === 'left' ? offset <= 0 : offset >= maxOffset) ? 0.3 : 1,
          transition: 'opacity 0.2s', flexShrink: 0,
        }}
      >
        {svgStr ? (
          <span dangerouslySetInnerHTML={{ __html: svgStr }} style={{ display: 'flex', width: cc.arrowSize * 0.5, height: cc.arrowSize * 0.5 }} />
        ) : (
          <DefaultArrow direction={dir} size={cc.arrowSize * 0.5} color={cc.arrowColor || '#000'} />
        )}
      </button>
    );
  };

  const arrowsBeside = cc.arrowPosition === 'beside';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: config.gap }}>
        {arrowsBeside && arrowBtn('left')}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              gap: config.gap,
              transform: `translateX(-${offset * (100 / visible + (config.gap / visible))}%)`,
              transition: 'transform 0.4s ease',
            }}
          >
            {displayed.map((listing) => (
              <div key={listing.id} style={{ flex: `0 0 calc(${100 / visible}% - ${(config.gap * (visible - 1)) / visible}px)`, minWidth: 0 }}>
                <CardClassic listing={listing} config={config} onClick={() => onCardClick?.(listing)} />
              </div>
            ))}
          </div>
        </div>
        {arrowsBeside && arrowBtn('right')}
      </div>
      {!arrowsBeside && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
          {arrowBtn('left')}
          {arrowBtn('right')}
        </div>
      )}
    </div>
  );
}

// ── Dispatcher ───────────────────────────────────────────────────────────────

export function EmbedListingCard(props: EmbedListingCardProps) {
  switch (props.config.cardLayout) {
    case 'overlay':
      return <CardOverlay {...props} />;
    case 'minimal':
      return <CardMinimal {...props} />;
    case 'split_info':
      return <CardSplitInfo {...props} />;
    case 'classic':
    default:
      return <CardClassic {...props} />;
  }
}
