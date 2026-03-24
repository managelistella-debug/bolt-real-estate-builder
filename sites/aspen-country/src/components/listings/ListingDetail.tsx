"use client";

import { useMemo, useState } from "react";
import { Listing, formatPrice } from "@/lib/listings";

interface ListingDetailProps {
  listing: Listing;
  styleConfig?: Partial<ListingDetailStyleConfig>;
}

interface ListingDetailTypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
}

interface ListingDetailStyleConfig {
  fontFamily: string;
  accentColor: string;
  accentTextColor: string;
  lineColor: string;
  lineWidth: number;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  imageBorderRadius: number;
  detailsBoxRadius: number;
  surfaceColor: string;
  mutedSurfaceColor: string;
  mutedTextColor: string;
  statusBadgeRadius: number;
  statusBadgeBorderWidth: number;
  statusBadgeBorderColor: string;
  statusColors: { active: string; pending: string; sold: string };
  typography: {
    price: ListingDetailTypographyToken;
    heading: ListingDetailTypographyToken;
    body: ListingDetailTypographyToken;
    meta: ListingDetailTypographyToken;
    label: ListingDetailTypographyToken;
    value: ListingDetailTypographyToken;
    button: ListingDetailTypographyToken;
  };
}

const DEFAULT_STYLE: ListingDetailStyleConfig = {
  fontFamily: 'Inter',
  accentColor: '#DAFF07',
  accentTextColor: '#000000',
  lineColor: '#EBEBEB',
  lineWidth: 1,
  borderColor: '#EBEBEB',
  borderWidth: 1,
  borderRadius: 12,
  imageBorderRadius: 12,
  detailsBoxRadius: 12,
  surfaceColor: '#ffffff',
  mutedSurfaceColor: '#F5F5F3',
  mutedTextColor: '#888C99',
  statusBadgeRadius: 999,
  statusBadgeBorderWidth: 1,
  statusBadgeBorderColor: '#EBEBEB',
  statusColors: { active: '#DAFF07', pending: '#F5F5F3', sold: '#111111' },
  typography: {
    price: { fontFamily: 'Inter', fontSize: 32, fontWeight: '500', color: '#000000' },
    heading: { fontFamily: 'Inter', fontSize: 24, fontWeight: '500', color: '#000000' },
    body: { fontFamily: 'Inter', fontSize: 13, fontWeight: '400', color: '#888C99' },
    meta: { fontFamily: 'Inter', fontSize: 13, fontWeight: '400', color: '#888C99' },
    label: { fontFamily: 'Inter', fontSize: 13, fontWeight: '400', color: '#888C99' },
    value: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', color: '#000000' },
    button: { fontFamily: 'Inter', fontSize: 13, fontWeight: '500', color: '#000000' },
  },
};

function mergeStyle(style?: Partial<ListingDetailStyleConfig>): ListingDetailStyleConfig {
  return {
    ...DEFAULT_STYLE,
    ...(style || {}),
    statusColors: { ...DEFAULT_STYLE.statusColors, ...(style?.statusColors || {}) },
    typography: {
      ...DEFAULT_STYLE.typography,
      ...(style?.typography || {}),
    },
  };
}

const STATUS_LABELS: Record<Listing["listingStatus"], string> = {
  active: "For Sale",
  pending: "Pending",
  sold: "Sold",
};

function formatNumber(value: number | string) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || "—";
  }
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatLotArea(value: number | string, unit: string) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "—";
    return unit === "acres" ? `${trimmed} acres` : `${trimmed} sqft`;
  }
  return unit === "acres"
    ? `${value.toLocaleString("en-US")} acres`
    : `${formatNumber(value)} sqft`;
}

function statusStyle(status: Listing["listingStatus"], style: ListingDetailStyleConfig) {
  if (status === "active") return { backgroundColor: style.statusColors.active, color: style.accentTextColor };
  if (status === "pending") {
    return {
      backgroundColor: style.statusColors.pending,
      color: style.mutedTextColor,
      border: `${style.statusBadgeBorderWidth}px solid ${style.statusBadgeBorderColor}`,
    };
  }
  return { backgroundColor: style.statusColors.sold, color: "#ffffff" };
}

