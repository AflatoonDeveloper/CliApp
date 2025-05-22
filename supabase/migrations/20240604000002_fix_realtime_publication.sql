-- Fix for tables already in publication
DO $$
BEGIN
  -- Create the food_analysis_results table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'food_analysis_results') THEN
    CREATE TABLE food_analysis_results (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      result JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
  
  -- Check if meals table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'meals'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE meals;
  END IF;
  
  -- Check if food_items table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'food_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE food_items;
  END IF;
  
  -- Check if food_analysis_results table is already in the publication
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'food_analysis_results') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'food_analysis_results'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE food_analysis_results;
    END IF;
  END IF;
END
$$;
