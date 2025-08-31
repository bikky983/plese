-- Demo Shop Data (Optional)
-- You can run this after setting up your database to see example shops

-- Note: Replace 'your-user-id-here' with an actual user ID from your auth.users table
-- You can find user IDs in Supabase Dashboard > Authentication > Users

-- Example Shop 1: Electronics Store
INSERT INTO shops (id, user_id, name, description, banner_height, grid_columns) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'your-user-id-here', 'TechHub Electronics', 'Your one-stop shop for the latest gadgets and electronics', 250, 4);

-- Example Products for Electronics Store
INSERT INTO products (shop_id, name, description, price, position, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Wireless Bluetooth Headphones', 'Premium quality wireless headphones with noise cancellation', 79.99, 1, true),
('550e8400-e29b-41d4-a716-446655440001', 'Smartphone Stand', 'Adjustable aluminum stand for phones and tablets', 24.99, 2, true),
('550e8400-e29b-41d4-a716-446655440001', 'USB-C Cable', 'Fast charging USB-C cable with data transfer support', 12.99, 3, true),
('550e8400-e29b-41d4-a716-446655440001', 'Portable Power Bank', '10000mAh portable charger with wireless charging', 39.99, 4, true);

-- Example Shop 2: Fashion Boutique
INSERT INTO shops (id, user_id, name, description, banner_height, grid_columns) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'your-user-id-here', 'Bella Fashion', 'Trendy and affordable fashion for the modern woman', 300, 3);

-- Example Products for Fashion Boutique
INSERT INTO products (shop_id, name, description, price, position, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Summer Dress', 'Light and breezy summer dress perfect for any occasion', 45.00, 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'Designer Handbag', 'Elegant leather handbag with gold accents', 89.99, 2, true),
('550e8400-e29b-41d4-a716-446655440002', 'Casual Sneakers', 'Comfortable white sneakers for everyday wear', 65.00, 3, true);

-- Example Shop 3: Home & Garden
INSERT INTO shops (id, user_id, name, description, banner_height, grid_columns) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'your-user-id-here', 'Green Thumb Garden', 'Everything you need for a beautiful garden and cozy home', 200, 5);

-- Example Products for Home & Garden
INSERT INTO products (shop_id, name, description, price, position, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Ceramic Plant Pot', 'Beautiful handcrafted ceramic pot for indoor plants', 18.50, 1, true),
('550e8400-e29b-41d4-a716-446655440003', 'Garden Tool Set', 'Complete set of essential gardening tools', 34.99, 2, true),
('550e8400-e29b-41d4-a716-446655440003', 'Scented Candles', 'Set of 3 aromatherapy candles in elegant glass holders', 22.00, 3, true),
('550e8400-e29b-41d4-a716-446655440003', 'Throw Pillow', 'Soft decorative pillow with modern geometric pattern', 16.99, 4, true),
('550e8400-e29b-41d4-a716-446655440003', 'Wall Clock', 'Minimalist wooden wall clock for modern homes', 42.00, 5, true);

-- Instructions:
-- 1. First, create a user account by signing up on your website
-- 2. Go to Supabase Dashboard > Authentication > Users
-- 3. Copy your user ID 
-- 4. Replace 'your-user-id-here' in this file with your actual user ID
-- 5. Run this SQL in Supabase SQL Editor to create demo shops
-- 6. You can then see these shops in your dashboard and on the public shops page
