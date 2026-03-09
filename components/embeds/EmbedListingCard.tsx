'use client';

import { CSSProperties } from 'react';
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

function font(entry: { fontFamily: string; fontSize: number; color: string }): CSSProperties {
  return {
    fontFamily: entry.fontFamily || undefined,
    fontSize: entry.fontSize,
    color: entry.color,
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
    background: b.bg,
    color: b.color,
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
    background: config.cardLayout === 'overlay' ? 'transparent' : config.detailsBoxBg,
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
  return (
    <button type="button" onClick={onClick} style={cardWrapperStyle(config)}>
      <div style={imageContainerStyle(config)}>
        <CardImage listing={listing} config={config} />
        <StatusBadge listing={listing} config={config} />
      </div>
      <div
        style={{
          padding: 16,
          background: config.detailsBoxBg,
          borderRadius: config.detailsBoxRadius || undefined,
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
        {/* Gradient overlay */}
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
        {/* Bottom text overlay */}
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
      <div style={{ padding: '14px 16px', textAlign: 'center' }}>
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
