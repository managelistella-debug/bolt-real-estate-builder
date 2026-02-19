# Custom Domains (Prototype to Production Handoff)

This document defines how the current local prototype should transition to a production-ready custom domain system on Vercel.

## Current Prototype (Implemented)

- Domain settings UI is available at `Settings > Domains`.
- Each website has a default platform subdomain.
- Custom domain setup includes deterministic DNS instructions and mocked verification states.
- Domain state persists in local storage through the website store.

## Planned Production API Contract

Use these endpoint shapes when backend infrastructure is introduced:

- `POST /api/domains`
  - Purpose: Create/connect a domain for a website.
  - Input: `{ websiteId, domain }`
  - Output: `{ domainId, status, dnsRecords, verificationToken }`

- `GET /api/domains?websiteId={id}`
  - Purpose: List all domains for one website.
  - Output: `[{ domainId, domain, status, lastVerifiedAt, sslStatus }]`

- `POST /api/domains/{domainId}/verify`
  - Purpose: Trigger DNS verification.
  - Output: `{ status, missingRecords, verifiedAt }`

- `DELETE /api/domains/{domainId}`
  - Purpose: Disconnect domain.
  - Output: `{ success: true }`

## Planned Middleware Host Resolution

Add `middleware.ts` at the project root for request host mapping:

1. Read request host header.
2. Skip dashboard/auth/internal routes.
3. Resolve host to website via domain mapping store/table.
4. Attach resolved website context for rendering.
5. Return a friendly fallback page if host is unknown.

## Vercel Production Ownership

- DNS targets:
  - Apex: `A` record -> `76.76.21.21`
  - Subdomain (`www` or tenant subdomain): `CNAME` -> `cname.vercel-dns.com`
- SSL certificates should be managed by Vercel once domain is validated.
- Domain verification should move from mock logic to provider-backed checks.

## Migration Checklist

- Replace local domain state with persistent DB records.
- Move verification logic to async server jobs.
- Replace mock verification provider with DNS lookup/provider API checks.
- Add background retry and status polling endpoints.
- Add domain activity logs for debugging and support workflows.
