"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import ListingFormDialog, {
  ListingPayload,
} from "@/components/admin/ListingFormDialog";

type ListingRow = ListingPayload & { id: string };

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Sold", value: "sold" },
] as const;

const statusPillClass: Record<string, string> = {
  active: "bg-[#DAFF07] text-black",
  pending: "bg-[#F5F5F3] text-[#888C99] border border-[#EBEBEB]",
  sold: "bg-black text-white",
};

const statusLabel: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  sold: "Sold",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ListingManager() {
  const [rows, setRows] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<ListingRow | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/listings");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage(err.error || "Unable to load listings.");
        setRows([]);
        return;
      }
      const data = await res.json();
      const mapped: ListingRow[] = (Array.isArray(data) ? data : []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => ({
          id: item.id,
          slug: item.slug || "",
          address: item.address || "",
          description: item.description || "",
          listPrice: Number(item.list_price || 0),
          listingStatus: (
            item.listing_status === "sold"
              ? "sold"
              : item.listing_status === "pending"
                ? "pending"
                : "active"
          ) as ListingRow["listingStatus"],
          representation: item.representation || "",
          neighborhood: item.neighborhood || "",
          city: item.city || "",
          bedrooms: Number(item.bedrooms || 0),
          bathrooms: Number(item.bathrooms || 0),
          propertyType: item.property_type || "",
          yearBuilt: Number(item.year_built || 0),
          livingArea: Number(item.living_area_sqft || item.living_area || 0),
          lotArea: Number(item.lot_area_value || item.lot_area || 0),
          lotAreaUnit:
            item.lot_area_unit === "sqft" ? "sq ft" : item.lot_area_unit || "acres",
          taxes: Number(item.taxes_annual || item.taxes || 0),
          listingBrokerage: item.listing_brokerage || "",
          mlsNumber: item.mls_number || "",
          thumbnail: item.thumbnail || "",
          gallery: Array.isArray(item.gallery)
            ? item.gallery
                .map((entry: { url?: string } | string) =>
                  typeof entry === "string" ? entry : entry?.url || ""
                )
                .filter(Boolean)
            : [],
          homepageFeatured: !!item.homepage_featured,
          ranchEstateFeatured: !!item.ranch_estate_featured,
        })
      );
      setRows(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (statusFilter !== "all" && r.listingStatus !== statusFilter)
          return false;
        if (!term) return true;
        return (
          r.address.toLowerCase().includes(term) ||
          r.city.toLowerCase().includes(term) ||
          r.neighborhood.toLowerCase().includes(term) ||
          r.mlsNumber.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => b.listPrice - a.listPrice);
  }, [rows, search, statusFilter]);

  const handleSave = async (payload: ListingPayload) => {
    setMessage(null);
    const body = {
      ...payload,
      slug: payload.slug || slugify(payload.address),
    };
    const url = payload.id
      ? `/api/admin/listings/${payload.id}`
      : "/api/admin/listings";
    const method = payload.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(err.error || "Failed to save listing.");
      return;
    }
    setMessage(payload.id ? "Listing updated." : "Listing created.");
    setIsCreateOpen(false);
    setEditingListing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this listing? This action cannot be undone."))
      return;
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    if (editingListing?.id === id) setEditingListing(null);
    load();
  };

  const formatPrice = (price: number) =>
    price > 0
      ? "$" + price.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : "";

  return (
    <div
      className="min-h-screen bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Header bar */}
      <div className="border-b border-[#EBEBEB] bg-white">
        <div className="flex items-center justify-between px-6 py-3.5">
          <div>
            <h1 className="text-[15px] font-medium text-black">Listings</h1>
            <p className="text-[13px] text-[#888C99]">
              Manage your real estate property listings
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] font-normal text-black transition-colors hover:bg-[#C8ED00]"
          >
            <Plus className="h-3.5 w-3.5" />
            New Listing
          </button>
        </div>
      </div>

      <div className="space-y-4 p-6">
        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#EBEBEB] bg-white p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative md:max-w-md md:flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search address, city, neighborhood, or MLS #"
              className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] pl-9 pr-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatusFilter(item.value)}
                className={`h-[30px] rounded-lg px-3 text-[13px] transition-colors ${
                  statusFilter === item.value
                    ? "bg-black text-white"
                    : "border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <p className="text-[13px] text-[#888C99]">{message}</p>
        )}

        {/* Listing rows */}
        <div className="rounded-xl border border-[#EBEBEB] bg-white">
          {loading ? (
            <div className="py-16 text-center text-[13px] text-[#888C99]">
              Loading listings...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[15px] text-black">No listings yet</p>
              <p className="mt-1 text-[13px] text-[#888C99]">
                Create your first property listing to get started.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="mt-5 inline-flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Listing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#EBEBEB]">
              {filteredRows.map((listing) => (
                <div
                  key={listing.id}
                  className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[13px] font-medium text-black">
                        {listing.address}
                      </h3>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] ${
                          statusPillClass[listing.listingStatus] ||
                          "bg-[#F5F5F3] text-[#888C99]"
                        }`}
                      >
                        {statusLabel[listing.listingStatus] ||
                          listing.listingStatus}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13px] text-[#888C99]">
                      {listing.neighborhood
                        ? `${listing.neighborhood}, `
                        : ""}
                      {listing.city}
                    </p>
                    <p className="mt-0.5 text-[13px]">
                      <span className="font-medium text-black">
                        {formatPrice(listing.listPrice)}
                      </span>
                      {listing.mlsNumber && (
                        <>
                          <span className="mx-1.5 text-[#CCCCCC]">·</span>
                          <span className="text-[#888C99]">
                            MLS# {listing.mlsNumber}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingListing(listing)}
                      className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(listing.id)}
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-[#CCCCCC] transition-colors hover:bg-[#F5F5F3] hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ListingFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleSave}
      />

      <ListingFormDialog
        open={!!editingListing}
        onOpenChange={(open) => {
          if (!open) setEditingListing(null);
        }}
        listing={editingListing}
        onSubmit={handleSave}
      />
    </div>
  );
}
