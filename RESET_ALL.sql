-- !!! WARNING: THIS WILL DELETE ALL DATA !!!
-- This script completely resets your public schema to ensure all tables exist correctly.
-- Use this only if you are in development and can afford to lose test data.

-- 1. DROP ALL EXISTING TABLES (Cascade to handle dependencies)
drop table if exists public.messages cascade;
drop table if exists public.conversations cascade;
drop table if exists public.bookings cascade;
drop table if exists public.businesses cascade;
drop table if exists public.profiles cascade;

-- 2. RE-CREATE PROFILES
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone_number text,
  display_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.profiles enable row level security;
create policy "Public view" on profiles for select using (true);
create policy "User update" on profiles for update using (auth.uid() = id);
create policy "User insert" on profiles for insert with check (auth.uid() = id);

-- 3. RE-CREATE BUSINESSES
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users not null,
  name text not null,
  category text not null,
  description text,
  address text,
  image_url text,
  price_range text,
  rating numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.businesses enable row level security;
create policy "Public view" on businesses for select using (true);
create policy "Owner manage" on businesses for all using (auth.uid() = owner_id);

-- 4. RE-CREATE CONVERSATIONS
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  business_id uuid references public.businesses(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, business_id)
);
alter table public.conversations enable row level security;
create policy "User view" on conversations for select using (auth.uid() = user_id);
create policy "Business view" on conversations for select using (exists (select 1 from businesses where id = conversations.business_id and owner_id = auth.uid()));
create policy "User create" on conversations for insert with check (auth.uid() = user_id);

-- 5. RE-CREATE MESSAGES
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) not null,
  sender_id uuid references auth.users not null,
  content text not null,
  status text default 'sent',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.messages enable row level security;
create policy "Participant view" on messages for select using (
  exists (
    select 1 from conversations c
    where c.id = messages.conversation_id
    and (c.user_id = auth.uid() or exists (select 1 from businesses b where b.id = c.business_id and b.owner_id = auth.uid()))
  )
);
create policy "Participant insert" on messages for insert with check (auth.uid() = sender_id);

-- 6. RE-CREATE BOOKINGS
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) not null,
  user_id uuid references auth.users not null,
  service_name text not null,
  start_time timestamp with time zone not null,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.bookings enable row level security;
create policy "User view" on bookings for select using (auth.uid() = user_id);
create policy "Business view" on bookings for select using (exists (select 1 from businesses where id = bookings.business_id and owner_id = auth.uid()));
create policy "User create" on bookings for insert with check (auth.uid() = user_id);

-- 7. REFRESH SCHEMA CACHE
notify pgrst, 'reload config';
