-- ============================================================
-- Hosted Sites — Super-admin managed website library
-- ============================================================
create table public.hosted_sites (
  id               text primary key,
  name             text not null,
  description      text not null default '',
  preview_image    text not null default '',
  site_slug        text not null unique,
  pages            jsonb not null default '[]',
  cms_config       jsonb not null default '{}',
  assigned_user_ids text[] not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create unique index idx_hosted_sites_slug on public.hosted_sites(site_slug);

alter table public.hosted_sites enable row level security;

create policy "Service role full access to hosted_sites"
  on public.hosted_sites for all using (true);

create trigger trg_hosted_sites_updated_at
  before update on public.hosted_sites
  for each row execute function public.set_updated_at();

-- ============================================================
-- Tenant Site Settings — per-user AI builder toggle + site assignment
-- ============================================================
create table public.tenant_site_settings (
  user_id                   text primary key,
  ai_builder_disabled       boolean not null default false,
  assigned_hosted_site_slug text references public.hosted_sites(site_slug) on delete set null,
  updated_at                timestamptz not null default now()
);

alter table public.tenant_site_settings enable row level security;

create policy "Service role full access to tenant_site_settings"
  on public.tenant_site_settings for all using (true);

create trigger trg_tenant_site_settings_updated_at
  before update on public.tenant_site_settings
  for each row execute function public.set_updated_at();
