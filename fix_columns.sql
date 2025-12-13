-- FIX MISSING COLUMNS SCRIPT
-- Run this in Supabase SQL Editor. 
-- It safeguards against errors if columns already exist.

do $$
begin
    -- 1. Add 'full_name' if it doesn't exist
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'full_name') then
        alter table public.profiles add column full_name text;
    end if;

    -- 2. Add 'phone_number' if it doesn't exist
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'phone_number') then
        alter table public.profiles add column phone_number text;
    end if;

    -- 3. Add 'display_name' if missing (older compatibility)
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'display_name') then
        alter table public.profiles add column display_name text;
    end if;
    
    -- 4. Add 'bookings' table check (just in case)
    if not exists (select 1 from information_schema.tables where table_name = 'bookings') then
        create table public.bookings (
          id uuid primary key default gen_random_uuid(),
          business_id uuid references public.businesses(id) not null,
          user_id uuid references auth.users not null,
          service_name text not null,
          start_time timestamp with time zone not null,
          status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
        alter table public.bookings enable row level security;
        create policy "Users see their own bookings" on public.bookings for select using ( auth.uid() = user_id );
        create policy "Users can create bookings" on public.bookings for insert with check ( auth.uid() = user_id );
        create policy "Owners see their business bookings" on public.bookings for select using ( exists (select 1 from public.businesses where id = bookings.business_id and owner_id = auth.uid()) );
    end if;

end $$;
