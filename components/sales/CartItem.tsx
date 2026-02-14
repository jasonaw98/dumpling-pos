import type { CartItem as CartItemType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      onRemove(item.id);
    } else {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm font-semibold">{item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => handleQuantityChange(-1)}
          aria-label="Decrease quantity"
        >
          {item.quantity > 1 ? <Minus className="h-4 w-4" /> : <Trash2 className="h-4 w-4 text-destructive" />}
        </Button>
        <span className="w-6 text-center font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => handleQuantityChange(1)}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="w-16 text-right font-semibold">
        {(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  );
}
