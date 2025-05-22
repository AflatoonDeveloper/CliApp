-- Create food_analysis_results table to store Gemini AI analysis results
CREATE TABLE IF NOT EXISTS food_analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add storage bucket for food images if it doesn't exist
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

-- Enable realtime for meals table
ALTER PUBLICATION supabase_realtime ADD TABLE meals;

-- Enable realtime for food_items table
ALTER PUBLICATION supabase_realtime ADD TABLE food_items;

-- Enable realtime for food_analysis_results table
ALTER PUBLICATION supabase_realtime ADD TABLE food_analysis_results;
