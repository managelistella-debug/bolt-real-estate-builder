alter table public.listings
  add column if not exists thumbnail text,
  add column if not exists homepage_featured boolean not null default false,
  add column if not exists ranch_estate_featured boolean not null default false;

alter table public.testimonials
  add column if not exists display_context text not null default 'both'
    check (display_context in ('home','about','both')),
  add column if not exists is_published boolean not null default true;
