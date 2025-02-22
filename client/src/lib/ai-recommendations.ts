import OpenAI from "openai";
import { Product } from "@shared/schema";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getProductRecommendations(
  searchHistory: string[],
  currentProducts: Product[]
): Promise<Product[]> {
  try {
    // Skip recommendations if no search history or products
    if (!searchHistory.length || !currentProducts.length) {
      return [];
    }

    // Check if API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.warn("OpenAI API key not found in VITE_OPENAI_API_KEY. Please add it to your environment variables.");
      return [];
    }

    const response = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a product recommendation expert. Based on the user's search history, recommend relevant products from the available catalog. Return recommendations in JSON format with an array of product IDs."
        },
        {
          role: "user",
          content: `Based on these recent searches: ${searchHistory.join(", ")}, recommend relevant products from this catalog: ${JSON.stringify(currentProducts)}. Return only the IDs of recommended products in a JSON array format like this: { "recommendedProducts": [1, 2, 3] }`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse response and get recommended product IDs
    const result = JSON.parse(response.choices[0].message.content || "{}");
    const recommendedIds = result.recommendedProducts || [];

    // Filter current products to only include recommended ones
    return currentProducts.filter(product => recommendedIds.includes(product.id));
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    return [];
  }
}