-- 1. Create Bookings Table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) not null,
  user_id uuid references auth.users not null, -- Customer
  service_name text not null,
  start_time timestamp with time zone not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.bookings enable row level security;

-- Policies
create policy "Owners see their business bookings"
  on public.bookings for select
  using ( exists (select 1 from public.businesses where id = bookings.business_id and owner_id = auth.uid()) );

create policy "Users see their own bookings"
  on public.bookings for select
  using ( auth.uid() = user_id );

create policy "Users can create bookings"
  on public.bookings for insert
  with check ( auth.uid() = user_id );

create policy "Owners can update booking status"
  on public.bookings for update
  using ( exists (select 1 from public.businesses where id = bookings.business_id and owner_id = auth.uid()) );


-- 2. Create RPC for Weekly Stats
-- Returns counts for the last 7 days (including today)
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
