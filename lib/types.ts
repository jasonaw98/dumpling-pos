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

export type PaymentMethod = 'Cash' | 'QR Pay';

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
}
