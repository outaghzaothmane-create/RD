-- =====================================================
-- BOOKING SYSTEM MIGRATION
-- Inspired by GoBarber open-source project
-- =====================================================

-- 1. BOOKINGS TABLE
-- Stores all booking/appointment records
create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  business_id uuid references businesses(id) on delete cascade not null,
  service_name text not null,
  booking_date timestamp with time zone not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for performance
create index bookings_business_id_idx on bookings(business_id);
create index bookings_booking_date_idx on bookings(booking_date);
create index bookings_user_id_idx on bookings(user_id);
create index bookings_status_idx on bookings(status);

-- Enable RLS
alter table bookings enable row level security;

-- RLS Policies for Bookings
-- Customers can view their own bookings
create policy "Users can view their own bookings"
  on bookings for select
  using ( auth.uid() = user_id );

-- Business owners can view bookings for their business
create policy "Business owners can view their bookings"
  on bookings for select
  using ( 
    exists (
      select 1 from businesses 
      where id = bookings.business_id 
      and owner_id = auth.uid()
    )
  );

-- Customers can create bookings
create policy "Users can create bookings"
  on bookings for insert
  with check ( auth.uid() = user_id );

-- Customers can cancel their own bookings
create policy "Users can update their own bookings"
  on bookings for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

-- Business owners can update bookings for their business (confirm/cancel)
create policy "Business owners can update their bookings"
  on bookings for update
  using ( 
    exists (
      select 1 from businesses 
      where id = bookings.business_id 
      and owner_id = auth.uid()
    )
  );

-- =====================================================
-- 2. AVAILABILITY TABLE
-- Defines when businesses are open for appointments
create table availability (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6),
  start_time time not null,
  end_time time not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure start_time is before end_time
  constraint valid_time_range check (start_time < end_time)
);

-- Index for quick lookups
create index availability_business_id_idx on availability(business_id);

-- Enable RLS
alter table availability enable row level security;

-- RLS Policies for Availability
-- Everyone can view availability (public information)
create policy "Availability is viewable by everyone"
  on availability for select
  using ( true );

-- Only business owners can manage their availability
create policy "Business owners can insert availability"
  on availability for insert
  with check ( 
    exists (
      select 1 from businesses 
      where id = availability.business_id 
      and owner_id = auth.uid()
    )
  );

create policy "Business owners can update availability"
  on availability for update
  using ( 
    exists (
      select 1 from businesses 
      where id = availability.business_id 
      and owner_id = auth.uid()
    )
  );

create policy "Business owners can delete availability"
  on availability for delete
  using ( 
    exists (
      select 1 from businesses 
      where id = availability.business_id 
      and owner_id = auth.uid()
    )
  );

-- =====================================================
-- 3. RPC FUNCTION: get_available_slots
-- Returns available time slots for a business on a specific date
-- Inspired by GoBarber's slot calculation logic
-- =====================================================

create or replace function get_available_slots(
  p_business_id uuid,
  p_date date
)
returns jsonb
language plpgsql
as $$
declare
  v_day_of_week integer;
  v_availability record;
  v_slots jsonb := '[]'::jsonb;
  v_slot_time time;
  v_slot_datetime timestamp with time zone;
  v_is_booked boolean;
begin
  -- Get day of week (0 = Sunday, 6 = Saturday)
  v_day_of_week := extract(dow from p_date);
  
  -- Loop through all availability records for this business and day
  for v_availability in
    select start_time, end_time
    from availability
    where business_id = p_business_id
    and day_of_week = v_day_of_week
  loop
    -- Generate hourly slots from start_time to end_time
    v_slot_time := v_availability.start_time;
    
    while v_slot_time < v_availability.end_time loop
      -- Create full timestamp for this slot
      v_slot_datetime := (p_date || ' ' || v_slot_time)::timestamp with time zone;
      
      -- Check if this slot is already booked
      select exists(
        select 1 
        from bookings 
        where business_id = p_business_id
        and booking_date = v_slot_datetime
        and status in ('pending', 'confirmed')
      ) into v_is_booked;
      
      -- Only add slot if:
      -- 1. Not booked
      -- 2. In the future (not in the past)
      if not v_is_booked and v_slot_datetime > now() then
        v_slots := v_slots || jsonb_build_object(
          'time', to_char(v_slot_time, 'HH24:MI'),
          'available', true
        );
      end if;
      
      -- Move to next hour
      v_slot_time := v_slot_time + interval '1 hour';
    end loop;
  end loop;
  
  return v_slots;
end;
$$;

-- =====================================================
-- 4. SAMPLE DATA (Optional - for testing)
-- Uncomment to insert sample availability data
-- =====================================================

-- Example: Set availability for first business in database
-- Monday-Friday: 9 AM - 5 PM
/*
insert into availability (business_id, day_of_week, start_time, end_time)
select 
  id,
  day,
  '09:00'::time,
  '17:00'::time
from businesses
cross join generate_series(1, 5) as day
limit 5;
*/

-- =====================================================
-- 5. HELPER FUNCTION: Update timestamp on row update
-- =====================================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply trigger to bookings table
create trigger update_bookings_updated_at
  before update on bookings
  for each row
  execute function update_updated_at_column();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run this script in your Supabase SQL Editor
-- 2. Insert availability records for your businesses
-- 3. Test get_available_slots function:
--    SELECT get_available_slots('your-business-uuid', '2025-12-14');
-- =====================================================
