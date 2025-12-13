-- Fix RLS policy for conversations to allow upsert during booking
-- The current policy only allows INSERT, but upsert needs UPDATE too

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;

-- Create new policy that allows both INSERT and UPDATE for upsert
CREATE POLICY "Users can upsert conversations"
  ON conversations
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Verify the fix
SELECT * FROM conversations LIMIT 5;