export default function ListingDetail({ listing, styleConfig }: ListingDetailProps) {
  const style = useMemo(() => mergeStyle(styleConfig), [styleConfig]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);

  const gallery = useMemo(() => listing.gallery || [], [listing.gallery]);
  const activeImage = gallery[0];

  const homeInsuranceAnnual = Math.round(listing.listPrice * 0.005);
  const downPaymentAmount = (listing.listPrice * downPaymentPercent) / 100;
  const loanAmount = Math.max(0, listing.listPrice - downPaymentAmount);
  const monthlyRate = interestRate / 100 / 12;
  const termMonths = 360;
  const principalAndInterestMonthly =
    monthlyRate === 0
      ? loanAmount / termMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
  const propertyTaxMonthly = listing.taxes / 12;
  const homeInsuranceMonthly = homeInsuranceAnnual / 12;
  const estimatedMonthlyPayment =
    principalAndInterestMonthly + propertyTaxMonthly + homeInsuranceMonthly;

  return (
    <>
      <div className="mx-auto max-w-[1300px] px-4 py-6 sm:px-6 sm:py-8" style={{ fontFamily: style.fontFamily }}>
        <div className="mb-4 flex items-center justify-between text-[13px]">
          <a
            href={listing.listingStatus === "sold" ? "/listings/sold" : "/listings/active"}
            className="hover:text-black"
            style={{ color: style.typography.meta.color }}
          >
            ← Back
          </a>
          <span style={{ color: style.typography.meta.color }}>MLS# {listing.mlsNumber}</span>
        </div>

        <section className="mb-8">
          {gallery.length >= 5 ? (
            <div className="grid gap-2 lg:grid-cols-[1.2fr_1fr]">
              <button
                type="button"
                className="overflow-hidden"
                style={{ borderRadius: `${style.imageBorderRadius}px` }}
                onClick={() => setLightboxIndex(0)}
              >
                <img src={gallery[0]} alt={listing.address} className="h-[420px] w-full object-cover lg:h-[540px]" />
              </button>
              <div className="grid grid-cols-2 gap-2">
                {gallery.slice(1, 5).map((image, idx) => (
                  <button
                    key={`${image}-${idx}`}
                    type="button"
                    className="relative overflow-hidden"
                    style={{ borderRadius: `${style.imageBorderRadius}px` }}
                    onClick={() => setLightboxIndex(idx + 1)}
                  >
                    <img src={image} alt={`Listing image ${idx + 2}`} className="h-[206px] w-full object-cover lg:h-[266px]" />
                    {idx === 3 && gallery.length > 5 && (
                      <span className="absolute bottom-3 right-3 rounded-lg bg-black px-3 py-1.5 text-[12px] font-medium text-white">
                        All photos
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="w-full overflow-hidden"
              style={{ borderRadius: `${style.imageBorderRadius}px`, backgroundColor: style.mutedSurfaceColor }}
              onClick={() => (gallery.length ? setLightboxIndex(0) : null)}
            >
              {activeImage ? (
                <img src={activeImage} alt={listing.address} className="h-[320px] w-full object-cover lg:h-[560px]" />
              ) : (
                <div className="grid h-[320px] place-items-center text-[13px] text-[#CCCCCC] lg:h-[560px]">
                  No gallery images uploaded.
                </div>
              )}
            </button>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            <div className="space-y-3 pb-5" style={{ borderBottom: `${style.lineWidth}px solid ${style.lineColor}` }}>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[32px]" style={{ color: style.typography.price.color, fontFamily: style.typography.price.fontFamily, fontSize: `${style.typography.price.fontSize}px`, fontWeight: style.typography.price.fontWeight }}>{formatPrice(listing.listPrice)}</h1>
                <span className="px-2.5 py-1 text-[11px] font-medium" style={{ borderRadius: `${style.statusBadgeRadius}px`, ...statusStyle(listing.listingStatus, style) }}>
                  {STATUS_LABELS[listing.listingStatus]}
                </span>
              </div>
              <h2 className="text-[24px]" style={{ color: style.typography.heading.color, fontFamily: style.typography.heading.fontFamily, fontSize: `${style.typography.heading.fontSize}px`, fontWeight: style.typography.heading.fontWeight }}>{listing.address}</h2>
              <p className="text-[13px]" style={{ color: style.typography.meta.color }}>{listing.neighborhood}, {listing.city}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 text-[13px] sm:grid-cols-5" style={{ borderTop: `${style.lineWidth}px solid ${style.lineColor}` }}>
                <p><span style={{ color: style.typography.label.color }}>Beds</span><br /><span style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{listing.bedrooms}</span></p>
                <p><span style={{ color: style.typography.label.color }}>Baths</span><br /><span style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{listing.bathrooms}</span></p>
                <p><span style={{ color: style.typography.label.color }}>Sq Ft</span><br /><span style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{formatNumber(listing.livingArea)}</span></p>
                <p><span style={{ color: style.typography.label.color }}>Year Built</span><br /><span style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{listing.yearBuilt}</span></p>
                <p><span style={{ color: style.typography.label.color }}>Type</span><br /><span style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{listing.propertyType}</span></p>
              </div>
            </div>

            <section>
              <h3 className="text-[15px]" style={{ color: style.typography.heading.color, fontWeight: style.typography.heading.fontWeight }}>About This Property</h3>
              <p
                className="mt-3 whitespace-pre-wrap leading-6"
                style={{ color: style.typography.body.color, fontFamily: style.typography.body.fontFamily, fontSize: `${style.typography.body.fontSize}px`, fontWeight: style.typography.body.fontWeight }}
                dangerouslySetInnerHTML={{ __html: listing.description }}
              />
            </section>

            <section>
              <h3 className="mb-3 text-[15px]" style={{ color: style.typography.heading.color, fontWeight: style.typography.heading.fontWeight }}>Property Details</h3>
              <div className="grid gap-2.5 text-[13px] sm:grid-cols-3">
                {[
                  { label: "Property Type", value: listing.propertyType },
                  { label: "Lot Area", value: formatLotArea(listing.lotArea, listing.lotAreaUnit) },
                  { label: "Year Built", value: String(listing.yearBuilt) },
                  { label: "Taxes", value: formatPrice(listing.taxes) },
                  { label: "MLS", value: listing.mlsNumber },
                  { label: "Brokerage", value: listing.listingBrokerage },
                  ...(listing.representation ? [{ label: "Representation", value: listing.representation }] : []),
                ].map((item) => (
                  <div key={item.label} className="bg-white p-4" style={{ borderRadius: `${style.detailsBoxRadius}px`, border: `${style.borderWidth}px solid ${style.borderColor}` }}>
                    <p className="mb-1" style={{ color: style.typography.label.color }}>{item.label}</p>
                    <p style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
            <div className="bg-white p-5" style={{ borderRadius: `${style.borderRadius}px`, border: `${style.borderWidth}px solid ${style.borderColor}` }}>
              <h3 className="text-[15px]" style={{ color: style.typography.heading.color, fontWeight: style.typography.heading.fontWeight }}>Contact Agent</h3>
              <p className="mt-2 text-[13px]" style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>Aspen Muraski</p>
              <div className="mt-3 space-y-2 text-[13px]" style={{ color: style.typography.meta.color }}>
                <p>Aspen@SundreRealEstate.com</p>
                <p>403-703-3909</p>
              </div>
              <button className="mt-4 w-full px-4 py-2.5" style={{ borderRadius: `${style.borderRadius}px`, backgroundColor: style.accentColor, color: style.typography.button.color, fontFamily: style.typography.button.fontFamily, fontWeight: style.typography.button.fontWeight, fontSize: `${style.typography.button.fontSize}px` }}>
                Schedule a Tour
              </button>
              <button className="mt-2 w-full bg-white px-4 py-2.5" style={{ borderRadius: `${style.borderRadius}px`, border: `${style.borderWidth}px solid ${style.borderColor}`, color: style.typography.button.color, fontFamily: style.typography.button.fontFamily, fontWeight: style.typography.button.fontWeight, fontSize: `${style.typography.button.fontSize}px` }}>
                Request Info
              </button>
            </div>

            <div className="bg-white p-5" style={{ borderRadius: `${style.borderRadius}px`, border: `${style.borderWidth}px solid ${style.borderColor}` }}>
              <h3 className="text-[15px]" style={{ color: style.typography.heading.color, fontWeight: style.typography.heading.fontWeight }}>Estimated Payment</h3>
              <div className="mt-4 p-4 text-center" style={{ borderRadius: `${style.detailsBoxRadius}px`, backgroundColor: style.mutedSurfaceColor }}>
                <p className="text-[28px] leading-tight" style={{ color: style.typography.heading.color, fontWeight: style.typography.heading.fontWeight }}>{formatPrice(Math.round(estimatedMonthlyPayment))}</p>
                <p className="mt-1 text-[13px]" style={{ color: style.typography.meta.color }}>per month</p>
              </div>

              <div className="mt-4 space-y-2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span style={{ color: style.typography.label.color }}>Principal &amp; Interest</span>
                  <span style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{formatPrice(Math.round(principalAndInterestMonthly))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: style.typography.label.color }}>Property Tax</span>
                  <span style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{formatPrice(Math.round(propertyTaxMonthly))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: style.typography.label.color }}>Home Insurance</span>
                  <span style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{formatPrice(Math.round(homeInsuranceMonthly))}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-1 text-[13px] hover:text-black"
                style={{ color: style.typography.meta.color }}
                onClick={() => setShowAssumptions((prev) => !prev)}
              >
                Adjust Assumptions {showAssumptions ? "▲" : "▼"}
              </button>

              {showAssumptions && (
                <div className="mt-4 space-y-4 pt-4" style={{ borderTop: `${style.lineWidth}px solid ${style.lineColor}` }}>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-[13px]">
                      <span style={{ color: style.typography.label.color }}>Down Payment</span>
                      <span style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>
                        {downPaymentPercent}% ({formatPrice(Math.round(downPaymentAmount))})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={1}
                      value={downPaymentPercent}
                      onChange={(event) => setDownPaymentPercent(Number(event.target.value))}
                      className="w-full"
                      style={{ accentColor: style.accentColor }}
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-[13px]">
                      <span style={{ color: style.typography.label.color }}>Interest Rate</span>
                      <span style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{interestRate.toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={12}
                      step={0.1}
                      value={interestRate}
                      onChange={(event) => setInterestRate(Number(event.target.value))}
                      className="w-full"
                      style={{ accentColor: style.accentColor }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 text-[13px]" style={{ borderTop: `${style.lineWidth}px solid ${style.lineColor}` }}>
                    <span style={{ color: style.typography.label.color }}>Loan Amount</span>
                    <span className="text-[20px]" style={{ color: style.typography.value.color, fontWeight: style.typography.value.fontWeight }}>{formatPrice(Math.round(loanAmount))}</span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90" onClick={onClose}>
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(event) => event.stopPropagation()}>
        <img
          src={images[idx]}
          alt={`Listing image ${idx + 1}`}
          className="max-h-[85vh] max-w-full rounded-lg object-contain"
        />

        {idx > 0 && (
          <button
            type="button"
            onClick={() => setIdx((value) => value - 1)}
            className="absolute left-[-48px] top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            &#8592;
          </button>
        )}
        {idx < images.length - 1 && (
          <button
            type="button"
            onClick={() => setIdx((value) => value + 1)}
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
