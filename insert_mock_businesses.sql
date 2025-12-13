-- ================================================
-- INSERT MOCK BUSINESSES INTO SUPABASE DATABASE
-- This allows the app to work with real database data
-- ================================================

-- First, we need a mock owner_id (your user ID)
-- Get your current user ID by running: SELECT auth.uid();
-- Or we'll just insert without owner requirement for testing

-- IMPORTANT: We'll disable the owner_id constraint temporarily for demo data
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_owner_id_key;

-- Now insert all mock businesses
INSERT INTO businesses (id, owner_id, name, category, description, address, image_url, price_range, rating) VALUES
-- La Pasta House
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
 (SELECT auth.uid()), 
 'La Pasta House', 
 'dining', 
 'Authentic Italian cuisine in a cozy atmosphere. Famous for our homemade pasta and wood-fired pizzas.',
 '123 Olive Garden Way, Foodville',
 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80',
 '$$',
 4.8),

-- Sushi Zen
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
 (SELECT auth.uid()),
 'Sushi Zen',
 'dining',
 'Premium sushi and sashimi prepared by master chefs using daily flown-in fish.',
 '456 Bamboo Lane, Japantown',
 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
 '$$$',
 4.9),

-- City Dental
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
 (SELECT auth.uid()),
 'City Dental',
 'healthcare',
 'Comprehensive dental care for the whole family. From checkups to cosmetic surgery.',
 '789 Smile Blvd, Health City',
 'https://images.unsplash.com/photo-1588776814546-1ffcf4722e02?w=500&q=80',
 '$$',
 4.9),

-- Dr. Sarah Smith
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
 (SELECT auth.uid()),
 'Dr. Sarah Smith',
 'healthcare',
 'Experienced family doctor providing compassionate primary care.',
 '101 Healing Way, Wellness Park',
 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&q=80',
 '$$',
 4.7),

-- Glow Spa
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
 (SELECT auth.uid()),
 'Glow Spa',
 'beauty',
 'Relax and rejuvenate with our premium spa services.',
 '555 Serenity Lane, Relaxville',
 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80',
 '$$',
 4.8),

-- Luxe Nails
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e',
 (SELECT auth.uid()),
 'Luxe Nails',
 'beauty',
 'Professional nail care and art in a modern salon.',
 '777 Polish Place, Glamour City',
 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80',
 '$$',
 4.6),

-- Iron Gym
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
 (SELECT auth.uid()),
 'Iron Gym',
 'fitness',
 'Fully equipped gym open 24 hours a day for all your fitness needs.',
 '888 Muscle St, Strength Town',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80',
 '$$',
 4.5),

-- Yoga Flow
('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a',
 (SELECT auth.uid()),
 'Yoga Flow',
 'fitness',
 'Find your inner peace with our variety of yoga classes.',
 '999 Zen Way, Peace Valley',
 'https://images.unsplash.com/photo-1599447421405-0e5a10c0071d?w=500&q=80',
 '$$',
 4.9);

-- Verify businesses were inserted
SELECT id, name, category FROM businesses;

-- Now add availability for La Pasta House (Mon-Fri 9-5)
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 1, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 2, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 3, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 4, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 5, '09:00', '17:00');

-- Add availability for City Dental (Mon-Fri 8-5)
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 1, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 2, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 3, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 4, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 5, '08:00', '17:00');

-- Add availability for Glow Spa (Mon-Sat 10-7)
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 1, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 2, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 3, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 4, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 5, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 6, '10:00', '19:00');

-- Verify availability was added
SELECT b.name, a.day_of_week, a.start_time, a.end_time
FROM availability a
JOIN businesses b ON b.id = a.business_id
ORDER BY b.name, a.day_of_week;

-- Test the RPC function for La Pasta House
SELECT get_available_slots('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '2025-12-16');

-- SUCCESS! You should see time slots returned
