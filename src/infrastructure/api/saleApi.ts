import { apiClient } from './apiClient';

export interface ApiSaleItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface ApiSale {
  id: string;
  business_id: string;
  worker_id?: string | null;
  promotion_id?: string | null;
  cash_register_id: string;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string;
  notes?: string | null;
  created_at: string;
  items: ApiSaleItem[];
  participations?: { worker_id: string; percentage: number }[];
}

export interface CreateSaleBody {
  worker_id?: string | null;
  promotion_id?: string | null;
  cash_register_id: string;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string;
  notes?: string | null;
  items: ApiSaleItem[];
  participations?: { worker_id: string; percentage: number }[];
}

export const saleApi = {
  list: () => apiClient.get<ApiSale[]>('/sales/'),
  get: (id: string) => apiClient.get<ApiSale>(`/sales/${id}`),
  create: (body: CreateSaleBody) => apiClient.post<ApiSale>('/sales/', body),
};
