# Aspen CMS Field Mapping

This document describes how CMS fields map between the Bolt admin UI, API, Supabase tables, and the public website display.

## CMS URLs

All CMS pages live under `/account/` to avoid conflicting with the public site:

- `/account` or `/account/dashboard` — Dashboard
- `/account/listings` — Listings manager
- `/account/blogs` — Blogs manager
- `/account/testimonials` — Testimonials manager

## Environment

- **NEXT_PUBLIC_TENANT_ID** or **ASPEN_TENANT_ID**: Aspen tenant ID (required for all CMS operations)
- Ensure the tenant exists in `public.tenants` and the Aspen user (`admin@listella.co`) can authenticate

---

## Listings

| CMS Field (UI) | API Payload (camelCase) | DB Column (snake_case) |
|----------------|------------------------|------------------------|
| Slug | slug | slug |
| Address | address | address |
| Description | description | description |
| List Price | listPrice | list_price |
| Status | listingStatus | listing_status (`active`→`for_sale`, `sold`→`sold`, `pending`→`pending`) |
| Representation | representation | representation |
| Neighborhood | neighborhood | neighborhood |
| City | city | city |
| Bedrooms | bedrooms | bedrooms |
| Bathrooms | bathrooms | bathrooms |
| Property Type | propertyType | property_type |
| Year Built | yearBuilt | year_built |
| Living Area | livingArea | living_area_sqft |
| Lot Area | lotArea | lot_area_value |
| Lot Unit | lotAreaUnit | lot_area_unit (`acres`→`acres`, `sq ft`→`sqft`) |
| Taxes | taxes | taxes_annual |
| Brokerage | listingBrokerage | listing_brokerage |
| MLS # | mlsNumber | mls_number |
| Thumbnail | thumbnail | thumbnail |
| Gallery | gallery | gallery (jsonb: `[{url, order}]`) |
| Homepage Featured | homepageFeatured | homepage_featured |
| Ranch/Estate Featured | ranchEstateFeatured | ranch_estate_featured |

**Public site display:**
- **Homepage featured** (`FeaturedListings`): Listings with `homepage_featured` toggle; status banner + thumbnail + price + address, city (no province)
- **Estates page** (`/estates`): Listings with `ranch_estate_featured` toggle; same card layout, shows bed/bath/acres (lot area + lot area unit: "acres" or "square feet")
- **Active listings** (`/listings/active`): Same layout as estates, filtered to status active; View More loads next 12
- **Sold page** (`/listings/sold`): Same layout, 3 columns; View More loads next 12
- **Listing detail** (`/listings/[slug]`): Hero = main thumbnail, status bar top left, gallery on click; address, city, price; "About this property" = description; property details with all CMS fields; lot area = number + unit ("acres" or "square feet"); photo gallery 3/row desktop, 2 tablet, 1 mobile

---

## Blogs

| CMS Field (UI) | API Payload (camelCase) | DB Column (snake_case) |
|----------------|------------------------|------------------------|
| Title | title | title |
| Slug | slug | slug |
| Author | author | author_name |
| Publish Date | publishDate | published_at |
| Featured Image | featuredImage | featured_image |
| Image Alt | featuredImageAlt | meta_description |
| Excerpt | excerpt | excerpt |
| Content | content | content_html |
| Category | category | category |
| Tags | tags | tags (array) |
| Published | isPublished | status (`true`→`published`, `false`→`draft`) |

**Public site** (`lib/aspen/blog.ts`): Filters by `status = 'published'`, maps to camelCase for display.

---

## Testimonials

| CMS Field (UI) | API Payload (camelCase) | DB Column (snake_case) |
|----------------|------------------------|------------------------|
| Quote | quote | quote |
| Author | author | author_name |
| Rating | rating | rating |
| Display Context | displayContext | display_context (`home` \| `about` \| `both`) |
| Sort Order | sortOrder | sort_order |
| Published | isPublished | is_published |

**Public site** (`lib/aspen/testimonials.ts`): Filters by `is_published !== false`, uses `display_context` for home vs about placement.

---

## Data Flow

1. **Admin UI** → `ListingManager`, `BlogManager`, `TestimonialManager` send camelCase payloads to `/api/admin/*`
2. **API** → Maps camelCase to snake_case, writes to Supabase (`listings`, `blog_posts`, `testimonials`)
3. **Public site** → `lib/aspen/*.ts` reads via Supabase public client, maps to display types, falls back to static data if Supabase unavailable
