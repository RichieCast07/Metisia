import { apiClient } from './apiClient';

export interface ApiExpense {
  id: string;
  business_id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
}

export const expenseApi = {
  list: () => apiClient.get<ApiExpense[]>('/expenses/'),
  create: (body: Omit<ApiExpense, 'id' | 'business_id' | 'created_at'>) =>
    apiClient.post<ApiExpense>('/expenses/', body),
  delete: (id: string) => apiClient.delete<void>(`/expenses/${id}`),
};
