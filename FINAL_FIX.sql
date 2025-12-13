-- ================================================
-- FIX: Remove the unique constraint on owner_id
-- This allows one user to own multiple businesses (needed for demo/testing)
-- ================================================

ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_owner_id_key;

-- Now delete any existing businesses
DELETE FROM businesses WHERE owner_id = '7025eae3-8618-4680-b956-5992d07b5ae9';

-- Insert 3 mock businesses
INSERT INTO businesses (id, owner_id, name, category, description, address, image_url, price_range, rating) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
 '7025eae3-8618-4680-b956-5992d07b5ae9', 
 'La Pasta House', 
 'dining', 
 'Authentic Italian cuisine in a cozy atmosphere.',
 '123 Olive Garden Way, Foodville',
 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80',
 '$$',
 4.8),

('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
 '7025eae3-8618-4680-b956-5992d07b5ae9',
 'City Dental',
 'healthcare',
 'Comprehensive dental care for the whole family.',
 '789 Smile Blvd, Health City',
 'https://images.unsplash.com/photo-1588776814546-1ffcf4722e02?w=500&q=80',
 '$$',
 4.9),

('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
 '7025eae3-8618-4680-b956-5992d07b5ae9',
 'Glow Spa',
 'beauty',
 'Relax and rejuvenate with our premium spa services.',
 '555 Serenity Lane, Relaxville',
 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80',
 '$$',
 4.8);

-- Add availability for La Pasta House (Mon-Fri 9am-5pm)
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 1, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 2, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 3, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 4, '09:00', '17:00'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 5, '09:00', '17:00');

-- Add availability for City Dental (Mon-Fri 8am-5pm)
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 1, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 2, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 3, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 4, '08:00', '17:00'),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 5, '08:00', '17:00');

-- Add availability for Glow Spa (Mon-Sat 10am-7pm)
INSERT INTO availability (business_id, day_of_week, start_time, end_time) VALUES
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 1, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 2, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 3, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 4, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 5, '10:00', '19:00'),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 6, '10:00', '19:00');

-- ✅ VERIFY SUCCESS
SELECT 'Businesses inserted:' as status, COUNT(*) as count FROM businesses;
SELECT 'Availability records:' as status, COUNT(*) as count FROM availability;

-- ✅ TEST THE SLOT FUNCTION
SELECT get_available_slots('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '2025-12-16');
