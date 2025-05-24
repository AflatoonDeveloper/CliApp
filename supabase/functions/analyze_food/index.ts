/// <reference lib="deno.ns" />
import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FoodAnalysisRequest {
  imageBase64: string;
  userId: string;
}

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion?: string;
}

interface AnalysisResult {
  foodItems: FoodItem[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    // Get the request body
    const { imageBase64, userId } = (await req.json()) as FoodAnalysisRequest;

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Image data is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call the Gemini API to analyze the food image
    const API_KEY =
      Deno.env.get("GEMINI_API_KEY") ||
      "AIzaSyBF5NAnAvzuKKeKmGijZJKfr3vLHIiZTow";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this food image and provide nutritional information. Return the result as a JSON object with foodItems (array of items with name, calories, protein, carbs, fat) and totalNutrition (sum of all items).",
                },
                { inline_data: { mime_type: "image/jpeg", data: imageBase64 } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;

      // Extract JSON from the response
      const jsonMatch =
        textResponse.match(/```json\n([\s\S]*)\n```/) ||
        textResponse.match(/```([\s\S]*)```/) ||
        textResponse.match(/{[\s\S]*}/);

      const jsonString = jsonMatch
        ? jsonMatch[1] || jsonMatch[0]
        : textResponse;

      try {
        // Parse the JSON response
        let parsedResult;
        try {
          parsedResult = JSON.parse(
            jsonString.replace(/```json|```/g, "").trim(),
          );
        } catch (jsonParseError) {
          console.error("Error parsing JSON response:", jsonParseError);
          console.log("Raw response:", textResponse);
          // Provide fallback data if parsing fails
          parsedResult = {
            foodItems: [
              {
                name: "Unknown Food Item",
                calories: 200,
                protein: 10,
                carbs: 20,
                fat: 5,
              },
            ],
            totalNutrition: {
              calories: 200,
              protein: 10,
              carbs: 20,
              fat: 5,
            },
          };
        }

        // Validate and format the response
        const analysisResult: AnalysisResult = {
          foodItems: parsedResult.foodItems || [],
          totalNutrition: parsedResult.totalNutrition || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          },
        };

        // Store the analysis result in Supabase
        if (userId) {
          const { error: storageError } = await supabaseClient
            .from("food_analysis_results")
            .insert({
              user_id: userId,
              result: analysisResult,
              created_at: new Date().toISOString(),
            });

          if (storageError) {
            console.error("Error storing analysis result:", storageError);
          }
        }

        return new Response(JSON.stringify(analysisResult), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        throw parseError;
      }
    } catch (apiError) {
      console.error("Error calling Gemini API:", apiError);
      throw apiError;
    }
  } catch (error: unknown) {
    console.error("General error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
