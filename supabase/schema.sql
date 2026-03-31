-- Enable pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";
create extension if not exists btree_gist;

-- Types
drop type if exists public.category_enum cascade;
create type public.category_enum as enum ('Mountain','Treehouse','Desert','Island','BeachFront','Hill Station','Others');

drop type if exists public.season_enum cascade;
create type public.season_enum as enum ('Winter','Summer','Monsoon','All');

drop type if exists public.booking_status_enum cascade;
create type public.booking_status_enum as enum ('upcoming','ongoing','completed','cancelled');

-- Resorts Table
drop table if exists public.resorts cascade;
create table public.resorts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  image text,
  gallery text[] not null default '{}',
  price integer not null,
  location text not null,
  country text not null default 'India',
  category public.category_enum not null,
  season public.season_enum not null,
  amenities text[] not null default '{}',
  capacity_guests integer not null,
  capacity_beds integer not null,
  capacity_baths integer not null,
  avg_rating numeric(4,2) not null default 0,
  review_count integer not null default 0,
  owner_name text not null,
  coordinates double precision[] not null,
  transport_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint coordinates_length check (array_length(coordinates,1) = 2)
);

-- Reviews Table
drop table if exists public.reviews cascade;
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.resorts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  comment text not null,
  rating integer not null,
  created_at timestamptz not null default now(),
  constraint rating_range check (rating between 1 and 5)
);

-- Bookings Table
drop table if exists public.bookings cascade;
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.resorts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  start_date date not null,
  end_date date not null,
  guests integer not null,
  total integer not null,
  status public.booking_status_enum not null default 'upcoming',
  cancellation_reason text,
  created_at timestamptz not null default now()
);

-- Booking Requests Table
drop table if exists public.booking_requests cascade;
create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.resorts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  check_in date not null,
  check_out date not null,
  guests integer not null,
  created_at timestamptz not null default now()
);

-- Profiles Table
drop table if exists public.profiles cascade;
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'user', -- 'user' or 'owner'
  created_at timestamptz not null default now()
);

-- Indices
create index resorts_created_at_idx on public.resorts (created_at);
create index resorts_category_season_idx on public.resorts (category, season);
create index reviews_listing_created_idx on public.reviews (listing_id, created_at);
create index bookings_user_created_idx on public.bookings (user_id, created_at);
create index booking_requests_listing_created_idx on public.booking_requests (listing_id, created_at);

-- Updated At Trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger resorts_set_updated_at
before update on public.resorts
for each row
execute function public.set_updated_at();

-- Update Resort Stats Trigger
create or replace function public.update_resort_review_stats()
returns trigger
language plpgsql
as $$
declare
  rid uuid;
begin
  rid := coalesce(new.listing_id, old.listing_id);
  update public.resorts
  set review_count = (select count(*) from public.reviews where listing_id = rid),
      avg_rating   = coalesce((select avg(rating)::numeric(4,2) from public.reviews where listing_id = rid), 0)
  where id = rid;
  return null;
end;
$$;

create trigger reviews_after_ins
after insert on public.reviews
for each row execute function public.update_resort_review_stats();
create trigger reviews_after_upd
after update on public.reviews
for each row execute function public.update_resort_review_stats();
create trigger reviews_after_del
after delete on public.reviews
for each row execute function public.update_resort_review_stats();

-- RLS
alter table public.resorts enable row level security;
alter table public.reviews enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_requests enable row level security;
alter table public.profiles enable row level security;

-- Resorts Policies
create policy resorts_select_public on public.resorts for select using (true);
create policy resorts_insert_owner on public.resorts for insert to authenticated with check (true);
create policy resorts_update_owner on public.resorts for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy resorts_delete_owner on public.resorts for delete to authenticated using (owner_id = auth.uid());

-- Reviews Policies
create policy reviews_select_public on public.reviews for select using (true);
create policy reviews_insert_auth on public.reviews for insert to authenticated with check (true);

-- Bookings Policies
create policy bookings_select_own on public.bookings for select to authenticated using (user_id = auth.uid());
create policy bookings_select_owner_resort on public.bookings for select to authenticated using (exists (select 1 from public.resorts where id = listing_id and owner_id = auth.uid()));
create policy bookings_modify_own on public.bookings for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Overlap Constraint
alter table public.bookings
  add column if not exists booking_range daterange
  generated always as (
    case
      when status in ('upcoming','ongoing') then daterange(start_date, end_date, '[)')
      else null
    end
  ) stored;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'bookings_no_overlap'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_no_overlap
      exclude using gist (listing_id with =, booking_range with &&);
  end if;
end $$;

-- Profiles Policies
create policy profiles_select_own on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_update_own on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- New User Trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Storage
insert into storage.buckets (id, name, public)
values ('resort-images', 'resort-images', true)
on conflict (id) do nothing;

create policy resort_images_public_read on storage.objects for select using (bucket_id = 'resort-images');
create policy resort_images_auth_insert on storage.objects for insert to authenticated with check (bucket_id = 'resort-images');
create policy resort_images_auth_update on storage.objects for update to authenticated using (bucket_id = 'resort-images') with check (bucket_id = 'resort-images');
create policy resort_images_auth_delete on storage.objects for delete to authenticated using (bucket_id = 'resort-images');
