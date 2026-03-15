# Aspen Mini-CMS Setup

## 1) Use shared Bolt Supabase project
- Aspen mini-CMS is tenant-scoped inside the existing Bolt Supabase project.
- Run the shared migration:
  - `supabase/migrations/003_aspen_shared_cms_columns.sql`
- Ensure Aspen uses its own tenant ID value.

## 2) Bootstrap tenant record
- The `listings` table requires `tenant_id` to reference a row in `tenants`.
- Create a tenant before adding listings. In Supabase SQL Editor:

```sql
insert into public.tenants (id, user_id, website_id)
values (
  'aspen-tenant',           -- use the same value as NEXT_PUBLIC_TENANT_ID
  '<your-aspen-user-uuid>', -- the auth.users id of the Aspen admin
  'aspen-website'           -- placeholder; no FK constraint
)
on conflict (id) do nothing;
```

- Replace `aspen-tenant` with your chosen tenant ID (must match `NEXT_PUBLIC_TENANT_ID`).
- Replace `<your-aspen-user-uuid>` with the Supabase Auth user ID of the Aspen admin.

## 3) Create Aspen admin user
- In shared Supabase Auth, create one Aspen user (or reuse an existing user).
- Aspen access is scoped by tenant ID in Aspen routes.

## 4) Configure Aspen environment
- Copy `sites/aspen-country/.env.example` to `.env.local`.
- Set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_TENANT_ID`

## 5) Start Aspen site
- `cd sites/aspen-country`
- `npm install`
- `npm run dev`

## 6) Access CMS
- Open `/login`.
- After login, CMS routes are under `/admin/*`:
  - `/admin/dashboard`
  - `/admin/listings`
  - `/admin/testimonials`

## 7) Listing feed behavior
- `homepage_featured = true` => eligible for homepage featured slider.
- `ranch_estate_featured = true` => included on `/estates`.
- Active/Sold pages filter by listing status.
- Active/Sold/Estates use `View More` in increments of 12.
