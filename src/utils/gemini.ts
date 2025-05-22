// This is a utility file for interacting with Google's Gemini API

export interface FoodAnalysisResult {
  foodItems: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    portion?: string;
  }[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export async function analyzeFoodImage(
  imageBase64: string,
): Promise<FoodAnalysisResult> {
  try {
    // Real implementation using Gemini API
    const API_KEY =
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "AIzaSyBF5NAnAvzuKKeKmGijZJKfr3vLHIiZTow";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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

    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textResponse;

    // Parse the JSON response
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonString.replace(/```json|```/g, "").trim());
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
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
    return {
      foodItems: parsedResult.foodItems || [],
      totalNutrition: parsedResult.totalNutrition || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    };
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze food image. Please try again.");
  }
}
