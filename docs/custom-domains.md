# Custom Domains (Local Development)

This document defines how the custom domain system works in local development.

## Current Implementation

- Domain settings UI is available at `Settings > Domains`.
- Each website has a default platform subdomain.
- Custom domain setup includes deterministic DNS instructions and mocked verification states.
- Domain state persists in local storage through the website store.

## API Contract

- `POST /api/domains`
  - Purpose: Create/connect a domain for a website.
  - Input: `{ tenantId, domain }`
  - Output: `{ success, items }`

- `GET /api/domains?tenantId={id}`
  - Purpose: List all domains for one tenant.
  - Output: `{ success, items }`

- `POST /api/domains/{domain}/verify`
  - Purpose: Trigger DNS verification.
  - Output: `{ success, items }`

- `DELETE /api/domains/{domain}?tenantId={id}`
  - Purpose: Disconnect domain.
  - Output: `{ success, items }`

## Middleware Host Resolution (Future)

Add `middleware.ts` at the project root for request host mapping:

1. Read request host header.
2. Skip dashboard/auth/internal routes.
3. Resolve host to website via domain mapping store/table.
4. Attach resolved website context for rendering.
5. Return a friendly fallback page if host is unknown.

## Migration Checklist

- Replace local domain state with persistent DB records.
- Move verification logic to async server jobs.
- Replace mock verification provider with DNS lookup checks.
- Add background retry and status polling endpoints.
- Add domain activity logs for debugging and support workflows.
