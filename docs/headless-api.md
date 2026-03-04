# Headless API (v1)

Base path: `/api/public/[tenant]`

## Authentication

Every request must include an `x-api-key` header with a tenant API key.

| Scope          | Used for                        |
|----------------|---------------------------------|
| `content:read` | All GET endpoints               |
| `forms:write`  | `POST /form-submissions`        |

CORS is enabled on all `/api/public/` routes (`Access-Control-Allow-Origin: *`), so client-side fetching from any origin works out of the box.

---

## Listings

### `GET /listings`

Returns a paginated, filterable list of property listings.

| Param          | Type   | Description                                                  |
|----------------|--------|--------------------------------------------------------------|
| `status`       | string | Filter by listing status: `for_sale`, `pending`, `sold`      |
| `city`         | string | Exact city match (case-insensitive)                          |
| `propertyType` | string | Exact property type match (case-insensitive)                 |
| `search`       | string | Searches address, neighborhood, city, MLS number             |
| `ids`          | string | Comma-separated listing IDs for manual selection             |
| `sort`         | string | `price_asc`, `price_desc`, `date_added_desc`, `custom_order` |
| `page`         | number | Page number (default 1)                                      |
| `pageSize`     | number | Items per page (default 25, max 100)                         |

**Example:**

```
GET /api/public/my-tenant/listings?status=for_sale&city=Austin&sort=price_desc&pageSize=12
```

**Response:**

```json
{
  "apiVersion": "v1",
  "tenant": "my-tenant",
  "items": [ { "id": "...", "slug": "123-main-st", ... } ],
  "pagination": { "page": 1, "pageSize": 12, "total": 42 }
}
```

### `GET /listings/[slug]`

Returns a single listing by URL slug.

```json
{
  "apiVersion": "v1",
  "tenant": "my-tenant",
  "item": { "id": "...", "slug": "123-main-st", ... }
}
```

Returns `404` if the slug does not match any listing.

---

## Blogs

### `GET /blogs`

Returns a paginated blog feed.

Defaults to `status=published` when no status is passed.

| Param      | Type   | Description |
|------------|--------|-------------|
| `status`   | string | `draft`, `published`, `archived` |
| `category` | string | Exact category match (case-insensitive) |
| `tag`      | string | Exact tag match (case-insensitive) |
| `sort`     | string | `published_desc`, `published_asc`, `title_asc`, `title_desc` |
| `page`     | number | Page number (default 1) |
| `pageSize` | number | Items per page (default 25, max 100) |

### `GET /blogs/[slug]`

Returns a single blog post by slug.

By default, only published posts are returned. Pass `?includeDraft=true` for draft preview use cases.

---

## Testimonials

### `GET /testimonials`

Returns a paginated testimonials feed.

| Param       | Type   | Description |
|-------------|--------|-------------|
| `source`    | string | `manual` or `google` |
| `minRating` | number | Minimum rating threshold |
| `sort`      | string | `sort_order_asc`, `rating_desc`, `created_desc` |
| `page`      | number | Page number (default 1) |
| `pageSize`  | number | Items per page (default 25, max 100) |

### `GET /testimonials/[id]`

Returns one testimonial by ID.

---

## Other Endpoints

- `GET /media`
- `GET /globals` — tenant-level settings (phone, social links, brokerage info)
- `POST /form-submissions` — requires `forms:write` scope

---

## Content-Change Webhook

### `POST /webhooks/content-changed`

Called internally when content is saved in the CMS dashboard. You generally do not call this yourself.

When content changes, the CMS also dispatches an **outbound POST** to the tenant's configured `revalidationWebhookUrl` (set during provisioning). The payload is:

```json
{
  "tenantId": "my-tenant",
  "type": "listing",
  "slug": "123-main-st",
  "ts": 1709251200000
}
```

Your external site should handle this webhook to call `revalidatePath()` or `revalidateTag()` locally.

---

## SDK

### Internal SDK (`lib/sdk/cmsClient.ts`)

Used within this project. Imports types from `@/lib/types`.

### Standalone SDK (`lib/sdk/headless-cms-client.ts`)

Self-contained, zero-dependency file for **external websites**. Copy this single file into your project. Includes all TypeScript types inline.

```ts
import { createCmsClient } from '@/lib/headless-cms-client';

const cms = createCmsClient({
  baseUrl:  process.env.CMS_BASE_URL!,
  tenantId: process.env.TENANT_ID!,
  apiKey:   process.env.CMS_READ_TOKEN!,
});

const { items, pagination } = await cms.getListings({ status: 'for_sale', sort: 'price_desc' });
const listing = await cms.getListingBySlug('123-main-st');
const posts   = await cms.getPosts(); // published by default
const testimonials = await cms.getTestimonials({ sort: 'rating_desc' });
const globals = await cms.getGlobals();
```

### Listing Detail Component (`lib/sdk/ListingDetail.tsx`)

A headless-compatible React component that renders a full property detail page. It accepts a `Listing` object as a prop and does **not** render any header or footer — wrap it with your own site chrome.

```tsx
import { ListingDetail } from '@/components/ListingDetail';

export default async function ListingPage({ params }) {
  const listing = await cms.getListingBySlug(params.slug);
  if (!listing) return notFound();

  return (
    <>
      <YourSiteHeader />
      <ListingDetail
        listing={listing}
        agent={{ name: 'Jane Doe', email: 'jane@example.com', phone: '(555) 123-4567' }}
        backHref="/listings"
      />
      <YourSiteFooter />
    </>
  );
}
```
