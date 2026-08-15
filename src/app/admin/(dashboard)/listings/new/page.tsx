import ListingForm from "@/components/admin/ListingForm";

export default function NewListingPage() {
  return (
    <div>
      <h2 className="font-heading text-white text-[24px] mb-6" style={{ fontWeight: 400 }}>
        New Listing
      </h2>
      <ListingForm />
    </div>
  );
}
