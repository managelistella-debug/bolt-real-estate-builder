-- Add date column to testimonials
alter table public.testimonials
  add column if not exists date date;

-- Update embed_configs type check to allow testimonial_feed
alter table public.embed_configs
  drop constraint if exists embed_configs_type_check;

alter table public.embed_configs
  add constraint embed_configs_type_check
  check (type in ('listing_feed', 'listing_detail', 'testimonial_feed'));
