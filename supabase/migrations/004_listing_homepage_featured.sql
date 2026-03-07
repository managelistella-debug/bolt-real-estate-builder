-- Add homepage_featured and thumbnail columns to listings
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS homepage_featured boolean DEFAULT false;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS thumbnail text;
