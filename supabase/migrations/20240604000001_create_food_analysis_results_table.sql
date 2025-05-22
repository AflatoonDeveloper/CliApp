-- Create food_analysis_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS food_analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for food_analysis_results
DROP POLICY IF EXISTS "Users can only see their own analysis results" ON food_analysis_results;
CREATE POLICY "Users can only see their own analysis results"
  ON food_analysis_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only insert their own analysis results" ON food_analysis_results;
CREATE POLICY "Users can only insert their own analysis results"
  ON food_analysis_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on food_analysis_results table
ALTER TABLE food_analysis_results ENABLE ROW LEVEL SECURITY;
