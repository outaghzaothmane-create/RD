-- Add availability for "City Dental" (Monday-Friday, 9 AM - 5 PM)
INSERT INTO availability (business_id, day_of_week, start_time, end_time)
VALUES 
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 1, '09:00', '17:00'),  -- Monday
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 2, '09:00', '17:00'),  -- Tuesday
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 3, '09:00', '17:00'),  -- Wednesday
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 4, '09:00', '17:00'),  -- Thursday
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 5, '09:00', '17:00');  -- Friday

-- Add availability for "Glow Spa" (Monday-Saturday, 10 AM - 6 PM)
INSERT INTO availability (business_id, day_of_week, start_time, end_time)
VALUES 
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 1, '10:00', '18:00'),  -- Monday
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 2, '10:00', '18:00'),  -- Tuesday
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 3, '10:00', '18:00'),  -- Wednesday
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 4, '10:00', '18:00'),  -- Thursday
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 5, '10:00', '18:00'),  -- Friday
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 6, '10:00', '18:00');  -- Saturday

-- Add availability for "Dr. Sarah Smith" (Monday-Friday, 8 AM - 4 PM)
INSERT INTO availability (business_id, day_of_week, start_time, end_time)
VALUES 
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 1, '08:00', '16:00'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 2, '08:00', '16:00'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 3, '08:00', '16:00'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 4, '08:00', '16:00'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 5, '08:00', '16:00');
