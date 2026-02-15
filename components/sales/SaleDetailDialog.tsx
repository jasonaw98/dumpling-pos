import type { Sale } from "@/lib/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, QrCode, Trash2 } from "lucide-react";
import { useSales } from "@/context/SalesContext";
import { toast } from "sonner";
import { useIsMobile } from "@/lib/use-mobile";

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
  const isMobile = useIsMobile();
  const { deleteSale } = useSales();

  const handleDelete = async () => {
    if (!sale) return;

    if (
      window.confirm(
        "Are you sure you want to delete this sale? This action cannot be undone.",
      )
    ) {
      try {
        await deleteSale(sale.id);
        toast.success("Sale Deleted");
        onOpenChange(false);
      } catch (error) {
        toast.error("Failed to delete sale");
        console.error(error);
      }
    }
  };

  if (!sale) return null;

  return isMobile ? (
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
        <DrawerFooter className="pt-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Sale
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm">Sale Details</DialogTitle>
          <DialogDescription>
            {new Date(sale.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mx-auto w-full">
          <div className="space-y-2">
            {sale.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
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
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
