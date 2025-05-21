-- Create food_items table
CREATE TABLE IF NOT EXISTS food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein_grams DECIMAL(10, 2) NOT NULL,
  carbs_grams DECIMAL(10, 2) NOT NULL,
  fat_grams DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  meal_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT,
  total_calories INTEGER NOT NULL,
  total_protein_grams DECIMAL(10, 2) NOT NULL,
  total_carbs_grams DECIMAL(10, 2) NOT NULL,
  total_fat_grams DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_items junction table
CREATE TABLE IF NOT EXISTS meal_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10, 2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;

-- Create policies for food_items
DROP POLICY IF EXISTS "Users can view their own food items" ON food_items;
CREATE POLICY "Users can view their own food items"
  ON food_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own food items" ON food_items;
CREATE POLICY "Users can insert their own food items"
  ON food_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own food items" ON food_items;
CREATE POLICY "Users can update their own food items"
  ON food_items FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own food items" ON food_items;
CREATE POLICY "Users can delete their own food items"
  ON food_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for meals
DROP POLICY IF EXISTS "Users can view their own meals" ON meals;
CREATE POLICY "Users can view their own meals"
  ON meals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own meals" ON meals;
CREATE POLICY "Users can insert their own meals"
  ON meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own meals" ON meals;
CREATE POLICY "Users can update their own meals"
  ON meals FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own meals" ON meals;
CREATE POLICY "Users can delete their own meals"
  ON meals FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for meal_items
DROP POLICY IF EXISTS "Users can view their own meal items" ON meal_items;
CREATE POLICY "Users can view their own meal items"
  ON meal_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their own meal items" ON meal_items;
CREATE POLICY "Users can insert their own meal items"
  ON meal_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own meal items" ON meal_items;
CREATE POLICY "Users can update their own meal items"
  ON meal_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their own meal items" ON meal_items;
CREATE POLICY "Users can delete their own meal items"
  ON meal_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

-- Enable realtime for all tables
alter publication supabase_realtime add table food_items;
alter publication supabase_realtime add table meals;
alter publication supabase_realtime add table meal_items;
