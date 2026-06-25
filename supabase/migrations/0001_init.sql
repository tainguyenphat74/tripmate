-- TripMate schema (MVP) — run this in the Supabase SQL editor.
-- Money is stored as integer VND (bigint). No auth: access is by join_code,
-- optionally protected by a per-trip PIN (hashed). RLS is open for the anon
-- role on purpose (personal app; see SPEC.md "Trade-off note").

create extension if not exists "pgcrypto";

create table if not exists trips (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  join_code   text not null unique,
  pin_hash    text,
  currency    text not null default 'VND',
  created_at  timestamptz not null default now()
);

create table if not exists members (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists expenses (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,
  payer_id    uuid not null references members(id) on delete restrict,
  description text not null,
  amount      bigint not null check (amount >= 0),
  split_type  text not null default 'even' check (split_type in ('even','exact')),
  created_at  timestamptz not null default now()
);

create table if not exists expense_shares (
  id          uuid primary key default gen_random_uuid(),
  expense_id  uuid not null references expenses(id) on delete cascade,
  member_id   uuid not null references members(id) on delete cascade,
  amount      bigint not null check (amount >= 0)
);

create table if not exists settlements (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,
  from_id     uuid not null references members(id) on delete cascade,
  to_id       uuid not null references members(id) on delete cascade,
  amount      bigint not null check (amount >= 0),
  settled_at  timestamptz not null default now()
);

create table if not exists places (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,
  name        text not null,
  note        text,
  url         text,
  visited     boolean not null default false,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists idx_members_trip on members(trip_id);
create index if not exists idx_expenses_trip on expenses(trip_id);
create index if not exists idx_shares_expense on expense_shares(expense_id);
create index if not exists idx_places_trip on places(trip_id);
create index if not exists idx_settlements_trip on settlements(trip_id);

-- Open access policies (anon role). Acceptable for a personal, link-shared app.
alter table trips          enable row level security;
alter table members        enable row level security;
alter table expenses       enable row level security;
alter table expense_shares enable row level security;
alter table settlements    enable row level security;
alter table places         enable row level security;

do $$
declare t text;
begin
  foreach t in array array['trips','members','expenses','expense_shares','settlements','places']
  loop
    execute format('drop policy if exists "%s_all" on %I;', t, t);
    execute format(
      'create policy "%s_all" on %I for all to anon, authenticated using (true) with check (true);',
      t, t);
  end loop;
end $$;
