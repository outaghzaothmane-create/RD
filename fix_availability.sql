-- DIAGNOSTIC: Check if availability exists
SELECT * FROM availability WHERE business_id = 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f';

-- If above returns no rows, the INSERT failed. 
-- Common reason: You might have run the SQL in wrong project or it errored silently.

-- DIAGNOSTIC: Test the RPC function directly
SELECT get_available_slots('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', '2025-12-15');

-- This should return time slots like [{"time":"09:00","available":true}, ...]
-- If it returns empty [], either:
--   1. No availability records exist
--   2. All slots are in the past (but Dec 15, 2025 is definitely future)
--   3. All slots are already booked

-- DIAGNOSTIC: Check if there are any bookings
SELECT * FROM bookings WHERE business_id = 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f';

-- ================================================
-- SOLUTION: Delete any existing and re-insert properly
-- ================================================

-- First, clean up any partial inserts
DELETE FROM availability WHERE business_id IN (
  'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
  'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
  'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a'
);

-- Now insert fresh data
-- City Dental: Monday-Friday, 9 AM - 5 PM
INSERT INTO availability (business_id, day_of_week, start_time, end_time)
VALUES 
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 1, '09:00', '17:00'),
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 2, '09:00', '17:00'),
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 3, '09:00', '17:00'),
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 4, '09:00', '17:00'),
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 5, '09:00', '17:00');

-- Glow Spa: Monday-Saturday, 10 AM - 6 PM
INSERT INTO availability (business_id, day_of_week, start_time, end_time)
VALUES 
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 1, '10:00', '18:00'),
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 2, '10:00', '18:00'),
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 3, '10:00', '18:00'),
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 4, '10:00', '18:00'),
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 5, '10:00', '18:00'),
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 6, '10:00', '18:00');

-- Dr. Sarah Smith: Monday-Friday, 8 AM - 4 PM
INSERT INTO availability (business_id, day_of_week, start_time, end_time)
VALUES 
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 1, '08:00', '16:00'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 2, '08:00', '16:00'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 3, '08:00', '16:00'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 4, '08:00', '16:00'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 5, '08:00', '16:00');

-- Verify it worked
SELECT business_id, day_of_week, start_time, end_time 
FROM availability 
ORDER BY business_id, day_of_week;

-- Test the function again
SELECT get_available_slots('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', '2025-12-15');

-- Should now show slots like:
-- [{"time":"09:00","available":true},{"time":"10:00","available":true}, ... {"time":"16:00","available":true}]
