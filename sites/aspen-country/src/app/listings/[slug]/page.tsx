import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingDetailLegacy from "@/components/listings/ListingDetailLegacy";
import { getAllListings, getListingBySlug } from "@/lib/listings";

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allListings = await getAllListings();
  return allListings.map((listing) => ({
    slug: listing.slug,
  }));
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) {
    return {
      title: "Listing Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${listing.address} | Aspen Muraski Real Estate`,
    description: `${listing.propertyType} in ${listing.city} - ${listing.bedrooms} bed, ${listing.bathrooms} bath, ${listing.livingArea.toLocaleString()} sq ft.`,
    alternates: {
      canonical: `/listings/${listing.slug}`,
    },
    openGraph: {
      title: `${listing.address} | Aspen Muraski Real Estate`,
      description: `${listing.propertyType} in ${listing.city} - ${listing.bedrooms} bed, ${listing.bathrooms} bath, ${listing.livingArea.toLocaleString()} sq ft.`,
      images: listing.thumbnail ? [{ url: listing.thumbnail }] : undefined,
      type: "article",
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const resolved = await getListingBySlug(slug);
  if (!resolved) {
    notFound();
  }

  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: resolved.address,
    description: resolved.description?.replace(/<[^>]+>/g, "").slice(0, 250),
    url: `/listings/${resolved.slug}`,
    image: resolved.gallery,
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: resolved.listPrice,
      availability: resolved.listingStatus === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
    itemOffered: {
      "@type": "Residence",
      address: {
        "@type": "PostalAddress",
        streetAddress: resolved.address,
        addressLocality: resolved.city,
      },
      floorSize: {
        "@type": "QuantitativeValue",
        value: resolved.livingArea,
        unitText: "sqft",
      },
      numberOfRooms: resolved.bedrooms,
      numberOfBathroomsTotal: resolved.bathrooms,
      yearBuilt: resolved.yearBuilt,
    },
  };

  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <ListingDetailLegacy listing={resolved} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }}
      />
      <Footer />
    </main>
  );
}
