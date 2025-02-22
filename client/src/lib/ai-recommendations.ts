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
    // Check if API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, skipping recommendations");
      return [];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: "You are a product recommendation expert. Based on the user's search history, recommend relevant products from the available catalog."
        },
        {
          role: "user",
          content: `Based on these recent searches: ${searchHistory.join(", ")}, recommend relevant products from this catalog: ${JSON.stringify(currentProducts)}. Return only the IDs of recommended products in a JSON array.`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Safety check for null content
    if (!response.choices[0].message.content) {
      return [];
    }

    const result = JSON.parse(response.choices[0].message.content);
    const recommendedIds = result.recommendedProducts || [];

    return currentProducts.filter(product => recommendedIds.includes(product.id));
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    return [];
  }
}