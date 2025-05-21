"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Utensils,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for charts
const mockDailyData = [
  { day: "Mon", calories: 1850, protein: 96, carbs: 148, fat: 63 },
  { day: "Tue", calories: 2100, protein: 110, carbs: 160, fat: 70 },
  { day: "Wed", calories: 1750, protein: 90, carbs: 140, fat: 60 },
  { day: "Thu", calories: 1900, protein: 100, carbs: 150, fat: 65 },
  { day: "Fri", calories: 2200, protein: 115, carbs: 170, fat: 75 },
  { day: "Sat", calories: 1800, protein: 95, carbs: 145, fat: 62 },
  { day: "Sun", calories: 1950, protein: 102, carbs: 155, fat: 67 },
];

export default function InsightsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(true); // Set to true to show mock data
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
      setLoading(false);
    }
    getUser();
  }, [router, supabase]);

  // Calculate averages and trends
  const calculateAverages = () => {
    const totalCalories = mockDailyData.reduce(
      (sum, day) => sum + day.calories,
      0,
    );
    const totalProtein = mockDailyData.reduce(
      (sum, day) => sum + day.protein,
      0,
    );
    const totalCarbs = mockDailyData.reduce((sum, day) => sum + day.carbs, 0);
    const totalFat = mockDailyData.reduce((sum, day) => sum + day.fat, 0);

    return {
      avgCalories: Math.round(totalCalories / mockDailyData.length),
      avgProtein: Math.round(totalProtein / mockDailyData.length),
      avgCarbs: Math.round(totalCarbs / mockDailyData.length),
      avgFat: Math.round(totalFat / mockDailyData.length),
    };
  };

  const averages = calculateAverages();

  // Calculate trends (comparing last day to average)
  const calculateTrends = () => {
    const lastDay = mockDailyData[mockDailyData.length - 1];

    return {
      caloriesTrend: (
        ((lastDay.calories - averages.avgCalories) / averages.avgCalories) *
        100
      ).toFixed(1),
      proteinTrend: (
        ((lastDay.protein - averages.avgProtein) / averages.avgProtein) *
        100
      ).toFixed(1),
      carbsTrend: (
        ((lastDay.carbs - averages.avgCarbs) / averages.avgCarbs) *
        100
      ).toFixed(1),
      fatTrend: (
        ((lastDay.fat - averages.avgFat) / averages.avgFat) *
        100
      ).toFixed(1),
    };
  };

  const trends = calculateTrends();

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <main className="w-full bg-gray-50 min-h-screen pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Nutrition Insights</h1>
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
          <h1 className="text-3xl font-bold mb-6">Nutrition Insights</h1>

          {hasData ? (
            <Tabs defaultValue="weekly" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Calories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {mockDailyData[mockDailyData.length - 1].calories}
                      </div>
                      <div className="flex items-center text-xs">
                        {parseFloat(trends.caloriesTrend) > 0 ? (
                          <>
                            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-500">
                              {trends.caloriesTrend}% from average
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDown className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-blue-500">
                              {Math.abs(parseFloat(trends.caloriesTrend))}% from
                              average
                            </span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Protein
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {mockDailyData[mockDailyData.length - 1].protein}g
                      </div>
                      <div className="flex items-center text-xs">
                        {parseFloat(trends.proteinTrend) > 0 ? (
                          <>
                            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-500">
                              {trends.proteinTrend}% from average
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDown className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-blue-500">
                              {Math.abs(parseFloat(trends.proteinTrend))}% from
                              average
                            </span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Carbs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {mockDailyData[mockDailyData.length - 1].carbs}g
                      </div>
                      <div className="flex items-center text-xs">
                        {parseFloat(trends.carbsTrend) > 0 ? (
                          <>
                            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-500">
                              {trends.carbsTrend}% from average
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDown className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-blue-500">
                              {Math.abs(parseFloat(trends.carbsTrend))}% from
                              average
                            </span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Fat</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {mockDailyData[mockDailyData.length - 1].fat}g
                      </div>
                      <div className="flex items-center text-xs">
                        {parseFloat(trends.fatTrend) > 0 ? (
                          <>
                            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-500">
                              {trends.fatTrend}% from average
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDown className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-blue-500">
                              {Math.abs(parseFloat(trends.fatTrend))}% from
                              average
                            </span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Calorie Breakdown</CardTitle>
                      <CardDescription>Distribution by meal</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <div className="h-full flex flex-col justify-center">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Breakfast</span>
                              <span>420 cal (22%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: "22%" }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Lunch</span>
                              <span>680 cal (35%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: "35%" }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Dinner</span>
                              <span>750 cal (38%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-purple-600 h-2.5 rounded-full"
                                style={{ width: "38%" }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Snacks</span>
                              <span>100 cal (5%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-amber-600 h-2.5 rounded-full"
                                style={{ width: "5%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Macronutrient Balance</CardTitle>
                      <CardDescription>
                        Protein, carbs, and fat distribution
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <div className="h-full flex flex-col justify-center">
                        <div className="relative h-64 w-64 mx-auto">
                          {/* Simple pie chart visualization */}
                          <div className="absolute inset-0 rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 w-full h-full bg-blue-500"
                              style={{
                                clipPath:
                                  "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)",
                              }}
                            ></div>
                            <div
                              className="absolute top-0 left-0 w-full h-full bg-green-500"
                              style={{
                                clipPath:
                                  "polygon(50% 50%, 100% 0%, 100% 100%, 50% 100%)",
                              }}
                            ></div>
                            <div
                              className="absolute top-0 left-0 w-full h-full bg-purple-500"
                              style={{
                                clipPath:
                                  "polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)",
                              }}
                            ></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white h-40 w-40 mx-auto my-12"></div>
                        </div>
                        <div className="flex justify-center space-x-6 mt-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-sm">Protein (30%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Carbs (45%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-sm">Fat (25%)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Calorie Trend</CardTitle>
                    <CardDescription>Last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <div className="h-full flex items-end justify-between px-2">
                      {mockDailyData.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="bg-green-500 w-8 rounded-t-md"
                            style={{
                              height: `${(day.calories / 2500) * 180}px`,
                            }}
                          ></div>
                          <span className="text-xs mt-2">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="weekly" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Avg. Daily Calories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {averages.avgCalories}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +5% from last week
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Avg. Daily Protein
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {averages.avgProtein}g
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +3% from last week
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Avg. Daily Carbs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {averages.avgCarbs}g
                      </div>
                      <p className="text-xs text-muted-foreground">
                        -2% from last week
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Avg. Daily Fat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {averages.avgFat}g
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +1% from last week
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Summary</CardTitle>
                    <CardDescription>
                      Nutrition overview for this week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        Detailed weekly charts coming soon!
                      </p>
                      <p className="text-sm text-gray-500">
                        This feature is under development.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monthly" className="space-y-6">
                <div className="flex h-64 items-center justify-center text-gray-500 bg-white rounded-xl border">
                  Monthly data visualization coming soon!
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="bg-white rounded-xl p-8 border shadow-sm text-center">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                No insights available yet
              </h3>
              <p className="text-gray-600 mb-4">
                Track your meals to start seeing nutrition insights
              </p>
              <Button
                onClick={() => router.push("/dashboard/upload")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Analyze Food
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
