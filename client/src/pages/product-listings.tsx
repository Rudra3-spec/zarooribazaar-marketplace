import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { Product } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getProductRecommendations } from "@/lib/ai-recommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update search history when user searches
  useEffect(() => {
    if (searchTerm.trim() && !searchHistory.includes(searchTerm)) {
      const updatedHistory = [...searchHistory, searchTerm].slice(-5); // Keep last 5 searches
      setSearchHistory(updatedHistory);
    }
  }, [searchTerm]);

  // Get AI recommendations when search history changes
  useEffect(() => {
    async function updateRecommendations() {
      if (products && searchHistory.length > 0) {
        try {
          setIsLoadingRecommendations(true);
          const recommendedProducts = await getProductRecommendations(searchHistory, products);
          setRecommendations(recommendedProducts);
        } catch (error) {
          console.error("Failed to get recommendations:", error);
          setRecommendations([]);
        } finally {
          setIsLoadingRecommendations(false);
        }
      }
    }
    updateRecommendations();
  }, [searchHistory, products]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Product Listings</h1>
        <p className="text-muted-foreground">
          Browse products and services from MSMEs across India
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search products by name or category..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {(recommendations.length > 0 || isLoadingRecommendations) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRecommendations ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((product) => (
                  <ProductCard key={`rec-${product.id}`} product={product} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}