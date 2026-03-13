create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'owner' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  address text not null,
  description text not null default '',
  list_price numeric not null default 0,
  listing_status text not null default 'active' check (listing_status in ('active', 'sold', 'pending')),
  representation text,
  neighborhood text not null default '',
  city text not null default '',
  bedrooms numeric not null default 0,
  bathrooms numeric not null default 0,
  property_type text not null default '',
  year_built int not null default 0,
  living_area int not null default 0,
  lot_area numeric not null default 0,
  lot_area_unit text not null default 'acres',
  taxes numeric not null default 0,
  listing_brokerage text not null default '',
  mls_number text not null default '',
  gallery jsonb not null default '[]'::jsonb,
  thumbnail text not null default '',
  homepage_featured boolean not null default false,
  ranch_estate_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  author text not null default '',
  publish_date date not null default now(),
  featured_image text not null default '',
  featured_image_alt text not null default '',
  excerpt text not null default '',
  content text not null default '',
  category text not null default '',
  tags jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  rating int not null default 5,
  display_context text not null default 'both' check (display_context in ('home', 'about', 'both')),
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles
for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update to authenticated using (auth.uid() = id);

drop policy if exists "listings_public_read" on public.listings;
create policy "listings_public_read" on public.listings
for select to anon, authenticated using (true);

drop policy if exists "listings_authenticated_write" on public.listings;
create policy "listings_authenticated_write" on public.listings
for all to authenticated using (true) with check (true);

drop policy if exists "blog_public_read" on public.blog_posts;
create policy "blog_public_read" on public.blog_posts
for select to anon, authenticated using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "blog_authenticated_write" on public.blog_posts;
create policy "blog_authenticated_write" on public.blog_posts
for all to authenticated using (true) with check (true);

drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read" on public.testimonials
for select to anon, authenticated using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "testimonials_authenticated_write" on public.testimonials;
create policy "testimonials_authenticated_write" on public.testimonials
for all to authenticated using (true) with check (true);
