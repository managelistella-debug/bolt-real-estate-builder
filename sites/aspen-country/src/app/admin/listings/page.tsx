import ListingManager from "@/components/admin/ListingManager";

export default function AdminListingsPage() {
  return (
    <div>
      <h1 className="font-heading text-4xl text-black" style={{ fontWeight: 400 }}>
        Listings
      </h1>
      <p className="mt-2 text-[#888C99]">Manage Aspen property listings and feed toggles.</p>
      <div className="mt-6">
        <ListingManager />
      </div>
    </div>
  );
}
