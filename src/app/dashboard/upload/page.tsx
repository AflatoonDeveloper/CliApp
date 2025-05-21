"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Camera, Upload, X, Loader2, Save, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../../supabase/client";
import { AnalysisResult } from "@/types/food";
import { useRouter } from "next/navigation";
import { analyzeFoodImage } from "@/utils/gemini";
import { Progress } from "@/components/ui/progress";

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResults(null);
      setError(null);
      setSaved(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResults(null);
      setError(null);
      setSaved(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearImage = () => {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResults(null);
    setError(null);
    setSaved(false);
  };

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        const base64Image = reader.result?.toString().split(",")[1] || "";

        try {
          // Call the Gemini API through our utility function
          const analysisResult = await analyzeFoodImage(base64Image);
          setResults(analysisResult);
          setProgress(100);

          // Simulate uploading to storage
          // In a real implementation, we would upload the image to Supabase Storage
          // const { data: uploadData, error: uploadError } = await supabase.storage
          //   .from('food-images')
          //   .upload(`${Date.now()}-${image.name}`, image);

          // if (uploadError) throw uploadError;
          // const imageUrl = supabase.storage.from('food-images').getPublicUrl(uploadData.path).data.publicUrl;
        } catch (err) {
          console.error(err);
          setError("Failed to analyze image. Please try again.");
        } finally {
          clearInterval(progressInterval);
          setLoading(false);
          setAnalyzing(false);
        }
      };

      reader.onerror = () => {
        setError("Failed to read image file. Please try again.");
        clearInterval(progressInterval);
        setLoading(false);
        setAnalyzing(false);
      };
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const saveMeal = async () => {
    if (!results) return;

    setLoading(true);

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // In a real implementation, we would save the meal to the database
      const { data: mealData, error: mealError } = await supabase
        .from("meals")
        .insert({
          user_id: user.id,
          title: "Lunch",
          image_url: preview || undefined,
          total_calories: results.totalNutrition.calories,
          total_protein_grams: results.totalNutrition.protein,
          total_carbs_grams: results.totalNutrition.carbs,
          total_fat_grams: results.totalNutrition.fat,
        })
        .select();

      if (mealError) throw mealError;

      // Save each food item and create meal_items relationships
      if (mealData && mealData.length > 0) {
        const mealId = mealData[0].id;

        // Insert food items
        for (const item of results.foodItems) {
          const { data: foodItemData, error: foodItemError } = await supabase
            .from("food_items")
            .insert({
              user_id: user.id,
              name: item.name,
              calories: item.calories,
              protein_grams: item.protein,
              carbs_grams: item.carbs,
              fat_grams: item.fat,
            })
            .select();

          if (foodItemError) throw foodItemError;

          if (foodItemData && foodItemData.length > 0) {
            // Create relationship in meal_items
            const { error: mealItemError } = await supabase
              .from("meal_items")
              .insert({
                meal_id: mealId,
                food_item_id: foodItemData[0].id,
                quantity: 1,
              });

            if (mealItemError) throw mealItemError;
          }
        }
      }

      setSaved(true);

      // Redirect to history page after a short delay
      setTimeout(() => {
        router.push("/dashboard/history");
      }, 1500);
    } catch (err) {
      setError("Failed to save meal. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <h1 className="text-3xl font-bold mb-6">Analyze Food Image</h1>

        {!preview ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Camera className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-medium mb-1">
                  Drag & drop an image or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, WEBP
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-4 border">
              <div className="relative">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={preview}
                    alt="Food preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                {analyzing && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Analyzing with Google Gemini AI...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {!results ? (
                  <Button
                    onClick={analyzeImage}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>Analyze Image</>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={saveMeal}
                    disabled={loading || saved}
                    className={`w-full ${saved ? "bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : saved ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save to Meal History
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {results && (
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <h2 className="text-xl font-semibold mb-4">
                    Analysis Results
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">
                      Identified Food Items
                    </h3>
                    <div className="space-y-3">
                      {results.foodItems.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500">
                              {item.calories} cal
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                            <div>Protein: {item.protein}g</div>
                            <div>Carbs: {item.carbs}g</div>
                            <div>Fat: {item.fat}g</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">
                      Total Nutrition
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {results.totalNutrition.calories}
                        </div>
                        <div className="text-sm text-green-600">Calories</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-700">
                          {results.totalNutrition.protein}g
                        </div>
                        <div className="text-sm text-blue-600">Protein</div>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-700">
                          {results.totalNutrition.carbs}g
                        </div>
                        <div className="text-sm text-amber-600">Carbs</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-700">
                          {results.totalNutrition.fat}g
                        </div>
                        <div className="text-sm text-purple-600">Fat</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
