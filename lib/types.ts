export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SaleItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export type PaymentMethod = "Cash" | "QR Pay";
export type DeliveryStatus = "Pending" | "Delivered" | "Cancelled";
export type SalesStatus = "Pending" | "Completed" | "Refunded" | "Cancelled";

export interface Sale {
  id: string;
  orderId: string;
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  salesman: string;
  deliveryStatus: DeliveryStatus;
  salesStatus: SalesStatus;
  timestamp: string;
}
