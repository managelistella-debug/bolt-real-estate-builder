import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingDetail from "@/components/listings/ListingDetail";
import { getListingById, getAllListings } from "@/lib/listings";

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const allListings = await getAllListings();
  return allListings.map((listing) => ({
    id: listing.id,
  }));
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return { title: "Listing Not Found" };

  return {
    title: `${listing.address} | Aspen Muraski Real Estate`,
    description: `${listing.propertyType} in ${listing.city} - ${listing.bedrooms} bed, ${listing.bathrooms} bath, ${listing.livingArea.toLocaleString()} sq ft.`,
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <main className="overflow-x-clip animate-[fadeIn_0.4s_ease-out]">
      <Header />
      <ListingDetail listing={listing} />
      <Footer />
    </main>
  );
}
