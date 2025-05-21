"use client";

import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "../../../../supabase/client";
import { Calendar, Clock, Utensils, Trash2, Filter } from "lucide-react";
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

      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase
      //   .from('meals')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .order('created_at', { ascending: false });

      // if (error) throw error;

      // For now, use mock data
      const mockMeals = [
        {
          id: "1",
          date: "2023-06-15",
          time: "12:30 PM",
          title: "Lunch",
          calories: 550,
          protein: 32,
          carbs: 45,
          fat: 22,
          image:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        },
        {
          id: "2",
          date: "2023-06-15",
          time: "7:00 PM",
          title: "Dinner",
          calories: 680,
          protein: 42,
          carbs: 55,
          fat: 25,
          image:
            "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
        },
        {
          id: "3",
          date: "2023-06-14",
          time: "8:15 AM",
          title: "Breakfast",
          calories: 420,
          protein: 22,
          carbs: 48,
          fat: 16,
          image:
            "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80",
        },
        {
          id: "4",
          date: "2023-06-13",
          time: "1:00 PM",
          title: "Lunch",
          calories: 520,
          protein: 35,
          carbs: 40,
          fat: 18,
          image:
            "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80",
        },
        {
          id: "5",
          date: "2023-06-12",
          time: "6:45 PM",
          title: "Dinner",
          calories: 720,
          protein: 45,
          carbs: 60,
          fat: 28,
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
        },
      ];

      setMeals(mockMeals);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      // In a real implementation, we would delete from the database
      // const { error } = await supabase
      //   .from('meals')
      //   .delete()
      //   .eq('id', mealId);

      // if (error) throw error;

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
                          <Calendar className="text-green-600" />
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
                                    src={meal.image}
                                    alt={meal.title}
                                    fill
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
