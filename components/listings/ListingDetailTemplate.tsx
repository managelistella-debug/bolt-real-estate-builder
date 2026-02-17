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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const activeImage = sortedGallery[activeImageIndex]?.url;

  if (!listing) {
    return (
      <div className="bg-white text-black min-h-screen">
        {website && (
          <SiteHeader
            websiteName={website.name}
            header={website.header}
            globalStyles={website.globalStyles}
            deviceView="desktop"
            className="border-b border-black/10"
          />
        )}
        <main className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-2xl font-semibold">Listing not found</h1>
          <p className="text-black/60 mt-2">
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

      <div className="bg-white text-black min-h-screen">
        {website && (
          <SiteHeader
            websiteName={website.name}
            header={website.header}
            globalStyles={website.globalStyles}
            deviceView="desktop"
            className="border-b border-black/10"
          />
        )}

        <main className="mx-auto max-w-[1300px] px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-4 flex items-center justify-between text-sm">
            <a href="/listings/collection" className="text-black/70 hover:text-black">← Back to Search</a>
            <span className="text-black/50">MLS# {listing.mlsNumber}</span>
          </div>

          <section className="mb-8">
            {sortedGallery.length >= 5 ? (
              <div className="grid gap-2 lg:grid-cols-[1.2fr_1fr]">
                <button
                  type="button"
                  className="overflow-hidden rounded-lg"
                  onClick={() => setLightboxIndex(0)}
                >
                  <img src={sortedGallery[0].url} alt={listing.address} className="h-[420px] w-full object-cover lg:h-[540px]" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  {sortedGallery.slice(1, 5).map((image, idx) => (
                    <button
                      key={image.id}
                      type="button"
                      className="relative overflow-hidden rounded-lg"
                      onClick={() => setLightboxIndex(idx + 1)}
                    >
                      <img src={image.url} alt={image.caption || `Listing image ${idx + 2}`} className="h-[206px] w-full object-cover lg:h-[266px]" />
                      {idx === 3 && sortedGallery.length > 5 && (
                        <span className="absolute bottom-3 right-3 rounded-md bg-black px-3 py-1.5 text-xs font-semibold text-white">
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
                className="w-full overflow-hidden rounded-lg bg-black/5"
                onClick={() => (sortedGallery.length ? setLightboxIndex(0) : null)}
              >
                {activeImage ? (
                  <img src={activeImage} alt={listing.address} className="h-[320px] w-full object-cover lg:h-[560px]" />
                ) : (
                  <div className="grid h-[320px] place-items-center text-sm text-black/50 lg:h-[560px]">
                    No gallery images uploaded.
                  </div>
                )}
              </button>
            )}
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-6">
              <div className="space-y-3 border-b border-black/10 pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-4xl font-bold">{formatListingPrice(listing.listPrice)}</h1>
                  <span className="rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white">
                    {LISTING_STATUS_LABELS[listing.listingStatus]}
                  </span>
                </div>
                <h2 className="text-3xl font-semibold">{listing.address}</h2>
                <p className="text-black/60">{listing.neighborhood}, {listing.city}</p>
                <div className="grid grid-cols-2 gap-4 border-t border-black/10 pt-4 text-sm sm:grid-cols-5">
                  <p><span className="text-black/55">Beds</span><br /><span className="font-semibold">{listing.bedrooms}</span></p>
                  <p><span className="text-black/55">Baths</span><br /><span className="font-semibold">{listing.bathrooms}</span></p>
                  <p><span className="text-black/55">Sq Ft</span><br /><span className="font-semibold">{formatNumber(listing.livingAreaSqft)}</span></p>
                  <p><span className="text-black/55">Year Built</span><br /><span className="font-semibold">{listing.yearBuilt}</span></p>
                  <p><span className="text-black/55">Type</span><br /><span className="font-semibold">{listing.propertyType}</span></p>
                </div>
                {listing.representation && (
                  <p className="text-sm text-black/60">
                    {LISTING_REPRESENTATION_LABELS[listing.representation]}
                  </p>
                )}
              </div>

              <section>
                <h3 className="text-2xl font-semibold">About This Property</h3>
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-black/70">{listing.description}</p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold mb-3">Property Details</h3>
                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-black/55 mb-1">Property Type</p>
                    <p className="font-semibold">{listing.propertyType}</p>
                  </div>
                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-black/55 mb-1">Lot Area</p>
                    <p className="font-semibold">{formatLotArea(listing.lotAreaValue, listing.lotAreaUnit)}</p>
                  </div>
                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-black/55 mb-1">Year Built</p>
                    <p className="font-semibold">{listing.yearBuilt}</p>
                  </div>
                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-black/55 mb-1">Taxes</p>
                    <p className="font-semibold">{formatListingPrice(listing.taxesAnnual)}</p>
                  </div>
                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-black/55 mb-1">MLS</p>
                    <p className="font-semibold">{listing.mlsNumber}</p>
                  </div>
                  <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-black/55 mb-1">Brokerage</p>
                    <p className="font-semibold">{listing.listingBrokerage}</p>
                  </div>
                  {listing.representation && (
                    <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                      <p className="text-black/55 mb-1">Representation</p>
                      <p className="font-semibold">{LISTING_REPRESENTATION_LABELS[listing.representation]}</p>
                    </div>
                  )}
                </div>
              </section>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
              <div className="rounded-lg border border-black/15 p-5">
                <h3 className="text-xl font-semibold">Contact Agent</h3>
                <p className="mt-2 text-lg font-medium">Reed Jackson</p>
                <div className="mt-3 space-y-2 text-sm text-black/65">
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> redacted@email.com</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> (000) 000-0000</p>
                </div>
                <button className="mt-4 w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white">
                  Schedule a Tour
                </button>
                <button className="mt-2 w-full rounded-md border border-black px-4 py-2.5 text-sm font-medium">
                  Request Info
                </button>
              </div>

              <div className="rounded-lg border border-black/15 p-5">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Estimated Payment
                </h3>

                <div className="mt-4 rounded-lg bg-black/[0.03] p-4 text-center">
                  <p className="text-4xl font-bold leading-tight">{formatListingPrice(Math.round(estimatedMonthlyPayment))}</p>
                  <p className="mt-1 text-lg text-black/55">per month</p>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Principal &amp; Interest</span>
                    <span className="font-semibold">{formatListingPrice(Math.round(principalAndInterestMonthly))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Property Tax</span>
                    <span className="font-semibold">{formatListingPrice(Math.round(propertyTaxMonthly))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Home Insurance</span>
                    <span className="font-semibold">{formatListingPrice(Math.round(homeInsuranceMonthly))}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-medium text-black/75"
                  onClick={() => setShowAssumptions((prev) => !prev)}
                >
                  Adjust Assumptions
                  {showAssumptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showAssumptions && (
                  <div className="mt-4 space-y-4 border-t border-black/10 pt-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-black/60">Down Payment</span>
                        <span className="font-semibold">
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
                        className="w-full accent-black"
                      />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-black/60">Interest Rate</span>
                        <span className="font-semibold">{interestRate.toFixed(1)}%</span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={12}
                        step={0.1}
                        value={interestRate}
                        onChange={(event) => setInterestRate(Number(event.target.value))}
                        className="w-full accent-black"
                      />
                    </div>
                    <div className="flex items-center justify-between border-t border-black/10 pt-3 text-sm">
                      <span className="text-black/60">Loan Amount</span>
                      <span className="text-2xl font-bold">{formatListingPrice(Math.round(loanAmount))}</span>
                    </div>
                  </div>
                )}

                <p className="mt-4 text-center text-xs text-black/45">
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
