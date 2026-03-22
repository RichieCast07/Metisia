export enum PaymentMethod {
  EFECTIVO = 'efectivo',
  TARJETA = 'tarjeta',
  TRANSFERENCIA = 'transferencia',
  MIXTO = 'mixto',
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  businessId: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  workerId?: string;
  promotionId?: string;
  cashRegisterId: string;
  notes?: string;
  createdAt: Date;
}
