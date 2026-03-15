import { notFound } from "next/navigation";
import Header from "@/components/aspen/Header";
import Footer from "@/components/aspen/Footer";
import EstateDetail from "@/components/aspen/estates/EstateDetail";
import { getEstateById, estates } from "@/lib/aspen/estates";

interface EstatePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return estates.map((estate) => ({
    id: estate.id,
  }));
}

export async function generateMetadata({ params }: EstatePageProps) {
  const { id } = await params;
  const estate = getEstateById(id);
  if (!estate) return { title: "Estate Not Found" };

  return {
    title: `${estate.address} | Aspen Muraski Real Estate`,
    description: `${estate.propertyType} in ${estate.city} - ${estate.bedrooms} bed, ${estate.bathrooms} bath, ${estate.livingArea.toLocaleString()} sq ft on ${estate.lotArea} ${estate.lotAreaUnit}.`,
  };
}

export default async function EstatePage({ params }: EstatePageProps) {
  const { id } = await params;
  const estate = getEstateById(id);

  if (!estate) {
    notFound();
  }

  return (
    <main className="overflow-x-clip">
      <Header />
      <EstateDetail estate={estate} />
      <Footer />
    </main>
  );
}
