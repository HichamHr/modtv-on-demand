alter table public.videos
  add column if not exists preview_url text,
  add column if not exists full_url text,
  add column if not exists is_premium boolean not null default false,
  add column if not exists price_cents integer not null default 0,
  add column if not exists currency text not null default 'usd';

alter table public.videos
  add constraint videos_price_cents_nonnegative
  check (price_cents >= 0) not valid;

alter table public.videos
  validate constraint videos_price_cents_nonnegative;
