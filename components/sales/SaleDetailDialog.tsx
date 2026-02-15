import { useState, useEffect } from "react";
import type { Sale } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, QrCode, Trash2 } from "lucide-react";
import { useSales } from "@/context/SalesContext";
import { toast } from "sonner";

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
  const { deleteSale, updateSale } = useSales();
  const [deliveryStatus, setDeliveryStatus] = useState(
    sale?.deliveryStatus || "Pending",
  );
  const [salesStatus, setSalesStatus] = useState(
    sale?.salesStatus || "Pending",
  );

  // Sync local state with prop changes
  useEffect(() => {
    if (sale) {
      setDeliveryStatus(sale.deliveryStatus || "Pending");
      setSalesStatus(sale.salesStatus || "Pending");
    }
  }, [sale]);

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

  const handleStatusChange = async (
    field: "deliveryStatus" | "salesStatus",
    value: string,
  ) => {
    if (!sale) return;

    // Update local state immediately for optimistic UI
    if (field === "deliveryStatus") {
      setDeliveryStatus(value as typeof deliveryStatus);
    } else {
      setSalesStatus(value as typeof salesStatus);
    }

    try {
      await updateSale(sale.id, { [field]: value });
      toast.success("Status Updated");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
      // Revert on error
      if (field === "deliveryStatus") {
        setDeliveryStatus(sale.deliveryStatus || "Pending");
      } else {
        setSalesStatus(sale.salesStatus || "Pending");
      }
    }
  };

  if (!sale) return null;

  const content = (
    <div className="space-y-4 mx-auto w-full">
      <div className="grid grid-cols-2 gap-4">
        <p className="font-medium">{sale.orderId || "N/A"}</p>
        <p className="font-medium">{sale.salesman || "N/A"}</p>
      </div>
      <Separator />
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-sm">Delivery Status</span>
          <Select
            value={deliveryStatus}
            onValueChange={(value) =>
              handleStatusChange("deliveryStatus", value!)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <span className="text-sm">Sales Status</span>
          <Select
            value={salesStatus}
            onValueChange={(value) => handleStatusChange("salesStatus", value!)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm">Sale Details</DialogTitle>
          <DialogDescription>
            {new Date(sale.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        {content}
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
