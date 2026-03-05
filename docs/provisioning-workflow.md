# Tenant Provisioning Workflow (v1)

This repository supports a manual-first provisioning flow for local development.

## Manual SOP

1. Create tenant in CMS and assign an internal owner.
2. Set env vars on the client site:
   - `CMS_BASE_URL` — full URL of this CMS app (e.g. `http://localhost:3005`)
   - `CMS_READ_TOKEN` — public API key with `content:read` scope
   - `TENANT_ID` — the tenant identifier
3. Register content-change webhook and test revalidation.
4. Connect domain from CMS Domains settings and verify DNS.

## Provisioning API

`POST /api/tenants/provision`

Request body:

```json
{
  "tenantId": "business-1",
  "revalidationWebhookUrl": "http://localhost:3006/api/revalidate"
}
```

Headers:

- `x-idempotency-key`: optional, prevents duplicate provisioning writes.

Response includes:

- tenant identity
- workflow step checklist
- idempotent replay marker when reused key is provided

## Reliability Notes

- Idempotency: basic buffer keyed by `x-idempotency-key`.
- Revalidation status is tracked per tenant infra record.
- Domain lifecycle events are persisted in the tenant store.

---

## External Site Integration Guide

### Overview

Any external website can consume content from this CMS via the public API. The CMS manages content; the external site renders it.

```
┌──────────────────────┐         ┌──────────────────────┐
│  HeadlessCMS          │  API    │  Agent Website       │
│  (this project)       │ ──────> │  (external project)  │
│                       │         │                      │
│  Dashboard ─> Store   │         │  Homepage grid       │
│  Public API           │ <─fetch─│  /listings/[slug]    │
│                       │         │                      │
│  On content change:   │         │                      │
│  POST webhook ────────│────────>│  /api/revalidate     │
└──────────────────────┘         └──────────────────────┘
```

### Step 1 — Provision the tenant

```bash
curl -X POST http://localhost:3005/api/tenants/provision \
  -H "Content-Type: application/json" \
  -H "x-idempotency-key: setup-$(date +%s)" \
  -d '{
    "tenantId": "reed-jackson-realty",
    "revalidationWebhookUrl": "http://localhost:3006/api/revalidate"
  }'
```

### Step 2 — Set environment variables on the external site

| Variable         | Value                                              |
|------------------|----------------------------------------------------|
| `CMS_BASE_URL`   | `http://localhost:3005`                            |
| `CMS_READ_TOKEN` | `demo_public_key_reed-jackson-realty` (or your key) |
| `TENANT_ID`      | `reed-jackson-realty`                               |

### Step 3 — Copy SDK files into the external site

Copy these files from `lib/sdk/`:

| File                       | Purpose                                          |
|----------------------------|--------------------------------------------------|
| `headless-cms-client.ts`   | SDK with types — fetches listings, blogs, testimonials, globals |
| `ListingDetail.tsx`        | Reference listing detail component (optional)     |

### Step 4 — Create a CMS client instance

```ts
// lib/cms.ts
import { createCmsClient } from '@/lib/headless-cms-client';

export const cms = createCmsClient({
  baseUrl:  process.env.CMS_BASE_URL!,
  tenantId: process.env.TENANT_ID!,
  apiKey:   process.env.CMS_READ_TOKEN!,
});
```

### Step 5 — Wire the homepage listing grid

```tsx
// app/page.tsx (or wherever your homepage is)
import { cms } from '@/lib/cms';

export default async function HomePage() {
  const { items: listings } = await cms.getListings({
    status: 'for_sale',
    sort: 'price_desc',
    pageSize: 12,
  });

  return (
    <>
      <YourHeader />
      <section className="grid grid-cols-3 gap-6 p-8">
        {listings.map((listing) => (
          <a key={listing.id} href={`/listings/${listing.slug}`}>
            <img src={listing.gallery[0]?.url} alt={listing.address} />
            <h3>{listing.address}</h3>
            <p>${listing.listPrice.toLocaleString()}</p>
          </a>
        ))}
      </section>
      <YourFooter />
    </>
  );
}
```

### Step 5b — Wire blog and testimonial sections

```tsx
import { cms } from '@/lib/cms';

export default async function MarketingSections() {
  const posts = await cms.getPosts({ status: 'published', pageSize: 3, sort: 'published_desc' });
  const testimonials = await cms.getTestimonials({ sort: 'rating_desc', pageSize: 6 });

  return (
    <>
      <section>
        <h2>Latest Articles</h2>
        {posts.map((post) => (
          <a key={post.id} href={`/blog/${post.slug}`}>{post.title}</a>
        ))}
      </section>
      <section>
        <h2>Client Testimonials</h2>
        {testimonials.map((t) => (
          <blockquote key={t.id}>
            {t.quote} — {t.authorName}
          </blockquote>
        ))}
      </section>
    </>
  );
}
```

### Step 6 — Create listing detail pages

```tsx
// app/listings/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { cms } from '@/lib/cms';
import { ListingDetail } from '@/components/ListingDetail';

export const revalidate = 60;

export default async function ListingPage({ params }: { params: { slug: string } }) {
  const listing = await cms.getListingBySlug(params.slug);
  if (!listing) return notFound();

  return (
    <>
      <YourHeader />
      <ListingDetail
        listing={listing}
        agent={{ name: 'Reed Jackson', email: 'reed@example.com', phone: '(555) 867-2311' }}
        backHref="/listings"
      />
      <YourFooter />
    </>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const listing = await cms.getListingBySlug(params.slug);
  if (!listing) return { title: 'Listing Not Found' };
  return {
    title: `${listing.address} | $${listing.listPrice.toLocaleString()}`,
    description: listing.description.slice(0, 155),
  };
}
```

### Step 7 — Add a revalidation webhook endpoint

When content changes in the CMS, it POSTs to the `revalidationWebhookUrl` you configured during provisioning.

```ts
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { type, slug } = body;

  revalidatePath('/');
  if (type === 'listing') {
    revalidatePath('/listings');
    if (slug) revalidatePath(`/listings/${slug}`);
  }
  if (type === 'blog') {
    revalidatePath('/blog');
    if (slug) revalidatePath(`/blog/${slug}`);
  }

  return NextResponse.json({ revalidated: true });
}
```

### Step 8 — Test the full flow

1. Create a listing in the CMS dashboard.
2. Verify it appears via the public API: `GET /api/public/reed-jackson-realty/listings`.
3. Verify the external site homepage shows the new listing.
4. Click through to the listing detail page.
5. Edit the listing in the CMS — the webhook should fire and the external site should refresh.
6. Publish a blog post and add/update testimonials in CMS; verify both API feeds and website sections update.
