import { apiClient } from './apiClient';

export interface ApiCashRegister {
  id: string;
  business_id: string;
  status: string;
  opening_amount: number;
  closing_amount?: number | null;
  opened_at: string;
  closed_at?: string | null;
  opened_by: string;
}

export const cashRegisterApi = {
  getCurrent: () => apiClient.get<ApiCashRegister | null>('/cash-register/current'),
  open: (body: { opening_amount: number; opened_at: string; opened_by: string; status: string }) =>
    apiClient.post<ApiCashRegister>('/cash-register/open', body),
  close: (id: string, body: { closing_amount: number; closed_at: string }) =>
    apiClient.post<ApiCashRegister>(`/cash-register/${id}/close`, body),
};
