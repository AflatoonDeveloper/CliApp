export interface FoodItem {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id?: string;
  title: string;
  mealTime?: string;
  imageUrl?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  foodItems?: FoodItem[];
  createdAt?: string;
}

export interface AnalysisResult {
  foodItems: FoodItem[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
