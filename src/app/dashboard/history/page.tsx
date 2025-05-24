"use client";

import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "../../../../supabase/client";
import {
  Calendar as CalendarIcon,
  Clock,
  Utensils,
  Trash2,
  Filter,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MealItem {
  id: string;
  date: string;
  time: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  image_url?: string;
  created_at?: string;
}

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      setUser(user);
      fetchMeals(user.id);
    }
    getUser();
  }, [router, supabase]);

  const fetchMeals = async (userId: string) => {
    try {
      setLoading(true);

      // Fetch real data from Supabase
      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      if (data && data.length > 0) {
        // Transform the data to match our MealItem interface
        const formattedMeals = data.map((meal) => {
          const createdAt = new Date(meal.created_at || Date.now());
          return {
            id: meal.id,
            date: createdAt.toISOString().split("T")[0],
            time: createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            title: meal.title || "Meal",
            calories: meal.total_calories || 0,
            protein: meal.total_protein_grams || 0,
            carbs: meal.total_carbs_grams || 0,
            fat: meal.total_fat_grams || 0,
            image:
              meal.image_url ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
            created_at: meal.created_at,
          };
        });

        console.log("Fetched meals:", formattedMeals);
        setMeals(formattedMeals);
      } else {
        console.log("No meals found for user", userId);
        setMeals([]);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      // Delete from the database
      const { error } = await supabase.from("meals").delete().eq("id", mealId);

      if (error) throw error;

      // Update local state
      setMeals(meals.filter((meal) => meal.id !== mealId));
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  // Group meals by date
  const mealsByDate = meals.reduce((acc: any, meal) => {
    if (!acc[meal.date]) {
      acc[meal.date] = [];
    }
    acc[meal.date].push(meal);
    return acc;
  }, {});

  // Filter meals by type
  const filteredMealsByDate = () => {
    if (filter === "all") return mealsByDate;

    const filtered: any = {};

    Object.entries(mealsByDate).forEach(
      ([date, mealsForDate]: [string, any]) => {
        const filteredMeals = mealsForDate.filter((meal: any) => {
          if (filter === "breakfast")
            return meal.title.toLowerCase() === "breakfast";
          if (filter === "lunch") return meal.title.toLowerCase() === "lunch";
          if (filter === "dinner") return meal.title.toLowerCase() === "dinner";
          return true;
        });

        if (filteredMeals.length > 0) {
          filtered[date] = filteredMeals;
        }
      },
    );

    return filtered;
  };

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <main className="w-full bg-gray-50 min-h-screen pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Meal History</h1>
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Meal History</h1>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All Meals
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("breakfast")}>
                  Breakfast
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("lunch")}>
                  Lunch
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("dinner")}>
                  Dinner
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="list" className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-4">
              {Object.keys(filteredMealsByDate()).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(filteredMealsByDate()).map(
                    ([date, meals]: [string, any]) => (
                      <div
                        key={date}
                        className="bg-white rounded-xl p-6 border shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <CalendarIcon className="text-green-600" />
                          <h2 className="text-xl font-semibold">
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </h2>
                        </div>

                        <div className="space-y-4">
                          {meals.map((meal: MealItem) => (
                            <div
                              key={meal.id}
                              className="flex flex-col md:flex-row gap-4 border-t pt-4"
                            >
                              <div className="w-full md:w-1/4 lg:w-1/5">
                                <div className="aspect-square relative rounded-lg overflow-hidden">
                                  <Image
                                    src={meal.image_url || meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
                                    alt={meal.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    className="object-cover"
                                  />
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="text-lg font-medium">
                                      {meal.title}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                      <Clock className="w-4 h-4 mr-1" />
                                      <span>{meal.time}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-right">
                                      <div className="text-lg font-semibold">
                                        {meal.calories} cal
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-gray-400 hover:text-red-500"
                                      onClick={() => deleteMeal(meal.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-4">
                                  <div className="bg-blue-50 p-2 rounded text-center">
                                    <div className="text-sm text-gray-500">
                                      Protein
                                    </div>
                                    <div className="font-medium">
                                      {meal.protein}g
                                    </div>
                                  </div>
                                  <div className="bg-amber-50 p-2 rounded text-center">
                                    <div className="text-sm text-gray-500">
                                      Carbs
                                    </div>
                                    <div className="font-medium">
                                      {meal.carbs}g
                                    </div>
                                  </div>
                                  <div className="bg-purple-50 p-2 rounded text-center">
                                    <div className="text-sm text-gray-500">
                                      Fat
                                    </div>
                                    <div className="font-medium">
                                      {meal.fat}g
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 border shadow-sm text-center">
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Utensils className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    No meal history yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start tracking your meals to see your history here
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard/upload")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Analyze Food
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="calendar" className="mt-4">
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Calendar view coming soon!
                  </p>
                  <p className="text-sm text-gray-500">
                    This feature is under development.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
