import { Expense } from '../entities/Expense';

export interface IExpenseRepository {
  create(expense: Omit<Expense, 'id' | 'createdAt'>): Expense;
  delete(id: string): void;
  getAll(businessId: string): Expense[];
  getByDateRange(businessId: string, from: Date, to: Date): Expense[];
}
