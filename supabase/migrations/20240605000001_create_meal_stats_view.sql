-- Create a view for meal statistics to make insights queries easier
CREATE OR REPLACE VIEW meal_stats AS
SELECT
  user_id,
  DATE(created_at) as meal_date,
  TO_CHAR(DATE(created_at), 'Dy') as day_name,
  SUM(total_calories) as daily_calories,
  SUM(total_protein_grams) as daily_protein,
  SUM(total_carbs_grams) as daily_carbs,
  SUM(total_fat_grams) as daily_fat,
  COUNT(*) as meal_count
FROM
  meals
GROUP BY
  user_id, DATE(created_at), TO_CHAR(DATE(created_at), 'Dy')
ORDER BY
  DATE(created_at);

-- Add the view to the realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'meal_stats'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE meal_stats;
  END IF;
END
$$;
