# Aspen Mini-CMS Setup

## 1) Create Aspen Supabase project
- Create a dedicated Supabase project for Aspen Country.
- In SQL editor, run:
  - `sites/aspen-country/supabase/migrations/001_initial_schema.sql`

## 2) Create Aspen admin user
- In Supabase Auth, create one user for Aspen.
- Optionally insert/update `public.profiles` for display name/role.

## 3) Configure Aspen environment
- Copy `sites/aspen-country/.env.example` to `.env.local`.
- Set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

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
