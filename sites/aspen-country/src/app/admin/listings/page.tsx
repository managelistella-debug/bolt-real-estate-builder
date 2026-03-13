import ListingManager from "@/components/admin/ListingManager";

export default function AdminListingsPage() {
  return (
    <div>
      <h1 className="font-heading text-4xl text-white" style={{ fontWeight: 400 }}>
        Listings
      </h1>
      <p className="mt-2 text-white/70">Manage Aspen property listings and feed toggles.</p>
      <div className="mt-6">
        <ListingManager />
      </div>
    </div>
  );
}
