-- MASTER SETUP SCRIPT
-- Run this in Supabase SQL Editor to fix "Table not found" errors.
-- This script is safe to run multiple times (it uses IF NOT EXISTS).

-- 1. Create PROFILES (Fixes your current error)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  display_name text,
  avatar_url text,
  phone_number text,
  updated_at timestamp with time zone
);
alter table public.profiles enable row level security;
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- 2. Create BUSINESSES
create table if not exists public.businesses (
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
drop policy if exists "Businesses are viewable by everyone" on businesses;
create policy "Businesses are viewable by everyone" on businesses for select using ( true );
drop policy if exists "Users can create their own business" on businesses;
create policy "Users can create their own business" on businesses for insert with check ( auth.uid() = owner_id );

-- 3. Create CONVERSATIONS
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  business_id uuid references public.businesses(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, business_id)
);
alter table public.conversations enable row level security;
drop policy if exists "Users can view their own conversations" on conversations;
create policy "Users can view their own conversations" on conversations for select using ( auth.uid() = user_id );
drop policy if exists "Businesses can view their conversations" on conversations;
create policy "Businesses can view their conversations" on conversations for select using ( exists (select 1 from businesses where id = conversations.business_id and owner_id = auth.uid()) );
drop policy if exists "Users can create conversations" on conversations;
create policy "Users can create conversations" on conversations for insert with check ( auth.uid() = user_id );

-- 4. Create MESSAGES
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) not null,
  sender_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'sent' check (status in ('sent', 'delivered', 'read'))
);
alter table public.messages enable row level security;
drop policy if exists "Participants can view messages" on messages;
create policy "Participants can view messages" on messages for select using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.user_id = auth.uid() or exists (select 1 from businesses b where b.id = c.business_id and b.owner_id = auth.uid()))
    )
);
drop policy if exists "Participants can send messages" on messages;
create policy "Participants can send messages" on messages for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.user_id = auth.uid() or exists (select 1 from businesses b where b.id = c.business_id and b.owner_id = auth.uid()))
    )
);

-- 5. Create BOOKINGS
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) not null,
  user_id uuid references auth.users not null,
  service_name text not null,
  start_time timestamp with time zone not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.bookings enable row level security;
drop policy if exists "Owners see their business bookings" on bookings;
create policy "Owners see their business bookings" on bookings for select using ( exists (select 1 from businesses where id = bookings.business_id and owner_id = auth.uid()) );
drop policy if exists "Users see their own bookings" on bookings;
create policy "Users see their own bookings" on bookings for select using ( auth.uid() = user_id );
drop policy if exists "Users can create bookings" on bookings;
create policy "Users can create bookings" on bookings for insert with check ( auth.uid() = user_id );

-- 6. RPC Function for Stats
create or replace function get_weekly_stats(curr_business_id uuid)
returns table (
  date_label text,
  booking_count bigint
) 
language plpgsql
security definer
as $$
begin
  return query
  select
    to_char(day_series, 'Mon DD') as date_label,
    count(b.id) as booking_count
  from
    generate_series(
      now() - interval '6 days',
      now(),
      '1 day'
    ) as day_series
  left join public.bookings b
    on b.business_id = curr_business_id
    and date_trunc('day', b.created_at) = date_trunc('day', day_series)
  group by day_series
  order by day_series;
end;
$$;

-- 7. Triggers
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, phone_number)
  values (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing; -- Prevent error if already exists
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. Enable Realtime
begin; 
  drop publication if exists supabase_realtime; 
  create publication supabase_realtime; 
commit;
alter publication supabase_realtime add table messages;
