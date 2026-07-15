-- Villa Serena — Contact form inquiries (Section 10: The Invitation)
-- Run in Supabase SQL Editor

create table if not exists inquiries (
  id             uuid primary key default uuid_generate_v4(),
  guest_id       uuid references guests(id) on delete set null,
  name           text not null,
  email          text not null,
  phone          text,
  guests         text,
  preferred_date text,
  message        text,
  source         text not null default 'contact_form',
  created_at     timestamptz not null default now()
);

create index if not exists inquiries_created_idx on inquiries(created_at desc);
create index if not exists inquiries_email_idx   on inquiries(email);

alter table inquiries enable row level security;

drop policy if exists "Admin full access on inquiries" on inquiries;
create policy "Admin full access on inquiries"
  on inquiries for all
  to authenticated
  using (true)
  with check (true);
