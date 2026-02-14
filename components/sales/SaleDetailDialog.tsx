import type { Sale } from "@/lib/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DollarSign, QrCode } from "lucide-react";

interface SaleDetailDialogProps {
  sale: Sale | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SaleDetailDialog({
  sale,
  isOpen,
  onOpenChange,
}: SaleDetailDialogProps) {
  if (!sale) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="px-2 pb-8">
        <DrawerHeader>
          <DrawerTitle className="text-sm">Sale Details</DrawerTitle>
          <DrawerDescription>
            {new Date(sale.timestamp).toLocaleString()}
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 mx-auto">
          <div className="space-y-2">
            {sale.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center w-xs md:w-md"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} x RM{item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold">
                  RM {(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <Badge variant={"secondary"} className="capitalize">
                {sale.paymentMethod === "QR Pay" ? (
                  <QrCode className="mr-1 h-3 w-3" />
                ) : (
                  <DollarSign className="mr-1 h-3 w-3" />
                )}
                {sale.paymentMethod}
              </Badge>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>RM {sale.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
