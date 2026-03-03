-- ============================================================
-- HeadlessCMS — Full Supabase Schema
-- Run this in Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- 0. Enable required extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. PROFILES (linked to auth.users)
-- ============================================================
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  name       text not null default '',
  role       text not null default 'business_user'
               check (role in ('super_admin','internal_admin','business_user')),
  business_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Service role full access to profiles"
  on public.profiles for all using (
    auth.jwt()->>'role' = 'service_role'
  );

-- ============================================================
-- 2. TENANTS
-- ============================================================
create table public.tenants (
  id          text primary key,
  user_id     text not null,
  website_id  text not null,
  created_at  timestamptz not null default now()
);

alter table public.tenants enable row level security;

create policy "Service role full access to tenants"
  on public.tenants for all using (true);

-- ============================================================
-- 3. API KEYS
-- ============================================================
create table public.api_keys (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  text not null references public.tenants(id) on delete cascade,
  key        text not null,
  scopes     text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_api_keys_tenant on public.api_keys(tenant_id);
create index idx_api_keys_key on public.api_keys(key);

alter table public.api_keys enable row level security;

create policy "Service role full access to api_keys"
  on public.api_keys for all using (true);

-- ============================================================
-- 4. LISTINGS
-- ============================================================
create table public.listings (
  id                text primary key,
  tenant_id         text not null references public.tenants(id) on delete cascade,
  user_id           text not null,
  slug              text not null,
  address           text not null default '',
  description       text not null default '',
  list_price        numeric not null default 0,
  neighborhood      text not null default '',
  city              text not null default '',
  listing_status    text not null default 'for_sale'
                      check (listing_status in ('for_sale','pending','sold')),
  bedrooms          int not null default 0,
  bathrooms         int not null default 0,
  property_type     text not null default '',
  year_built        int not null default 0,
  living_area_sqft  int not null default 0,
  lot_area_value    numeric not null default 0,
  lot_area_unit     text not null default 'sqft'
                      check (lot_area_unit in ('sqft','acres')),
  taxes_annual      numeric not null default 0,
  listing_brokerage text not null default '',
  mls_number        text not null default '',
  representation    text,
  gallery           jsonb not null default '[]',
  custom_order      int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create unique index idx_listings_tenant_slug on public.listings(tenant_id, slug);
create index idx_listings_tenant on public.listings(tenant_id);

alter table public.listings enable row level security;

create policy "Service role full access to listings"
  on public.listings for all using (true);

-- ============================================================
-- 5. BLOG POSTS
-- ============================================================
create table public.blog_posts (
  id               text primary key,
  tenant_id        text not null references public.tenants(id) on delete cascade,
  user_id          text not null,
  title            text not null default '',
  slug             text not null,
  excerpt          text,
  meta_description text,
  content_html     text not null default '',
  featured_image   text,
  author_name      text,
  tags             text[] not null default '{}',
  category         text,
  status           text not null default 'draft'
                     check (status in ('draft','published','archived')),
  template_id      text not null default 'classic',
  custom_order     int not null default 0,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create unique index idx_blog_posts_tenant_slug on public.blog_posts(tenant_id, slug);
create index idx_blog_posts_tenant on public.blog_posts(tenant_id);

alter table public.blog_posts enable row level security;

create policy "Service role full access to blog_posts"
  on public.blog_posts for all using (true);

-- ============================================================
-- 6. TESTIMONIALS
-- ============================================================
create table public.testimonials (
  id           text primary key,
  tenant_id    text not null references public.tenants(id) on delete cascade,
  user_id      text not null,
  quote        text not null default '',
  author_name  text not null default '',
  author_title text,
  rating       int,
  source       text default 'manual' check (source in ('manual','google')),
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_testimonials_tenant on public.testimonials(tenant_id);

alter table public.testimonials enable row level security;

create policy "Service role full access to testimonials"
  on public.testimonials for all using (true);

-- ============================================================
-- 7. IMAGE COLLECTIONS
-- ============================================================
create table public.image_collections (
  id         text primary key,
  tenant_id  text not null references public.tenants(id) on delete cascade,
  user_id    text not null,
  name       text not null default '',
  images     jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_image_collections_tenant on public.image_collections(tenant_id);

alter table public.image_collections enable row level security;

create policy "Service role full access to image_collections"
  on public.image_collections for all using (true);

-- ============================================================
-- 8. LEADS
-- ============================================================
create table public.leads (
  id            text primary key,
  tenant_id     text not null references public.tenants(id) on delete cascade,
  website_id    text not null,
  first_name    text not null default '',
  last_name     text not null default '',
  email         text not null default '',
  phone         text,
  message       text,
  status        text not null default 'new'
                  check (status in ('new','contacted','in_progress','closed','lost')),
  tags          text[] not null default '{}',
  source_page   text not null default '',
  owner_id      text,
  custom_fields jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_leads_tenant on public.leads(tenant_id);

alter table public.leads enable row level security;

create policy "Service role full access to leads"
  on public.leads for all using (true);

-- ============================================================
-- 9. LEAD TASKS
-- ============================================================
create table public.lead_tasks (
  id              text primary key,
  lead_id         text not null references public.leads(id) on delete cascade,
  title           text not null default '',
  description     text,
  due_date        timestamptz,
  assigned_user_id text,
  completed       boolean not null default false,
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index idx_lead_tasks_lead on public.lead_tasks(lead_id);

alter table public.lead_tasks enable row level security;

create policy "Service role full access to lead_tasks"
  on public.lead_tasks for all using (true);

-- ============================================================
-- 10. LEAD NOTES
-- ============================================================
create table public.lead_notes (
  id         text primary key,
  lead_id    text not null references public.leads(id) on delete cascade,
  user_id    text not null,
  content    text not null default '',
  created_at timestamptz not null default now()
);

create index idx_lead_notes_lead on public.lead_notes(lead_id);

alter table public.lead_notes enable row level security;

create policy "Service role full access to lead_notes"
  on public.lead_notes for all using (true);

-- ============================================================
-- 11. LEAD ACTIVITY LOG
-- ============================================================
create table public.lead_activity (
  id          text primary key,
  lead_id     text not null references public.leads(id) on delete cascade,
  type        text not null,
  description text not null default '',
  user_id     text,
  created_at  timestamptz not null default now()
);

create index idx_lead_activity_lead on public.lead_activity(lead_id);

alter table public.lead_activity enable row level security;

create policy "Service role full access to lead_activity"
  on public.lead_activity for all using (true);

-- ============================================================
-- 12. FORM SUBMISSIONS
-- ============================================================
create table public.form_submissions (
  id          text primary key,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  user_id     text not null,
  website_id  text not null,
  form_key    text not null,
  source_page text,
  contact     jsonb not null default '{}',
  payload     jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create index idx_form_submissions_tenant on public.form_submissions(tenant_id);

alter table public.form_submissions enable row level security;

create policy "Service role full access to form_submissions"
  on public.form_submissions for all using (true);

-- ============================================================
-- 13. TENANT DOMAINS
-- ============================================================
create table public.tenant_domains (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          text not null references public.tenants(id) on delete cascade,
  domain             text not null,
  project_id         text,
  status             text not null default 'not_started'
                       check (status in ('not_started','pending_dns','verifying','connected','error')),
  is_primary         boolean not null default false,
  verification_error text,
  updated_at         timestamptz not null default now()
);

create index idx_tenant_domains_tenant on public.tenant_domains(tenant_id);

alter table public.tenant_domains enable row level security;

create policy "Service role full access to tenant_domains"
  on public.tenant_domains for all using (true);

-- ============================================================
-- 14. TENANT GLOBALS (one row per tenant)
-- ============================================================
create table public.tenant_globals (
  tenant_id      text primary key references public.tenants(id) on delete cascade,
  phone          text,
  email_routing  text[] not null default '{}',
  social_links   jsonb not null default '[]',
  brokerage_info text,
  footer_text    text,
  updated_at     timestamptz not null default now()
);

alter table public.tenant_globals enable row level security;

create policy "Service role full access to tenant_globals"
  on public.tenant_globals for all using (true);

-- ============================================================
-- 15. TENANT INFRA (one row per tenant)
-- ============================================================
create table public.tenant_infra (
  tenant_id                text primary key references public.tenants(id) on delete cascade,
  vercel_project_id        text,
  vercel_team_id           text,
  revalidation_webhook_url text,
  revalidation_status      text not null default 'idle'
                             check (revalidation_status in ('idle','ok','error')),
  updated_at               timestamptz not null default now()
);

alter table public.tenant_infra enable row level security;

create policy "Service role full access to tenant_infra"
  on public.tenant_infra for all using (true);

-- ============================================================
-- 16. INTEGRATION CONFIGS (one row per tenant)
-- ============================================================
create table public.integration_configs (
  tenant_id        text primary key references public.tenants(id) on delete cascade,
  user_id          text not null,
  google           jsonb not null default '{"enabled":false}',
  resend           jsonb not null default '{"enabled":false}',
  contact_routing  jsonb not null default '{"enabled":true,"forwardTo":[]}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.integration_configs enable row level security;

create policy "Service role full access to integration_configs"
  on public.integration_configs for all using (true);

-- ============================================================
-- Helper: auto-update updated_at columns
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

create trigger trg_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

create trigger trg_testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

create trigger trg_image_collections_updated_at
  before update on public.image_collections
  for each row execute function public.set_updated_at();

create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create trigger trg_tenant_globals_updated_at
  before update on public.tenant_globals
  for each row execute function public.set_updated_at();

create trigger trg_tenant_infra_updated_at
  before update on public.tenant_infra
  for each row execute function public.set_updated_at();

create trigger trg_integration_configs_updated_at
  before update on public.integration_configs
  for each row execute function public.set_updated_at();

create trigger trg_tenant_domains_updated_at
  before update on public.tenant_domains
  for each row execute function public.set_updated_at();
