-- Fix for tables already in publication (excluding views)
DO $$
BEGIN
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
  
  -- Check if food_analysis_results table exists and add to publication
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'food_analysis_results') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'food_analysis_results'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE food_analysis_results;
    END IF;
  END IF;
  
  -- Check if meal_items table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'meal_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE meal_items;
  END IF;
END
$$;
