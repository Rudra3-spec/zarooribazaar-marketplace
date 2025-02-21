import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Product } from "@shared/schema";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

  return (
    <Card>
      <CardHeader className="p-0">
        <AspectRatio ratio={4/3}>
          <img
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-full rounded-t-lg"
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
        <p className="text-sm line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="font-semibold">₹{product.price}</p>
      </CardFooter>
    </Card>
  );
}
