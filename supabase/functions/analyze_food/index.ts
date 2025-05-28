import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Type declarations
declare global {
  namespace Express {
    interface Request {
      headers: {
        authorization?: string;
      };
      body: any;
    }
  }
}

// Gemini API response types
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const app = express();
app.use(cors());
app.use(express.json());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

app.post('/analyze', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const supabaseClient = createClient(
      process.env.SUPABASE_URL ?? "",
      process.env.SUPABASE_ANON_KEY ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { imageBase64, userId } = req.body as FoodAnalysisRequest;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBF5NAnAvzuKKeKmGijZJKfr3vLHIiZTow";
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

      const data = await response.json() as GeminiResponse;
      const textResponse = data.candidates[0].content.parts[0].text;

      const jsonMatch =
        textResponse.match(/```json\n([\s\S]*)\n```/) ||
        textResponse.match(/```([\s\S]*)```/) ||
        textResponse.match(/{[\s\S]*}/);

      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textResponse;

      try {
        let parsedResult;
        try {
          parsedResult = JSON.parse(jsonString.replace(/```json|```/g, "").trim());
        } catch (jsonParseError) {
          console.error("Error parsing JSON response:", jsonParseError);
          console.log("Raw response:", textResponse);
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

        const analysisResult: AnalysisResult = {
          foodItems: parsedResult.foodItems || [],
          totalNutrition: parsedResult.totalNutrition || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          },
        };

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

        return res.status(200).json(analysisResult);
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
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
