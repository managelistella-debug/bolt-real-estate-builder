# Aspen Mini-CMS Setup

## 1) Use shared Bolt Supabase project
- Aspen mini-CMS is tenant-scoped inside the existing Bolt Supabase project.
- Run the shared migration:
  - `supabase/migrations/003_aspen_shared_cms_columns.sql`
- Ensure Aspen uses its own tenant ID value.

## 2) Create Aspen admin user
- In shared Supabase Auth, create one Aspen user (or reuse an existing user).
- Aspen access is scoped by tenant ID in Aspen routes.

## 3) Configure Aspen environment
- Copy `sites/aspen-country/.env.example` to `.env.local`.
- Set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_TENANT_ID`

## 4) Start Aspen site
- `cd sites/aspen-country`
- `npm install`
- `npm run dev`

## 5) Access CMS
- Open `/login`.
- After login, CMS routes are under `/admin/*`:
  - `/admin/dashboard`
  - `/admin/listings`
  - `/admin/blogs`
  - `/admin/testimonials`

## 6) Listing feed behavior
- `homepage_featured = true` => eligible for homepage featured slider.
- `ranch_estate_featured = true` => included on `/estates`.
- Active/Sold pages filter by listing status.
- Active/Sold/Estates use `View More` in increments of 12.
