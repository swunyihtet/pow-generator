-- Migration: Create Storage Bucket for Portfolio Assets
-- Allows users to upload profile photos and CV documents

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies

-- Allow public read access to all assets
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'portfolio-assets' );

-- Allow authenticated users to upload their own assets
-- Assets must be stored in a folder named after their user_id
CREATE POLICY "Users can upload own assets" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'portfolio-assets' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own assets
CREATE POLICY "Users can update own assets" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'portfolio-assets' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own assets
CREATE POLICY "Users can delete own assets" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'portfolio-assets' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
