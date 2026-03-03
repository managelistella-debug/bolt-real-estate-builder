import { Listing, ListingRepresentation, ListingStatus } from '@/lib/types';

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  for_sale: 'For Sale',
  pending: 'Pending',
  sold: 'Sold',
};

export const LISTING_REPRESENTATION_LABELS: Record<ListingRepresentation, string> = {
  buyer_representation: 'Buyer Representation',
  seller_representation: 'Seller Representation',
};

export const getListingStatusBadgeClass = (status: ListingStatus) => {
  if (status === 'for_sale') return 'bg-emerald-600 text-white';
  if (status === 'pending') return 'bg-amber-500 text-white';
  return 'bg-slate-700 text-white';
};

export const formatListingPrice = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value || 0);

export const formatLotArea = (value: number, unit: 'sqft' | 'acres') => {
  if (unit === 'acres') return `${value.toLocaleString('en-US')} acres`;
  return `${formatNumber(value)} sqft`;
};

export const getPrimaryListingImage = (listing: Listing) => {
  if (!listing.gallery.length) return '';
  return [...listing.gallery].sort((a, b) => a.order - b.order)[0]?.url || '';
};
