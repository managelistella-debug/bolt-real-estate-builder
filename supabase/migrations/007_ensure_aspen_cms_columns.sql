-- Ensure Aspen CMS columns exist (idempotent)
-- Listings: thumbnail, homepage_featured, ranch_estate_featured
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS thumbnail text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS homepage_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS ranch_estate_featured boolean NOT NULL DEFAULT false;

-- Testimonials: display_context, is_published
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS display_context text NOT NULL DEFAULT 'both';
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
