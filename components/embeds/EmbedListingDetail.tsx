'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

interface ListingData {
  id: string;
  slug: string;
  address: string;
  description: string;
  list_price: number;
  neighborhood: string;
  city: string;
  listing_status: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  year_built: number;
  living_area_sqft: number;
  lot_area_value: number;
  lot_area_unit: string;
  taxes_annual: number;
  listing_brokerage: string;
  mls_number: string;
  representation?: string;
  gallery: GalleryImage[];
  thumbnail?: string;
}

interface DetailConfig {
  showGallery?: boolean;
  showMortgageCalculator?: boolean;
  showPropertyDetails?: boolean;
  showContactForm?: boolean;
  agentName?: string;
  agentEmail?: string;
  agentPhone?: string;
  ctaLabel?: string;
}

interface EmbedListingDetailProps {
  listing: ListingData;
  config?: DetailConfig;
  backHref?: string;
}

const STATUS_LABELS: Record<string, string> = {
  for_sale: 'For Sale',
  pending: 'Pending',
  sold: 'Sold',
};

const REPRESENTATION_LABELS: Record<string, string> = {
  buyer_representation: 'Buyer Representation',
  seller_representation: 'Seller Representation',
};

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatNum(value: number) {
  return new Intl.NumberFormat('en-US').format(value || 0);
}

function formatLot(value: number, unit: string) {
  if (unit === 'acres') return `${value.toLocaleString('en-US')} acres`;
  return `${formatNum(value)} sqft`;
}

