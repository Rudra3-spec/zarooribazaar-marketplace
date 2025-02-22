import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Product } from "@shared/schema";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MapPin, Tag, Truck, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { addItem, items } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addCount, setAddCount] = useState(0);
  const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

  // Get current quantity of this product in cart
  const cartQuantity = items.find(item => item.product.id === product.id)?.quantity || 0;

  const discountedPrice = product.discount 
    ? Number(product.price) * (1 - product.discount.percentage / 100)
    : Number(product.price);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (addCount > 0) {
      timeout = setTimeout(() => {
        setAddCount(0);
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [addCount]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addItem(product);
      setAddCount(prev => prev + 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card className="group overflow-hidden relative">
      <CardHeader className="p-0">
        <AspectRatio ratio={4/3}>
          <img
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-full rounded-t-lg transition-transform group-hover:scale-105"
          />
          {product.discount && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              {product.discount.percentage}% OFF
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="absolute top-2 left-2">Featured</Badge>
          )}
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="flex items-center gap-1">
            <p className={product.discount ? "text-sm line-through text-muted-foreground" : "text-lg font-semibold"}>
              ₹{product.price}
            </p>
            {product.discount && (
              <p className="text-lg font-semibold text-red-500">
                ₹{discountedPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{product.location}</span>
        </div>

        <p className="text-sm line-clamp-2 mb-3">{product.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>

        {product.shipping && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Truck className="h-4 w-4" />
            <span>Shipping in {product.shipping.estimatedDays} days</span>
          </div>
        )}

        {product.returnPolicy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <RefreshCcw className="h-4 w-4" />
            <span>{product.returnPolicy}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full relative" 
          onClick={handleAddToCart}
          disabled={isAddingToCart || (product.quantity === 0)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.quantity === 0 ? "Out of Stock" : (
            <>
              {isAddingToCart ? "Adding..." : "Add to Cart"}
              {cartQuantity > 0 && !isAddingToCart && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {cartQuantity}
                </span>
              )}
              {addCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm animate-in zoom-in-75 duration-300">
                  +{addCount}
                </span>
              )}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}