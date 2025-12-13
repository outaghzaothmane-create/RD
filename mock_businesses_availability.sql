-- ================================================
-- ADD AVAILABILITY FOR ALL MOCK BUSINESSES
-- This adds Mon-Fri 9am-5pm for all businesses
-- ================================================

-- La Pasta House
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 1, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 2, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 3, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 4, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 5, '09:00', '17:00');

-- Sushi Zen
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 1, '11:00', '22:00'),
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 2, '11:00', '22:00'),
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 3, '11:00', '22:00'),
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 4, '11:00', '22:00'),
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 5, '11:00', '22:00'),
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 6, '11:00', '22:00');

-- City Dental
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 1, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 2, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 3, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 4, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 5, '08:00', '17:00');

-- Dr. Sarah Smith
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 1, '08:00', '16:00'),
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 2, '08:00', '16:00'),
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 3, '08:00', '16:00'),
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 4, '08:00', '16:00'),
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 5, '08:00', '16:00');

-- Glow Spa
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 1, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 2, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 3, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 4, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 5, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 6, '10:00', '19:00');

-- Luxe Nails
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 1, '09:00', '18:00'),
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 2, '09:00', '18:00'),
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 3, '09:00', '18:00'),
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 4, '09:00', '18:00'),
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 5, '09:00', '18:00'),
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 6, '09:00', '18:00');

-- Iron Gym (24/7, but let's do 6am-10pm)
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 1, '06:00', '22:00'),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 2, '06:00', '22:00'),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 3, '06:00', '22:00'),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 4, '06:00', '22:00'),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 5, '06:00', '22:00'),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 6, '06:00', '22:00'),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 0, '06:00', '22:00');

-- Yoga Flow
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 1, '07:00', '20:00'),
('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 2, '07:00', '20:00'),
('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 3, '07:00', '20:00'),
('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 4, '07:00', '20:00'),
('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 5, '07:00', '20:00'),
('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 6, '08:00', '18:00'),
('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 0, '08:00', '18:00');

-- ================================================
-- TEST: Verify availability was added
-- ================================================
SELECT business_id, COUNT(*) as days_available
FROM availability
GROUP BY business_id
ORDER BY business_id;

-- TEST: Check La Pasta House specifically
SELECT get_available_slots('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '2025-12-16');
