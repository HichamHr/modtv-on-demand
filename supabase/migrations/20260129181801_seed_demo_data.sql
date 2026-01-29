-- Seed demo channel + videos (idempotent)

do $$
declare
  owner_id uuid;
  v_channel_id uuid;
begin
  -- Pick the earliest user as owner. Replace logic if you want a specific user.
  select id
    into owner_id
  from auth.users
  order by created_at asc
  limit 1;

  if owner_id is null then
    raise notice 'No users found in auth.users. Create a user, then re-run this migration.';
    return;
  end if;

  insert into public.channels (id, owner_id, title, slug, description, is_public)
  values (gen_random_uuid(), owner_id, 'ModTV Demo', 'modtv-demo', 'Demo channel for portfolio', true)
  on conflict (slug) do nothing;

  select id into v_channel_id from public.channels where slug = 'modtv-demo';

  if v_channel_id is null then
    raise notice 'Channel could not be created or found. Aborting seed.';
    return;
  end if;

  insert into public.channel_members (channel_id, user_id, role)
  values (v_channel_id, owner_id, 'owner')
  on conflict (channel_id, user_id) do nothing;

  insert into public.videos (channel_id, created_by, title, description, url, thumbnail_url, is_published, published_at)
  select
    v_channel_id,
    owner_id,
    v.title,
    v.description,
    v.url,
    v.thumbnail_url,
    v.is_published,
    v.published_at
  from (
    values
      (
        'Welcome to ModTV',
        'Free preview video',
        'https://example.com/videos/welcome.mp4',
        'https://example.com/thumbnails/welcome.jpg',
        true,
        now()
      ),
      (
        'Premium Episode 1',
        'Paid content example',
        'https://example.com/videos/premium-ep-1.mp4',
        'https://example.com/thumbnails/premium-ep-1.jpg',
        true,
        now()
      )
  ) as v(title, description, url, thumbnail_url, is_published, published_at)
  where not exists (
    select 1
    from public.videos existing
    where existing.channel_id = v_channel_id
      and existing.title = v.title
  );
end $$;
