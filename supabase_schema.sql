-- Create businesses table
create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users not null,
  name text not null,
  category text not null,
  description text,
  address text,
  image_url text,
  price_range text,
  rating numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Add constraint to ensure one business per owner (optional, depending on requirements)
  unique(owner_id)
);

-- Enable RLS
alter table businesses enable row level security;

-- Policies
-- 1. View: Everyone can view businesses
create policy "Businesses are viewable by everyone"
  on businesses for select
  using ( true );

-- 2. Insert: Authenticated users can create a business (assigns to themselves)
create policy "Users can create their own business"
  on businesses for insert
  with check ( auth.uid() = owner_id );

-- 3. Update: Only owner can update their business
create policy "Users can update their own business"
  on businesses for update
  using ( auth.uid() = owner_id );

-- 4. Delete: Only owner can delete their business
create policy "Users can delete their own business"
  on businesses for delete
  using ( auth.uid() = owner_id );

-- Chat System Tables

-- 5. Conversations
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  business_id uuid references businesses(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, business_id)
);

alter table conversations enable row level security;

-- Policy: Users can view their own conversations
create policy "Users can view their own conversations"
  on conversations for select
  using ( auth.uid() = user_id );

-- Policy: Businesses (owners) can view conversations for their business
create policy "Businesses can view their conversations"
  on conversations for select
  using ( exists (select 1 from businesses where id = conversations.business_id and owner_id = auth.uid()) );

-- Policy: Users can create conversations
create policy "Users can create conversations"
  on conversations for insert
  with check ( auth.uid() = user_id );

-- 6. Messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) not null,
  sender_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table messages enable row level security;

-- Policy: Participants can view messages
create policy "Participants can view messages"
  on messages for select
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.user_id = auth.uid() or exists (select 1 from businesses b where b.id = c.business_id and b.owner_id = auth.uid()))
    )
  );

-- Policy: Participants can insert messages
create policy "Participants can send messages"
  on messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.user_id = auth.uid() or exists (select 1 from businesses b where b.id = c.business_id and b.owner_id = auth.uid()))
    )
  );
