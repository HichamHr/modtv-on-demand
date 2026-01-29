-- Seed data for local development / portfolio demos.
-- Run with: npx supabase db reset
-- This will run migrations, then apply this seed file.

do $$
declare
  demo_owner_id uuid;
  demo_channel_id uuid;
begin
  select id
    into demo_owner_id
  from auth.users
  order by created_at asc
  limit 1;

  if demo_owner_id is null then
    raise notice 'No users found in auth.users. Create a user, then re-run seed.';
    return;
  end if;

  insert into public.channels (owner_id, title, slug, description, is_public)
  values (
    demo_owner_id,
    'ModTV Showcase',
    'modtv-showcase',
    'A demo channel for local previews and portfolio demos.',
    true
  )
  returning id into demo_channel_id;

  insert into public.channel_members (channel_id, user_id, role)
  values (demo_channel_id, demo_owner_id, 'owner');

  insert into public.videos (channel_id, created_by, title, description, url, thumbnail_url, is_published, published_at)
  values
    (
      demo_channel_id,
      demo_owner_id,
      'City Lights',
      'Moody urban visuals with synth score.',
      'https://example.com/videos/city-lights.mp4',
      'https://example.com/thumbnails/city-lights.jpg',
      true,
      now()
    ),
    (
      demo_channel_id,
      demo_owner_id,
      'Coastal Drift',
      'Slow, cinematic coastline shots.',
      'https://example.com/videos/coastal-drift.mp4',
      'https://example.com/thumbnails/coastal-drift.jpg',
      true,
      now()
    ),
    (
      demo_channel_id,
      demo_owner_id,
      'Studio Session',
      'Behind-the-scenes editing session.',
      'https://example.com/videos/studio-session.mp4',
      'https://example.com/thumbnails/studio-session.jpg',
      false,
      null
    );
end $$;
