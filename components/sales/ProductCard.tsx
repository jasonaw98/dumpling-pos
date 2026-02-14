import type { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card
      className="flex flex-col aspect-video justify-center items-center text-center transition-all hover:shadow-md cursor-pointer active:scale-95 hover:bg-zinc-100 active:shadow-lg active:bg-zinc-200"
      onClick={onAddToCart}
    >
      <CardContent className="flex-1 flex flex-col justify-center items-center gap-2">
        <p className="font-semibold md:text-lg">{product.name}</p>
        <p className="text-xs font-semibold">RM {product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
