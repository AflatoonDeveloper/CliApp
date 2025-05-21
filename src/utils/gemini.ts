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
    // In a real implementation, we would call the Gemini API here
    // For now, we'll simulate the API call with a timeout and mock data
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock response data
    return {
      foodItems: [
        {
          name: "Grilled Chicken Breast",
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          portion: "100g",
        },
        {
          name: "Brown Rice",
          calories: 112,
          protein: 2.6,
          carbs: 23.5,
          fat: 0.9,
          portion: "100g",
        },
        {
          name: "Steamed Broccoli",
          calories: 55,
          protein: 3.7,
          carbs: 11.2,
          fat: 0.6,
          portion: "100g",
        },
      ],
      totalNutrition: {
        calories: 332,
        protein: 37.3,
        carbs: 34.7,
        fat: 5.1,
      },
    };

    // In a real implementation with the Gemini API, it would look something like this:
    /*
    const API_KEY = "AIzaSyBF5NAnAvzuKKeKmGijZJKfr3vLHIiZTow";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${API_KEY}`;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Analyze this food image and provide nutritional information. Return the result as a JSON object with foodItems (array of items with name, calories, protein, carbs, fat) and totalNutrition (sum of all items)." },
            { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 4096
        }
      })
    });

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = textResponse.match(/```json\n([\s\S]*)\n```/) || 
                      textResponse.match(/```([\s\S]*)```/) || 
                      textResponse.match(/{[\s\S]*}/); 
                      
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textResponse;
    
    // Parse the JSON response
    const parsedResult = JSON.parse(jsonString.replace(/```json|```/g, '').trim());
    
    // Validate and format the response
    return {
      foodItems: parsedResult.foodItems || [],
      totalNutrition: parsedResult.totalNutrition || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    };
    */
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze food image. Please try again.");
  }
}
