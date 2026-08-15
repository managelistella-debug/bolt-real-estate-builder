"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ListingForm from "@/components/admin/ListingForm";
import { adminJson } from "@/lib/admin/adminFetch";
import type { Listing } from "@/lib/sanity/types";

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminJson<{ listing: Listing }>(`/api/admin/listings/${params.id}`)
      .then((res) => setListing(res.listing))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div>
      <h2 className="font-heading text-white text-[24px] mb-6" style={{ fontWeight: 400 }}>
        Edit Listing
      </h2>
      {loading ? (
        <p className="text-white/50 text-[14px]">Loading...</p>
      ) : listing ? (
        <ListingForm listing={listing} />
      ) : (
        <p className="text-white/50 text-[14px]">Listing not found.</p>
      )}
    </div>
  );
}
