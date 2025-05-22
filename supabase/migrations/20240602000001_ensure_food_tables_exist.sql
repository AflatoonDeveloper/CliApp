-- Ensure all necessary tables exist for food tracking

-- Create food_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein_grams DECIMAL NOT NULL,
  carbs_grams DECIMAL NOT NULL,
  fat_grams DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table if it doesn't exist
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT,
  meal_time TEXT,
  total_calories INTEGER NOT NULL,
  total_protein_grams DECIMAL NOT NULL,
  total_carbs_grams DECIMAL NOT NULL,
  total_fat_grams DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS meal_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  quantity DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for food_items
DROP POLICY IF EXISTS "Users can only see their own food items" ON food_items;
CREATE POLICY "Users can only see their own food items"
  ON food_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only insert their own food items" ON food_items;
CREATE POLICY "Users can only insert their own food items"
  ON food_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own food items" ON food_items;
CREATE POLICY "Users can only update their own food items"
  ON food_items FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own food items" ON food_items;
CREATE POLICY "Users can only delete their own food items"
  ON food_items FOR DELETE
  USING (auth.uid() = user_id);

-- Add RLS policies for meals
DROP POLICY IF EXISTS "Users can only see their own meals" ON meals;
CREATE POLICY "Users can only see their own meals"
  ON meals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only insert their own meals" ON meals;
CREATE POLICY "Users can only insert their own meals"
  ON meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own meals" ON meals;
CREATE POLICY "Users can only update their own meals"
  ON meals FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own meals" ON meals;
CREATE POLICY "Users can only delete their own meals"
  ON meals FOR DELETE
  USING (auth.uid() = user_id);

-- Add RLS policies for meal_items
DROP POLICY IF EXISTS "Users can only see their own meal items" ON meal_items;
CREATE POLICY "Users can only see their own meal items"
  ON meal_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can only insert their own meal items" ON meal_items;
CREATE POLICY "Users can only insert their own meal items"
  ON meal_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can only delete their own meal items" ON meal_items;
CREATE POLICY "Users can only delete their own meal items"
  ON meal_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

-- Enable RLS on all tables
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;
