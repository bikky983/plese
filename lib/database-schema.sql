-- Shop Management Database Schema
-- Run these commands in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  banner_image_url TEXT,
  banner_height INTEGER DEFAULT 200,
  grid_columns INTEGER DEFAULT 3 CHECK (grid_columns IN (3, 4, 5)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create images table for storing uploaded images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage bucket for banner images
INSERT INTO storage.buckets (id, name, public) VALUES ('banner-images', 'banner-images', true);

-- Enable Row Level Security (RLS)
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shops
CREATE POLICY "Users can view their own shops" ON shops
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shops" ON shops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shops" ON shops
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shops" ON shops
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for products
CREATE POLICY "Users can view products from their shops" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert products to their shops" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update products in their shops" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete products from their shops" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.user_id = auth.uid()
    )
  );

-- RLS Policies for product_images
CREATE POLICY "Users can view images from their products" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      JOIN shops ON shops.id = products.shop_id 
      WHERE products.id = product_images.product_id AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert images to their products" ON product_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products 
      JOIN shops ON shops.id = products.shop_id 
      WHERE products.id = product_images.product_id AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update images in their products" ON product_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products 
      JOIN shops ON shops.id = products.shop_id 
      WHERE products.id = product_images.product_id AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images from their products" ON product_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM products 
      JOIN shops ON shops.id = products.shop_id 
      WHERE products.id = product_images.product_id AND shops.user_id = auth.uid()
    )
  );

-- Storage policies for product-images bucket
CREATE POLICY "Users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Users can update their product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for banner-images bucket
CREATE POLICY "Users can upload banner images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'banner-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view banner images" ON storage.objects
  FOR SELECT USING (bucket_id = 'banner-images');

CREATE POLICY "Users can update their banner images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'banner-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their banner images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'banner-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
