-- ============================================================
-- Villa Serena — Supabase Database Schema
-- Run this in the Supabase SQL editor to set up the database.
-- ============================================================

-- -------------------------------------------------------
-- EXTENSIONS
-- -------------------------------------------------------
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------
-- GUESTS
-- Stores every person who has made a booking request or inquiry.
-- -------------------------------------------------------
create table if not exists guests (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  nationality text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint guests_email_unique unique (email)
);

-- -------------------------------------------------------
-- BOOKINGS
-- A booking is a request made by a guest for specific dates.
-- -------------------------------------------------------
do $$ begin
  create type booking_status as enum (
    'pending', 'approved', 'declined', 'cancelled', 'completed'
  );
exception when duplicate_object then null;
end $$;

create table if not exists bookings (
  id             uuid primary key default uuid_generate_v4(),
  guest_id       uuid not null references guests(id) on delete cascade,
  check_in       date not null,
  check_out      date not null,
  nights         int generated always as (check_out - check_in) stored,
  guests_count   int not null default 1,
  status         booking_status not null default 'pending',
  message        text,
  internal_notes text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint bookings_dates_valid check (check_out > check_in)
);

-- -------------------------------------------------------
-- BLOCKED DATES
-- Manually blocked periods (maintenance, owner use, etc.)
-- These are surfaced in the public availability calendar.
-- -------------------------------------------------------
create table if not exists blocked_dates (
  id         uuid primary key default uuid_generate_v4(),
  start_date date not null,
  end_date   date not null,
  label      text not null default 'Blocked',
  created_at timestamptz not null default now(),
  constraint blocked_dates_valid check (end_date > start_date)
);

-- -------------------------------------------------------
-- ACTIVITY LOG
-- Every notable event on the public website is logged here.
-- Used for the admin activity feed.
-- -------------------------------------------------------
do $$ begin
  create type activity_event_type as enum (
    'page_view', 'booking_request', 'contact_inquiry',
    'booking_approved', 'booking_declined', 'booking_cancelled'
  );
exception when duplicate_object then null;
end $$;

create table if not exists activity_log (
  id           uuid primary key default uuid_generate_v4(),
  event_type   activity_event_type not null,
  booking_id   uuid references bookings(id) on delete set null,
  guest_id     uuid references guests(id) on delete set null,
  metadata     jsonb default '{}',
  ip_country   text,
  user_agent   text,
  created_at   timestamptz not null default now()
);

-- -------------------------------------------------------
-- INDEXES
-- -------------------------------------------------------
create index if not exists bookings_guest_id_idx    on bookings(guest_id);
create index if not exists bookings_status_idx       on bookings(status);
create index if not exists bookings_check_in_idx     on bookings(check_in);
create index if not exists activity_log_event_idx    on activity_log(event_type);
create index if not exists activity_log_created_idx  on activity_log(created_at desc);
create index if not exists blocked_dates_range_idx   on blocked_dates(start_date, end_date);

-- -------------------------------------------------------
-- UPDATED_AT TRIGGER
-- -------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guests_updated_at on guests;
create trigger guests_updated_at
  before update on guests
  for each row execute function set_updated_at();

drop trigger if exists bookings_updated_at on bookings;
create trigger bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- -------------------------------------------------------
-- ROW LEVEL SECURITY
-- The public site uses a service-role key server-side.
-- The admin panel uses Supabase Auth + anon key.
-- -------------------------------------------------------
alter table guests       enable row level security;
alter table bookings     enable row level security;
alter table blocked_dates enable row level security;
alter table activity_log  enable row level security;

-- Admin (authenticated users) can do everything
drop policy if exists "Admin full access on guests" on guests;
create policy "Admin full access on guests"
  on guests for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin full access on bookings" on bookings;
create policy "Admin full access on bookings"
  on bookings for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin full access on blocked_dates" on blocked_dates;
create policy "Admin full access on blocked_dates"
  on blocked_dates for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin full access on activity_log" on activity_log;
create policy "Admin full access on activity_log"
  on activity_log for all
  to authenticated
  using (true)
  with check (true);

-- Public (service role via API routes) can insert guests, bookings, activity
-- These are handled server-side with the SERVICE_ROLE key so RLS is bypassed.
-- No anon read access to booking data from the browser.

-- -------------------------------------------------------
-- USEFUL VIEWS
-- -------------------------------------------------------

-- Bookings with guest info joined
create or replace view bookings_with_guests as
select
  b.id,
  b.check_in,
  b.check_out,
  b.nights,
  b.guests_count,
  b.status,
  b.message,
  b.internal_notes,
  b.created_at,
  b.updated_at,
  g.id        as guest_id,
  g.name      as guest_name,
  g.email     as guest_email,
  g.phone     as guest_phone,
  g.nationality as guest_nationality
from bookings b
join guests g on g.id = b.guest_id;

-- -------------------------------------------------------
-- SEED: Initial admin user
-- Create this via the Supabase dashboard:
--   Authentication > Users > Invite user
--   Email: your-admin@email.com
-- -------------------------------------------------------
