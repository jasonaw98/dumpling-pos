"use client";

import { useState, useMemo } from "react";
import type {
  CartItem as CartItemType,
  PaymentMethod,
  SaleItem,
} from "@/lib/types";
import { PRODUCTS } from "@/lib/products";
import { useSales } from "@/context/SalesContext";
import { ProductCard } from "./ProductCard";
import { CartItem } from "./CartItem";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingCart, CreditCard, DollarSign } from "lucide-react";
import { toast } from "sonner";

export function NewSale() {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Card");
  const { addSale } = useSales();

  const handleAddToCart = (productId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      const product = PRODUCTS.find((p) => p.id === productId);
      return product ? [...prevCart, { ...product, quantity: 1 }] : prevCart;
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast.warning("Empty Cart", {
        description:
          "Please add products to the cart before completing the sale.",
      });
      return;
    }

    const itemsToSave: SaleItem[] = cart.map(
      ({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity,
      }),
    );

    addSale({
      items: itemsToSave,
      total: totalAmount,
      paymentMethod,
    });

    toast.success("Sale Completed", {
      description: `Total: RM${totalAmount.toFixed(2)} paid with ${paymentMethod}.`,
    });

    setCart([]);
  };

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
      <Card className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 p-2">
        <CardHeader>
          <CardTitle>Dumplings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Current Sale</span>
          </CardTitle>
          <CardDescription>{cart.length} item(s) in cart</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 pt-0">
            {cart.length > 0 ? (
              cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveFromCart}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10">
                <ShoppingCart className="h-10 w-10 mb-2" />
                <p>Your cart is empty</p>
                <p className="text-xs">Add products to get started</p>
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <>
              <Separator />
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>RM {totalAmount.toFixed(2)}</span>
                </div>
                <div>
                  <Label className="mb-2 block">Payment Method</Label>
                  <RadioGroup
                    defaultValue="Card"
                    className="grid grid-cols-2 gap-4"
                    onValueChange={(value: string) =>
                      setPaymentMethod(value as PaymentMethod)
                    }
                  >
                    <div>
                      <RadioGroupItem
                        value="Card"
                        id="card"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        Card
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="Cash"
                        id="cash"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="cash"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <DollarSign className="mb-3 h-6 w-6" />
                        Cash
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </>
          )}
        </CardContent>
        {cart.length > 0 && (
          <CardFooter>
            <Button onClick={handleCompleteSale} className="w-full">
              Complete Sale
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