function statusClass(status: string) {
  if (status === 'for_sale') return 'bg-[#DAFF07] text-black';
  if (status === 'pending') return 'bg-[#F5F5F3] text-[#888C99] border border-[#EBEBEB]';
  return 'bg-black text-white';
}

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(images.length - 1, i + 1));
    },
    [images.length, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90" onClick={onClose}>
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[idx]?.url}
          alt={images[idx]?.caption || ''}
          className="max-h-[85vh] max-w-full rounded-lg object-contain"
        />
        {images[idx]?.caption && (
          <p className="mt-2 text-center text-sm text-white/70">{images[idx].caption}</p>
        )}
        {idx > 0 && (
          <button
            type="button"
            onClick={() => setIdx((i) => i - 1)}
            className="absolute left-[-48px] top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            &#8592;
          </button>
        )}
        {idx < images.length - 1 && (
          <button
            type="button"
            onClick={() => setIdx((i) => i + 1)}
            className="absolute right-[-48px] top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            &#8594;
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-sm text-white/60 hover:text-white"
        >
          Close &times;
        </button>
        <p className="mt-1 text-center text-xs text-white/40">
          {idx + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}

export function EmbedListingDetail({
  listing,
  config = {},
  backHref = '/',
}: EmbedListingDetailProps) {
  const {
    showGallery = true,
    showMortgageCalculator = true,
    showPropertyDetails = true,
    showContactForm = true,
    agentName,
    agentEmail,
    agentPhone,
    ctaLabel = 'Schedule a Tour',
  } = config;

  const sortedGallery = useMemo(
    () => [...(listing.gallery || [])].sort((a, b) => a.order - b.order),
    [listing.gallery]
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);

  const homeInsuranceAnnual = Math.round(listing.list_price * 0.005);
  const downPaymentAmount = (listing.list_price * downPaymentPercent) / 100;
  const loanAmount = Math.max(0, listing.list_price - downPaymentAmount);
  const monthlyRate = interestRate / 100 / 12;
  const termMonths = 360;
  const principalAndInterest =
    monthlyRate === 0
      ? loanAmount / termMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
  const propertyTaxMonthly = listing.taxes_annual / 12;
  const homeInsuranceMonthly = homeInsuranceAnnual / 12;
  const estimatedMonthly = principalAndInterest + propertyTaxMonthly + homeInsuranceMonthly;

  const hasAgent = agentName || agentEmail || agentPhone;

  return (
    <>
      <main className="mx-auto max-w-[1300px] px-4 py-6 sm:px-6 sm:py-8" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
        <div className="mb-4 flex items-center justify-between text-[13px]">
          <a href={backHref} className="text-[#888C99] hover:text-black">&larr; Back</a>
          <span className="text-[#CCCCCC]">MLS# {listing.mls_number}</span>
        </div>

        {/* Gallery */}
        {showGallery && (
          <section className="mb-8">
            {sortedGallery.length >= 5 ? (
              <div className="grid gap-2 lg:grid-cols-[1.2fr_1fr]">
                <button type="button" className="overflow-hidden rounded-xl" onClick={() => setLightboxIndex(0)}>
                  <img src={sortedGallery[0].url} alt={listing.address} className="h-[420px] w-full object-cover lg:h-[540px]" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  {sortedGallery.slice(1, 5).map((image, idx) => (
                    <button key={image.id} type="button" className="relative overflow-hidden rounded-xl" onClick={() => setLightboxIndex(idx + 1)}>
                      <img src={image.url} alt={image.caption || `Image ${idx + 2}`} className="h-[206px] w-full object-cover lg:h-[266px]" />
                      {idx === 3 && sortedGallery.length > 5 && (
                        <span className="absolute bottom-3 right-3 rounded-lg bg-black px-3 py-1.5 text-[12px] font-medium text-white">All photos</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : sortedGallery.length > 0 ? (
              <button type="button" className="w-full overflow-hidden rounded-xl bg-[#EBEBEB]" onClick={() => setLightboxIndex(0)}>
                <img src={sortedGallery[0].url} alt={listing.address} className="h-[320px] w-full object-cover lg:h-[560px]" />
              </button>
            ) : null}
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            <div className="space-y-3 border-b border-[#EBEBEB] pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[32px] font-medium text-black">{formatPrice(listing.list_price)}</h1>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClass(listing.listing_status)}`}>
                  {STATUS_LABELS[listing.listing_status] ?? listing.listing_status}
                </span>
              </div>
              <h2 className="text-[24px] font-medium text-black">{listing.address}</h2>
              <p className="text-[13px] text-[#888C99]">{listing.neighborhood}, {listing.city}</p>
              <div className="grid grid-cols-2 gap-4 border-t border-[#EBEBEB] pt-4 text-[13px] sm:grid-cols-5">
                <p><span className="text-[#888C99]">Beds</span><br /><span className="font-medium text-black">{listing.bedrooms}</span></p>
                <p><span className="text-[#888C99]">Baths</span><br /><span className="font-medium text-black">{listing.bathrooms}</span></p>
                <p><span className="text-[#888C99]">Sq Ft</span><br /><span className="font-medium text-black">{formatNum(listing.living_area_sqft)}</span></p>
                <p><span className="text-[#888C99]">Year Built</span><br /><span className="font-medium text-black">{listing.year_built}</span></p>
                <p><span className="text-[#888C99]">Type</span><br /><span className="font-medium text-black">{listing.property_type}</span></p>
              </div>
              {listing.representation && (
                <p className="text-[13px] text-[#888C99]">{REPRESENTATION_LABELS[listing.representation] ?? listing.representation}</p>
              )}
            </div>

            <section>
              <h3 className="text-[15px] font-medium text-black">About This Property</h3>
              <p className="mt-3 whitespace-pre-wrap text-[13px] leading-6 text-[#888C99]">{listing.description}</p>
            </section>

            {showPropertyDetails && (
              <section>
                <h3 className="mb-3 text-[15px] font-medium text-black">Property Details</h3>
                <div className="grid gap-2.5 text-[13px] sm:grid-cols-3">
                  {[
                    { label: 'Property Type', value: listing.property_type },
                    { label: 'Lot Area', value: formatLot(listing.lot_area_value, listing.lot_area_unit) },
                    { label: 'Year Built', value: String(listing.year_built) },
                    { label: 'Taxes', value: formatPrice(listing.taxes_annual) },
                    { label: 'MLS', value: listing.mls_number },
                    { label: 'Brokerage', value: listing.listing_brokerage },
                    ...(listing.representation ? [{ label: 'Representation', value: REPRESENTATION_LABELS[listing.representation] ?? listing.representation }] : []),
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-[#EBEBEB] bg-white p-4">
                      <p className="mb-1 text-[#888C99]">{item.label}</p>
                      <p className="font-medium text-black">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
            {showContactForm && hasAgent && (
              <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
                <h3 className="text-[15px] font-medium text-black">Contact Agent</h3>
                {agentName && <p className="mt-2 text-[13px] font-medium text-black">{agentName}</p>}
                <div className="mt-3 space-y-2 text-[13px] text-[#888C99]">
                  {agentEmail && <p>{agentEmail}</p>}
                  {agentPhone && <p>{agentPhone}</p>}
                </div>
                <button type="button" className="mt-4 w-full rounded-lg bg-[#DAFF07] px-4 py-2.5 text-[13px] font-medium text-black hover:bg-[#C8ED00]">
                  {ctaLabel}
                </button>
                <button type="button" className="mt-2 w-full rounded-lg border border-[#EBEBEB] bg-white px-4 py-2.5 text-[13px] font-medium text-black hover:bg-[#F5F5F3]">
                  Request Info
                </button>
              </div>
            )}

            {showMortgageCalculator && (
              <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
                <h3 className="text-[15px] font-medium text-black">Estimated Payment</h3>
                <div className="mt-4 rounded-xl bg-[#F5F5F3] p-4 text-center">
                  <p className="text-[28px] font-medium leading-tight text-black">{formatPrice(Math.round(estimatedMonthly))}</p>
                  <p className="mt-1 text-[13px] text-[#888C99]">per month</p>
                </div>
                <div className="mt-4 space-y-2 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#888C99]">Principal &amp; Interest</span>
                    <span className="font-medium text-black">{formatPrice(Math.round(principalAndInterest))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#888C99]">Property Tax</span>
                    <span className="font-medium text-black">{formatPrice(Math.round(propertyTaxMonthly))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#888C99]">Home Insurance</span>
                    <span className="font-medium text-black">{formatPrice(Math.round(homeInsuranceMonthly))}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-1 text-[13px] text-[#888C99] hover:text-black"
                  onClick={() => setShowAssumptions((v) => !v)}
                >
                  Adjust Assumptions {showAssumptions ? '▲' : '▼'}
                </button>
                {showAssumptions && (
                  <div className="mt-4 space-y-4 border-t border-[#EBEBEB] pt-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-[13px]">
                        <span className="text-[#888C99]">Down Payment</span>
                        <span className="font-medium text-black">{downPaymentPercent}% ({formatPrice(Math.round(downPaymentAmount))})</span>
                      </div>
                      <input type="range" min={0} max={60} step={1} value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} className="w-full accent-[#DAFF07]" />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-[13px]">
                        <span className="text-[#888C99]">Interest Rate</span>
                        <span className="font-medium text-black">{interestRate.toFixed(1)}%</span>
                      </div>
                      <input type="range" min={2} max={12} step={0.1} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full accent-[#DAFF07]" />
                    </div>
                    <div className="flex items-center justify-between border-t border-[#EBEBEB] pt-3 text-[13px]">
                      <span className="text-[#888C99]">Loan Amount</span>
                      <span className="text-[20px] font-medium text-black">{formatPrice(Math.round(loanAmount))}</span>
                    </div>
                  </div>
                )}
                <p className="mt-4 text-center text-[11px] text-[#CCCCCC]">This is an estimate. Actual payments may vary.</p>
              </div>
            )}
          </aside>
        </div>
      </main>

      {lightboxIndex !== null && (
        <Lightbox images={sortedGallery} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  );
}
