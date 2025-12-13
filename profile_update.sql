-- Update Profiles Table to match new requirements

-- 1. Add new columns if they don't exist
do $$
begin
    -- Add full_name if missing
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'full_name') then
        alter table public.profiles add column full_name text;
    end if;

    -- Add phone_number if missing
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'phone_number') then
        alter table public.profiles add column phone_number text;
    end if;
end $$;

-- 2. Migrate existing display_name to full_name (if applicable)
update public.profiles 
set full_name = display_name 
where full_name is null and display_name is not null;

-- 3. Update the handle_new_user function to map meta data correctly
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
  );
  return new;
end;
$$;
