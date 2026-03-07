-- Embed configurations for listing feeds and listing detail widgets
create table public.embed_configs (
  id          text primary key,
  tenant_id   text not null references public.tenants(id) on delete cascade,
  name        text not null default '',
  type        text not null check (type in ('listing_feed', 'listing_detail')),
  config      jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_embed_configs_tenant on public.embed_configs(tenant_id);
