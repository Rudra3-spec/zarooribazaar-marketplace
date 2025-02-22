import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { Product } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

export default function ProductListings() {
  const [searchTerm, setSearchTerm] = useState("");

  // Add sample products for testing
  const sampleProducts: Product[] = [
    {
      id: 1,
      userId: 1,
      name: "Handmade Leather Bag",
      description: "Beautiful handcrafted leather bag made with genuine materials",
      price: "2999",
      category: "Accessories",
      quantity: 5,
      location: "Mumbai",
      tags: ["handmade", "leather", "premium"],
      isFeatured: true,
      shipping: {
        policy: "Free shipping",
        cost: 0,
        estimatedDays: 3
      },
      returnPolicy: "30-day returns accepted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      userId: 1,
      name: "Organic Cotton T-shirt",
      description: "100% organic cotton t-shirt, environmentally friendly",
      price: "899",
      category: "Clothing",
      quantity: 20,
      location: "Delhi",
      tags: ["organic", "sustainable", "fashion"],
      discount: {
        percentage: 20,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      userId: 1,
      name: "Handwoven Silk Saree",
      description: "Traditional handwoven silk saree with intricate designs",
      price: "5999",
      category: "Clothing",
      quantity: 3,
      location: "Varanasi",
      tags: ["handwoven", "silk", "traditional"],
      isFeatured: true,
      shipping: {
        policy: "Insured shipping",
        cost: 299,
        estimatedDays: 5
      },
      returnPolicy: "7-day returns for unworn items",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const { data: products = sampleProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    initialData: sampleProducts // Use sample data initially
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}