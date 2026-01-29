create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'channel_role') then
    create type public.channel_role as enum ('owner', 'admin', 'member');
  end if;
end $$;

create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug)
);

create table if not exists public.channel_members (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.channel_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (channel_id, user_id)
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  url text not null,
  thumbnail_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists channels_owner_id_idx on public.channels(owner_id);
create index if not exists channels_slug_idx on public.channels(slug);
create index if not exists channel_members_channel_id_idx on public.channel_members(channel_id);
create index if not exists channel_members_user_id_idx on public.channel_members(user_id);
create index if not exists channel_members_role_idx on public.channel_members(role);
create index if not exists videos_channel_id_idx on public.videos(channel_id);
create index if not exists videos_published_idx on public.videos(is_published, published_at);
create index if not exists videos_created_by_idx on public.videos(created_by);

alter table public.channels enable row level security;
alter table public.channel_members enable row level security;
alter table public.videos enable row level security;

create or replace function public.is_channel_member(channel_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.channels c
    left join public.channel_members cm
      on cm.channel_id = c.id
     and cm.user_id = auth.uid()
    where c.id = channel_id
      and (c.owner_id = auth.uid() or cm.user_id is not null)
  );
$$;

create or replace function public.has_channel_role(channel_id uuid, roles public.channel_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.channels c
    where c.id = channel_id
      and c.owner_id = auth.uid()
      and 'owner' = any(roles)
  )
  or exists (
    select 1
    from public.channel_members cm
    where cm.channel_id = channel_id
      and cm.user_id = auth.uid()
      and cm.role = any(roles)
  );
$$;

create policy "public read channels"
on public.channels
for select
using (is_public = true);

create policy "owner read channels"
on public.channels
for select
using (owner_id = auth.uid());

create policy "owner insert channels"
on public.channels
for insert
with check (owner_id = auth.uid());

create policy "owner update channels"
on public.channels
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "owner delete channels"
on public.channels
for delete
using (owner_id = auth.uid());

create policy "members read channel_members"
on public.channel_members
for select
using (is_channel_member(channel_id));

create policy "owner_admin insert channel_members"
on public.channel_members
for insert
with check (has_channel_role(channel_id, array['owner', 'admin']::public.channel_role[]));

create policy "owner_admin update channel_members"
on public.channel_members
for update
using (has_channel_role(channel_id, array['owner', 'admin']::public.channel_role[]))
with check (has_channel_role(channel_id, array['owner', 'admin']::public.channel_role[]));

create policy "owner_admin delete channel_members"
on public.channel_members
for delete
using (has_channel_role(channel_id, array['owner', 'admin']::public.channel_role[]));

create policy "public read published videos"
on public.videos
for select
using (is_published = true);

create policy "owner_admin insert videos"
on public.videos
for insert
with check (has_channel_role(channel_id, array['owner', 'admin']::public.channel_role[]));

create policy "owner_admin update videos"
on public.videos
for update
using (has_channel_role(channel_id, array['owner', 'admin']::public.channel_role[]))
with check (has_channel_role(channel_id, array['owner', 'admin']::public.channel_role[]));

create policy "owner_admin delete videos"
on public.videos
for delete
using (has_channel_role(channel_id, array['owner', 'admin']::public.channel_role[]));
