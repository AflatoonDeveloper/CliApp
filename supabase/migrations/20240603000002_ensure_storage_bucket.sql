-- Ensure storage bucket exists for food images
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'food-images', true)
ON CONFLICT (id) DO NOTHING;

-- Add policy to allow authenticated users to upload images
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'food-images');

-- Add policy to allow public access to food images
DROP POLICY IF EXISTS "Allow public access to food images" ON storage.objects;
CREATE POLICY "Allow public access to food images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'food-images');
