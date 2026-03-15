# Client Listing Detail Integration

This playbook standardizes how listing-feed clicks open SEO-friendly listing detail pages while preserving each client's own header/footer.

## Core Pattern

1. Render listing feeds via embed code where cards are needed.
2. Route card clicks to a native client route (`/listings/{slug}`).
3. Render detail content inside the client shell (header + footer).
4. Generate metadata and JSON-LD on the server detail route.

## Required Contract

- `detailPageUrlPattern` must include `{slug}`.
- Recommended default: `/listings/{slug}`.
- Cross-domain option: `https://clientdomain.com/listings/{slug}`.

## Client Implementation Checklist

1. **Slug route**
   - Add `app/listings/[slug]/page.tsx`.
   - Resolve record by slug (not by ID).

2. **Shell composition**
   - Render:
     - client `Header`
     - listing detail body component
     - client `Footer`

3. **Data mapping**
   - Ensure listing model includes `slug`.
   - Add `getListingBySlug(slug)` helper.
   - Keep optional ID route redirect for backward compatibility.

4. **SEO**
   - `generateMetadata()` should output:
     - title
     - description
     - canonical
     - Open Graph image/title/description
   - Include `RealEstateListing` JSON-LD in page output.
   - Return 404 for invalid slug.

5. **Embed config**
   - Set listing-feed `detailPageUrlPattern` to client canonical detail route.
   - Verify a card click navigates to a valid detail URL.

6. **Verification**
   - Manual: click listing cards from homepage/feed pages.
   - Confirm header/footer match client site.
   - Confirm metadata and JSON-LD appear in page source.
   - Validate OG preview and rich results on a sample URL.

## Aspen Reference

- Detail route: `sites/aspen-country/src/app/listings/[slug]/page.tsx`
- Legacy ID redirect: `sites/aspen-country/src/app/listings/[id]/page.tsx`
- Slug data helper: `sites/aspen-country/src/lib/listings.ts`
- Listing card links: `sites/aspen-country/src/components/listings/ListingCard.tsx`
