-- COMPLETE SETUP SCRIPT
-- Run this in Supabase SQL Editor to ensure ALL tables and features exist.

-- 1. Create PUBLIC.BUSINESSES (if not exists)
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
-- Enable RLS for businesses
alter table public.businesses enable row level security;
-- Business Policies (Safe to run multiple times, will just error if exists, so we wrap in do block or just ignore errors in editor)
drop policy if exists "Businesses are viewable by everyone" on businesses;
create policy "Businesses are viewable by everyone" on businesses for select using ( true );

drop policy if exists "Users can create their own business" on businesses;
create policy "Users can create their own business" on businesses for insert with check ( auth.uid() = owner_id );


-- 2. Create PUBLIC.CONVERSATIONS
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


-- 3. Create PUBLIC.MESSAGES
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) not null,
  sender_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
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


-- 4. Create PUBLIC.PROFILES (The upgrade part)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  updated_at timestamp with time zone
);
alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );


-- 5. Helper Functions & Triggers
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 6. Upgrades: Add Status & Realtime
-- Add status column if not exists
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'status') then
        alter table public.messages add column status text default 'sent' check (status in ('sent', 'delivered', 'read'));
    end if;
end $$;

-- Enable Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table messages;
