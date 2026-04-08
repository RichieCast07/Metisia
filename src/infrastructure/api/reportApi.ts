import { apiClient } from './apiClient';

export interface DailyReportResponse {
  total_ventas: number;
  total_gastos: number;
  ganancia: number;
}

export interface PaymentMethodsResponse {
  data: Record<string, number>;
}

export interface TopProductsResponse {
  products: [string, number][];
}

export const reportApi = {
  daily: (day: string) =>
    apiClient.get<DailyReportResponse>(`/reports/daily?day=${day}`),
  paymentMethods: (start: string, end: string) =>
    apiClient.get<PaymentMethodsResponse>(`/reports/payment-methods?start=${start}&end=${end}`),
  topProducts: (start: string, end: string, limit = 10) =>
    apiClient.get<TopProductsResponse>(`/reports/top-products?start=${start}&end=${end}&limit=${limit}`),
};
