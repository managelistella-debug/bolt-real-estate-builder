-- Add permissions JSONB column to profiles for support permission controls
alter table public.profiles
  add column if not exists permissions jsonb default null;

-- Add last_login_at column to track admin logins
alter table public.profiles
  add column if not exists last_login_at timestamptz default null;
