-- Fix RLS policies for bookings table to allow DELETE
-- This allows users to delete their own bookings

-- Drop existing DELETE policy if it exists
DROP POLICY IF EXISTS "Users can delete their own bookings" ON bookings;

-- Create DELETE policy
CREATE POLICY "Users can delete their own bookings"
  ON bookings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Verify policies
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'bookings'
ORDER BY policyname;
