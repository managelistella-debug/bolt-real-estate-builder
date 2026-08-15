"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminJson } from "@/lib/admin/adminFetch";
import { imageUrl } from "@/lib/sanity/image";
import type { Listing } from "@/lib/sanity/types";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dragId, setDragId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const { listings } = await adminJson<{ listings: Listing[] }>("/api/admin/listings");
      setListings(listings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function runBulk(action: "delete" | "publish" | "unpublish") {
    if (selected.size === 0) return;
    if (action === "delete" && !confirm(`Delete ${selected.size} listing(s)? This can't be undone.`)) return;
    await adminJson("/api/admin/listings/bulk", {
      method: "POST",
      body: JSON.stringify({ ids: Array.from(selected), action }),
    });
    setSelected(new Set());
    load();
  }

  async function togglePublished(listing: Listing) {
    setListings((prev) =>
      prev.map((l) => (l._id === listing._id ? { ...l, published: !l.published } : l))
    );
    await adminJson(`/api/admin/listings/${listing._id}`, {
      method: "PATCH",
      body: JSON.stringify({ published: !listing.published }),
    });
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const fromIndex = listings.findIndex((l) => l._id === dragId);
    const toIndex = listings.findIndex((l) => l._id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...listings];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setListings(reordered);
    setDragId(null);

    reordered.forEach((listing, index) => {
      if (listing.sortOrder !== index) {
        adminJson(`/api/admin/listings/${listing._id}`, {
          method: "PATCH",
          body: JSON.stringify({ sortOrder: index }),
        }).catch(() => {});
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-heading text-white text-[24px]" style={{ fontWeight: 400 }}>
          Listings
        </h2>
        <Link
          href="/admin/listings/new"
          className="gold-gradient-bg text-[#09312a] font-semibold text-[13px] px-4 py-2"
        >
          + New Listing
        </Link>
      </div>

      {error && <p className="text-red-400 text-[13px] mb-4">{error}</p>}

      {selected.size > 0 && (
        <div className="flex items-center gap-2 mb-4 text-[13px]">
          <span className="text-white/60">{selected.size} selected</span>
          <button onClick={() => runBulk("publish")} className="px-3 py-1 border border-white/20 text-white/80 hover:border-[#daaf3a]">
            Publish
          </button>
          <button onClick={() => runBulk("unpublish")} className="px-3 py-1 border border-white/20 text-white/80 hover:border-[#daaf3a]">
            Unpublish
          </button>
          <button onClick={() => runBulk("delete")} className="px-3 py-1 border border-red-400/40 text-red-400 hover:border-red-400">
            Delete
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-white/50 text-[14px]">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-white/50 text-[14px]">No listings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr className="text-white/40 border-b border-white/10">
                <th className="py-2 pr-2 w-8"></th>
                <th className="py-2 pr-3 w-12"></th>
                <th className="py-2 pr-3">Address</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3">Featured</th>
                <th className="py-2 pr-3">Published</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr
                  key={listing._id}
                  draggable
                  onDragStart={() => setDragId(listing._id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(listing._id)}
                  className="border-b border-white/5 text-white/80 cursor-move"
                >
                  <td className="py-2 pr-2 text-white/30">⠿</td>
                  <td className="py-2 pr-3">
                    <input
                      type="checkbox"
                      checked={selected.has(listing._id)}
                      onChange={() => toggleSelected(listing._id)}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <Link href={`/admin/listings/${listing._id}`} className="hover:text-[#daaf3a]">
                      {listing.address || "(no address)"}
                    </Link>
                    <div className="text-white/40 text-[11px]">{listing.city}</div>
                  </td>
                  <td className="py-2 pr-3">{listing.status}</td>
                  <td className="py-2 pr-3">{listing.price ? `$${listing.price.toLocaleString()}` : "—"}</td>
                  <td className="py-2 pr-3">{listing.featured ? "Yes" : ""}</td>
                  <td className="py-2 pr-3">
                    <button
                      onClick={() => togglePublished(listing)}
                      className={`px-2 py-1 text-[11px] ${listing.published ? "bg-[#daaf3a]/20 text-[#daaf3a]" : "bg-white/5 text-white/40"}`}
                    >
                      {listing.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <Link href={`/admin/listings/${listing._id}`} className="text-white/50 hover:text-white">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
