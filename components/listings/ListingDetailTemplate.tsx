'use client';

import { useMemo, useState } from 'react';
import Head from 'next/head';
import { useListingsStore } from '@/lib/stores/listings';
import { useWebsiteStore } from '@/lib/stores/website';
import { SiteHeader } from '@/components/site-header/SiteHeader';
import { SiteFooter } from '@/components/site-footer/SiteFooter';
import { Lightbox } from '@/components/builder/Lightbox';
import {
  formatListingPrice,
  formatLotArea,
  formatNumber,
  LISTING_REPRESENTATION_LABELS,
  LISTING_STATUS_LABELS,
} from '@/lib/listings';
import { Calculator, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';

interface ListingDetailTemplateProps {
  slug: string;
}

export function ListingDetailTemplate({ slug }: ListingDetailTemplateProps) {
  const listing = useListingsStore((state) => state.listings.find((item) => item.slug === slug));
  const { currentWebsite, websites } = useWebsiteStore();
  const website = currentWebsite ?? websites[0] ?? null;

  const sortedGallery = useMemo(
    () => (listing ? [...listing.gallery].sort((a, b) => a.order - b.order) : []),
    [listing]
  );
  const [activeImageIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const activeImage = sortedGallery[activeImageIndex]?.url;

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] text-black" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
        {website && (
          <SiteHeader
            websiteName={website.name}
            header={website.header}
            globalStyles={website.globalStyles}
            deviceView="desktop"
            className="border-b border-[#EBEBEB]"
          />
        )}
        <main className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-[24px] font-medium text-black">Listing not found</h1>
          <p className="mt-2 text-[13px] text-[#888C99]">
            This listing may have been removed or the URL slug is incorrect.
          </p>
        </main>
        {website && (
          <SiteFooter
            websiteName={website.name}
            footer={website.footer}
            headerNavigation={website.header.navigation}
            globalStyles={website.globalStyles}
            deviceView="desktop"
          />
        )}
      </div>
    );
  }

  const metaTitle = `${listing.address} | ${formatListingPrice(listing.listPrice)}`;
  const metaDescription = listing.description.slice(0, 155);
  const homeInsuranceAnnual = Math.round(listing.listPrice * 0.005);
  const downPaymentAmount = (listing.listPrice * downPaymentPercent) / 100;
  const loanAmount = Math.max(0, listing.listPrice - downPaymentAmount);
  const monthlyRate = interestRate / 100 / 12;
  const termMonths = 30 * 12;
  const principalAndInterestMonthly =
    monthlyRate === 0
      ? loanAmount / termMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  const propertyTaxMonthly = listing.taxesAnnual / 12;
  const homeInsuranceMonthly = homeInsuranceAnnual / 12;
  const estimatedMonthlyPayment = principalAndInterestMonthly + propertyTaxMonthly + homeInsuranceMonthly;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.address,
    description: listing.description,
    url: `/listings/${listing.slug}`,
    image: sortedGallery.map((image) => image.url),
    datePosted: new Date(listing.createdAt).toISOString(),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: listing.listPrice,
      availability: listing.listingStatus === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
    itemOffered: {
      '@type': 'Residence',
      address: {
        '@type': 'PostalAddress',
        streetAddress: listing.address,
        addressLocality: listing.city,
      },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: listing.livingAreaSqft,
        unitText: 'sqft',
      },
      numberOfRooms: listing.bedrooms,
      numberOfBathroomsTotal: listing.bathrooms,
      yearBuilt: listing.yearBuilt,
    },
  };

  const statusClass =
    listing.listingStatus === 'for_sale'
      ? 'bg-[#DAFF07] text-black'
      : listing.listingStatus === 'pending'
        ? 'bg-[#F5F5F3] text-[#888C99] border border-[#EBEBEB]'
        : 'bg-black text-white';

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {activeImage && <meta property="og:image" content={activeImage} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <div className="min-h-screen bg-[#F5F5F3] text-black" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
        {website && (
          <SiteHeader
            websiteName={website.name}
            header={website.header}
            globalStyles={website.globalStyles}
            deviceView="desktop"
            className="border-b border-[#EBEBEB]"
          />
        )}

        <main className="mx-auto max-w-[1300px] px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-4 flex items-center justify-between text-[13px]">
            <a href="/" className="text-[#888C99] hover:text-black">← Back</a>
            <span className="text-[#CCCCCC]">MLS# {listing.mlsNumber}</span>
          </div>

          {/* Gallery */}
          <section className="mb-8">
            {sortedGallery.length >= 5 ? (
              <div className="grid gap-2 lg:grid-cols-[1.2fr_1fr]">
                <button
                  type="button"
                  className="overflow-hidden rounded-xl"
                  onClick={() => setLightboxIndex(0)}
                >
                  <img src={sortedGallery[0].url} alt={listing.address} className="h-[420px] w-full object-cover lg:h-[540px]" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  {sortedGallery.slice(1, 5).map((image, idx) => (
                    <button
                      key={image.id}
                      type="button"
                      className="relative overflow-hidden rounded-xl"
                      onClick={() => setLightboxIndex(idx + 1)}
                    >
                      <img src={image.url} alt={image.caption || `Listing image ${idx + 2}`} className="h-[206px] w-full object-cover lg:h-[266px]" />
                      {idx === 3 && sortedGallery.length > 5 && (
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
                className="w-full overflow-hidden rounded-xl bg-[#EBEBEB]"
                onClick={() => (sortedGallery.length ? setLightboxIndex(0) : null)}
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
            {/* Main content */}
            <section className="space-y-6">
              <div className="space-y-3 border-b border-[#EBEBEB] pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[32px] font-medium text-black">{formatListingPrice(listing.listPrice)}</h1>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClass}`}>
                    {LISTING_STATUS_LABELS[listing.listingStatus]}
                  </span>
                </div>
                <h2 className="text-[24px] font-medium text-black">{listing.address}</h2>
                <p className="text-[13px] text-[#888C99]">{listing.neighborhood}, {listing.city}</p>
                <div className="grid grid-cols-2 gap-4 border-t border-[#EBEBEB] pt-4 text-[13px] sm:grid-cols-5">
                  <p><span className="text-[#888C99]">Beds</span><br /><span className="font-medium text-black">{listing.bedrooms}</span></p>
                  <p><span className="text-[#888C99]">Baths</span><br /><span className="font-medium text-black">{listing.bathrooms}</span></p>
                  <p><span className="text-[#888C99]">Sq Ft</span><br /><span className="font-medium text-black">{formatNumber(listing.livingAreaSqft)}</span></p>
                  <p><span className="text-[#888C99]">Year Built</span><br /><span className="font-medium text-black">{listing.yearBuilt}</span></p>
                  <p><span className="text-[#888C99]">Type</span><br /><span className="font-medium text-black">{listing.propertyType}</span></p>
                </div>
                {listing.representation && (
                  <p className="text-[13px] text-[#888C99]">
                    {LISTING_REPRESENTATION_LABELS[listing.representation]}
                  </p>
                )}
              </div>

              <section>
                <h3 className="text-[15px] font-medium text-black">About This Property</h3>
                <p className="mt-3 whitespace-pre-wrap text-[13px] leading-6 text-[#888C99]">{listing.description}</p>
              </section>

              <section>
                <h3 className="mb-3 text-[15px] font-medium text-black">Property Details</h3>
                <div className="grid gap-2.5 text-[13px] sm:grid-cols-3">
                  {[
                    { label: 'Property Type', value: listing.propertyType },
                    { label: 'Lot Area', value: formatLotArea(listing.lotAreaValue, listing.lotAreaUnit) },
                    { label: 'Year Built', value: String(listing.yearBuilt) },
                    { label: 'Taxes', value: formatListingPrice(listing.taxesAnnual) },
                    { label: 'MLS', value: listing.mlsNumber },
                    { label: 'Brokerage', value: listing.listingBrokerage },
                    ...(listing.representation ? [{ label: 'Representation', value: LISTING_REPRESENTATION_LABELS[listing.representation] }] : []),
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-[#EBEBEB] bg-white p-4">
                      <p className="mb-1 text-[#888C99]">{item.label}</p>
                      <p className="font-medium text-black">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            </section>

            {/* Sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
              <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
                <h3 className="text-[15px] font-medium text-black">Contact Agent</h3>
                <p className="mt-2 text-[13px] font-medium text-black">Reed Jackson</p>
                <div className="mt-3 space-y-2 text-[13px] text-[#888C99]">
                  <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> redacted@email.com</p>
                  <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> (000) 000-0000</p>
                </div>
                <button className="mt-4 w-full rounded-lg bg-[#DAFF07] px-4 py-2.5 text-[13px] font-medium text-black hover:bg-[#C8ED00]">
                  Schedule a Tour
                </button>
                <button className="mt-2 w-full rounded-lg border border-[#EBEBEB] bg-white px-4 py-2.5 text-[13px] font-medium text-black hover:bg-[#F5F5F3]">
                  Request Info
                </button>
              </div>

              <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
                <h3 className="flex items-center gap-2 text-[15px] font-medium text-black">
                  <Calculator className="h-4 w-4 text-[#888C99]" />
                  Estimated Payment
                </h3>

                <div className="mt-4 rounded-xl bg-[#F5F5F3] p-4 text-center">
                  <p className="text-[28px] font-medium leading-tight text-black">{formatListingPrice(Math.round(estimatedMonthlyPayment))}</p>
                  <p className="mt-1 text-[13px] text-[#888C99]">per month</p>
                </div>

                <div className="mt-4 space-y-2 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#888C99]">Principal &amp; Interest</span>
                    <span className="font-medium text-black">{formatListingPrice(Math.round(principalAndInterestMonthly))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#888C99]">Property Tax</span>
                    <span className="font-medium text-black">{formatListingPrice(Math.round(propertyTaxMonthly))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#888C99]">Home Insurance</span>
                    <span className="font-medium text-black">{formatListingPrice(Math.round(homeInsuranceMonthly))}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-1 text-[13px] text-[#888C99] hover:text-black"
                  onClick={() => setShowAssumptions((prev) => !prev)}
                >
                  Adjust Assumptions
                  {showAssumptions ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showAssumptions && (
                  <div className="mt-4 space-y-4 border-t border-[#EBEBEB] pt-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-[13px]">
                        <span className="text-[#888C99]">Down Payment</span>
                        <span className="font-medium text-black">
                          {downPaymentPercent}% ({formatListingPrice(Math.round(downPaymentAmount))})
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={60}
                        step={1}
                        value={downPaymentPercent}
                        onChange={(event) => setDownPaymentPercent(Number(event.target.value))}
                        className="w-full accent-[#DAFF07]"
                      />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-[13px]">
                        <span className="text-[#888C99]">Interest Rate</span>
                        <span className="font-medium text-black">{interestRate.toFixed(1)}%</span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={12}
                        step={0.1}
                        value={interestRate}
                        onChange={(event) => setInterestRate(Number(event.target.value))}
                        className="w-full accent-[#DAFF07]"
                      />
                    </div>
                    <div className="flex items-center justify-between border-t border-[#EBEBEB] pt-3 text-[13px]">
                      <span className="text-[#888C99]">Loan Amount</span>
                      <span className="text-[20px] font-medium text-black">{formatListingPrice(Math.round(loanAmount))}</span>
                    </div>
                  </div>
                )}

                <p className="mt-4 text-center text-[11px] text-[#CCCCCC]">
                  This is an estimate. Actual payments may vary.
                </p>
              </div>
            </aside>
          </div>
        </main>

        {website && (
          <SiteFooter
            websiteName={website.name}
            footer={website.footer}
            headerNavigation={website.header.navigation}
            globalStyles={website.globalStyles}
            deviceView="desktop"
          />
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={sortedGallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          showCaptions
        />
      )}
    </>
  );
}
